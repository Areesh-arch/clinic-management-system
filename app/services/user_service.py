from sqlalchemy.orm import Session

from app.crud.user import (
    create_user,
    get_user_by_email,
    get_user_by_id,
)
from app.models.user import User
from app.schemas.user import UserCreate


def create_new_user(
    db: Session,
    user: UserCreate,
) -> User:
    """
    Business logic for creating a user.
    """

    return create_user(
        db=db,
        user=user,
    )


def get_user(
    db: Session,
    user_id: int,
) -> User | None:
    """
    Return a user by ID.
    """

    return get_user_by_id(
        db=db,
        user_id=user_id,
    )


def get_user_email(
    db: Session,
    email: str,
) -> User | None:
    """
    Return a user by email.
    """

    return get_user_by_email(
        db=db,
        email=email,
    )