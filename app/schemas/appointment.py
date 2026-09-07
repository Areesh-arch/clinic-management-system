from datetime import date, time

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import AppointmentStatus


class AppointmentCreate(BaseModel):

    patient_id: int

    appointment_date: date

    appointment_time: time

    duration_minutes: int = Field(
        default=30,
        gt=0,
    )

    reason: str | None = None

    is_follow_up: bool = False

    notes: str | None = None


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

    is_follow_up: bool | None = None

    notes: str | None = None


class AppointmentResponse(BaseModel):

    id: int

    tenant_id: int

    patient_id: int

    appointment_date: date

    appointment_time: time

    duration_minutes: int

    status: AppointmentStatus

    reason: str | None

    is_follow_up: bool

    notes: str | None

    model_config = ConfigDict(
        from_attributes=True,
    )