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

from app.models.enums import (
    AppointmentStatus,
    VisitStatus,
)

from app.schemas.visit import (
    VisitCreate,
    VisitUpdate,
)


# =========================================================
# SYNC APPOINTMENT STATUS
# =========================================================

def sync_appointment_status(
    db: Session,
    visit: Visit,
    tenant_id: int,
):
    """
    Synchronize the appointment status with the visit.

    Appointment workflow:

        SCHEDULED
            |
            | patient attends / visit is completed
            v
        COMPLETED

    Payment is NOT required for an appointment to become
    COMPLETED.

    Payment belongs to billing/financial workflow and should
    not determine whether the appointment happened.
    """

    # -----------------------------------------------------
    # Visit must belong to an appointment
    # -----------------------------------------------------

    if visit.appointment_id is None:
        return

    # -----------------------------------------------------
    # Find appointment
    # -----------------------------------------------------

    appointment = (
        db.query(Appointment)
        .filter(
            Appointment.id == visit.appointment_id,
            Appointment.tenant_id == tenant_id,
        )
        .first()
    )

    if appointment is None:
        return

    # -----------------------------------------------------
    # Do not overwrite final appointment statuses
    # -----------------------------------------------------
    #
    # If an appointment was explicitly marked:
    #
    #   CANCELLED
    #   NO_SHOW
    #
    # a visit update should not automatically change it
    # back to SCHEDULED or COMPLETED.
    #
    # This protects the appointment workflow.
    # -----------------------------------------------------

    if appointment.status in (
        AppointmentStatus.CANCELLED,
        AppointmentStatus.NO_SHOW,
    ):
        db.commit()
        db.refresh(appointment)
        return

    # -----------------------------------------------------
    # COMPLETED VISIT = COMPLETED APPOINTMENT
    # -----------------------------------------------------

    if visit.status == VisitStatus.COMPLETED:
        appointment.status = AppointmentStatus.COMPLETED

    # -----------------------------------------------------
    # Other visit statuses
    # -----------------------------------------------------
    #
    # If visit is IN_PROGRESS, appointment remains
    # SCHEDULED because the appointment has happened but
    # the visit has not been completed yet.
    #
    # We intentionally do NOT change a completed appointment
    # back to scheduled here.
    # -----------------------------------------------------

    db.commit()
    db.refresh(appointment)


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

    # -----------------------------------------------------
    # Synchronize appointment status
    # -----------------------------------------------------
    #
    # Normally a newly created visit will be IN_PROGRESS.
    #
    # If the VisitCreate data creates it directly as
    # COMPLETED, the appointment should immediately become
    # COMPLETED as well.
    # -----------------------------------------------------

    sync_appointment_status(
        db=db,
        visit=visit,
        tenant_id=tenant_id,
    )

    return visit


# =========================================================
# GET ONE
# =========================================================

def get_visit_service(
    db: Session,
    visit_id: int,
    tenant_id: int,
):
    visit = get_visit_by_id(
        db=db,
        visit_id=visit_id,
    )

    if visit is None:
        raise ValueError(
            "Visit not found."
        )

    if visit.tenant_id != tenant_id:
        raise ValueError(
            "Visit does not belong to this clinic."
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
    tenant_id: int,
):
    """
    Update visit and automatically synchronize
    the connected appointment.
    """

    # -----------------------------------------------------
    # Tenant validation
    # -----------------------------------------------------

    if visit.tenant_id != tenant_id:
        raise ValueError(
            "Visit does not belong to this clinic."
        )

    # -----------------------------------------------------
    # Update visit
    # -----------------------------------------------------

    updated_visit = update_visit(
        db=db,
        visit=visit,
        visit_data=visit_data,
    )

    # -----------------------------------------------------
    # Synchronize appointment
    # -----------------------------------------------------

    sync_appointment_status(
        db=db,
        visit=updated_visit,
        tenant_id=tenant_id,
    )

    return updated_visit


# =========================================================
# DELETE
# =========================================================

def delete_visit_service(
    db: Session,
    visit: Visit,
    tenant_id: int,
):
    # -----------------------------------------------------
    # Tenant validation
    # -----------------------------------------------------

    if visit.tenant_id != tenant_id:
        raise ValueError(
            "Visit does not belong to this clinic."
        )

    # -----------------------------------------------------
    # Delete visit
    # -----------------------------------------------------

    delete_visit(
        db=db,
        visit=visit,
    )