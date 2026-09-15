from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from sqlalchemy.orm import Session

from app.database.session import get_db
from app.api.permissions import require_roles

from app.models.enums import UserRole
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
    list_archived_inventory_service,
    update_inventory_service,
    delete_inventory_service,
    archive_inventory_service,
    restore_inventory_service,
    permanently_delete_inventory_service,
)


router = APIRouter(
    prefix="",
    tags=["Inventory"],
)


# =========================================================
# CREATE INVENTORY ITEM
# =========================================================

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
            UserRole.SUPER_ADMIN,
            UserRole.OWNER,
            UserRole.STAFF,
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


# =========================================================
# LIST ACTIVE INVENTORY
# =========================================================

@router.get(
    "/",
    response_model=list[InventoryResponse],
)
def list_inventory(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.SUPER_ADMIN,
            UserRole.OWNER,
            UserRole.STAFF,
        )
    ),
):
    return list_inventory_service(
        db=db,
        tenant_id=current_user.tenant_id,
    )


# =========================================================
# LIST ARCHIVED INVENTORY
# IMPORTANT: BEFORE /{inventory_item_id}
# =========================================================

@router.get(
    "/archived",
    response_model=list[InventoryResponse],
)
def list_archived_inventory(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.SUPER_ADMIN,
            UserRole.OWNER,
            UserRole.STAFF,
        )
    ),
):
    return list_archived_inventory_service(
        db=db,
        tenant_id=current_user.tenant_id,
    )


# =========================================================
# ARCHIVE INVENTORY ITEM
# =========================================================

@router.post(
    "/{inventory_item_id}/archive",
    response_model=InventoryResponse,
)
def archive_inventory(
    inventory_item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.SUPER_ADMIN,
            UserRole.OWNER,
            UserRole.STAFF,
        )
    ),
):
    try:
        return archive_inventory_service(
            db=db,
            inventory_item_id=inventory_item_id,
            tenant_id=current_user.tenant_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


# =========================================================
# RESTORE INVENTORY ITEM
# =========================================================

@router.post(
    "/{inventory_item_id}/restore",
    response_model=InventoryResponse,
)
def restore_inventory(
    inventory_item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.SUPER_ADMIN,
            UserRole.OWNER,
            UserRole.STAFF,
        )
    ),
):
    try:
        return restore_inventory_service(
            db=db,
            inventory_item_id=inventory_item_id,
            tenant_id=current_user.tenant_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


# =========================================================
# PERMANENT DELETE
# IMPORTANT: BEFORE /{inventory_item_id}
# =========================================================

@router.delete(
    "/{inventory_item_id}/permanent",
    status_code=status.HTTP_204_NO_CONTENT,
)
def permanently_delete_inventory(
    inventory_item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.SUPER_ADMIN,
            UserRole.OWNER,
            UserRole.STAFF,
        )
    ),
):
    try:
        permanently_delete_inventory_service(
            db=db,
            inventory_item_id=inventory_item_id,
            tenant_id=current_user.tenant_id,
        )

        return None

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


# =========================================================
# GET SINGLE ACTIVE INVENTORY ITEM
# =========================================================

@router.get(
    "/{inventory_item_id}",
    response_model=InventoryResponse,
)
def get_inventory(
    inventory_item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.SUPER_ADMIN,
            UserRole.OWNER,
            UserRole.STAFF,
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


# =========================================================
# UPDATE INVENTORY ITEM
# =========================================================

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
            UserRole.SUPER_ADMIN,
            UserRole.OWNER,
            UserRole.STAFF,
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


# =========================================================
# DELETE = ARCHIVE
# =========================================================

@router.delete(
    "/{inventory_item_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_inventory(
    inventory_item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.SUPER_ADMIN,
            UserRole.OWNER,
            UserRole.STAFF,
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

        return None

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )