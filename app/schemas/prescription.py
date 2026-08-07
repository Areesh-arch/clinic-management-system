from datetime import datetime

from pydantic import BaseModel, ConfigDict


class PrescriptionItemBase(BaseModel):
    medicine_name: str
    dosage: str
    frequency: str
    duration: str
    quantity: int
    notes: str | None = None


class PrescriptionItemCreate(PrescriptionItemBase):
    pass


class PrescriptionItemResponse(PrescriptionItemBase):
    id: int

    model_config = ConfigDict(
        from_attributes=True,
    )


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