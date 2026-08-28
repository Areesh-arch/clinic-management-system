from sqlalchemy.orm import Session

from app.models.visit import Visit
from app.schemas.visit import (
    VisitCreate,
    VisitUpdate,
)


# =========================================================
# CREATE
# =========================================================

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
    )

    db.add(visit)
    db.commit()
    db.refresh(visit)

    return visit


# =========================================================
# GET ONE
# =========================================================

def get_visit_by_id(
    db: Session,
    visit_id: int,
) -> Visit | None:

    return (
        db.query(Visit)
        .filter(
            Visit.id == visit_id,
        )
        .first()
    )


# =========================================================
# GET ALL
# =========================================================

def get_visits(
    db: Session,
    tenant_id: int,
) -> list[Visit]:

    return (
        db.query(Visit)
        .filter(
            Visit.tenant_id == tenant_id,
        )
        .all()
    )


# =========================================================
# UPDATE
# =========================================================

def update_visit(
    db: Session,
    visit: Visit,
    visit_data: VisitUpdate,
) -> Visit:

    update_data = visit_data.model_dump(
        exclude_unset=True,
    )

    for key, value in update_data.items():
        setattr(
            visit,
            key,
            value,
        )

    db.commit()
    db.refresh(visit)

    return visit


# =========================================================
# DELETE
# =========================================================

def delete_visit(
    db: Session,
    visit: Visit,
) -> None:

    db.delete(visit)
    db.commit()