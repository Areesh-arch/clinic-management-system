from sqlalchemy.orm import Session

from app.models.prescription import Prescription
from app.models.prescription_item import PrescriptionItem

from app.schemas.prescription import (
    PrescriptionCreate,
    PrescriptionUpdate,
)


def create_prescription(
    db: Session,
    prescription_data: PrescriptionCreate,
    tenant_id: int,
) -> Prescription:

    prescription = Prescription(
        tenant_id=tenant_id,
        visit_id=prescription_data.visit_id,
        instructions=prescription_data.instructions,
    )

    db.add(prescription)
    db.flush()

    for item in prescription_data.items:
        prescription_item = PrescriptionItem(
            prescription_id=prescription.id,
            medicine_name=item.medicine_name,
            dosage=item.dosage,
            frequency=item.frequency,
            duration=item.duration,
            quantity=item.quantity,
            notes=item.notes,
        )

        db.add(prescription_item)

    db.commit()
    db.refresh(prescription)

    return prescription


def get_prescription_by_id(
    db: Session,
    prescription_id: int,
):
    return (
        db.query(Prescription)
        .filter(Prescription.id == prescription_id)
        .first()
    )


def get_prescriptions(
    db: Session,
    tenant_id: int,
):
    return (
        db.query(Prescription)
        .filter(Prescription.tenant_id == tenant_id)
        .all()
    )


def update_prescription(
    db: Session,
    prescription: Prescription,
    prescription_data: PrescriptionUpdate,
):

    update_data = prescription_data.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(prescription, key, value)

    db.commit()
    db.refresh(prescription)

    return prescription


def delete_prescription(
    db: Session,
    prescription: Prescription,
):

    db.delete(prescription)
    db.commit()