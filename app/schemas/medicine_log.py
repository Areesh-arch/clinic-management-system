from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel


class MedicineLogResponse(BaseModel):
    prescription_item_id: int

    prescription_id: int
    visit_id: int

    patient_id: int
    patient_name: str
    medical_record_number: str

    date: datetime

    medicine_name: str
    medicine_unit: str

    quantity: int

    dosage: str
    frequency: str
    duration: str

    amount: Decimal | None = None