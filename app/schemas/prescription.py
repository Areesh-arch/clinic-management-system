from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


# =========================================================
# PRESCRIPTION ITEM
# =========================================================

class PrescriptionItemBase(BaseModel):
    inventory_item_id: int
    dosage: str
    frequency: str
    duration: str
    quantity: int = Field(gt=0)
    notes: str | None = None


class PrescriptionItemCreate(PrescriptionItemBase):
    pass


class PrescriptionItemResponse(BaseModel):
    id: int

    prescription_id: int

    inventory_item_id: int | None = None

    medicine_name: str

    dosage: str
    frequency: str
    duration: str
    quantity: int

    unit_price: Decimal | None = None
    total_amount: Decimal | None = None

    notes: str | None = None

    model_config = ConfigDict(
        from_attributes=True,
    )


# =========================================================
# PRESCRIPTION
# =========================================================

class PrescriptionBase(BaseModel):
    visit_id: int
    instructions: str | None = None


class PrescriptionCreate(PrescriptionBase):
    items: list[PrescriptionItemCreate]


class PrescriptionUpdate(BaseModel):
    instructions: str | None = None


class PrescriptionResponse(PrescriptionBase):
    id: int
    tenant_id: int
    created_at: datetime
    updated_at: datetime

    items: list[PrescriptionItemResponse]

    model_config = ConfigDict(
        from_attributes=True,
    )