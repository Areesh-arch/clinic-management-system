from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.features import require_feature
from app.api.permissions import require_roles
from app.database.session import get_db

from app.models.enums import UserRole
from app.models.feature import Feature
from app.models.user import User

from app.schemas.patient import (
    PatientCreate,
    PatientResponse,
    PatientUpdate,
)

from app.services.patient_service import (
    create_patient_service,
    delete_patient_service,
    get_patient_service,
    list_patients_service,
    update_patient_service,
)


router = APIRouter(
    prefix="",
    tags=["Patients"],
)


# =========================================================
# CREATE PATIENT
# =========================================================

@router.post(
    "/",
    response_model=PatientResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_patient(
    patient: PatientCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
    _: User = Depends(
        require_feature(Feature.PATIENTS)
    ),
):
    return create_patient_service(
        db=db,
        patient_data=patient,
        tenant_id=current_user.tenant_id,
    )


# =========================================================
# LIST PATIENTS
# =========================================================

@router.get(
    "/",
    response_model=list[PatientResponse],
)
def list_patients(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
    _: User = Depends(
        require_feature(Feature.PATIENTS)
    ),
):
    return list_patients_service(
        db=db,
        tenant_id=current_user.tenant_id,
    )


# =========================================================
# GET PATIENT
# =========================================================

@router.get(
    "/{patient_id}",
    response_model=PatientResponse,
)
def get_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
    _: User = Depends(
        require_feature(Feature.PATIENTS)
    ),
):
    patient = get_patient_service(
        db=db,
        patient_id=patient_id,
        tenant_id=current_user.tenant_id,
    )

    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found",
        )

    return patient


# =========================================================
# UPDATE PATIENT
# =========================================================

@router.put(
    "/{patient_id}",
    response_model=PatientResponse,
)
def update_patient(
    patient_id: int,
    patient_data: PatientUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
    _: User = Depends(
        require_feature(Feature.PATIENTS)
    ),
):
    patient = get_patient_service(
        db=db,
        patient_id=patient_id,
        tenant_id=current_user.tenant_id,
    )

    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found",
        )

    return update_patient_service(
        db=db,
        patient=patient,
        patient_data=patient_data,
    )


# =========================================================
# DELETE PATIENT
# =========================================================

@router.delete(
    "/{patient_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
    _: User = Depends(
        require_feature(Feature.PATIENTS)
    ),
):
    patient = get_patient_service(
        db=db,
        patient_id=patient_id,
        tenant_id=current_user.tenant_id,
    )

    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found",
        )

    delete_patient_service(
        db=db,
        patient=patient,
    )

    return None