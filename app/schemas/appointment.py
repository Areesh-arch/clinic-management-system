from datetime import date, time

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import AppointmentStatus


# =========================================================
# CREATE
# =========================================================

class AppointmentCreate(BaseModel):

    patient_id: int

    appointment_date: date

    appointment_time: time

    duration_minutes: int = Field(
        default=30,
        gt=0,
    )

    reason: str | None = None

    notes: str | None = None


# =========================================================
# UPDATE
# =========================================================

class AppointmentUpdate(BaseModel):

    patient_id: int | None = None

    appointment_date: date | None = None

    appointment_time: time | None = None

    duration_minutes: int | None = Field(
        default=None,
        gt=0,
    )

    status: AppointmentStatus | None = None

    reason: str | None = None

    notes: str | None = None


# =========================================================
# RESPONSE
# =========================================================

class AppointmentResponse(BaseModel):

    id: int

    tenant_id: int

    patient_id: int

    appointment_date: date

    appointment_time: time

    duration_minutes: int

    status: AppointmentStatus

    reason: str | None

    notes: str | None

    model_config = ConfigDict(
        from_attributes=True,
    )