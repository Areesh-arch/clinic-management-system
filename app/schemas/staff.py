from datetime import date
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, EmailStr


class StaffBase(BaseModel):
    designation: str
    phone: str
    salary: Decimal | None = None
    hire_date: date
    is_active: bool = True


class StaffCreate(BaseModel):
    """
    Data required to create a Staff member.

    A Staff member has:
    1. A User account
    2. A Staff employment profile
    """

    full_name: str
    email: EmailStr
    password: str

    designation: str
    phone: str
    salary: Decimal | None = None
    hire_date: date
    is_active: bool = True


class StaffUpdate(BaseModel):
    full_name: str | None = None
    email: EmailStr | None = None

    designation: str | None = None
    phone: str | None = None
    salary: Decimal | None = None
    hire_date: date | None = None
    is_active: bool | None = None


class StaffResponse(StaffBase):
    id: int
    tenant_id: int
    user_id: int
    employee_code: str
    name: str
    email: EmailStr

    model_config = ConfigDict(
        from_attributes=True,
    )