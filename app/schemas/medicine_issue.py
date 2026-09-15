from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, Field


class MedicineIssueCreate(BaseModel):
    patient_id: int | None = None
    customer_name: str | None = Field(
        default=None,
        max_length=255,
    )
    quantity: int = Field(
        ge=1,
    )


class MedicineIssueResponse(BaseModel):
    id: int
    inventory_item_id: int

    patient_id: int | None
    customer_name: str | None

    medicine_name: str
    medicine_unit: str

    quantity: int
    unit_price: Decimal
    total_amount: Decimal

    issued_at: datetime

    model_config = {
        "from_attributes": True,
    }