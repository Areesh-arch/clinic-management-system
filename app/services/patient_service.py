from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.crud.patient import (
    create_patient,
    delete_patient,
    get_patient_by_id,
    get_patients,
    update_patient,
)
from app.models.patient import Patient
from app.schemas.patient import PatientCreate, PatientUpdate


def generate_medical_record_number(db: Session) -> str:
    """
    Generate a unique Medical Record Number (MRN).
    Example: DC-000001
    """

    count = db.scalar(
        select(func.count()).select_from(Patient)
    )

    return f"DC-{count + 1:06d}"


def create_patient_service(
    db: Session,
    patient_data: PatientCreate,
    tenant_id: int,
) -> Patient:
    """
    Business logic for creating a patient.
    """

    mrn = generate_medical_record_number(db)

    return create_patient(
        db=db,
        patient_data=patient_data,
        tenant_id=tenant_id,
        medical_record_number=mrn,
    )


def get_patient_service(
    db: Session,
    patient_id: int,
) -> Patient | None:
    return get_patient_by_id(db, patient_id)


def list_patients_service(
    db: Session,
) -> list[Patient]:
    return get_patients(db)


def update_patient_service(
    db: Session,
    patient: Patient,
    patient_data: PatientUpdate,
) -> Patient:
    return update_patient(
        db,
        patient,
        patient_data,
    )


def delete_patient_service(
    db: Session,
    patient: Patient,
) -> None:
    delete_patient(
        db,
        patient,
    )