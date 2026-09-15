from sqlalchemy.orm import Session

from app.crud.visit import (
    create_visit,
    get_visit_by_id,
    get_visits,
    get_archived_visits,
    update_visit,
    archive_visit,
    restore_visit,
    permanently_delete_visit,
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


# ============================================================
# SYNC APPOINTMENT STATUS
# ============================================================

def sync_appointment_status(
    db: Session,
    appointment: Appointment,
    visit_status: VisitStatus,
) -> None:

    if visit_status == VisitStatus.COMPLETED:
        appointment.status = AppointmentStatus.COMPLETED

    elif visit_status == VisitStatus.CANCELLED:
        appointment.status = AppointmentStatus.CANCELLED

    elif visit_status == VisitStatus.NO_SHOW:
        appointment.status = AppointmentStatus.NO_SHOW


# ============================================================
# CREATE VISIT
# ============================================================

def create_visit_service(
    db: Session,
    visit_data: VisitCreate,
    tenant_id: int,
) -> Visit:

    appointment = (
        db.query(Appointment)
        .filter(
            Appointment.id == visit_data.appointment_id,
            Appointment.tenant_id == tenant_id,
        )
        .first()
    )

    if not appointment:
        raise ValueError("Appointment not found.")

    patient = (
        db.query(Patient)
        .filter(
            Patient.id == appointment.patient_id,
            Patient.tenant_id == tenant_id,
        )
        .first()
    )

    if not patient:
        raise ValueError("Patient not found.")

    visit = create_visit(
        db=db,
        visit_data=visit_data,
        tenant_id=tenant_id,
        patient_id=patient.id,
    )

    return visit


# ============================================================
# GET SINGLE ACTIVE VISIT
# ============================================================

def get_visit_service(
    db: Session,
    visit_id: int,
    tenant_id: int,
) -> Visit:

    visit = get_visit_by_id(
        db=db,
        visit_id=visit_id,
    )

    if not visit or visit.tenant_id != tenant_id:
        raise ValueError("Visit not found.")

    return visit


# ============================================================
# GET ACTIVE VISITS
# ============================================================

def list_visits_service(
    db: Session,
    tenant_id: int,
) -> list[Visit]:

    return get_visits(
        db=db,
        tenant_id=tenant_id,
    )


# ============================================================
# GET ARCHIVED VISITS
# ============================================================

def list_archived_visits_service(
    db: Session,
    tenant_id: int,
) -> list[Visit]:

    return get_archived_visits(
        db=db,
        tenant_id=tenant_id,
    )


# ============================================================
# UPDATE VISIT
# ============================================================

def update_visit_service(
    db: Session,
    visit_id: int,
    visit_data: VisitUpdate,
    tenant_id: int,
) -> Visit:

    visit = get_visit_by_id(
        db=db,
        visit_id=visit_id,
    )

    if not visit or visit.tenant_id != tenant_id:
        raise ValueError("Visit not found.")

    updated_visit = update_visit(
        db=db,
        visit=visit,
        visit_data=visit_data,
    )

    # Keep appointment status synchronized when
    # the visit status changes.
    if visit_data.status is not None:

        appointment = (
            db.query(Appointment)
            .filter(
                Appointment.id == visit.appointment_id,
                Appointment.tenant_id == tenant_id,
            )
            .first()
        )

        if appointment:
            sync_appointment_status(
                db=db,
                appointment=appointment,
                visit_status=visit_data.status,
            )

            db.commit()
            db.refresh(updated_visit)

    return updated_visit


# ============================================================
# ARCHIVE VISIT
# ============================================================

def archive_visit_service(
    db: Session,
    visit_id: int,
    tenant_id: int,
) -> Visit:

    visit = get_visit_by_id(
        db=db,
        visit_id=visit_id,
    )

    if not visit or visit.tenant_id != tenant_id:
        raise ValueError("Visit not found.")

    return archive_visit(
        db=db,
        visit=visit,
    )


# ============================================================
# RESTORE VISIT
# ============================================================

def restore_visit_service(
    db: Session,
    visit_id: int,
    tenant_id: int,
) -> Visit:

    visit = (
        db.query(Visit)
        .filter(
            Visit.id == visit_id,
            Visit.tenant_id == tenant_id,
            Visit.is_archived.is_(True),
        )
        .first()
    )

    if not visit:
        raise ValueError("Archived visit not found.")

    return restore_visit(
        db=db,
        visit=visit,
    )


# ============================================================
# PERMANENT DELETE
# ============================================================

def permanently_delete_visit_service(
    db: Session,
    visit_id: int,
    tenant_id: int,
) -> None:

    visit = (
        db.query(Visit)
        .filter(
            Visit.id == visit_id,
            Visit.tenant_id == tenant_id,
            Visit.is_archived.is_(True),
        )
        .first()
    )

    if not visit:
        raise ValueError("Archived visit not found.")

    permanently_delete_visit(
        db=db,
        visit=visit,
    )


# ============================================================
# DELETE → ARCHIVE
# ============================================================

def delete_visit_service(
    db: Session,
    visit_id: int,
    tenant_id: int,
) -> Visit:

    return archive_visit_service(
        db=db,
        visit_id=visit_id,
        tenant_id=tenant_id,
    )