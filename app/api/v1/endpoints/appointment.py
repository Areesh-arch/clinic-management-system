from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Request,
    status,
)

from sqlalchemy.orm import Session

from app.database.session import get_db
from app.api.features import require_feature
from app.api.permissions import require_roles
from app.api.tenant_context import get_effective_tenant_id

from app.models.enums import UserRole
from app.models.user import User
from app.models.feature import Feature

from app.schemas.appointment import (
    AppointmentCreate,
    AppointmentUpdate,
    AppointmentResponse,
    PublicAppointmentCreate,
)

from app.services.appointment_service import (
    create_appointment_service,
    create_public_appointment_service,
    get_appointment_service,
    list_appointments_service,
    list_archived_appointments_service,
    update_appointment_service,
    delete_appointment_service,
    archive_appointment_service,
    restore_appointment_service,
    permanently_delete_appointment_service,
)

from app.api.v1.endpoints.lead import (
    resolve_public_tenant,
)


router = APIRouter(
    prefix="",
    tags=["Appointments"],
)


# =========================================================
# PUBLIC WEBSITE
# CREATE APPOINTMENT
# =========================================================

@router.post(
    "/public",
    response_model=AppointmentResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_public_appointment(
    appointment: PublicAppointmentCreate,
    request: Request,
    db: Session = Depends(get_db),
):

    tenant = resolve_public_tenant(
        request=request,
        db=db,
    )

    try:
        return create_public_appointment_service(
            db=db,
            appointment_data=appointment,
            tenant_id=tenant.id,
        )

    except HTTPException:
        raise

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
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
# LIST ACTIVE APPOINTMENTS
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
# LIST ARCHIVED APPOINTMENTS
# IMPORTANT: MUST COME BEFORE /{appointment_id}
# =========================================================

@router.get(
    "/archived",
    response_model=list[AppointmentResponse],
)
def list_archived_appointments(
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

    return list_archived_appointments_service(
        db=db,
        current_user=current_user,
        tenant_id=tenant_id,
    )


# =========================================================
# ARCHIVE APPOINTMENT
# =========================================================

@router.post(
    "/{appointment_id}/archive",
    response_model=AppointmentResponse,
)
def archive_appointment(
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
        return archive_appointment_service(
            db=db,
            appointment_id=appointment_id,
            current_user=current_user,
            tenant_id=tenant_id,
        )

    except HTTPException:
        raise


# =========================================================
# RESTORE APPOINTMENT
# =========================================================

@router.post(
    "/{appointment_id}/restore",
    response_model=AppointmentResponse,
)
def restore_appointment(
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
        return restore_appointment_service(
            db=db,
            appointment_id=appointment_id,
            current_user=current_user,
            tenant_id=tenant_id,
        )

    except HTTPException:
        raise


# =========================================================
# PERMANENT DELETE
# =========================================================

@router.delete(
    "/{appointment_id}/permanent",
    status_code=status.HTTP_204_NO_CONTENT,
)
def permanently_delete_appointment(
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

    permanently_delete_appointment_service(
        db=db,
        appointment_id=appointment_id,
        current_user=current_user,
        tenant_id=tenant_id,
    )

    return None


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

    except HTTPException:
        raise


# =========================================================
# UPDATE APPOINTMENT
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

    except HTTPException:
        raise


# =========================================================
# DELETE = ARCHIVE
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

    delete_appointment_service(
        db=db,
        appointment_id=appointment_id,
        current_user=current_user,
        tenant_id=tenant_id,
    )

    return None