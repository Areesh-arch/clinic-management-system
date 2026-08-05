from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.crud.user import (
    create_user,
    delete_user,
    get_user_by_email,
    get_user_by_id,
    list_users,
    update_user,
)

from app.models.enums import UserRole
from app.models.user import User

from app.schemas.user import (
    UserCreate,
    UserUpdate,
)


def create_user_service(
    db: Session,
    user_data: UserCreate,
    current_user: User,
) -> User:
    """
    Create a user.

    - Super Admin can create users for any tenant.
    - Owner can create users only in their own tenant.
    """

    existing_user = get_user_by_email(
        db,
        user_data.email,
    )

    if existing_user:
        raise ValueError(
            "Email already exists."
        )

    password_hash = hash_password(
        user_data.password,
    )

    # Decide tenant
    if current_user.role == UserRole.SUPER_ADMIN:

        if user_data.tenant_id is None:
            raise ValueError(
                "tenant_id is required for Super Admin."
            )

        tenant_id = user_data.tenant_id

    else:
        tenant_id = current_user.tenant_id

    return create_user(
        db=db,
        user_data=user_data,
        tenant_id=tenant_id,
        password_hash=password_hash,
    )


def get_user_service(
    db: Session,
    user_id: int,
) -> User | None:

    return get_user_by_id(
        db,
        user_id,
    )


def list_users_service(
    db: Session,
    tenant_id: int | None,
):

    return list_users(
        db,
        tenant_id,
    )


def update_user_service(
    db: Session,
    user: User,
    user_data: UserUpdate,
) -> User:

    update_data = user_data.model_dump(
        exclude_unset=True,
    )

    if "password" in update_data:
        update_data["password_hash"] = hash_password(
            update_data.pop("password")
        )

    user_update = UserUpdate(
        **update_data
    )

    return update_user(
        db,
        user,
        user_update,
    )


def delete_user_service(
    db: Session,
    user: User,
) -> None:

    delete_user(
        db,
        user,
    )