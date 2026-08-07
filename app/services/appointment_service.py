from datetime import date, datetime, timedelta

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
from app.models.staff import Staff

from app.schemas.appointment import (
    AppointmentCreate,
    AppointmentUpdate,
)


def create_appointment_service(
    db: Session,
    appointment_data: AppointmentCreate,
    tenant_id: int,
):
    """
    Create a new appointment after validating
    patient, doctor, date and overlapping schedule.
    """

    # ==========================================
    # Check patient exists
    # ==========================================
    patient = (
        db.query(Patient)
        .filter(
            Patient.id == appointment_data.patient_id,
            Patient.tenant_id == tenant_id,
        )
        .first()
    )

    if patient is None:
        raise ValueError("Patient not found.")

    # ==========================================
    # Check doctor exists
    # ==========================================
    doctor = (
        db.query(Staff)
        .filter(
            Staff.id == appointment_data.doctor_id,
            Staff.tenant_id == tenant_id,
        )
        .first()
    )

    if doctor is None:
        raise ValueError("Doctor not found.")

    # ==========================================
    # Prevent past appointments
    # ==========================================
    if appointment_data.appointment_date < date.today():
        raise ValueError(
            "Cannot create appointment in the past."
        )

    # ==========================================
    # Check overlapping appointments
    # ==========================================
    appointments = (
        db.query(Appointment)
        .filter(
            Appointment.doctor_id == appointment_data.doctor_id,
            Appointment.appointment_date == appointment_data.appointment_date,
        )
        .all()
    )

    # Make incoming time timezone-naive
    new_time = appointment_data.appointment_time.replace(tzinfo=None)

    new_start = datetime.combine(
        appointment_data.appointment_date,
        new_time,
    )

    new_end = new_start + timedelta(
        minutes=appointment_data.duration_minutes
    )

    for appointment in appointments:

        # Make database time timezone-naive
        existing_time = appointment.appointment_time.replace(
            tzinfo=None
        )

        existing_start = datetime.combine(
            appointment.appointment_date,
            existing_time,
        )

        existing_end = existing_start + timedelta(
            minutes=appointment.duration_minutes
        )

        if (
            new_start < existing_end
            and new_end > existing_start
        ):
            raise ValueError(
                "Doctor already has an overlapping appointment."
            )

    # ==========================================
    # Create appointment
    # ==========================================
    return create_appointment(
        db=db,
        appointment_data=appointment_data,
        tenant_id=tenant_id,
    )


def get_appointment_service(
    db: Session,
    appointment_id: int,
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


def list_appointments_service(
    db: Session,
    tenant_id: int,
):
    return get_appointments(
        db=db,
        tenant_id=tenant_id,
    )


def update_appointment_service(
    db: Session,
    appointment: Appointment,
    appointment_data: AppointmentUpdate,
):
    return update_appointment(
        db=db,
        appointment=appointment,
        appointment_data=appointment_data,
    )


def delete_appointment_service(
    db: Session,
    appointment: Appointment,
):
    delete_appointment(
        db=db,
        appointment=appointment,
    )