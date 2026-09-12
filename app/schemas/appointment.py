from datetime import date, time

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models.enums import (
    AppointmentStatus,
    AppointmentSource,
    Gender,
)


# =========================================================
# CREATE APPOINTMENT
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
    #
    # Existing clinic-created appointments default
    # to CLINIC.
    #
    # Public website appointments will be forced
    # to WEBSITE by the public appointment service.
    source: AppointmentSource = AppointmentSource.CLINIC


# =========================================================
# PUBLIC WEBSITE APPOINTMENT
# =========================================================

class PublicAppointmentCreate(BaseModel):
    """
    Data submitted by the public clinic website.

    The frontend does NOT provide:
        - tenant_id
        - patient_id
        - source

    The backend resolves the tenant from the website
    hostname/origin, finds or creates the patient, and
    forces the appointment source to WEBSITE.
    """

    full_name: str = Field(
        ...,
        min_length=2,
        max_length=255,
    )

    phone: str = Field(
        ...,
        min_length=1,
        max_length=30,
    )

    email: EmailStr | None = None

    message: str | None = Field(
        default=None,
        max_length=2000,
    )

    # Required because the existing PatientCreate schema
    # requires these fields for a new patient.
    gender: Gender

    date_of_birth: date

    appointment_date: date

    appointment_time: time

    duration_minutes: int = Field(
        default=30,
        gt=0,
    )


# =========================================================
# UPDATE APPOINTMENT
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

    is_follow_up: bool | None = None

    notes: str | None = None

    # IMPORTANT:
    # source is intentionally NOT included here.
    #
    # Appointment source represents how the appointment
    # originally entered the system:
    #
    # CLINIC
    # WEBSITE
    # WALK_IN
    #
    # It should remain immutable after creation.


# =========================================================
# APPOINTMENT RESPONSE
# =========================================================

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