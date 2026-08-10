from datetime import datetime

from pydantic import BaseModel, ConfigDict


class OutstandingResponse(BaseModel):
    id: int

    tenant_id: int
    patient_id: int
    visit_id: int

    total_charge: float
    total_paid: float
    outstanding_amount: float

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )