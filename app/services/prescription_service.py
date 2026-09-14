from decimal import Decimal, ROUND_HALF_UP

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.crud.prescription import (
    create_prescription,
    get_prescription_by_id,
    get_prescriptions,
    update_prescription,
)

from app.models.inventory_item import InventoryItem
from app.models.prescription import Prescription
from app.models.prescription_item import PrescriptionItem
from app.models.visit import Visit
from app.models.payment import Payment
from app.models.outstanding import Outstanding

from app.schemas.prescription import (
    PrescriptionCreate,
    PrescriptionUpdate,
    PrescriptionItemUpdate,
)


MONEY_QUANTIZER = Decimal("0.01")


# =========================================================
# MONEY HELPERS
# =========================================================

def _money(value) -> Decimal:
    return Decimal(str(value or 0)).quantize(
        MONEY_QUANTIZER,
        rounding=ROUND_HALF_UP,
    )


# =========================================================
# OUTSTANDING
# =========================================================

def _refresh_visit_outstanding(
    db: Session,
    visit: Visit,
    tenant_id: int,
):
    total_paid = (
        db.query(
            func.coalesce(
                func.sum(Payment.amount),
                0,
            )
        )
        .filter(
            Payment.visit_id == visit.id,
            Payment.tenant_id == tenant_id,
        )
        .scalar()
    )

    total_paid = _money(total_paid)
    total_charge = _money(visit.charge)

    if total_charge < total_paid:
        raise ValueError(
            "This change would reduce the visit bill below "
            "the amount already paid."
        )

    outstanding_amount = (
        total_charge - total_paid
    ).quantize(
        MONEY_QUANTIZER,
        rounding=ROUND_HALF_UP,
    )

    outstanding = (
        db.query(Outstanding)
        .filter(
            Outstanding.visit_id == visit.id,
            Outstanding.tenant_id == tenant_id,
        )
        .with_for_update()
        .first()
    )

    if outstanding:
        outstanding.total_charge = total_charge
        outstanding.total_paid = total_paid
        outstanding.outstanding_amount = outstanding_amount
    else:
        outstanding = Outstanding(
            tenant_id=tenant_id,
            patient_id=visit.patient_id,
            visit_id=visit.id,
            total_charge=total_charge,
            total_paid=total_paid,
            outstanding_amount=outstanding_amount,
        )

        db.add(outstanding)

    db.flush()


# =========================================================
# INVENTORY HELPERS
# =========================================================

def _get_locked_inventory(
    db: Session,
    inventory_item_id: int,
    tenant_id: int,
):
    inventory_item = (
        db.query(InventoryItem)
        .filter(
            InventoryItem.id == inventory_item_id,
            InventoryItem.tenant_id == tenant_id,
        )
        .with_for_update()
        .first()
    )

    if inventory_item is None:
        raise ValueError(
            "Selected medicine was not found in inventory."
        )

    return inventory_item


def _validate_inventory_conversion(
    inventory_item: InventoryItem,
):
    units_per_stock_unit = int(
        inventory_item.units_per_stock_unit or 1
    )

    if units_per_stock_unit <= 0:
        raise ValueError(
            f"Invalid stock conversion for "
            f"'{inventory_item.name}'."
        )

    stock_quantity = int(
        inventory_item.quantity or 0
    )

    loose_quantity = int(
        inventory_item.loose_quantity or 0
    )

    if stock_quantity < 0 or loose_quantity < 0:
        raise ValueError(
            f"Invalid stock quantity for "
            f"'{inventory_item.name}'."
        )

    return (
        units_per_stock_unit,
        stock_quantity,
        loose_quantity,
    )


def _available_issue_units(
    inventory_item: InventoryItem,
):
    (
        units_per_stock_unit,
        stock_quantity,
        loose_quantity,
    ) = _validate_inventory_conversion(
        inventory_item
    )

    return (
        stock_quantity * units_per_stock_unit
        + loose_quantity
    )


def _issue_price(
    inventory_item: InventoryItem,
):
    (
        units_per_stock_unit,
        _,
        _,
    ) = _validate_inventory_conversion(
        inventory_item
    )

    stock_unit_price = _money(
        inventory_item.selling_price
    )

    return (
        stock_unit_price
        / Decimal(units_per_stock_unit)
    ).quantize(
        MONEY_QUANTIZER,
        rounding=ROUND_HALF_UP,
    )


def _deduct_inventory(
    inventory_item: InventoryItem,
    requested_quantity: int,
):
    requested_quantity = int(requested_quantity)

    if requested_quantity <= 0:
        raise ValueError(
            "Medicine quantity must be greater than zero."
        )

    (
        units_per_stock_unit,
        stock_quantity,
        loose_quantity,
    ) = _validate_inventory_conversion(
        inventory_item
    )

    available_issue_units = (
        stock_quantity * units_per_stock_unit
        + loose_quantity
    )

    if requested_quantity > available_issue_units:
        raise ValueError(
            f"Insufficient stock for "
            f"'{inventory_item.name}'. "
            f"Available: {available_issue_units} "
            f"{inventory_item.issue_unit}, "
            f"requested: {requested_quantity} "
            f"{inventory_item.issue_unit}."
        )

    remaining_issue_units = (
        available_issue_units
        - requested_quantity
    )

    inventory_item.quantity = (
        remaining_issue_units
        // units_per_stock_unit
    )

    inventory_item.loose_quantity = (
        remaining_issue_units
        % units_per_stock_unit
    )


def _restore_inventory(
    inventory_item: InventoryItem,
    quantity: int,
):
    """
    Restore issued sale/issue units back into inventory.

    The quantity stored on PrescriptionItem is always the
    issue-unit quantity.

    Example:
        1 Box = 10 Packs
        Issued = 3 Packs

    On delete/edit:
        +3 Packs are returned to current inventory.

    If the inventory conversion has changed later, the
    restored issue units are converted using the inventory's
    CURRENT conversion. This preserves the actual stock
    quantity correctly.
    """

    quantity = int(quantity)

    if quantity <= 0:
        return

    (
        units_per_stock_unit,
        stock_quantity,
        loose_quantity,
    ) = _validate_inventory_conversion(
        inventory_item
    )

    current_total = (
        stock_quantity * units_per_stock_unit
        + loose_quantity
    )

    restored_total = (
        current_total + quantity
    )

    inventory_item.quantity = (
        restored_total
        // units_per_stock_unit
    )

    inventory_item.loose_quantity = (
        restored_total
        % units_per_stock_unit
    )


# =========================================================
# CREATE PRESCRIPTION
# =========================================================

def create_prescription_service(
    db: Session,
    prescription_data: PrescriptionCreate,
    tenant_id: int,
):
    try:
        if not prescription_data.items:
            raise ValueError(
                "At least one medicine is required."
            )

        # -------------------------------------------------
        # Lock visit
        # -------------------------------------------------

        visit = (
            db.query(Visit)
            .filter(
                Visit.id == prescription_data.visit_id,
                Visit.tenant_id == tenant_id,
            )
            .with_for_update()
            .first()
        )

        if visit is None:
            raise ValueError(
                "Visit not found."
            )

        if visit.prescription:
            raise ValueError(
                "Prescription already exists for this visit."
            )

        # -------------------------------------------------
        # Duplicate medicine protection
        # -------------------------------------------------

        inventory_ids = [
            item.inventory_item_id
            for item in prescription_data.items
        ]

        if len(inventory_ids) != len(set(inventory_ids)):
            raise ValueError(
                "The same medicine cannot be added more than once "
                "in the same prescription."
            )

        # -------------------------------------------------
        # Prescription shell
        # -------------------------------------------------

        prescription = create_prescription(
            db=db,
            prescription_data=prescription_data,
            tenant_id=tenant_id,
        )

        medicine_total = Decimal("0.00")

        # -------------------------------------------------
        # Process medicines
        # -------------------------------------------------

        for item_data in prescription_data.items:

            inventory_item = _get_locked_inventory(
                db=db,
                inventory_item_id=item_data.inventory_item_id,
                tenant_id=tenant_id,
            )

            (
                units_per_stock_unit,
                _,
                _,
            ) = _validate_inventory_conversion(
                inventory_item
            )

            requested_quantity = int(
                item_data.quantity
            )

            issue_unit_price = _issue_price(
                inventory_item
            )

            total_amount = (
                issue_unit_price
                * Decimal(requested_quantity)
            ).quantize(
                MONEY_QUANTIZER,
                rounding=ROUND_HALF_UP,
            )

            # Deduct stock.
            _deduct_inventory(
                inventory_item=inventory_item,
                requested_quantity=requested_quantity,
            )

            # -------------------------------------------------
            # Historical medicine snapshot
            # -------------------------------------------------

            prescription_item = PrescriptionItem(
                prescription_id=prescription.id,

                inventory_item_id=inventory_item.id,

                medicine_name=inventory_item.name,

                medicine_unit=(
                    inventory_item.issue_unit
                    or inventory_item.unit
                    or "unit"
                ),

                units_per_stock_unit=(
                    units_per_stock_unit
                ),

                unit_price=issue_unit_price,

                total_amount=total_amount,

                dosage=item_data.dosage,

                frequency=item_data.frequency,

                duration=item_data.duration,

                quantity=requested_quantity,

                notes=item_data.notes,
            )

            db.add(prescription_item)

            medicine_total += total_amount

        # -------------------------------------------------
        # Add medicine charges to visit
        # -------------------------------------------------

        existing_visit_charge = _money(
            visit.charge
        )

        visit.charge = (
            existing_visit_charge
            + medicine_total
        ).quantize(
            MONEY_QUANTIZER,
            rounding=ROUND_HALF_UP,
        )

        # -------------------------------------------------
        # Outstanding
        # -------------------------------------------------

        _refresh_visit_outstanding(
            db=db,
            visit=visit,
            tenant_id=tenant_id,
        )

        # -------------------------------------------------
        # ONE COMMIT
        # -------------------------------------------------

        db.commit()

        db.refresh(prescription)

        return prescription

    except Exception:
        db.rollback()
        raise


# =========================================================
# GET
# =========================================================

def get_prescription_service(
    db: Session,
    prescription_id: int,
    tenant_id: int,
):
    prescription = get_prescription_by_id(
        db=db,
        prescription_id=prescription_id,
        tenant_id=tenant_id,
    )

    if prescription is None:
        raise ValueError(
            "Prescription not found."
        )

    return prescription


def list_prescriptions_service(
    db: Session,
    tenant_id: int,
):
    return get_prescriptions(
        db=db,
        tenant_id=tenant_id,
    )


# =========================================================
# UPDATE PRESCRIPTION INSTRUCTIONS
# =========================================================

def update_prescription_service(
    db: Session,
    prescription_id: int,
    prescription_data: PrescriptionUpdate,
    tenant_id: int,
):
    try:
        prescription = (
            db.query(Prescription)
            .filter(
                Prescription.id == prescription_id,
                Prescription.tenant_id == tenant_id,
            )
            .with_for_update()
            .first()
        )

        if prescription is None:
            raise ValueError(
                "Prescription not found."
            )

        update_prescription(
            db=db,
            prescription=prescription,
            prescription_data=prescription_data,
        )

        db.commit()
        db.refresh(prescription)

        return prescription

    except Exception:
        db.rollback()
        raise


# =========================================================
# EDIT MEDICINE ITEM
# =========================================================

def update_prescription_item_service(
    db: Session,
    item_id: int,
    item_data: PrescriptionItemUpdate,
    tenant_id: int,
):
    try:
        # -------------------------------------------------
        # Lock item
        # -------------------------------------------------

        prescription_item = (
            db.query(PrescriptionItem)
            .join(
                Prescription,
                Prescription.id
                == PrescriptionItem.prescription_id,
            )
            .filter(
                PrescriptionItem.id == item_id,
                Prescription.tenant_id == tenant_id,
            )
            .with_for_update()
            .first()
        )

        if prescription_item is None:
            raise ValueError(
                "Medicine record not found."
            )

        # -------------------------------------------------
        # Lock prescription
        # -------------------------------------------------

        prescription = (
            db.query(Prescription)
            .filter(
                Prescription.id
                == prescription_item.prescription_id,
                Prescription.tenant_id == tenant_id,
            )
            .with_for_update()
            .first()
        )

        if prescription is None:
            raise ValueError(
                "Prescription not found."
            )

        # -------------------------------------------------
        # Lock visit
        # -------------------------------------------------

        visit = (
            db.query(Visit)
            .filter(
                Visit.id == prescription.visit_id,
                Visit.tenant_id == tenant_id,
            )
            .with_for_update()
            .first()
        )

        if visit is None:
            raise ValueError(
                "Visit not found."
            )

        # -------------------------------------------------
        # Prevent duplicate medicine
        # -------------------------------------------------

        duplicate = (
            db.query(PrescriptionItem)
            .filter(
                PrescriptionItem.prescription_id
                == prescription.id,

                PrescriptionItem.inventory_item_id
                == item_data.inventory_item_id,

                PrescriptionItem.id != item_id,
            )
            .first()
        )

        if duplicate:
            raise ValueError(
                "This medicine already exists in this prescription."
            )

        # -------------------------------------------------
        # Lock old inventory
        # -------------------------------------------------

        old_inventory = None

        if prescription_item.inventory_item_id:
            old_inventory = _get_locked_inventory(
                db=db,
                inventory_item_id=(
                    prescription_item.inventory_item_id
                ),
                tenant_id=tenant_id,
            )

            # Return old issued quantity first.
            _restore_inventory(
                inventory_item=old_inventory,
                quantity=prescription_item.quantity,
            )

        # -------------------------------------------------
        # Lock new inventory
        # -------------------------------------------------

        new_inventory = _get_locked_inventory(
            db=db,
            inventory_item_id=item_data.inventory_item_id,
            tenant_id=tenant_id,
        )

        (
            new_units_per_stock_unit,
            _,
            _,
        ) = _validate_inventory_conversion(
            new_inventory
        )

        requested_quantity = int(
            item_data.quantity
        )

        issue_unit_price = _issue_price(
            new_inventory
        )

        total_amount = (
            issue_unit_price
            * Decimal(requested_quantity)
        ).quantize(
            MONEY_QUANTIZER,
            rounding=ROUND_HALF_UP,
        )

        # -------------------------------------------------
        # Deduct new stock
        # -------------------------------------------------

        _deduct_inventory(
            inventory_item=new_inventory,
            requested_quantity=requested_quantity,
        )

        # -------------------------------------------------
        # Update visit charge
        # -------------------------------------------------

        old_amount = _money(
            prescription_item.total_amount
        )

        current_charge = _money(
            visit.charge
        )

        new_charge = (
            current_charge
            - old_amount
            + total_amount
        ).quantize(
            MONEY_QUANTIZER,
            rounding=ROUND_HALF_UP,
        )

        if new_charge < Decimal("0.00"):
            raise ValueError(
                "The updated visit charge cannot be negative."
            )

        # -------------------------------------------------
        # Paid amount protection
        # -------------------------------------------------

        total_paid = (
            db.query(
                func.coalesce(
                    func.sum(Payment.amount),
                    0,
                )
            )
            .filter(
                Payment.visit_id == visit.id,
                Payment.tenant_id == tenant_id,
            )
            .scalar()
        )

        total_paid = _money(total_paid)

        if new_charge < total_paid:
            # Rollback restores BOTH inventory changes.
            db.rollback()

            raise ValueError(
                "This edit would reduce the visit bill below "
                "the amount already paid."
            )

        # -------------------------------------------------
        # Update visit charge
        # -------------------------------------------------

        visit.charge = new_charge

        # -------------------------------------------------
        # Update historical medicine snapshot
        # -------------------------------------------------

        prescription_item.inventory_item_id = (
            new_inventory.id
        )

        prescription_item.medicine_name = (
            new_inventory.name
        )

        prescription_item.medicine_unit = (
            new_inventory.issue_unit
            or new_inventory.unit
            or "unit"
        )

        prescription_item.units_per_stock_unit = (
            new_units_per_stock_unit
        )

        prescription_item.unit_price = (
            issue_unit_price
        )

        prescription_item.total_amount = (
            total_amount
        )

        prescription_item.quantity = (
            requested_quantity
        )

        prescription_item.dosage = (
            item_data.dosage
        )

        prescription_item.frequency = (
            item_data.frequency
        )

        prescription_item.duration = (
            item_data.duration
        )

        prescription_item.notes = (
            item_data.notes
        )

        db.flush()

        # -------------------------------------------------
        # Outstanding
        # -------------------------------------------------

        _refresh_visit_outstanding(
            db=db,
            visit=visit,
            tenant_id=tenant_id,
        )

        # -------------------------------------------------
        # Commit
        # -------------------------------------------------

        db.commit()

        db.refresh(prescription_item)

        return prescription_item

    except Exception:
        db.rollback()
        raise


# =========================================================
# DELETE MEDICINE ITEM
# =========================================================

def delete_prescription_item_service(
    db: Session,
    item_id: int,
    tenant_id: int,
):
    try:
        # -------------------------------------------------
        # Lock item
        # -------------------------------------------------

        prescription_item = (
            db.query(PrescriptionItem)
            .join(
                Prescription,
                Prescription.id
                == PrescriptionItem.prescription_id,
            )
            .filter(
                PrescriptionItem.id == item_id,
                Prescription.tenant_id == tenant_id,
            )
            .with_for_update()
            .first()
        )

        if prescription_item is None:
            raise ValueError(
                "Medicine record not found."
            )

        # -------------------------------------------------
        # Lock prescription
        # -------------------------------------------------

        prescription = (
            db.query(Prescription)
            .filter(
                Prescription.id
                == prescription_item.prescription_id,
                Prescription.tenant_id == tenant_id,
            )
            .with_for_update()
            .first()
        )

        if prescription is None:
            raise ValueError(
                "Prescription not found."
            )

        # -------------------------------------------------
        # Lock visit
        # -------------------------------------------------

        visit = (
            db.query(Visit)
            .filter(
                Visit.id == prescription.visit_id,
                Visit.tenant_id == tenant_id,
            )
            .with_for_update()
            .first()
        )

        if visit is None:
            raise ValueError(
                "Visit not found."
            )

        # -------------------------------------------------
        # Lock inventory and restore stock
        # -------------------------------------------------

        if prescription_item.inventory_item_id:
            inventory_item = _get_locked_inventory(
                db=db,
                inventory_item_id=(
                    prescription_item.inventory_item_id
                ),
                tenant_id=tenant_id,
            )

            _restore_inventory(
                inventory_item=inventory_item,
                quantity=prescription_item.quantity,
            )

        # -------------------------------------------------
        # Remove medicine charge
        # -------------------------------------------------

        medicine_amount = _money(
            prescription_item.total_amount
        )

        current_charge = _money(
            visit.charge
        )

        new_charge = (
            current_charge
            - medicine_amount
        ).quantize(
            MONEY_QUANTIZER,
            rounding=ROUND_HALF_UP,
        )

        if new_charge < Decimal("0.00"):
            raise ValueError(
                "The visit charge cannot become negative."
            )

        # -------------------------------------------------
        # Paid amount protection
        # -------------------------------------------------

        total_paid = (
            db.query(
                func.coalesce(
                    func.sum(Payment.amount),
                    0,
                )
            )
            .filter(
                Payment.visit_id == visit.id,
                Payment.tenant_id == tenant_id,
            )
            .scalar()
        )

        total_paid = _money(total_paid)

        if new_charge < total_paid:
            db.rollback()

            raise ValueError(
                "This medicine cannot be deleted because "
                "the remaining visit bill would be less than "
                "the amount already paid."
            )

        # -------------------------------------------------
        # Update visit charge
        # -------------------------------------------------

        visit.charge = new_charge

        # -------------------------------------------------
        # Delete item
        # -------------------------------------------------

        db.delete(prescription_item)
        db.flush()

        # -------------------------------------------------
        # Remove empty prescription
        # -------------------------------------------------

        remaining_items = (
            db.query(PrescriptionItem)
            .filter(
                PrescriptionItem.prescription_id
                == prescription.id
            )
            .count()
        )

        if remaining_items == 0:
            db.delete(prescription)

        # -------------------------------------------------
        # Outstanding
        # -------------------------------------------------

        _refresh_visit_outstanding(
            db=db,
            visit=visit,
            tenant_id=tenant_id,
        )

        # -------------------------------------------------
        # Commit
        # -------------------------------------------------

        db.commit()

        return True

    except Exception:
        db.rollback()
        raise


# =========================================================
# DELETE WHOLE PRESCRIPTION
# =========================================================

def delete_prescription_service(
    db: Session,
    prescription_id: int,
    tenant_id: int,
):
    try:
        # -------------------------------------------------
        # Lock prescription
        # -------------------------------------------------

        prescription = (
            db.query(Prescription)
            .filter(
                Prescription.id == prescription_id,
                Prescription.tenant_id == tenant_id,
            )
            .with_for_update()
            .first()
        )

        if prescription is None:
            raise ValueError(
                "Prescription not found."
            )

        # -------------------------------------------------
        # Lock visit
        # -------------------------------------------------

        visit = (
            db.query(Visit)
            .filter(
                Visit.id == prescription.visit_id,
                Visit.tenant_id == tenant_id,
            )
            .with_for_update()
            .first()
        )

        if visit is None:
            raise ValueError(
                "Visit not found."
            )

        # -------------------------------------------------
        # Get prescription items
        # -------------------------------------------------

        items = (
            db.query(PrescriptionItem)
            .filter(
                PrescriptionItem.prescription_id
                == prescription.id
            )
            .all()
        )

        total_medicine_amount = Decimal("0.00")

        # -------------------------------------------------
        # Restore every medicine
        # -------------------------------------------------

        for item in items:

            if item.inventory_item_id:

                inventory_item = _get_locked_inventory(
                    db=db,
                    inventory_item_id=item.inventory_item_id,
                    tenant_id=tenant_id,
                )

                _restore_inventory(
                    inventory_item=inventory_item,
                    quantity=item.quantity,
                )

            total_medicine_amount += _money(
                item.total_amount
            )

        # -------------------------------------------------
        # Remove medicine charges
        # -------------------------------------------------

        current_charge = _money(
            visit.charge
        )

        new_charge = (
            current_charge
            - total_medicine_amount
        ).quantize(
            MONEY_QUANTIZER,
            rounding=ROUND_HALF_UP,
        )

        if new_charge < Decimal("0.00"):
            raise ValueError(
                "The visit charge cannot become negative."
            )

        # -------------------------------------------------
        # Paid amount protection
        # -------------------------------------------------

        total_paid = (
            db.query(
                func.coalesce(
                    func.sum(Payment.amount),
                    0,
                )
            )
            .filter(
                Payment.visit_id == visit.id,
                Payment.tenant_id == tenant_id,
            )
            .scalar()
        )

        total_paid = _money(total_paid)

        if new_charge < total_paid:
            db.rollback()

            raise ValueError(
                "This prescription cannot be deleted because "
                "the remaining visit bill would be less than "
                "the amount already paid."
            )

        # -------------------------------------------------
        # Update visit charge
        # -------------------------------------------------

        visit.charge = new_charge

        # -------------------------------------------------
        # Delete prescription
        # -------------------------------------------------

        db.delete(prescription)
        db.flush()

        # -------------------------------------------------
        # Outstanding
        # -------------------------------------------------

        _refresh_visit_outstanding(
            db=db,
            visit=visit,
            tenant_id=tenant_id,
        )

        # -------------------------------------------------
        # Commit
        # -------------------------------------------------

        db.commit()

        return True

    except Exception:
        db.rollback()
        raise