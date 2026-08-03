from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr

from app.models.enums import UserRole


class UserBase(BaseModel):
    """
    Common fields shared by all user schemas.
    """

    full_name: str
    email: EmailStr
    role: UserRole = UserRole.OWNER


class UserCreate(UserBase):
    """
    Used when creating a new user.
    """

    tenant_id: int
    password: str


class UserLogin(BaseModel):
    """
    Used for login.
    """

    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    """
    Used when updating a user.
    """

    full_name: str | None = None
    email: EmailStr | None = None
    password: str | None = None
    role: UserRole | None = None
    is_active: bool | None = None


class UserResponse(UserBase):
    """
    Returned by the API.
    """

    id: int
    tenant_id: int
    is_active: bool

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )