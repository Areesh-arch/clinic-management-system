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
from app.models.user import User
from app.models.enums import UserRole

from app.schemas.appointment import (
    AppointmentCreate,
    AppointmentUpdate,
)


def is_super_admin(current_user: User) -> bool:
    return current_user.role == UserRole.SUPER_ADMIN


# =========================================================
# CREATE APPOINTMENT
# =========================================================

def create_appointment_service(
    db: Session,
    appointment_data: AppointmentCreate,
    current_user: User,
):
    """
    Create appointment.

    SUPER_ADMIN:
        Can create for any clinic, but the request must
        contain clinic-specific patient/doctor IDs.

    OWNER/STAFF:
        Can create only inside their own clinic.
    """

    tenant_id = current_user.tenant_id

    # -----------------------------------------------------
    # Determine tenant from patient
    # -----------------------------------------------------

    patient = (
        db.query(Patient)
        .filter(
            Patient.id == appointment_data.patient_id,
        )
        .first()
    )

    if patient is None:
        raise ValueError("Patient not found.")

    # Normal users must stay inside their own clinic.
    if not is_super_admin(current_user):
        if patient.tenant_id != tenant_id:
            raise ValueError(
                "Patient does not belong to your clinic."
            )

    # For SUPER_ADMIN, use the patient's clinic.
    tenant_id = patient.tenant_id

    # -----------------------------------------------------
    # Check doctor
    # -----------------------------------------------------

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

    # -----------------------------------------------------
    # Prevent past appointments
    # -----------------------------------------------------

    if appointment_data.appointment_date < date.today():
        raise ValueError(
            "Cannot create appointment in the past."
        )

    # -----------------------------------------------------
    # Check overlapping appointments
    # -----------------------------------------------------

    appointments = (
        db.query(Appointment)
        .filter(
            Appointment.doctor_id
            == appointment_data.doctor_id,
            Appointment.tenant_id == tenant_id,
            Appointment.appointment_date
            == appointment_data.appointment_date,
        )
        .all()
    )

    new_time = appointment_data.appointment_time.replace(
        tzinfo=None
    )

    new_start = datetime.combine(
        appointment_data.appointment_date,
        new_time,
    )

    new_end = new_start + timedelta(
        minutes=appointment_data.duration_minutes
    )

    for appointment in appointments:

        existing_time = (
            appointment.appointment_time.replace(
                tzinfo=None
            )
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

    # -----------------------------------------------------
    # Create
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
):
    appointment = get_appointment_by_id(
        db=db,
        appointment_id=appointment_id,
    )

    if appointment is None:
        raise ValueError(
            "Appointment not found."
        )

    # SUPER_ADMIN can access every clinic.
    if is_super_admin(current_user):
        return appointment

    # OWNER/STAFF can only access their own clinic.
    if appointment.tenant_id != current_user.tenant_id:
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
):
    # SUPER_ADMIN → every clinic
    if is_super_admin(current_user):
        return (
            db.query(Appointment)
            .all()
        )

    # OWNER/STAFF → own clinic
    return get_appointments(
        db=db,
        tenant_id=current_user.tenant_id,
    )


# =========================================================
# UPDATE APPOINTMENT
# =========================================================

def update_appointment_service(
    db: Session,
    appointment: Appointment,
    appointment_data: AppointmentUpdate,
    current_user: User,
):
    # Endpoint already retrieved the appointment using
    # the correct authorization rules.

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
):
    # Endpoint already retrieved the appointment using
    # the correct authorization rules.

    delete_appointment(
        db=db,
        appointment=appointment,
    )