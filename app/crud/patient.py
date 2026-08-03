from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.patient import Patient
from app.schemas.patient import PatientCreate, PatientUpdate


def create_patient(
    db: Session,
    patient_data: PatientCreate,
    tenant_id: int,
    medical_record_number: str,
) -> Patient:
    """
    Create a new patient.
    """

    patient = Patient(
        tenant_id=tenant_id,
        medical_record_number=medical_record_number,
        **patient_data.model_dump(),
    )

    db.add(patient)
    db.commit()
    db.refresh(patient)

    return patient


def get_patient_by_id(
    db: Session,
    patient_id: int,
) -> Patient | None:
    """
    Return a single patient by ID.
    """

    statement = select(Patient).where(
        Patient.id == patient_id
    )

    return db.scalar(statement)


def get_patients(
    db: Session,
) -> list[Patient]:
    """
    Return all active patients.
    """

    statement = (
        select(Patient)
        .where(Patient.is_active == True)
        .order_by(Patient.first_name)
    )

    return list(db.scalars(statement).all())


def update_patient(
    db: Session,
    patient: Patient,
    patient_data: PatientUpdate,
) -> Patient:
    """
    Update patient details.
    """

    updates = patient_data.model_dump(exclude_unset=True)

    for key, value in updates.items():
        setattr(patient, key, value)

    db.commit()
    db.refresh(patient)

    return patient


def delete_patient(
    db: Session,
    patient: Patient,
) -> None:
    """
    Soft delete a patient.
    """

    patient.is_active = False

    db.commit()