from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.api.permissions import require_roles

from app.models.user import User
from app.models.enums import UserRole

from app.schemas.user import (
    UserCreate,
    UserUpdate,
    UserResponse,
)

from app.services.user_service import (
    create_user_service,
    get_user_service,
    list_users_service,
    update_user_service,
    delete_user_service,
)

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


@router.post(
    "/",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.SUPER_ADMIN,
            UserRole.OWNER,
        )
    ),
):
    try:
        return create_user_service(
            db=db,
            user_data=user,
            current_user=current_user,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.get(
    "/",
    response_model=list[UserResponse],
)
def list_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.SUPER_ADMIN,
            UserRole.OWNER,
        )
    ),
):
    tenant_id = (
        None
        if current_user.role == UserRole.SUPER_ADMIN
        else current_user.tenant_id
    )

    return list_users_service(
        db=db,
        tenant_id=tenant_id,
    )


@router.get(
    "/{user_id}",
    response_model=UserResponse,
)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.SUPER_ADMIN,
            UserRole.OWNER,
        )
    ),
):
    user = get_user_service(
        db,
        user_id,
    )

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found.",
        )

    if (
        current_user.role != UserRole.SUPER_ADMIN
        and user.tenant_id != current_user.tenant_id
    ):
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to view this user.",
        )

    return user


@router.put(
    "/{user_id}",
    response_model=UserResponse,
)
def update_user(
    user_id: int,
    user_data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.SUPER_ADMIN,
            UserRole.OWNER,
        )
    ),
):
    user = get_user_service(
        db,
        user_id,
    )

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found.",
        )

    if (
        current_user.role != UserRole.SUPER_ADMIN
        and user.tenant_id != current_user.tenant_id
    ):
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to update this user.",
        )

    return update_user_service(
        db,
        user,
        user_data,
    )


@router.delete(
    "/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.SUPER_ADMIN,
            UserRole.OWNER,
        )
    ),
):
    user = get_user_service(
        db,
        user_id,
    )

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found.",
        )

    if (
        current_user.role != UserRole.SUPER_ADMIN
        and user.tenant_id != current_user.tenant_id
    ):
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to delete this user.",
        )

    delete_user_service(
        db,
        user,
    )