from sqlalchemy.orm import Session

from app.crud.prescription import (
    create_prescription,
    get_prescription_by_id,
    get_prescriptions,
    update_prescription,
    delete_prescription,
)

from app.models.prescription import Prescription
from app.models.visit import Visit

from app.schemas.prescription import (
    PrescriptionCreate,
    PrescriptionUpdate,
)


def create_prescription_service(
    db: Session,
    prescription_data: PrescriptionCreate,
    tenant_id: int,
):
    """
    Create a prescription after validating:
    - Visit exists
    - Visit belongs to tenant
    - Prescription doesn't already exist
    """

    # ================================
    # Check visit exists
    # ================================
    visit = (
        db.query(Visit)
        .filter(
            Visit.id == prescription_data.visit_id,
            Visit.tenant_id == tenant_id,
        )
        .first()
    )

    if visit is None:
        raise ValueError(
            "Visit not found."
        )

    # ================================
    # Prevent duplicate prescription
    # ================================
    if visit.prescription:
        raise ValueError(
            "Prescription already exists for this visit."
        )

    return create_prescription(
        db=db,
        prescription_data=prescription_data,
        tenant_id=tenant_id,
    )


def get_prescription_service(
    db: Session,
    prescription_id: int,
):
    prescription = get_prescription_by_id(
        db=db,
        prescription_id=prescription_id,
    )

    if prescription is None:
        raise ValueError(
            "Prescription not found."
        )

    return prescription


def list_prescriptions_service(
    db: Session,
    tenant_id: int,
):
    return get_prescriptions(
        db=db,
        tenant_id=tenant_id,
    )


def update_prescription_service(
    db: Session,
    prescription: Prescription,
    prescription_data: PrescriptionUpdate,
):
    return update_prescription(
        db=db,
        prescription=prescription,
        prescription_data=prescription_data,
    )


def delete_prescription_service(
    db: Session,
    prescription: Prescription,
):
    delete_prescription(
        db=db,
        prescription=prescription,
    )