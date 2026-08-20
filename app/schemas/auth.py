from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    email: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class CurrentUserResponse(BaseModel):
    id: int
    tenant_id: int | None
    full_name: str
    email: str
    role: str
    is_active: bool


class ChangePasswordRequest(BaseModel):
    current_password: str = Field(
        ...,
        min_length=1,
    )

    new_password: str = Field(
        ...,
        min_length=8,
        max_length=128,
    )