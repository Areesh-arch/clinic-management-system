from datetime import date, time
from pydantic import BaseModel

from app.models.enums import AppointmentStatus


class AppointmentCreate(BaseModel):
    patient_id: int
    doctor_id: int
    appointment_date: date
    appointment_time: time
    duration_minutes: int = 30
    reason: str | None = None
    notes: str | None = None


class AppointmentUpdate(BaseModel):
    appointment_date: date | None = None
    appointment_time: time | None = None
    duration_minutes: int | None = None
    status: AppointmentStatus | None = None
    reason: str | None = None
    notes: str | None = None


class AppointmentResponse(BaseModel):
    id: int
    tenant_id: int
    patient_id: int
    doctor_id: int
    appointment_date: date
    appointment_time: time
    duration_minutes: int
    status: AppointmentStatus
    reason: str | None
    notes: str | None

    class Config:
        from_attributes = True