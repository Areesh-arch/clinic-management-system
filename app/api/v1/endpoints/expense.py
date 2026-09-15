from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from sqlalchemy.orm import Session

from app.database.session import get_db
from app.api.permissions import require_roles
from app.api.tenant_context import get_effective_tenant_id

from app.models.enums import UserRole
from app.models.user import User

from app.schemas.expense import (
    ExpenseCreate,
    ExpenseUpdate,
    ExpenseResponse,
)

from app.services.expense_service import (
    create_expense_service,
    list_expenses_service,
    list_archived_expenses_service,
    get_expense_service,
    get_archived_expense_service,
    update_expense_service,
    archive_expense_service,
    restore_expense_service,
    permanently_delete_expense_service,
)


router = APIRouter(
    prefix="/expenses",
    tags=["Expenses"],
)


# =========================================================
# CREATE EXPENSE
# SUPER_ADMIN + OWNER + STAFF
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
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
    tenant_id: int = Depends(
        get_effective_tenant_id
    ),
):
    try:
        return create_expense_service(
            db=db,
            tenant_id=tenant_id,
            expense_data=expense_data,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


# =========================================================
# LIST ACTIVE EXPENSES
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
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
    tenant_id: int = Depends(
        get_effective_tenant_id
    ),
):
    return list_expenses_service(
        db=db,
        tenant_id=tenant_id,
    )


# =========================================================
# LIST ARCHIVED EXPENSES
# =========================================================

@router.get(
    "/archived",
    response_model=list[ExpenseResponse],
)
def list_archived_expenses(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
    tenant_id: int = Depends(
        get_effective_tenant_id
    ),
):
    return list_archived_expenses_service(
        db=db,
        tenant_id=tenant_id,
    )


# =========================================================
# GET ACTIVE EXPENSE
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
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
    tenant_id: int = Depends(
        get_effective_tenant_id
    ),
):
    expense = get_expense_service(
        db=db,
        tenant_id=tenant_id,
        expense_id=expense_id,
    )

    if expense is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found.",
        )

    return expense


# =========================================================
# UPDATE ACTIVE EXPENSE
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
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
    tenant_id: int = Depends(
        get_effective_tenant_id
    ),
):
    expense = update_expense_service(
        db=db,
        tenant_id=tenant_id,
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
# ARCHIVE EXPENSE
# =========================================================

@router.post(
    "/{expense_id}/archive",
    response_model=ExpenseResponse,
)
def archive_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
    tenant_id: int = Depends(
        get_effective_tenant_id
    ),
):
    expense = archive_expense_service(
        db=db,
        tenant_id=tenant_id,
        expense_id=expense_id,
    )

    if expense is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found.",
        )

    return expense


# =========================================================
# RESTORE ARCHIVED EXPENSE
# =========================================================

@router.post(
    "/{expense_id}/restore",
    response_model=ExpenseResponse,
)
def restore_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
    tenant_id: int = Depends(
        get_effective_tenant_id
    ),
):
    expense = restore_expense_service(
        db=db,
        tenant_id=tenant_id,
        expense_id=expense_id,
    )

    if expense is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Archived expense not found.",
        )

    return expense


# =========================================================
# PERMANENT DELETE EXPENSE
# ARCHIVED ONLY
# =========================================================

@router.delete(
    "/{expense_id}/permanent",
    status_code=status.HTTP_204_NO_CONTENT,
)
def permanently_delete_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
    tenant_id: int = Depends(
        get_effective_tenant_id
    ),
):
    expense = permanently_delete_expense_service(
        db=db,
        tenant_id=tenant_id,
        expense_id=expense_id,
    )

    if expense is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Archived expense not found.",
        )

    return None


# =========================================================
# LEGACY DELETE → ARCHIVE
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
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
    tenant_id: int = Depends(
        get_effective_tenant_id
    ),
):
    """
    Existing DELETE endpoint is kept for frontend
    compatibility.

    It now ARCHIVES the expense instead of permanently
    deleting it.
    """

    expense = archive_expense_service(
        db=db,
        tenant_id=tenant_id,
        expense_id=expense_id,
    )

    if expense is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found.",
        )

    return None