from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.patient import (
    PatientCreate,
    PatientResponse,
    PatientUpdate,
)
from app.services.patient_service import (
    create_patient_service,
    get_patient_service,
    list_patients_service,
    update_patient_service,
    delete_patient_service,
)

router = APIRouter(
    prefix="/patients",
    tags=["Patients"],
)


# Temporary tenant_id
# Later we'll get this from the logged-in user.
TENANT_ID = 1


@router.post(
    "/",
    response_model=PatientResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_patient(
    patient: PatientCreate,
    db: Session = Depends(get_db),
):
    return create_patient_service(
        db=db,
        patient_data=patient,
        tenant_id=TENANT_ID,
    )


@router.get(
    "/",
    response_model=list[PatientResponse],
)
def list_patients(
    db: Session = Depends(get_db),
):
    return list_patients_service(db)


@router.get(
    "/{patient_id}",
    response_model=PatientResponse,
)
def get_patient(
    patient_id: int,
    db: Session = Depends(get_db),
):
    patient = get_patient_service(db, patient_id)

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found",
        )

    return patient


@router.put(
    "/{patient_id}",
    response_model=PatientResponse,
)
def update_patient(
    patient_id: int,
    patient_data: PatientUpdate,
    db: Session = Depends(get_db),
):
    patient = get_patient_service(db, patient_id)

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found",
        )

    return update_patient_service(
        db,
        patient,
        patient_data,
    )


@router.delete(
    "/{patient_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_patient(
    patient_id: int,
    db: Session = Depends(get_db),
):
    patient = get_patient_service(db, patient_id)

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found",
        )

    delete_patient_service(
        db,
        patient,
    )