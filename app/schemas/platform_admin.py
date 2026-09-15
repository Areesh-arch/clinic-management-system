from pydantic import BaseModel, ConfigDict, EmailStr


class PlatformAdminCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    is_active: bool = True


class PlatformAdminUpdate(BaseModel):
    full_name: str | None = None
    email: EmailStr | None = None
    password: str | None = None
    is_active: bool | None = None


class PlatformAdminResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    is_active: bool
    role: str
    tenant_id: int | None
    profile_image_url: str | None = None

    model_config = ConfigDict(
        from_attributes=True
    )