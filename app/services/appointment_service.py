from datetime import datetime, timedelta

from fastapi import HTTPException, status

from sqlalchemy.orm import Session

from app.crud.appointment import (
    create_appointment,
    get_appointment_by_id,
    get_appointments,
    update_appointment,
    delete_appointment,
)

from app.models.appointment import Appointment
from app.models.enums import AppointmentStatus
from app.models.patient import Patient
from app.models.user import User
from app.schemas.appointment import (
    AppointmentCreate,
    AppointmentUpdate,
)


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
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found in the selected clinic.",
        )

    return patient


def _validate_future_datetime(
    appointment_date,
    appointment_time,
) -> None:
    """
    Validate that the appointment date/time is in the future.

    Appointment date/time represents clinic-local time.
    If the incoming time is timezone-aware, remove the timezone
    information before comparing it with the server's local time.
    """

    appointment_datetime = datetime.combine(
        appointment_date,
        appointment_time,
    )

    # Prevent:
    # TypeError: can't compare offset-naive and offset-aware datetimes
    if appointment_datetime.tzinfo is not None:
        appointment_datetime = appointment_datetime.replace(
            tzinfo=None
        )

    now = datetime.now()

    if appointment_datetime <= now:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Appointment date and time must be in the future.",
        )


def _validate_duration(
    duration_minutes: int,
) -> None:
    if duration_minutes <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Duration must be greater than zero.",
        )


def _check_overlap(
    db: Session,
    tenant_id: int,
    appointment_date,
    appointment_time,
    duration_minutes: int,
    exclude_appointment_id: int | None = None,
) -> None:
    appointments = (
        db.query(Appointment)
        .filter(
            Appointment.tenant_id == tenant_id,
            Appointment.appointment_date == appointment_date,
        )
        .all()
    )

    new_start = datetime.combine(
        appointment_date,
        appointment_time,
    )

    new_end = new_start + timedelta(
        minutes=duration_minutes
    )

    for appointment in appointments:
        if (
            exclude_appointment_id is not None
            and appointment.id == exclude_appointment_id
        ):
            continue

        # Cancelled and no-show appointments should not
        # block a new appointment time.
        if appointment.status in (
            AppointmentStatus.CANCELLED,
            AppointmentStatus.NO_SHOW,
        ):
            continue

        existing_start = datetime.combine(
            appointment.appointment_date,
            appointment.appointment_time,
        )

        existing_end = existing_start + timedelta(
            minutes=appointment.duration_minutes
        )

        if (
            new_start < existing_end
            and new_end > existing_start
        ):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Another appointment already exists during this time.",
            )


def _has_previous_appointment(
    db: Session,
    tenant_id: int,
    patient_id: int,
    appointment_date,
    exclude_appointment_id: int | None = None,
) -> bool:
    query = (
        db.query(Appointment)
        .filter(
            Appointment.tenant_id == tenant_id,
            Appointment.patient_id == patient_id,
            Appointment.appointment_date < appointment_date,
        )
    )

    if exclude_appointment_id is not None:
        query = query.filter(
            Appointment.id != exclude_appointment_id
        )

    return query.first() is not None


def _determine_follow_up(
    db: Session,
    tenant_id: int,
    patient_id: int,
    appointment_date,
    requested_value: bool | None,
    exclude_appointment_id: int | None = None,
) -> bool:
    previous_appointment = _has_previous_appointment(
        db=db,
        tenant_id=tenant_id,
        patient_id=patient_id,
        appointment_date=appointment_date,
        exclude_appointment_id=exclude_appointment_id,
    )

    if requested_value is None:
        return previous_appointment

    return bool(requested_value)


def _get_patient_display_data(
    db: Session,
    appointment: Appointment,
) -> dict:
    patient = (
        db.query(Patient)
        .filter(
            Patient.id == appointment.patient_id,
            Patient.tenant_id == appointment.tenant_id,
        )
        .first()
    )

    if patient is None:
        return {
            "patient_name": None,
            "medical_record_number": None,
        }

    patient_name = " ".join(
        part
        for part in [
            patient.first_name,
            patient.last_name,
        ]
        if part
    ).strip()

    return {
        "patient_name": patient_name or None,
        "medical_record_number": patient.medical_record_number,
    }


def _attach_patient_data(
    db: Session,
    appointment: Appointment,
) -> Appointment:
    patient_data = _get_patient_display_data(
        db,
        appointment,
    )

    appointment.patient_name = patient_data["patient_name"]

    appointment.medical_record_number = (
        patient_data["medical_record_number"]
    )

    return appointment


def _attach_patient_data_to_list(
    db: Session,
    appointments: list[Appointment],
) -> list[Appointment]:
    for appointment in appointments:
        _attach_patient_data(
            db,
            appointment,
        )

    return appointments


# =========================================================
# STATUS VALIDATION
# =========================================================

def _validate_status_change(
    current_status: AppointmentStatus,
    new_status: AppointmentStatus,
) -> None:
    """
    Validate allowed appointment status transitions.

    Normal appointment lifecycle:

        SCHEDULED
            ├── COMPLETED
            ├── CANCELLED
            └── NO_SHOW

    Once an appointment reaches a final state, it cannot
    be changed to another final state through the normal
    appointment update endpoint.
    """

    if current_status == new_status:
        return

    if current_status == AppointmentStatus.SCHEDULED:
        allowed_statuses = {
            AppointmentStatus.COMPLETED,
            AppointmentStatus.CANCELLED,
            AppointmentStatus.NO_SHOW,
        }

        if new_status not in allowed_statuses:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    f"Appointment cannot be changed from "
                    f"{current_status.value} to {new_status.value}."
                ),
            )

        return

    if current_status == AppointmentStatus.COMPLETED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "A completed appointment cannot be changed "
                "to another status."
            ),
        )

    if current_status == AppointmentStatus.CANCELLED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "A cancelled appointment cannot be changed "
                "to another status."
            ),
        )

    if current_status == AppointmentStatus.NO_SHOW:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "A no-show appointment cannot be changed "
                "to another status."
            ),
        )


# =========================================================
# CREATE
# =========================================================

def create_appointment_service(
    db: Session,
    appointment_data: AppointmentCreate,
    current_user: User,
    tenant_id: int,
) -> Appointment:
    _validate_patient(
        db=db,
        patient_id=appointment_data.patient_id,
        tenant_id=tenant_id,
    )

    _validate_future_datetime(
        appointment_data.appointment_date,
        appointment_data.appointment_time,
    )

    _validate_duration(
        appointment_data.duration_minutes
    )

    _check_overlap(
        db=db,
        tenant_id=tenant_id,
        appointment_date=appointment_data.appointment_date,
        appointment_time=appointment_data.appointment_time,
        duration_minutes=appointment_data.duration_minutes,
    )

    follow_up = _determine_follow_up(
        db=db,
        tenant_id=tenant_id,
        patient_id=appointment_data.patient_id,
        appointment_date=appointment_data.appointment_date,
        requested_value=appointment_data.is_follow_up,
    )

    data = appointment_data.model_copy(
        update={
            "is_follow_up": follow_up,
        }
    )

    appointment = create_appointment(
        db=db,
        appointment_data=data,
        tenant_id=tenant_id,
    )

    return _attach_patient_data(
        db,
        appointment,
    )


# =========================================================
# GET
# =========================================================

def get_appointment_service(
    db: Session,
    appointment_id: int,
    current_user: User,
    tenant_id: int,
) -> Appointment:
    appointment = get_appointment_by_id(
        db=db,
        appointment_id=appointment_id,
    )

    if appointment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found.",
        )

    if appointment.tenant_id != tenant_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found in the selected clinic.",
        )

    return _attach_patient_data(
        db,
        appointment,
    )


# =========================================================
# LIST
# =========================================================

def list_appointments_service(
    db: Session,
    current_user: User,
    tenant_id: int,
) -> list[Appointment]:
    appointments = get_appointments(
        db=db,
        tenant_id=tenant_id,
    )

    return _attach_patient_data_to_list(
        db,
        appointments,
    )


# =========================================================
# UPDATE
# =========================================================

def update_appointment_service(
    db: Session,
    appointment_id: int,
    appointment_data: AppointmentUpdate,
    current_user: User,
    tenant_id: int,
) -> Appointment:
    appointment = get_appointment_by_id(
        db=db,
        appointment_id=appointment_id,
    )

    if appointment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found.",
        )

    if appointment.tenant_id != tenant_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found in the selected clinic.",
        )

    update_data = appointment_data.model_dump(
        exclude_unset=True,
    )

    # -----------------------------------------------------
    # STATUS UPDATE
    # -----------------------------------------------------

    if "status" in update_data:
        new_status = update_data["status"]

        _validate_status_change(
            current_status=appointment.status,
            new_status=new_status,
        )

    # -----------------------------------------------------
    # PATIENT
    # -----------------------------------------------------

    patient_id = update_data.get(
        "patient_id",
        appointment.patient_id,
    )

    _validate_patient(
        db=db,
        patient_id=patient_id,
        tenant_id=tenant_id,
    )

    # -----------------------------------------------------
    # DATE / TIME / DURATION
    # -----------------------------------------------------

    appointment_date = update_data.get(
        "appointment_date",
        appointment.appointment_date,
    )

    appointment_time = update_data.get(
        "appointment_time",
        appointment.appointment_time,
    )

    duration_minutes = update_data.get(
        "duration_minutes",
        appointment.duration_minutes,
    )

    # Only validate future date/time when the appointment
    # date or time is actually being changed.
    #
    # This allows an old appointment to be marked:
    #   - NO_SHOW
    #   - CANCELLED
    #   - COMPLETED
    #
    # without triggering the future-date validation.

    if (
        "appointment_date" in update_data
        or "appointment_time" in update_data
    ):
        _validate_future_datetime(
            appointment_date,
            appointment_time,
        )

    _validate_duration(
        duration_minutes
    )

    # -----------------------------------------------------
    # OVERLAP
    # -----------------------------------------------------

    # Only check overlap when scheduling information changes.
    if (
        "appointment_date" in update_data
        or "appointment_time" in update_data
        or "duration_minutes" in update_data
        or "patient_id" in update_data
    ):
        _check_overlap(
            db=db,
            tenant_id=tenant_id,
            appointment_date=appointment_date,
            appointment_time=appointment_time,
            duration_minutes=duration_minutes,
            exclude_appointment_id=appointment.id,
        )

    # -----------------------------------------------------
    # FOLLOW-UP
    # -----------------------------------------------------

    if (
        "patient_id" in update_data
        or "appointment_date" in update_data
        or "is_follow_up" in update_data
    ):
        requested_follow_up = update_data.get(
            "is_follow_up",
            appointment.is_follow_up,
        )

        update_data["is_follow_up"] = _determine_follow_up(
            db=db,
            tenant_id=tenant_id,
            patient_id=patient_id,
            appointment_date=appointment_date,
            requested_value=requested_follow_up,
            exclude_appointment_id=appointment.id,
        )

    # -----------------------------------------------------
    # APPLY UPDATE
    # -----------------------------------------------------

    updated_data = AppointmentUpdate(
        **update_data
    )

    appointment = update_appointment(
        db=db,
        appointment=appointment,
        appointment_data=updated_data,
    )

    return _attach_patient_data(
        db,
        appointment,
    )


# =========================================================
# DELETE
# =========================================================

def delete_appointment_service(
    db: Session,
    appointment_id: int,
    current_user: User,
    tenant_id: int,
) -> None:
    appointment = get_appointment_by_id(
        db=db,
        appointment_id=appointment_id,
    )

    if appointment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found.",
        )

    if appointment.tenant_id != tenant_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found in the selected clinic.",
        )

    delete_appointment(
        db=db,
        appointment=appointment,
    )