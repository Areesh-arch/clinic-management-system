from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models.user import User
from app.schemas.user import UserCreate


def create_user(
    db: Session,
    user: UserCreate,
) -> User:
    """
    Create a new user.
    """

    db_user = User(
        tenant_id=user.tenant_id,
        full_name=user.full_name,
        email=user.email,
        password_hash=hash_password(user.password),
        role=user.role,
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user


def get_user_by_email(
    db: Session,
    email: str,
) -> User | None:
    """
    Get user by email.
    """

    return (
        db.query(User)
        .filter(User.email == email)
        .first()
    )


def get_user_by_id(
    db: Session,
    user_id: int,
) -> User | None:
    """
    Get user by ID.
    """

    return (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )