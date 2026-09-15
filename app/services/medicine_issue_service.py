from decimal import Decimal

from sqlalchemy.orm import Session

from app.models.inventory_item import InventoryItem
from app.models.medicine_issue import MedicineIssue
from app.models.patient import Patient


def create_medicine_issue_service(
    db: Session,
    tenant_id: int,
    inventory_item_id: int,
    quantity: int,
    current_user_id: int,
    patient_id: int | None = None,
    customer_name: str | None = None,
):
    if quantity <= 0:
        raise ValueError("Quantity must be greater than zero.")

    # ---------------------------------------------------------
    # PATIENT VALIDATION
    # ---------------------------------------------------------

    patient = None

    if patient_id is not None:
        patient = (
            db.query(Patient)
            .filter(
                Patient.id == patient_id,
                Patient.tenant_id == tenant_id,
            )
            .first()
        )

        if patient is None:
            raise ValueError(
                "Patient not found in the current clinic."
            )

    # ---------------------------------------------------------
    # LOCK INVENTORY ROW
    # ---------------------------------------------------------

    inventory_item = (
        db.query(InventoryItem)
        .filter(
            InventoryItem.id == inventory_item_id,
            InventoryItem.tenant_id == tenant_id,
            InventoryItem.is_archived.is_(False),
        )
        .with_for_update()
        .first()
    )

    if inventory_item is None:
        raise ValueError(
            "Inventory item not found or archived."
        )

    # ---------------------------------------------------------
    # STOCK VALIDATION
    #
    # Keep the existing inventory/prescription behaviour:
    # quantity is the stock quantity currently used by the
    # prescription flow.
    # ---------------------------------------------------------

    if inventory_item.quantity < quantity:
        raise ValueError(
            f"Insufficient stock for "
            f"'{inventory_item.name}'. "
            f"Available: {inventory_item.quantity}, "
            f"requested: {quantity}."
        )

    # ---------------------------------------------------------
    # CUSTOMER VALIDATION
    # ---------------------------------------------------------

    if patient_id is None and not customer_name:
        customer_name = "Walk-in Customer"

    # ---------------------------------------------------------
    # PRICE SNAPSHOT
    # ---------------------------------------------------------

    unit_price = Decimal(
        str(inventory_item.selling_price)
    )

    total_amount = unit_price * quantity

    # ---------------------------------------------------------
    # CREATE ISSUE RECORD
    # ---------------------------------------------------------

    issue = MedicineIssue(
        tenant_id=tenant_id,
        inventory_item_id=inventory_item.id,
        patient_id=patient_id,
        customer_name=customer_name,
        medicine_name=inventory_item.name,
        medicine_unit=(
            inventory_item.issue_unit
            or inventory_item.unit
            or "unit"
        ),
        quantity=quantity,
        unit_price=unit_price,
        total_amount=total_amount,
        created_by=current_user_id,
    )

    # ---------------------------------------------------------
    # DEDUCT STOCK
    # ---------------------------------------------------------

    inventory_item.quantity -= quantity

    db.add(issue)

    # ---------------------------------------------------------
    # ATOMIC COMMIT
    # ---------------------------------------------------------

    try:
        db.commit()
        db.refresh(issue)
    except Exception:
        db.rollback()
        raise

    return issue