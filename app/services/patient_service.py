from sqlalchemy import Integer, func, select, text
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
    """
    Generate the next medical record number for a specific tenant.

    Medical record numbers restart from DC-000001 for every tenant.

    A PostgreSQL transaction-level advisory lock is used so that
    two patients cannot receive the same number when created
    simultaneously for the same tenant.
    """

    # Lock this tenant for the duration of the current transaction.
    #
    # Different tenants use different lock keys, so creating a patient
    # in Tenant A does not block patient creation in Tenant B.
    db.execute(
        text("SELECT pg_advisory_xact_lock(:tenant_id)"),
        {"tenant_id": tenant_id},
    )

    # Extract the numeric portion from medical_record_number
    # and find the highest number belonging ONLY to this tenant.
    max_number = db.scalar(
        select(
            func.max(
                func.cast(
                    func.substring(
                        Patient.medical_record_number,
                        4,
                    ),
                    Integer,
                )
            )
        ).where(
            Patient.tenant_id == tenant_id
        )
    )

    next_number = (max_number or 0) + 1

    return f"DC-{next_number:06d}"


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