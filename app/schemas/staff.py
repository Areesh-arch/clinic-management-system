from datetime import date
from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class StaffBase(BaseModel):
    designation: str
    phone: str
    salary: Decimal | None = None
    hire_date: date
    is_active: bool = True


class StaffCreate(StaffBase):
    user_id: int


class StaffUpdate(BaseModel):
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

    model_config = ConfigDict(
        from_attributes=True,
    )