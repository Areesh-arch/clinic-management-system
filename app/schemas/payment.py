from datetime import date, datetime

from pydantic import BaseModel, ConfigDict

from app.models.enums import PaymentMethod


class PaymentBase(BaseModel):
    patient_id: int
    visit_id: int
    amount: float
    payment_method: PaymentMethod
    payment_date: date
    notes: str | None = None


class PaymentCreate(PaymentBase):
    pass


class PaymentUpdate(BaseModel):
    amount: float | None = None
    payment_method: PaymentMethod | None = None
    payment_date: date | None = None
    notes: str | None = None


class PaymentResponse(PaymentBase):
    id: int
    tenant_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )