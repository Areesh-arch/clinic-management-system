from datetime import datetime, timedelta, timezone

from jose import jwt
from passlib.context import CryptContext

from app.core.config import settings


pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
)


# =========================================================
# PASSWORD
# =========================================================

def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    return pwd_context.verify(
        plain_password,
        hashed_password,
    )


# =========================================================
# JWT
# =========================================================

def create_access_token(
    data: dict | None = None,
    *,
    subject: int | str | None = None,
) -> str:
    """
    Create a short-lived access token.

    Supports both:
        create_access_token({"user_id": 1})
    and:
        create_access_token(subject=1)
    """

    to_encode = dict(data or {})

    if subject is not None:
        to_encode["user_id"] = subject

    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update(
        {
            "exp": expire,
            "token_type": "access",
        }
    )

    return jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )


def create_refresh_token(
    subject: int | str,
) -> str:
    """
    Create a long-lived refresh token.

    Refresh tokens are intentionally separate from
    access tokens so the frontend can obtain a new
    access token without asking the user to log in again.
    """

    refresh_expire_days = getattr(
        settings,
        "REFRESH_TOKEN_EXPIRE_DAYS",
        30,
    )

    expire = datetime.now(timezone.utc) + timedelta(
        days=refresh_expire_days
    )

    payload = {
        "user_id": subject,
        "exp": expire,
        "token_type": "refresh",
    }

    return jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )