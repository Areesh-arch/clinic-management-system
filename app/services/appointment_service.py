from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from app.crud.appointment import (
    create_appointment,
    get_appointment_by_id,
    get_appointments,
    update_appointment,
    delete_appointment,
)

from app.models.appointment import Appointment
from app.models.patient import Patient
from app.models.user import User

from app.models.enums import AppointmentStatus

from app.schemas.appointment import (
    AppointmentCreate,
    AppointmentUpdate,
)


# =========================================================
# HELPERS
# =========================================================

def _get_tenant_id(current_user: User) -> int:
    """
    Return the clinic/tenant belonging to the
    authenticated user.

    The owner does NOT need a doctor/staff profile.
    """

    if current_user.tenant_id is None:
        raise ValueError(
            "User is not associated with a clinic."
        )

    return current_user.tenant_id


def _validate_patient(
    db: Session,
    patient_id: int,
    tenant_id: int,
) -> Patient:

    patient = (
        db.query(Patient)
        .filter(
            Patient.id == patient_id,
            Patient.tenant_id == tenant_id,
        )
        .first()
    )

    if patient is None:
        raise ValueError(
            "Patient not found."
        )

    return patient


def _validate_future_datetime(
    appointment_date,
    appointment_time,
) -> datetime:

    appointment_datetime = datetime.combine(
        appointment_date,
        appointment_time,
    )

    if appointment_datetime <= datetime.now():
        raise ValueError(
            "Appointment date and time must be in the future."
        )

    return appointment_datetime


def _validate_duration(
    duration_minutes: int,
) -> None:

    if duration_minutes <= 0:
        raise ValueError(
            "Appointment duration must be greater than zero."
        )


def _check_overlap(
    db: Session,
    tenant_id: int,
    appointment_date,
    new_start: datetime,
    new_duration: int,
    exclude_appointment_id: int | None = None,
) -> None:

    new_end = (
        new_start
        + timedelta(
            minutes=new_duration,
        )
    )

    query = (
        db.query(Appointment)
        .filter(
            Appointment.tenant_id == tenant_id,
            Appointment.appointment_date == appointment_date,
            Appointment.status == AppointmentStatus.SCHEDULED,
        )
    )

    if exclude_appointment_id is not None:
        query = query.filter(
            Appointment.id != exclude_appointment_id,
        )

    existing_appointments = query.all()

    for existing in existing_appointments:

        existing_start = datetime.combine(
            existing.appointment_date,
            existing.appointment_time,
        )

        existing_end = (
            existing_start
            + timedelta(
                minutes=existing.duration_minutes,
            )
        )

        if (
            new_start < existing_end
            and new_end > existing_start
        ):
            raise ValueError(
                "The clinic already has an overlapping appointment."
            )


# =========================================================
# CREATE APPOINTMENT
# =========================================================

def create_appointment_service(
    db: Session,
    appointment_data: AppointmentCreate,
    current_user: User,
) -> Appointment:

    # -----------------------------------------------------
    # 1. Get clinic from logged-in user
    # -----------------------------------------------------

    tenant_id = _get_tenant_id(
        current_user,
    )

    # -----------------------------------------------------
    # 2. Validate patient belongs to this clinic
    # -----------------------------------------------------

    _validate_patient(
        db=db,
        patient_id=appointment_data.patient_id,
        tenant_id=tenant_id,
    )

    # -----------------------------------------------------
    # 3. Validate future date/time
    # -----------------------------------------------------

    appointment_datetime = _validate_future_datetime(
        appointment_data.appointment_date,
        appointment_data.appointment_time,
    )

    # -----------------------------------------------------
    # 4. Validate duration
    # -----------------------------------------------------

    _validate_duration(
        appointment_data.duration_minutes,
    )

    # -----------------------------------------------------
    # 5. Prevent overlapping clinic appointments
    # -----------------------------------------------------

    _check_overlap(
        db=db,
        tenant_id=tenant_id,
        appointment_date=appointment_data.appointment_date,
        new_start=appointment_datetime,
        new_duration=appointment_data.duration_minutes,
    )

    # -----------------------------------------------------
    # 6. Create appointment
    # -----------------------------------------------------

    return create_appointment(
        db=db,
        appointment_data=appointment_data,
        tenant_id=tenant_id,
    )


# =========================================================
# GET APPOINTMENT
# =========================================================

def get_appointment_service(
    db: Session,
    appointment_id: int,
    current_user: User,
) -> Appointment:

    # -----------------------------------------------------
    # SUPER ADMIN
    # -----------------------------------------------------

    if current_user.role == "SUPER_ADMIN" or (
        getattr(current_user.role, "name", None)
        == "SUPER_ADMIN"
    ):
        appointment = get_appointment_by_id(
            db=db,
            appointment_id=appointment_id,
        )

        if appointment is None:
            raise ValueError(
                "Appointment not found."
            )

        return appointment

    # -----------------------------------------------------
    # NORMAL CLINIC USER
    # -----------------------------------------------------

    tenant_id = _get_tenant_id(
        current_user,
    )

    appointment = (
        db.query(Appointment)
        .filter(
            Appointment.id == appointment_id,
            Appointment.tenant_id == tenant_id,
        )
        .first()
    )

    if appointment is None:
        raise ValueError(
            "Appointment not found."
        )

    return appointment


# =========================================================
# LIST APPOINTMENTS
# =========================================================

def list_appointments_service(
    db: Session,
    current_user: User,
) -> list[Appointment]:

    # -----------------------------------------------------
    # SUPER ADMIN
    # -----------------------------------------------------

    if current_user.role == "SUPER_ADMIN" or (
        getattr(current_user.role, "name", None)
        == "SUPER_ADMIN"
    ):
        return (
            db.query(Appointment)
            .order_by(
                Appointment.appointment_date,
                Appointment.appointment_time,
            )
            .all()
        )

    # -----------------------------------------------------
    # CLINIC USER
    # -----------------------------------------------------

    tenant_id = _get_tenant_id(
        current_user,
    )

    return get_appointments(
        db=db,
        tenant_id=tenant_id,
    )


# =========================================================
# UPDATE APPOINTMENT
# =========================================================

def update_appointment_service(
    db: Session,
    appointment: Appointment,
    appointment_data: AppointmentUpdate,
    current_user: User,
) -> Appointment:

    # -----------------------------------------------------
    # Make sure appointment belongs to user's clinic
    # -----------------------------------------------------

    if current_user.role != "SUPER_ADMIN" and (
        getattr(current_user.role, "name", None)
        != "SUPER_ADMIN"
    ):

        tenant_id = _get_tenant_id(
            current_user,
        )

        if appointment.tenant_id != tenant_id:
            raise ValueError(
                "Appointment not found."
            )

    # -----------------------------------------------------
    # Values after update
    # -----------------------------------------------------

    update_data = appointment_data.model_dump(
        exclude_unset=True,
    )

    new_patient_id = update_data.get(
        "patient_id",
        appointment.patient_id,
    )

    new_date = update_data.get(
        "appointment_date",
        appointment.appointment_date,
    )

    new_time = update_data.get(
        "appointment_time",
        appointment.appointment_time,
    )

    new_duration = update_data.get(
        "duration_minutes",
        appointment.duration_minutes,
    )

    new_status = update_data.get(
        "status",
        appointment.status,
    )

    # -----------------------------------------------------
    # Validate patient if changed
    # -----------------------------------------------------

    _validate_patient(
        db=db,
        patient_id=new_patient_id,
        tenant_id=appointment.tenant_id,
    )

    # -----------------------------------------------------
    # Validate duration
    # -----------------------------------------------------

    _validate_duration(
        new_duration,
    )

    # -----------------------------------------------------
    # Validate future schedule
    # -----------------------------------------------------

    new_start = _validate_future_datetime(
        new_date,
        new_time,
    )

    # -----------------------------------------------------
    # Check overlap only for scheduled appointments
    # -----------------------------------------------------

    if new_status == AppointmentStatus.SCHEDULED:

        _check_overlap(
            db=db,
            tenant_id=appointment.tenant_id,
            appointment_date=new_date,
            new_start=new_start,
            new_duration=new_duration,
            exclude_appointment_id=appointment.id,
        )

    # -----------------------------------------------------
    # Update
    # -----------------------------------------------------

    return update_appointment(
        db=db,
        appointment=appointment,
        appointment_data=appointment_data,
    )


# =========================================================
# DELETE APPOINTMENT
# =========================================================

def delete_appointment_service(
    db: Session,
    appointment: Appointment,
    current_user: User,
) -> None:

    # -----------------------------------------------------
    # Verify tenant access
    # -----------------------------------------------------

    if current_user.role != "SUPER_ADMIN" and (
        getattr(current_user.role, "name", None)
        != "SUPER_ADMIN"
    ):

        tenant_id = _get_tenant_id(
            current_user,
        )

        if appointment.tenant_id != tenant_id:
            raise ValueError(
                "Appointment not found."
            )

    # -----------------------------------------------------
    # Delete
    # -----------------------------------------------------

    delete_appointment(
        db=db,
        appointment=appointment,
    )