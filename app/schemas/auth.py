from pydantic import BaseModel, Field


# =========================================================
# LOGIN
# =========================================================

class LoginRequest(BaseModel):
    email: str
    password: str


# =========================================================
# TOKEN
# =========================================================

class Token(BaseModel):
    access_token: str
    token_type: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str


class RefreshTokenRequest(BaseModel):
    refresh_token: str


# =========================================================
# CURRENT USER
# =========================================================

class CurrentUserResponse(BaseModel):
    id: int
    tenant_id: int | None
    full_name: str
    email: str
    role: str
    is_active: bool


# =========================================================
# CHANGE PASSWORD
# =========================================================

class ChangePasswordRequest(BaseModel):
    new_password: str = Field(
        ...,
        min_length=8,
        max_length=128,
    )