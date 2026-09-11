from datetime import date, time

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import (
    AppointmentStatus,
    AppointmentSource,
)


class AppointmentCreate(BaseModel):

    patient_id: int

    appointment_date: date

    appointment_time: time

    duration_minutes: int = Field(
        default=30,
        gt=0,
    )

    reason: str | None = None

    # None means:
    # let the backend automatically determine
    # whether this is a follow-up.
    #
    # True means:
    # staff explicitly wants follow-up.
    #
    # False means:
    # staff explicitly wants a normal/new appointment.
    is_follow_up: bool | None = None

    notes: str | None = None

    # Appointment origin.
    # Existing clinic-created appointments default
    # to CLINIC.
    source: AppointmentSource = AppointmentSource.CLINIC


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

    source: AppointmentSource | None = None


class AppointmentResponse(BaseModel):

    id: int

    tenant_id: int

    patient_id: int

    # Patient information is returned directly
    # with the appointment so Super Admin can see
    # patients belonging to different tenants.
    patient_name: str | None = None

    medical_record_number: str | None = None

    appointment_date: date

    appointment_time: time

    duration_minutes: int

    status: AppointmentStatus

    source: AppointmentSource

    reason: str | None

    is_follow_up: bool

    notes: str | None

    model_config = ConfigDict(
        from_attributes=True,
    )