from __future__ import annotations

from sqlalchemy.orm import Session

from app.models.expense import Expense
from app.schemas.expense import (
    ExpenseCreate,
    ExpenseUpdate,
)


# =========================================================
# CREATE EXPENSE
# =========================================================

def create_expense_service(
    db: Session,
    tenant_id: int,
    expense_data: ExpenseCreate,
) -> Expense:
    """
    Create a new active expense for a tenant.
    """

    expense = Expense(
        tenant_id=tenant_id,
        description=expense_data.description,
        amount=expense_data.amount,
        expense_date=expense_data.expense_date,
        category=expense_data.category,
        notes=expense_data.notes,
        is_archived=False,
    )

    db.add(expense)
    db.commit()
    db.refresh(expense)

    return expense


# =========================================================
# LIST ACTIVE EXPENSES
# =========================================================

def list_expenses_service(
    db: Session,
    tenant_id: int,
) -> list[Expense]:
    """
    Return only ACTIVE expenses belonging to the tenant.

    Archived expenses are hidden from normal Billing.
    """

    return (
        db.query(Expense)
        .filter(
            Expense.tenant_id == tenant_id,
            Expense.is_archived.is_(False),
        )
        .order_by(
            Expense.expense_date.desc()
        )
        .all()
    )


# =========================================================
# LIST ARCHIVED EXPENSES
# =========================================================

def list_archived_expenses_service(
    db: Session,
    tenant_id: int,
) -> list[Expense]:
    """
    Return only archived expenses.
    """

    return (
        db.query(Expense)
        .filter(
            Expense.tenant_id == tenant_id,
            Expense.is_archived.is_(True),
        )
        .order_by(
            Expense.expense_date.desc()
        )
        .all()
    )


# =========================================================
# GET ACTIVE EXPENSE
# =========================================================

def get_expense_service(
    db: Session,
    tenant_id: int,
    expense_id: int,
) -> Expense | None:
    """
    Return one ACTIVE expense belonging to the tenant.

    Archived expenses are intentionally hidden from
    normal operations.
    """

    return (
        db.query(Expense)
        .filter(
            Expense.id == expense_id,
            Expense.tenant_id == tenant_id,
            Expense.is_archived.is_(False),
        )
        .first()
    )


# =========================================================
# GET ARCHIVED EXPENSE
# =========================================================

def get_archived_expense_service(
    db: Session,
    tenant_id: int,
    expense_id: int,
) -> Expense | None:
    """
    Return one archived expense belonging to the tenant.

    Used only by Archive operations.
    """

    return (
        db.query(Expense)
        .filter(
            Expense.id == expense_id,
            Expense.tenant_id == tenant_id,
            Expense.is_archived.is_(True),
        )
        .first()
    )


# =========================================================
# UPDATE ACTIVE EXPENSE
# =========================================================

def update_expense_service(
    db: Session,
    tenant_id: int,
    expense_id: int,
    expense_data: ExpenseUpdate,
) -> Expense | None:
    """
    Update an ACTIVE expense.

    Archived expenses cannot be updated from normal
    Billing.
    """

    expense = (
        db.query(Expense)
        .filter(
            Expense.id == expense_id,
            Expense.tenant_id == tenant_id,
            Expense.is_archived.is_(False),
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


# =========================================================
# ARCHIVE EXPENSE
# =========================================================

def archive_expense_service(
    db: Session,
    tenant_id: int,
    expense_id: int,
) -> Expense | None:
    """
    Soft-delete an expense.

    The expense remains in the database and can be
    restored from Archive.
    """

    expense = (
        db.query(Expense)
        .filter(
            Expense.id == expense_id,
            Expense.tenant_id == tenant_id,
            Expense.is_archived.is_(False),
        )
        .first()
    )

    if expense is None:
        return None

    expense.is_archived = True

    db.commit()
    db.refresh(expense)

    return expense


# =========================================================
# RESTORE EXPENSE
# =========================================================

def restore_expense_service(
    db: Session,
    tenant_id: int,
    expense_id: int,
) -> Expense | None:
    """
    Restore an archived expense.
    """

    expense = (
        db.query(Expense)
        .filter(
            Expense.id == expense_id,
            Expense.tenant_id == tenant_id,
            Expense.is_archived.is_(True),
        )
        .first()
    )

    if expense is None:
        return None

    expense.is_archived = False

    db.commit()
    db.refresh(expense)

    return expense


# =========================================================
# PERMANENT DELETE EXPENSE
# =========================================================

def permanently_delete_expense_service(
    db: Session,
    tenant_id: int,
    expense_id: int,
) -> Expense | None:
    """
    Permanently delete an expense.

    Permanent deletion is ONLY allowed for archived
    expenses.
    """

    expense = (
        db.query(Expense)
        .filter(
            Expense.id == expense_id,
            Expense.tenant_id == tenant_id,
            Expense.is_archived.is_(True),
        )
        .first()
    )

    if expense is None:
        return None

    db.delete(expense)
    db.commit()

    return expense


# =========================================================
# LEGACY DELETE → ARCHIVE
# =========================================================

def delete_expense_service(
    db: Session,
    tenant_id: int,
    expense_id: int,
) -> Expense | None:
    """
    Backward-compatible delete function.

    Existing frontend DELETE calls now ARCHIVE the expense
    instead of permanently deleting it.

    Permanent deletion must use:
        permanently_delete_expense_service()
    """

    return archive_expense_service(
        db=db,
        tenant_id=tenant_id,
        expense_id=expense_id,
    )