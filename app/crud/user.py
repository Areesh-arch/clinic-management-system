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

    If tenant_id is provided, use it (Owner flow).
    Otherwise use user_data.tenant_id (Super Admin flow).
    """

    user = User(
    db=db,
    user_data=user_data,
    tenant_id=tenant_id,
    password_hash=password_hash,
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