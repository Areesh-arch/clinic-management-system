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
from app.models.patient import Patient


# =========================================================
# CALCULATE VISIT OUTSTANDING
# =========================================================

def calculate_visit_outstanding(
    db: Session,
    visit: Visit,
) -> tuple[Decimal, Decimal, Decimal]:
    """
    Calculate:

        total_charge
        total_paid
        outstanding_amount

    Only ACTIVE payments are included.

    Archived payments are ignored.
    """

    total_charge = Decimal(
        str(visit.charge or 0)
    )

    # -----------------------------------------------------
    # ACTIVE PAYMENTS ONLY
    # -----------------------------------------------------

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
            Payment.is_archived.is_(False),
        )
        .scalar()
    )

    total_paid = Decimal(
        str(total_paid or 0)
    )

    outstanding_amount = (
        total_charge - total_paid
    )

    # Never allow negative outstanding.
    if outstanding_amount < 0:
        outstanding_amount = Decimal("0.00")

    return (
        total_charge,
        total_paid,
        outstanding_amount,
    )


# =========================================================
# CREATE / UPDATE OUTSTANDING
# =========================================================

def create_or_update_outstanding_service(
    db: Session,
    visit: Visit,
    tenant_id: int,
):
    """
    Create or update the outstanding record for a visit.
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


# =========================================================
# BUILD OUTSTANDING RESPONSE
# =========================================================

def build_outstanding_response(
    db: Session,
    outstanding: Outstanding,
):
    """
    Build the frontend Outstanding response.

    Includes:
        - Patient Name
        - Medical Record Number
        - Patient ID for backend compatibility
    """

    # -----------------------------------------------------
    # Get patient using tenant-safe lookup
    # -----------------------------------------------------

    patient = (
        db.query(Patient)
        .filter(
            Patient.id == outstanding.patient_id,
            Patient.tenant_id == outstanding.tenant_id,
        )
        .first()
    )

    # -----------------------------------------------------
    # Patient name
    # -----------------------------------------------------

    if patient is None:
        patient_name = "Unknown Patient"
        medical_record_number = None
    else:
        first_name = (
            getattr(patient, "first_name", "")
            or ""
        ).strip()

        last_name = (
            getattr(patient, "last_name", "")
            or ""
        ).strip()

        patient_name = " ".join(
            part
            for part in [first_name, last_name]
            if part
        ).strip()

        if not patient_name:
            patient_name = (
                getattr(patient, "name", None)
                or getattr(patient, "full_name", None)
                or "Unknown Patient"
            )

        medical_record_number = getattr(
            patient,
            "medical_record_number",
            None,
        )

    # -----------------------------------------------------
    # Response
    # -----------------------------------------------------

    return {
        "id": outstanding.id,
        "tenant_id": outstanding.tenant_id,

        "patient_id": outstanding.patient_id,
        "patient_name": patient_name,
        "medical_record_number": medical_record_number,

        "visit_id": outstanding.visit_id,

        "total_charge": float(
            outstanding.total_charge
        ),
        "total_paid": float(
            outstanding.total_paid
        ),
        "outstanding_amount": float(
            outstanding.outstanding_amount
        ),

        "created_at": outstanding.created_at,
        "updated_at": outstanding.updated_at,
    }


# =========================================================
# GET ONE OUTSTANDING
# =========================================================

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


# =========================================================
# GET OUTSTANDING BY VISIT
# =========================================================

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


# =========================================================
# LIST OUTSTANDING
# =========================================================

def list_outstanding_service(
    db: Session,
    tenant_id: int,
):

    outstandings = get_outstandings(
        db=db,
        tenant_id=tenant_id,
    )

    return [
        build_outstanding_response(
            db=db,
            outstanding=outstanding,
        )
        for outstanding in outstandings
    ]


# =========================================================
# LIST ALL OUTSTANDING
# =========================================================

def list_all_outstanding_service(
    db: Session,
    tenant_id: int,
):

    outstandings = get_all_outstandings(
        db=db,
        tenant_id=tenant_id,
    )

    return [
        build_outstanding_response(
            db=db,
            outstanding=outstanding,
        )
        for outstanding in outstandings
    ]


# =========================================================
# REFRESH OUTSTANDING FOR VISIT
# =========================================================

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


# =========================================================
# DELETE OUTSTANDING
# =========================================================

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