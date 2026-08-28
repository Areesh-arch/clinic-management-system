from sqlalchemy.orm import Session

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from app.database.session import get_db
from app.api.permissions import require_roles

from app.models.enums import UserRole
from app.models.user import User

from app.schemas.expense import (
    ExpenseCreate,
    ExpenseUpdate,
    ExpenseResponse,
)

from app.services.expense_service import (
    create_expense_service,
    get_expense_service,
    list_expenses_service,
    update_expense_service,
    delete_expense_service,
)


router = APIRouter(
    prefix="/expenses",
    tags=["Expenses"],
)


# =========================================================
# CREATE EXPENSE
# OWNER + SUPER_ADMIN
# =========================================================

@router.post(
    "/",
    response_model=ExpenseResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_expense(
    expense_data: ExpenseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.SUPER_ADMIN,
        )
    ),
):
    try:
        return create_expense_service(
            db=db,
            expense_data=expense_data,
            tenant_id=current_user.tenant_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


# =========================================================
# LIST EXPENSES
# OWNER + SUPER_ADMIN
# =========================================================

@router.get(
    "/",
    response_model=list[ExpenseResponse],
)
def list_expenses(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.SUPER_ADMIN,
        )
    ),
):
    return list_expenses_service(
        db=db,
        tenant_id=current_user.tenant_id,
    )


# =========================================================
# GET SINGLE EXPENSE
# OWNER + SUPER_ADMIN
# =========================================================

@router.get(
    "/{expense_id}",
    response_model=ExpenseResponse,
)
def get_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.SUPER_ADMIN,
        )
    ),
):
    expense = get_expense_service(
        db=db,
        tenant_id=current_user.tenant_id,
        expense_id=expense_id,
    )

    if expense is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found.",
        )

    return expense


# =========================================================
# UPDATE EXPENSE
# OWNER + SUPER_ADMIN
# =========================================================

@router.put(
    "/{expense_id}",
    response_model=ExpenseResponse,
)
def update_expense(
    expense_id: int,
    expense_data: ExpenseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.SUPER_ADMIN,
        )
    ),
):
    expense = update_expense_service(
        db=db,
        tenant_id=current_user.tenant_id,
        expense_id=expense_id,
        expense_data=expense_data,
    )

    if expense is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found.",
        )

    return expense


# =========================================================
# DELETE EXPENSE
# OWNER + SUPER_ADMIN
# =========================================================

@router.delete(
    "/{expense_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.SUPER_ADMIN,
        )
    ),
):
    expense = delete_expense_service(
        db=db,
        tenant_id=current_user.tenant_id,
        expense_id=expense_id,
    )

    if expense is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found.",
        )

    return None