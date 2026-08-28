from sqlalchemy.orm import Session

from app.crud.visit import (
    create_visit,
    get_visit_by_id,
    get_visits,
    update_visit,
    delete_visit,
)

from app.models.visit import Visit
from app.models.patient import Patient
from app.models.appointment import Appointment

from app.models.enums import AppointmentStatus

from app.schemas.visit import (
    VisitCreate,
    VisitUpdate,
)


# =========================================================
# CREATE VISIT
# =========================================================

def create_visit_service(
    db: Session,
    visit_data: VisitCreate,
    tenant_id: int,
):
    """
    Create a visit from an existing appointment.

    Architecture:
        OWNER = DOCTOR

    Therefore:
        - no doctor_id is accepted
        - no Staff record is required
        - no doctor profile is required

    The appointment already belongs to the current tenant,
    and the patient is taken directly from that appointment.
    """

    # -----------------------------------------------------
    # Find appointment
    # -----------------------------------------------------

    appointment = (
        db.query(Appointment)
        .filter(
            Appointment.id == visit_data.appointment_id,
            Appointment.tenant_id == tenant_id,
        )
        .first()
    )

    if appointment is None:
        raise ValueError(
            "Appointment not found."
        )

    # -----------------------------------------------------
    # Appointment must be scheduled
    # -----------------------------------------------------

    if appointment.status != AppointmentStatus.SCHEDULED:
        raise ValueError(
            "Visit can only be started from a scheduled appointment."
        )

    # -----------------------------------------------------
    # Prevent duplicate visit
    # -----------------------------------------------------

    existing_visit = (
        db.query(Visit)
        .filter(
            Visit.appointment_id == appointment.id,
            Visit.tenant_id == tenant_id,
        )
        .first()
    )

    if existing_visit is not None:
        raise ValueError(
            "Visit already exists for this appointment."
        )

    # -----------------------------------------------------
    # Verify patient
    # -----------------------------------------------------

    patient = (
        db.query(Patient)
        .filter(
            Patient.id == appointment.patient_id,
            Patient.tenant_id == tenant_id,
        )
        .first()
    )

    if patient is None:
        raise ValueError(
            "Patient associated with this appointment was not found."
        )

    # -----------------------------------------------------
    # Create visit
    # -----------------------------------------------------

    visit = create_visit(
        db=db,
        visit_data=visit_data,
        tenant_id=tenant_id,
        patient_id=appointment.patient_id,
    )

    return visit


# =========================================================
# GET ONE
# =========================================================

def get_visit_service(
    db: Session,
    visit_id: int,
):
    visit = get_visit_by_id(
        db=db,
        visit_id=visit_id,
    )

    if visit is None:
        raise ValueError(
            "Visit not found."
        )

    return visit


# =========================================================
# GET ALL
# =========================================================

def list_visits_service(
    db: Session,
    tenant_id: int,
):
    return get_visits(
        db=db,
        tenant_id=tenant_id,
    )


# =========================================================
# UPDATE
# =========================================================

def update_visit_service(
    db: Session,
    visit: Visit,
    visit_data: VisitUpdate,
):
    return update_visit(
        db=db,
        visit=visit,
        visit_data=visit_data,
    )


# =========================================================
# DELETE
# =========================================================

def delete_visit_service(
    db: Session,
    visit: Visit,
):
    delete_visit(
        db=db,
        visit=visit,
    )