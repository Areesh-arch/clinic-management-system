from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.api.features import require_feature
from app.api.permissions import require_roles

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
# STAFF RESPONSE HELPER
# ============================================================

def staff_to_response(staff) -> StaffResponse:
    """
    Convert Staff SQLAlchemy object into StaffResponse.

    Staff information is stored in two related tables:

    Staff:
        - id
        - tenant_id
        - user_id
        - employee_code
        - designation
        - phone
        - salary
        - hire_date
        - is_active

    User:
        - full_name
        - email

    The API combines both objects into one clean response.
    """

    return StaffResponse(
        id=staff.id,
        tenant_id=staff.tenant_id,
        user_id=staff.user_id,
        employee_code=staff.employee_code,

        # User information
        name=staff.user.full_name,
        email=staff.user.email,

        # Staff information
        designation=staff.designation,
        phone=staff.phone,
        salary=staff.salary,
        hire_date=staff.hire_date,
        is_active=staff.is_active,
    )


# ============================================================
# CREATE STAFF
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
        require_roles(UserRole.OWNER)
    ),
    _: User = Depends(
        require_feature(Feature.STAFF)
    ),
):

    if current_user.tenant_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Owner is not associated with a clinic.",
        )

    try:
        created_staff = create_staff_service(
            db=db,
            staff_data=staff,
            tenant_id=current_user.tenant_id,
        )

        return staff_to_response(created_staff)

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


# ============================================================
# LIST STAFF
# ============================================================

@router.get(
    "/",
    response_model=list[StaffResponse],
)
def list_staff(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.OWNER)
    ),
    _: User = Depends(
        require_feature(Feature.STAFF)
    ),
):

    if current_user.tenant_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Owner is not associated with a clinic.",
        )

    staff_members = list_staff_service(
        db=db,
        tenant_id=current_user.tenant_id,
    )

    return [
        staff_to_response(staff)
        for staff in staff_members
    ]


# ============================================================
# GET ONE STAFF MEMBER
# ============================================================

@router.get(
    "/{staff_id}",
    response_model=StaffResponse,
)
def get_staff(
    staff_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.OWNER)
    ),
    _: User = Depends(
        require_feature(Feature.STAFF)
    ),
):

    if current_user.tenant_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Owner is not associated with a clinic.",
        )

    staff = get_staff_service(
        db=db,
        staff_id=staff_id,
        tenant_id=current_user.tenant_id,
    )

    if staff is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Staff not found.",
        )

    return staff_to_response(staff)


# ============================================================
# UPDATE STAFF
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
        require_roles(UserRole.OWNER)
    ),
    _: User = Depends(
        require_feature(Feature.STAFF)
    ),
):

    if current_user.tenant_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Owner is not associated with a clinic.",
        )

    staff = get_staff_service(
        db=db,
        staff_id=staff_id,
        tenant_id=current_user.tenant_id,
    )

    if staff is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Staff not found.",
        )

    try:
        updated_staff = update_staff_service(
            db=db,
            staff=staff,
            staff_data=staff_data,
        )

        return staff_to_response(updated_staff)

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


# ============================================================
# DELETE STAFF
# ============================================================

@router.delete(
    "/{staff_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_staff(
    staff_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.OWNER)
    ),
    _: User = Depends(
        require_feature(Feature.STAFF)
    ),
):

    if current_user.tenant_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Owner is not associated with a clinic.",
        )

    staff = get_staff_service(
        db=db,
        staff_id=staff_id,
        tenant_id=current_user.tenant_id,
    )

    if staff is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Staff not found.",
        )

    delete_staff_service(
        db=db,
        staff=staff,
    )

    return None