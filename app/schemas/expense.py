from __future__ import annotations

from datetime import date

from pydantic import BaseModel, ConfigDict


class ExpenseBase(BaseModel):
    description: str
    amount: float
    expense_date: date
    category: str
    notes: str | None = None


class ExpenseCreate(ExpenseBase):
    pass


class ExpenseUpdate(BaseModel):
    description: str | None = None
    amount: float | None = None
    expense_date: date | None = None
    category: str | None = None
    notes: str | None = None


class ExpenseResponse(ExpenseBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    tenant_id: int