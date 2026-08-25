from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate


def create_user(
    db: Session,
    user_data: UserCreate,
    tenant_id: int | None,
    password_hash: str,
) -> User:
    """
    Create a new user.

    If tenant_id is provided, use it.
    Otherwise use user_data.tenant_id if available.
    """

    # Use the tenant_id explicitly provided by the caller.
    # For Staff creation, this will be the owner's clinic tenant.
    final_tenant_id = tenant_id

    # For flows where tenant_id is not provided,
    # use the value from UserCreate if it exists.
    if final_tenant_id is None:
        final_tenant_id = getattr(
            user_data,
            "tenant_id",
            None,
        )

    user = User(
        tenant_id=final_tenant_id,
        full_name=user_data.full_name,
        email=user_data.email,
        password_hash=password_hash,
        role=user_data.role,
        is_active=user_data.is_active,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def get_user_by_id(
    db: Session,
    user_id: int,
) -> User | None:
    return (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )


def get_user_by_email(
    db: Session,
    email: str,
) -> User | None:
    return (
        db.query(User)
        .filter(User.email == email)
        .first()
    )


def list_users(
    db: Session,
    tenant_id: int,
):
    query = db.query(User)

    if tenant_id is not None:
        query = query.filter(
            User.tenant_id == tenant_id
        )

    return query.all()


def update_user(
    db: Session,
    user: User,
    user_data: UserUpdate,
) -> User:
    update_data = user_data.model_dump(
        exclude_unset=True,
    )

    for key, value in update_data.items():
        setattr(user, key, value)

    db.commit()
    db.refresh(user)

    return user


def delete_user(
    db: Session,
    user: User,
) -> None:
    db.delete(user)
    db.commit()