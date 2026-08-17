from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.api.permissions import require_roles
from app.api.features import require_feature

from app.models.enums import UserRole
from app.models.feature import Feature
from app.models.user import User

from app.schemas.staff import (
    StaffCreate,
    StaffUpdate,
    StaffResponse,
)

from app.services.staff_service import (
    create_staff_service,
    get_staff_service,
    list_staff_service,
    update_staff_service,
    delete_staff_service,
)

router = APIRouter(
    prefix="/staff",
    tags=["Staff"],
)


# ============================================================
# CREATE STAFF
# SUPER_ADMIN ONLY
# ============================================================

@router.post(
    "/",
    response_model=StaffResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_staff(
    staff: StaffCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.SUPER_ADMIN)
    ),
    _: User = Depends(
        require_feature(Feature.STAFF)
    ),
):
    try:
        return create_staff_service(
            db=db,
            staff_data=staff,
            tenant_id=current_user.tenant_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


# ============================================================
# LIST STAFF
# SUPER_ADMIN + OWNER
# ============================================================

@router.get(
    "/",
    response_model=list[StaffResponse],
)
def list_staff(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.SUPER_ADMIN,
            UserRole.OWNER,
        )
    ),
    _: User = Depends(
        require_feature(Feature.STAFF)
    ),
):
    return list_staff_service(db)


# ============================================================
# GET ONE STAFF MEMBER
# SUPER_ADMIN + OWNER
# ============================================================

@router.get(
    "/{staff_id}",
    response_model=StaffResponse,
)
def get_staff(
    staff_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.SUPER_ADMIN,
            UserRole.OWNER,
        )
    ),
    _: User = Depends(
        require_feature(Feature.STAFF)
    ),
):
    staff = get_staff_service(
        db,
        staff_id,
    )

    if staff is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Staff not found",
        )

    return staff


# ============================================================
# UPDATE STAFF
# SUPER_ADMIN ONLY
# ============================================================

@router.put(
    "/{staff_id}",
    response_model=StaffResponse,
)
def update_staff(
    staff_id: int,
    staff_data: StaffUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.SUPER_ADMIN)
    ),
    _: User = Depends(
        require_feature(Feature.STAFF)
    ),
):
    staff = get_staff_service(
        db,
        staff_id,
    )

    if staff is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Staff not found",
        )

    return update_staff_service(
        db,
        staff,
        staff_data,
    )


# ============================================================
# DELETE STAFF
# SUPER_ADMIN ONLY
# ============================================================

@router.delete(
    "/{staff_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_staff(
    staff_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.SUPER_ADMIN)
    ),
    _: User = Depends(
        require_feature(Feature.STAFF)
    ),
):
    staff = get_staff_service(
        db,
        staff_id,
    )

    if staff is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Staff not found",
        )

    delete_staff_service(
        db,
        staff,
    )

    return None