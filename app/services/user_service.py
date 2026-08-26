from app.core.security import hash_password

from app.crud.user import (
    create_user,
    delete_user,
    get_user_by_email,
    get_user_by_id,
    list_users,
    update_user,
)

from app.models.user import User

from app.schemas.user import (
    UserCreate,
    UserUpdate,
)


def create_user_service(
    db,
    user_data: UserCreate,
    current_user: User | None = None,
    tenant_id: int | None = None,
) -> User:
    """
    Create a user inside a clinic.

    Either:
    - current_user is provided, and its tenant_id is used, or
    - tenant_id is provided directly, which is used during
      initial tenant/owner creation.
    """

    existing_user = get_user_by_email(
        db,
        user_data.email,
    )

    if existing_user:
        raise ValueError("Email already exists.")

    if tenant_id is None:
        if current_user is None or current_user.tenant_id is None:
            raise ValueError(
                "User is not associated with a clinic."
            )

        tenant_id = current_user.tenant_id

    password_hash = hash_password(
        user_data.password,
    )

    user = create_user(
        db=db,
        user_data=user_data,
        tenant_id=tenant_id,
        password_hash=password_hash,
    )

    return user


def get_user_service(
    db,
    user_id: int,
) -> User | None:

    return get_user_by_id(
        db,
        user_id,
    )


def list_users_service(
    db,
    tenant_id: int | None,
):

    return list_users(
        db,
        tenant_id,
    )


def update_user_service(
    db,
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
    db,
    user: User,
) -> None:

    delete_user(
        db,
        user,
    )