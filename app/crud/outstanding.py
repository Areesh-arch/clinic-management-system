from sqlalchemy.orm import Session

from app.models.outstanding import Outstanding


def create_outstanding(
    db: Session,
    tenant_id: int,
    patient_id: int,
    visit_id: int,
    total_charge: float,
    total_paid: float,
    outstanding_amount: float,
) -> Outstanding:

    outstanding = Outstanding(
        tenant_id=tenant_id,
        patient_id=patient_id,
        visit_id=visit_id,
        total_charge=total_charge,
        total_paid=total_paid,
        outstanding_amount=outstanding_amount,
    )

    db.add(outstanding)
    db.commit()
    db.refresh(outstanding)

    return outstanding


def get_outstanding_by_id(
    db: Session,
    outstanding_id: int,
) -> Outstanding | None:

    return (
        db.query(Outstanding)
        .filter(
            Outstanding.id == outstanding_id,
        )
        .first()
    )


def get_outstanding_by_visit_id(
    db: Session,
    visit_id: int,
) -> Outstanding | None:

    return (
        db.query(Outstanding)
        .filter(
            Outstanding.visit_id == visit_id,
        )
        .first()
    )


def get_outstandings(
    db: Session,
    tenant_id: int,
) -> list[Outstanding]:

    return (
        db.query(Outstanding)
        .filter(
            Outstanding.tenant_id == tenant_id,
            Outstanding.outstanding_amount > 0,
        )
        .all()
    )


def get_all_outstandings(
    db: Session,
    tenant_id: int,
) -> list[Outstanding]:

    return (
        db.query(Outstanding)
        .filter(
            Outstanding.tenant_id == tenant_id,
        )
        .all()
    )


def update_outstanding(
    db: Session,
    outstanding: Outstanding,
    total_charge: float,
    total_paid: float,
    outstanding_amount: float,
) -> Outstanding:

    outstanding.total_charge = total_charge
    outstanding.total_paid = total_paid
    outstanding.outstanding_amount = outstanding_amount

    db.commit()
    db.refresh(outstanding)

    return outstanding


def delete_outstanding(
    db: Session,
    outstanding: Outstanding,
) -> None:

    db.delete(outstanding)
    db.commit()