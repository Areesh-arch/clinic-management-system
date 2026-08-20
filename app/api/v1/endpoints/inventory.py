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

from app.schemas.inventory import (
    InventoryCreate,
    InventoryUpdate,
    InventoryResponse,
)

from app.services.inventory_service import (
    create_inventory_service,
    get_inventory_service,
    list_inventory_service,
    update_inventory_service,
    delete_inventory_service,
)


router = APIRouter(
    prefix="",
    tags=["Inventory"],
)


@router.post(
    "/",
    response_model=InventoryResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_inventory(
    inventory_data: InventoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            "owner",
            "staff",
        )
    ),
):
    try:
        return create_inventory_service(
            db=db,
            inventory_data=inventory_data,
            tenant_id=current_user.tenant_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.get(
    "/",
    response_model=list[InventoryResponse],
)
def list_inventory(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            "owner",
            "staff",
        )
    ),
):
    return list_inventory_service(
        db=db,
        tenant_id=current_user.tenant_id,
    )


@router.get(
    "/{inventory_item_id}",
    response_model=InventoryResponse,
)
def get_inventory(
    inventory_item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            "owner",
            "staff",
        )
    ),
):
    try:
        return get_inventory_service(
            db=db,
            inventory_item_id=inventory_item_id,
            tenant_id=current_user.tenant_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


@router.put(
    "/{inventory_item_id}",
    response_model=InventoryResponse,
)
def update_inventory(
    inventory_item_id: int,
    inventory_data: InventoryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            "owner",
            "staff",
        )
    ),
):
    try:
        inventory_item = get_inventory_service(
            db=db,
            inventory_item_id=inventory_item_id,
            tenant_id=current_user.tenant_id,
        )

        return update_inventory_service(
            db=db,
            inventory_item=inventory_item,
            inventory_data=inventory_data,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


@router.delete(
    "/{inventory_item_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_inventory(
    inventory_item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            "owner",
            "staff",
        )
    ),
):
    try:
        inventory_item = get_inventory_service(
            db=db,
            inventory_item_id=inventory_item_id,
            tenant_id=current_user.tenant_id,
        )

        delete_inventory_service(
            db=db,
            inventory_item=inventory_item,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )