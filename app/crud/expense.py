from __future__ import annotations

from sqlalchemy.orm import Session

from app.models.expense import Expense
from app.schemas.expense import ExpenseCreate, ExpenseUpdate


def create_expense(
    db: Session,
    expense_data: ExpenseCreate,
    tenant_id: int,
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


def get_expense_by_id(
    db: Session,
    expense_id: int,
    tenant_id: int,
) -> Expense | None:
    """
    Get a single expense belonging to the tenant.
    """

    return (
        db.query(Expense)
        .filter(
            Expense.id == expense_id,
            Expense.tenant_id == tenant_id,
        )
        .first()
    )


def get_expenses(
    db: Session,
    tenant_id: int,
) -> list[Expense]:
    """
    Get all expenses belonging to the tenant.
    """

    return (
        db.query(Expense)
        .filter(Expense.tenant_id == tenant_id)
        .order_by(Expense.expense_date.desc())
        .all()
    )


def update_expense(
    db: Session,
    expense: Expense,
    expense_data: ExpenseUpdate,
) -> Expense:
    """
    Update an existing expense.
    """

    update_data = expense_data.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(expense, key, value)

    db.commit()
    db.refresh(expense)

    return expense


def delete_expense(
    db: Session,
    expense: Expense,
) -> None:
    """
    Delete an expense.
    """

    db.delete(expense)
    db.commit()