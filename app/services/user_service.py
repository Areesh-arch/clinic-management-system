from datetime import date

from app.schemas.staff import StaffCreate
from app.services.staff_service import create_staff_service

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

from app.schemas.staff import StaffCreate
from app.services.staff_service import create_staff_service


def create_user_service(
    db: Session,
    user_data: UserCreate,
    current_user: User,
) -> User:
    """
    Create a user.

    Owner:
        - creates users only inside his clinic.

    Super Admin:
        - does not create staff users.
    """

    existing_user = get_user_by_email(
        db,
        user_data.email,
    )

    if existing_user:
        raise ValueError("Email already exists.")

    password_hash = hash_password(
        user_data.password
    )

    # Owner's clinic id
    tenant_id = current_user.tenant_id

    # Create User
    user = create_user(
        db=db,
        user_data=user_data,
        tenant_id=tenant_id,
        password_hash=password_hash,
    )

    # Automatically create Staff Profile
    if user.role == UserRole.STAFF:

        staff_data = StaffCreate(
            user_id=user.id,
            designation="Receptionist",
            phone="00000000000",
            salary=None,
            hire_date=date.today(),
            is_active=True,
        )

        create_staff_service(
            db=db,
            staff_data=staff_data,
            tenant_id=tenant_id,
        )

    return user

    existing_user = get_user_by_email(
        db,
        user_data.email,
    )

    if existing_user:
        raise ValueError("Email already exists.")

    password_hash = hash_password(
        user_data.password,
    )

    # Owner creates users only inside his tenant
    tenant_id = current_user.tenant_id

    user = create_user(
        db=db,
        user_data=user_data,
        tenant_id=tenant_id,
        password_hash=password_hash,
    )

    # Automatically create Staff profile
    if user.role == UserRole.STAFF:

        staff_data = StaffCreate(
            user_id=user.id,
            designation="Receptionist",
            phone="00000000000",
            salary=None,
            hire_date=date.today(),
            is_active=True,
        )

        create_staff_service(
            db=db,
            staff_data=staff_data,
            tenant_id=tenant_id,
        )

    return user


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