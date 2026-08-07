from sqlalchemy.orm import Session

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from app.database.session import get_db
from app.api.permissions import require_roles
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
            "owner",
            "staff",
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


@router.get(
    "/",
    response_model=list[ExpenseResponse],
)
def list_expenses(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            "owner",
            "staff",
        )
    ),
):
    return list_expenses_service(
        db=db,
        tenant_id=current_user.tenant_id,
    )


@router.get(
    "/{expense_id}",
    response_model=ExpenseResponse,
)
def get_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            "owner",
            "staff",
        )
    ),
):
    try:
        return get_expense_service(
            db=db,
            expense_id=expense_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


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
            "owner",
            "staff",
        )
    ),
):
    try:
        expense = get_expense_service(
            db=db,
            expense_id=expense_id,
        )

        return update_expense_service(
            db=db,
            expense=expense,
            expense_data=expense_data,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


@router.delete(
    "/{expense_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            "owner",
            "staff",
        )
    ),
):
    try:
        expense = get_expense_service(
            db=db,
            expense_id=expense_id,
        )

        delete_expense_service(
            db=db,
            expense=expense,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )