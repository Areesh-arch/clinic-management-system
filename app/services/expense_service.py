from __future__ import annotations

from datetime import date

from sqlalchemy.orm import Session

from app.models.expense import Expense
from app.schemas.expense import (
    ExpenseCreate,
    ExpenseUpdate,
)


def create_expense_service(
    db: Session,
    tenant_id: int,
    expense_data: ExpenseCreate,
) -> Expense:
    """
    Create a new expense for a tenant.
    """

    expense = Expense(
        tenant_id=tenant_id,
        description=expense_data.description,
        amount=expense_data.amount,
        expense_date=expense_data.expense_date,
        category=expense_data.category,
        notes=expense_data.notes,
    )

    db.add(expense)
    db.commit()
    db.refresh(expense)

    return expense


def list_expenses_service(
    db: Session,
    tenant_id: int,
) -> list[Expense]:
    """
    Return all expenses belonging to a tenant.
    """

    return (
        db.query(Expense)
        .filter(
            Expense.tenant_id == tenant_id
        )
        .order_by(
            Expense.expense_date.desc()
        )
        .all()
    )


def get_expense_service(
    db: Session,
    tenant_id: int,
    expense_id: int,
) -> Expense | None:
    """
    Return one expense belonging to a tenant.
    """

    return (
        db.query(Expense)
        .filter(
            Expense.id == expense_id,
            Expense.tenant_id == tenant_id,
        )
        .first()
    )


def update_expense_service(
    db: Session,
    tenant_id: int,
    expense_id: int,
    expense_data: ExpenseUpdate,
) -> Expense | None:
    """
    Update an existing tenant expense.
    """

    expense = (
        db.query(Expense)
        .filter(
            Expense.id == expense_id,
            Expense.tenant_id == tenant_id,
        )
        .first()
    )

    if expense is None:
        return None

    update_data = expense_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(expense, field, value)

    db.commit()
    db.refresh(expense)

    return expense


def delete_expense_service(
    db: Session,
    tenant_id: int,
    expense_id: int,
) -> Expense | None:
    """
    Delete an expense belonging to a tenant.
    """

    expense = (
        db.query(Expense)
        .filter(
            Expense.id == expense_id,
            Expense.tenant_id == tenant_id,
        )
        .first()
    )

    if expense is None:
        return None

    db.delete(expense)
    db.commit()

    return expense