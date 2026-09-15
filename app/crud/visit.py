from sqlalchemy.orm import Session

from app.models.visit import Visit
from app.schemas.visit import (
    VisitCreate,
    VisitUpdate,
)


# ============================================================
# CREATE
# ============================================================

def create_visit(
    db: Session,
    visit_data: VisitCreate,
    tenant_id: int,
    patient_id: int,
) -> Visit:

    visit = Visit(
        tenant_id=tenant_id,
        appointment_id=visit_data.appointment_id,
        patient_id=patient_id,
        chief_complaint=visit_data.chief_complaint,
        diagnosis=visit_data.diagnosis,
        notes=visit_data.notes,
        charge=visit_data.charge,
        is_archived=False,
    )

    db.add(visit)
    db.commit()
    db.refresh(visit)

    return visit


# ============================================================
# GET SINGLE ACTIVE VISIT
# ============================================================

def get_visit_by_id(
    db: Session,
    visit_id: int,
) -> Visit | None:

    return (
        db.query(Visit)
        .filter(
            Visit.id == visit_id,
            Visit.is_archived.is_(False),
        )
        .first()
    )


# ============================================================
# GET ACTIVE VISITS
# ============================================================

def get_visits(
    db: Session,
    tenant_id: int,
) -> list[Visit]:

    return (
        db.query(Visit)
        .filter(
            Visit.tenant_id == tenant_id,
            Visit.is_archived.is_(False),
        )
        .order_by(Visit.visit_time.desc())
        .all()
    )


# ============================================================
# GET ARCHIVED VISITS
# ============================================================

def get_archived_visits(
    db: Session,
    tenant_id: int,
) -> list[Visit]:

    return (
        db.query(Visit)
        .filter(
            Visit.tenant_id == tenant_id,
            Visit.is_archived.is_(True),
        )
        .order_by(Visit.visit_time.desc())
        .all()
    )


# ============================================================
# UPDATE
# ============================================================

def update_visit(
    db: Session,
    visit: Visit,
    visit_data: VisitUpdate,
) -> Visit:

    update_data = visit_data.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(visit, key, value)

    db.commit()
    db.refresh(visit)

    return visit


# ============================================================
# ARCHIVE
# ============================================================

def archive_visit(
    db: Session,
    visit: Visit,
) -> Visit:

    visit.is_archived = True

    db.commit()
    db.refresh(visit)

    return visit


# ============================================================
# RESTORE
# ============================================================

def restore_visit(
    db: Session,
    visit: Visit,
) -> Visit:

    visit.is_archived = False

    db.commit()
    db.refresh(visit)

    return visit


# ============================================================
# PERMANENT DELETE
# ============================================================

def permanently_delete_visit(
    db: Session,
    visit: Visit,
) -> None:

    db.delete(visit)
    db.commit()


# ============================================================
# LEGACY DELETE
# ============================================================

def delete_visit(
    db: Session,
    visit: Visit,
) -> Visit:

    """
    Legacy delete behavior.

    Normal delete now archives the visit instead of
    permanently deleting it.
    """

    return archive_visit(
        db=db,
        visit=visit,
    )