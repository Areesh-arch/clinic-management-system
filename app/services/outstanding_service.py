from decimal import Decimal

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.crud.outstanding import (
    create_outstanding,
    get_outstanding_by_id,
    get_outstanding_by_visit_id,
    get_outstandings,
    get_all_outstandings,
    update_outstanding,
    delete_outstanding,
)

from app.models.outstanding import Outstanding
from app.models.visit import Visit
from app.models.payment import Payment


def calculate_visit_outstanding(
    db: Session,
    visit: Visit,
) -> tuple[Decimal, Decimal, Decimal]:
    """
    Calculate:

        total_charge
        total_paid
        outstanding_amount

    for a single visit.
    """

    total_charge = Decimal(
        str(visit.charge or 0)
    )

    total_paid = (
        db.query(
            func.coalesce(
                func.sum(Payment.amount),
                0,
            )
        )
        .filter(
            Payment.visit_id == visit.id,
            Payment.tenant_id == visit.tenant_id,
        )
        .scalar()
    )

    total_paid = Decimal(
        str(total_paid or 0)
    )

    outstanding_amount = (
        total_charge - total_paid
    )

    # Never allow outstanding to become negative.
    if outstanding_amount < 0:
        outstanding_amount = Decimal("0.00")

    return (
        total_charge,
        total_paid,
        outstanding_amount,
    )


def create_or_update_outstanding_service(
    db: Session,
    visit: Visit,
    tenant_id: int,
):
    """
    Create or update the outstanding record
    for a visit.
    """

    if visit.tenant_id != tenant_id:
        raise ValueError(
            "Visit does not belong to this clinic."
        )

    (
        total_charge,
        total_paid,
        outstanding_amount,
    ) = calculate_visit_outstanding(
        db=db,
        visit=visit,
    )

    existing_outstanding = (
        get_outstanding_by_visit_id(
            db=db,
            visit_id=visit.id,
        )
    )

    if existing_outstanding:
        return update_outstanding(
            db=db,
            outstanding=existing_outstanding,
            total_charge=total_charge,
            total_paid=total_paid,
            outstanding_amount=outstanding_amount,
        )

    return create_outstanding(
        db=db,
        tenant_id=tenant_id,
        patient_id=visit.patient_id,
        visit_id=visit.id,
        total_charge=total_charge,
        total_paid=total_paid,
        outstanding_amount=outstanding_amount,
    )


def build_outstanding_response(
    outstanding: Outstanding,
):
    """
    Convert an Outstanding model into the response
    expected by the frontend.

    Includes both patient_id and patient_name.
    """

    patient = outstanding.patient

    if patient is None:
        patient_name = "Unknown Patient"
    else:
        patient_name = (
            f"{patient.first_name} {patient.last_name}"
        ).strip()

    return {
        "id": outstanding.id,
        "tenant_id": outstanding.tenant_id,
        "patient_id": outstanding.patient_id,
        "patient_name": patient_name,
        "visit_id": outstanding.visit_id,
        "total_charge": float(outstanding.total_charge),
        "total_paid": float(outstanding.total_paid),
        "outstanding_amount": float(
            outstanding.outstanding_amount
        ),
        "created_at": outstanding.created_at,
        "updated_at": outstanding.updated_at,
    }


def get_outstanding_service(
    db: Session,
    outstanding_id: int,
    tenant_id: int,
):

    outstanding = get_outstanding_by_id(
        db=db,
        outstanding_id=outstanding_id,
    )

    if outstanding is None:
        raise ValueError(
            "Outstanding record not found."
        )

    if outstanding.tenant_id != tenant_id:
        raise ValueError(
            "Outstanding record does not belong to this clinic."
        )

    return outstanding


def get_outstanding_by_visit_service(
    db: Session,
    visit_id: int,
    tenant_id: int,
):

    visit = (
        db.query(Visit)
        .filter(
            Visit.id == visit_id,
            Visit.tenant_id == tenant_id,
        )
        .first()
    )

    if visit is None:
        raise ValueError(
            "Visit not found."
        )

    return create_or_update_outstanding_service(
        db=db,
        visit=visit,
        tenant_id=tenant_id,
    )


def list_outstanding_service(
    db: Session,
    tenant_id: int,
):

    outstandings = get_outstandings(
        db=db,
        tenant_id=tenant_id,
    )

    return [
        build_outstanding_response(outstanding)
        for outstanding in outstandings
    ]


def list_all_outstanding_service(
    db: Session,
    tenant_id: int,
):

    outstandings = get_all_outstandings(
        db=db,
        tenant_id=tenant_id,
    )

    return [
        build_outstanding_response(outstanding)
        for outstanding in outstandings
    ]


def refresh_outstanding_for_visit(
    db: Session,
    visit_id: int,
    tenant_id: int,
):

    visit = (
        db.query(Visit)
        .filter(
            Visit.id == visit_id,
            Visit.tenant_id == tenant_id,
        )
        .first()
    )

    if visit is None:
        raise ValueError(
            "Visit not found."
        )

    return create_or_update_outstanding_service(
        db=db,
        visit=visit,
        tenant_id=tenant_id,
    )


def delete_outstanding_service(
    db: Session,
    outstanding_id: int,
    tenant_id: int,
):

    outstanding = get_outstanding_service(
        db=db,
        outstanding_id=outstanding_id,
        tenant_id=tenant_id,
    )

    delete_outstanding(
        db=db,
        outstanding=outstanding,
    )