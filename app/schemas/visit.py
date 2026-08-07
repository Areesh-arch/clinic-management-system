from datetime import datetime

from pydantic import BaseModel

from app.models.enums import VisitStatus


class VisitCreate(BaseModel):
    appointment_id: int
    chief_complaint: str | None = None
    diagnosis: str | None = None
    notes: str | None = None


class VisitUpdate(BaseModel):
    status: VisitStatus | None = None
    chief_complaint: str | None = None
    diagnosis: str | None = None
    notes: str | None = None


class VisitResponse(BaseModel):
    id: int
    tenant_id: int
    appointment_id: int
    patient_id: int
    doctor_id: int
    visit_time: datetime
    status: VisitStatus
    chief_complaint: str | None
    diagnosis: str | None = None
    notes: str | None

    class Config:
        from_attributes = True