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


def generate_medical_record_number(
    db: Session,
    tenant_id: int,
) -> str:
    count = db.scalar(
        select(func.count())
        .select_from(Patient)
        .where(Patient.tenant_id == tenant_id)
    )

    return f"DC-{(count or 0) + 1:06d}"


def create_patient_service(
    db: Session,
    patient_data: PatientCreate,
    tenant_id: int,
) -> Patient:

    mrn = generate_medical_record_number(
        db=db,
        tenant_id=tenant_id,
    )

    return create_patient(
        db=db,
        patient_data=patient_data,
        tenant_id=tenant_id,
        medical_record_number=mrn,
    )


def get_patient_service(
    db: Session,
    patient_id: int,
    tenant_id: int,
) -> Patient | None:

    return get_patient_by_id(
        db=db,
        patient_id=patient_id,
        tenant_id=tenant_id,
    )


def list_patients_service(
    db: Session,
    tenant_id: int,
) -> list[Patient]:

    return get_patients(
        db=db,
        tenant_id=tenant_id,
    )


def update_patient_service(
    db: Session,
    patient: Patient,
    patient_data: PatientUpdate,
) -> Patient:

    return update_patient(
        db=db,
        patient=patient,
        patient_data=patient_data,
    )


def delete_patient_service(
    db: Session,
    patient: Patient,
) -> None:

    delete_patient(
        db=db,
        patient=patient,
    )