from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.api.features import require_feature
from app.api.tenant_context import get_effective_tenant_id
from app.api.permissions import require_roles

from app.models.enums import UserRole
from app.models.user import User
from app.models.feature import Feature

from app.schemas.appointment import (
    AppointmentCreate,
    AppointmentUpdate,
    AppointmentResponse,
)

from app.services.appointment_service import (
    create_appointment_service,
    get_appointment_service,
    list_appointments_service,
    update_appointment_service,
    delete_appointment_service,
)


router = APIRouter(
    prefix="",
    tags=["Appointments"],
)


# =========================================================
# CREATE APPOINTMENT
# OWNER + STAFF
# =========================================================

@router.post(
    "/",
    response_model=AppointmentResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_appointment(
    appointment: AppointmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
        )
    ),
    _: User = Depends(
        require_feature(Feature.APPOINTMENTS)
    ),
    tenant_id: int = Depends(
        get_effective_tenant_id
    ),
):

    try:
        return create_appointment_service(
            db=db,
            appointment_data=appointment,
            current_user=current_user,
            tenant_id=tenant_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


# =========================================================
# LIST APPOINTMENTS
# =========================================================

@router.get(
    "",
    response_model=list[AppointmentResponse],
)
@router.get(
    "/",
    response_model=list[AppointmentResponse],
    include_in_schema=False,
)
def list_appointments(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.SUPER_ADMIN,
            UserRole.OWNER,
            UserRole.STAFF,
        )
    ),
    _: User = Depends(
        require_feature(Feature.APPOINTMENTS)
    ),
    tenant_id: int = Depends(
        get_effective_tenant_id
    ),
):

    return list_appointments_service(
        db=db,
        current_user=current_user,
        tenant_id=tenant_id,
    )


# =========================================================
# GET APPOINTMENT
# =========================================================

@router.get(
    "/{appointment_id}",
    response_model=AppointmentResponse,
)
def get_appointment(
    appointment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.SUPER_ADMIN,
            UserRole.OWNER,
            UserRole.STAFF,
        )
    ),
    _: User = Depends(
        require_feature(Feature.APPOINTMENTS)
    ),
    tenant_id: int = Depends(
        get_effective_tenant_id
    ),
):

    try:
        return get_appointment_service(
            db=db,
            appointment_id=appointment_id,
            current_user=current_user,
            tenant_id=tenant_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


# =========================================================
# UPDATE APPOINTMENT
# OWNER + STAFF
# =========================================================

@router.put(
    "/{appointment_id}",
    response_model=AppointmentResponse,
)
def update_appointment(
    appointment_id: int,
    appointment_data: AppointmentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
        )
    ),
    _: User = Depends(
        require_feature(Feature.APPOINTMENTS)
    ),
    tenant_id: int = Depends(
        get_effective_tenant_id
    ),
):

    try:
        return update_appointment_service(
            db=db,
            appointment_id=appointment_id,
            appointment_data=appointment_data,
            current_user=current_user,
            tenant_id=tenant_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


# =========================================================
# DELETE APPOINTMENT
# OWNER + STAFF
# =========================================================

@router.delete(
    "/{appointment_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_appointment(
    appointment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
        )
    ),
    _: User = Depends(
        require_feature(Feature.APPOINTMENTS)
    ),
    tenant_id: int = Depends(
        get_effective_tenant_id
    ),
):

    try:
        delete_appointment_service(
            db=db,
            appointment_id=appointment_id,
            current_user=current_user,
            tenant_id=tenant_id,
        )

        return None

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )