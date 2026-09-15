from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel


class MedicineLogResponse(BaseModel):
    # Prescription fields
    prescription_item_id: int | None = None
    prescription_id: int | None = None
    visit_id: int | None = None

    # Patient / customer
    patient_id: int | None = None
    patient_name: str | None = None
    medical_record_number: str | None = None
    customer_name: str | None = None

    # Common medicine information
    date: datetime
    medicine_name: str
    medicine_unit: str
    quantity: int

    # Prescription-specific information
    dosage: str | None = None
    frequency: str | None = None
    duration: str | None = None

    # Amount
    amount: Decimal | None = None

    # Helps frontend distinguish the source
    source: str

    model_config = {
        "from_attributes": True,
    }