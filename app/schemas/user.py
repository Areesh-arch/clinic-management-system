from pydantic import BaseModel, ConfigDict, EmailStr

from app.models.enums import UserRole


class UserBase(BaseModel):
    full_name: str
    email: EmailStr
    role: UserRole
    is_active: bool = True


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    full_name: str | None = None
    email: EmailStr | None = None
    password: str | None = None
    role: UserRole | None = None
    is_active: bool | None = None


class UserResponse(UserBase):
    id: int
    tenant_id: int | None
    profile_image_url: str | None = None

    model_config = ConfigDict(
        from_attributes=True,
    )


# =========================================================
# PATIENT PORTAL ACCOUNT
# =========================================================

class PatientPortalAccountCreate(BaseModel):
    email: EmailStr
    password: str
    confirm_password: str


class PatientPortalPasswordReset(BaseModel):
    password: str
    confirm_password: str


class PatientPortalAccountStatusUpdate(BaseModel):
    is_active: bool


class PatientPortalAccountResponse(BaseModel):
    user_id: int
    patient_id: int
    tenant_id: int
    full_name: str
    email: EmailStr
    role: UserRole
    is_active: bool

    model_config = ConfigDict(
        from_attributes=True,
    )


class PatientPortalAccountStatusResponse(BaseModel):
    exists: bool
    user_id: int | None = None
    patient_id: int
    tenant_id: int
    full_name: str | None = None
    email: EmailStr | None = None
    is_active: bool = False

    model_config = ConfigDict(
        from_attributes=True,
    )
