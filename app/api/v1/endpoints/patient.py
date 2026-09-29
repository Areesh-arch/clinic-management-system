from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from app.api.features import require_feature
from app.api.permissions import require_roles
from app.api.tenant_context import (
    get_effective_tenant_id,
)

from app.database.session import get_db

from app.models.enums import UserRole
from app.models.feature import Feature
from app.models.user import User

from app.schemas.patient import (
    PatientCreate,
    PatientResponse,
    PatientUpdate,
)
from app.schemas.user import (
    PatientPortalAccountCreate,
    PatientPortalAccountResponse,
    PatientPortalAccountStatusResponse,
    PatientPortalAccountStatusUpdate,
    PatientPortalPasswordReset,
)

from app.services.patient_service import (
    create_patient_service,
    delete_patient_service,
    get_patient_service,
    list_patients_service,
    update_patient_service,
)
from app.services.patient_portal_service import (
    create_patient_portal_account_service,
    get_patient_portal_account_service,
    reset_patient_portal_password_service,
    set_patient_portal_account_status_service,
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
    tenant_id: int = Depends(
        get_effective_tenant_id
    ),
    _: User = Depends(
        require_feature(Feature.PATIENTS)
    ),
):
    return create_patient_service(
        db=db,
        patient_data=patient,
        tenant_id=tenant_id,
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
    tenant_id: int = Depends(
        get_effective_tenant_id
    ),
    _: User = Depends(
        require_feature(Feature.PATIENTS)
    ),
):
    return list_patients_service(
        db=db,
        tenant_id=tenant_id,
    )


# =========================================================
# GET PATIENT PORTAL ACCOUNT STATUS
# =========================================================

@router.get(
    "/{patient_id}/portal-account",
    response_model=PatientPortalAccountStatusResponse,
)
def get_patient_portal_account(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
    tenant_id: int = Depends(
        get_effective_tenant_id
    ),
    _: User = Depends(
        require_feature(Feature.PATIENTS)
    ),
):
    patient = get_patient_service(
        db=db,
        patient_id=patient_id,
        tenant_id=tenant_id,
    )

    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found",
        )

    user = get_patient_portal_account_service(
        db=db,
        patient=patient,
    )

    if user is None:
        return {
            "exists": False,
            "user_id": None,
            "patient_id": patient.id,
            "tenant_id": patient.tenant_id,
            "full_name": None,
            "email": None,
            "is_active": False,
        }

    return {
        "exists": True,
        "user_id": user.id,
        "patient_id": user.patient_id,
        "tenant_id": user.tenant_id,
        "full_name": user.full_name,
        "email": user.email,
        "is_active": user.is_active,
    }


# =========================================================
# ACTIVATE / DEACTIVATE PATIENT PORTAL ACCOUNT
# =========================================================

@router.patch(
    "/{patient_id}/portal-account/status",
    response_model=PatientPortalAccountResponse,
)
def update_patient_portal_account_status(
    patient_id: int,
    account_status: PatientPortalAccountStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
    tenant_id: int = Depends(
        get_effective_tenant_id
    ),
    _: User = Depends(
        require_feature(Feature.PATIENTS)
    ),
):
    patient = get_patient_service(
        db=db,
        patient_id=patient_id,
        tenant_id=tenant_id,
    )

    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found",
        )

    user = set_patient_portal_account_status_service(
        db=db,
        patient=patient,
        is_active=account_status.is_active,
    )

    return {
        "user_id": user.id,
        "patient_id": user.patient_id,
        "tenant_id": user.tenant_id,
        "full_name": user.full_name,
        "email": user.email,
        "role": user.role,
        "is_active": user.is_active,
    }


# =========================================================
# RESET PATIENT PORTAL PASSWORD
# =========================================================

@router.post(
    "/{patient_id}/portal-account/reset-password",
    response_model=PatientPortalAccountResponse,
)
def reset_patient_portal_password(
    patient_id: int,
    password_data: PatientPortalPasswordReset,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
    tenant_id: int = Depends(
        get_effective_tenant_id
    ),
    _: User = Depends(
        require_feature(Feature.PATIENTS)
    ),
):
    patient = get_patient_service(
        db=db,
        patient_id=patient_id,
        tenant_id=tenant_id,
    )

    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found",
        )

    user = reset_patient_portal_password_service(
        db=db,
        patient=patient,
        password=password_data.password,
        confirm_password=password_data.confirm_password,
    )

    return {
        "user_id": user.id,
        "patient_id": user.patient_id,
        "tenant_id": user.tenant_id,
        "full_name": user.full_name,
        "email": user.email,
        "role": user.role,
        "is_active": user.is_active,
    }


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
    tenant_id: int = Depends(
        get_effective_tenant_id
    ),
    _: User = Depends(
        require_feature(Feature.PATIENTS)
    ),
):
    patient = get_patient_service(
        db=db,
        patient_id=patient_id,
        tenant_id=tenant_id,
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
    tenant_id: int = Depends(
        get_effective_tenant_id
    ),
    _: User = Depends(
        require_feature(Feature.PATIENTS)
    ),
):
    patient = get_patient_service(
        db=db,
        patient_id=patient_id,
        tenant_id=tenant_id,
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
    tenant_id: int = Depends(
        get_effective_tenant_id
    ),
    _: User = Depends(
        require_feature(Feature.PATIENTS)
    ),
):
    patient = get_patient_service(
        db=db,
        patient_id=patient_id,
        tenant_id=tenant_id,
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


# =========================================================
# CREATE PATIENT PORTAL ACCOUNT
# =========================================================

@router.post(
    "/{patient_id}/portal-account",
    response_model=PatientPortalAccountResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_patient_portal_account(
    patient_id: int,
    account_data: PatientPortalAccountCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
    tenant_id: int = Depends(
        get_effective_tenant_id
    ),
    _: User = Depends(
        require_feature(Feature.PATIENTS)
    ),
):
    # -----------------------------------------------------
    # Get patient within the currently selected/effective
    # clinic.
    # -----------------------------------------------------

    patient = get_patient_service(
        db=db,
        patient_id=patient_id,
        tenant_id=tenant_id,
    )

    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found",
        )

    # -----------------------------------------------------
    # Create the portal account.
    # The service determines patient_id, tenant_id and role.
    # -----------------------------------------------------

    user = create_patient_portal_account_service(
        db=db,
        patient=patient,
        email=account_data.email,
        password=account_data.password,
        confirm_password=account_data.confirm_password,
    )

    return {
        "user_id": user.id,
        "patient_id": user.patient_id,
        "tenant_id": user.tenant_id,
        "full_name": user.full_name,
        "email": user.email,
        "role": user.role,
        "is_active": user.is_active,
    }
