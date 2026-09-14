from sqlalchemy.orm import Session

from app.crud.prescription import (
    create_prescription,
    get_prescription_by_id,
    get_prescriptions,
    update_prescription,
    delete_prescription,
)

from app.models.inventory_item import InventoryItem
from app.models.prescription import Prescription
from app.models.prescription_item import PrescriptionItem
from app.models.visit import Visit

from app.schemas.prescription import (
    PrescriptionCreate,
    PrescriptionUpdate,
)


# =========================================================
# CREATE PRESCRIPTION + ISSUE MEDICINES
# =========================================================

def create_prescription_service(
    db: Session,
    prescription_data: PrescriptionCreate,
    tenant_id: int,
):
    """
    Create a prescription and issue medicines from inventory.

    Everything happens inside one database transaction.

    If any medicine fails validation or stock is insufficient,
    nothing is committed.
    """

    # -----------------------------------------------------
    # VALIDATE VISIT
    # -----------------------------------------------------

    visit = (
        db.query(Visit)
        .filter(
            Visit.id == prescription_data.visit_id,
            Visit.tenant_id == tenant_id,
        )
        .first()
    )

    if visit is None:
        raise ValueError("Visit not found.")

    # -----------------------------------------------------
    # PREVENT DUPLICATE PRESCRIPTION
    # -----------------------------------------------------

    if visit.prescription:
        raise ValueError(
            "Prescription already exists for this visit."
        )

    # -----------------------------------------------------
    # CREATE PRESCRIPTION
    # -----------------------------------------------------

    prescription = create_prescription(
        db=db,
        prescription_data=prescription_data,
        tenant_id=tenant_id,
    )

    # -----------------------------------------------------
    # PROCESS EACH MEDICINE
    # -----------------------------------------------------

    for item_data in prescription_data.items:

        inventory_item = (
            db.query(InventoryItem)
            .filter(
                InventoryItem.id
                == item_data.inventory_item_id,
                InventoryItem.tenant_id
                == tenant_id,
            )
            .with_for_update()
            .first()
        )

        if inventory_item is None:
            raise ValueError(
                "Selected medicine was not found in inventory."
            )

        # -------------------------------------------------
        # STOCK VALIDATION
        # -------------------------------------------------

        if inventory_item.quantity < item_data.quantity:
            raise ValueError(
                f"Insufficient stock for "
                f"'{inventory_item.name}'. "
                f"Available: {inventory_item.quantity}, "
                f"requested: {item_data.quantity}."
            )

        # -------------------------------------------------
        # PRICE SNAPSHOT
        # -------------------------------------------------

        unit_price = inventory_item.selling_price

        total_amount = (
            unit_price * item_data.quantity
        )

        # -------------------------------------------------
        # CREATE PRESCRIPTION ITEM
        # -------------------------------------------------

        prescription_item = PrescriptionItem(
            prescription_id=prescription.id,
            inventory_item_id=inventory_item.id,
            medicine_name=inventory_item.name,
            unit_price=unit_price,
            total_amount=total_amount,
            dosage=item_data.dosage,
            frequency=item_data.frequency,
            duration=item_data.duration,
            quantity=item_data.quantity,
            notes=item_data.notes,
        )

        db.add(prescription_item)

        # -------------------------------------------------
        # REDUCE INVENTORY
        # -------------------------------------------------

        inventory_item.quantity -= item_data.quantity

    # -----------------------------------------------------
    # COMMIT EVERYTHING TOGETHER
    # -----------------------------------------------------

    db.commit()
    db.refresh(prescription)

    return prescription


# =========================================================
# GET SINGLE PRESCRIPTION
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


# =========================================================
# LIST PRESCRIPTIONS
# =========================================================

def list_prescriptions_service(
    db: Session,
    tenant_id: int,
):

    return get_prescriptions(
        db=db,
        tenant_id=tenant_id,
    )


# =========================================================
# UPDATE PRESCRIPTION
# =========================================================

def update_prescription_service(
    db: Session,
    prescription: Prescription,
    prescription_data: PrescriptionUpdate,
):

    return update_prescription(
        db=db,
        prescription=prescription,
        prescription_data=prescription_data,
    )


# =========================================================
# DELETE PRESCRIPTION
# =========================================================

def delete_prescription_service(
    db: Session,
    prescription: Prescription,
):

    delete_prescription(
        db=db,
        prescription=prescription,
    )