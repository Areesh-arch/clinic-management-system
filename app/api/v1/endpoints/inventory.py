
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import Session

from app.database.session import get_db

from app.api.permissions import require_roles
from app.api.tenant_context import get_effective_tenant_id

from app.models.enums import UserRole
from app.models.user import User

from app.schemas.inventory import (
    InventoryCreate,
    InventoryResponse,
    InventoryUpdate,
)

from app.schemas.medicine_issue import (
    MedicineIssueCreate,
    MedicineIssueResponse,
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

from app.services.medicine_issue_service import (
    create_medicine_issue_service,
)


router = APIRouter(
    prefix="",
    tags=["Inventory"],
)


# =========================================================
# CREATE INVENTORY ITEM
# OWNER + STAFF + SUPER_ADMIN
# =========================================================

@router.post(
    "/",
    response_model=InventoryResponse,
)
def create_inventory(
    data: InventoryCreate,
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
        return create_inventory_service(
            db=db,
            inventory_data=data,
            tenant_id=tenant_id,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )


# =========================================================
# LIST ACTIVE INVENTORY
# OWNER + STAFF + SUPER_ADMIN
# =========================================================

@router.get(
    "/",
    response_model=list[InventoryResponse],
)
def get_inventory(
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
    return list_inventory_service(
        db=db,
        tenant_id=tenant_id,
    )


# =========================================================
# LIST ARCHIVED INVENTORY
# OWNER + STAFF + SUPER_ADMIN
# =========================================================

@router.get(
    "/archived",
    response_model=list[InventoryResponse],
)
def get_archived_inventory(
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
    return list_archived_inventory_service(
        db=db,
        tenant_id=tenant_id,
    )


# =========================================================
# ARCHIVE INVENTORY ITEM
# OWNER + STAFF + SUPER_ADMIN
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
        return archive_inventory_service(
            db=db,
            inventory_item_id=inventory_item_id,
            tenant_id=tenant_id,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=404,
            detail=str(exc),
        )


# =========================================================
# RESTORE INVENTORY ITEM
# OWNER + STAFF + SUPER_ADMIN
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
        return restore_inventory_service(
            db=db,
            inventory_item_id=inventory_item_id,
            tenant_id=tenant_id,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=404,
            detail=str(exc),
        )


# =========================================================
# PERMANENT DELETE ARCHIVED INVENTORY ITEM
# OWNER + SUPER_ADMIN
# =========================================================

@router.delete(
    "/{inventory_item_id}/permanent",
)
def permanently_delete_inventory(
    inventory_item_id: int,
    db: Session = Depends(get_db),

    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.SUPER_ADMIN,
        )
    ),

    tenant_id: int = Depends(
        get_effective_tenant_id
    ),
):
    try:
        permanently_delete_inventory_service(
            db=db,
            inventory_item_id=inventory_item_id,
            tenant_id=tenant_id,
        )

        return {
            "message": "Inventory item permanently deleted."
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=404,
            detail=str(exc),
        )


# =========================================================
# GET SINGLE ACTIVE INVENTORY ITEM
# OWNER + STAFF + SUPER_ADMIN
# =========================================================

@router.get(
    "/{inventory_item_id}",
    response_model=InventoryResponse,
)
def get_inventory_item(
    inventory_item_id: int,
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
        return get_inventory_service(
            db=db,
            inventory_item_id=inventory_item_id,
            tenant_id=tenant_id,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=404,
            detail=str(exc),
        )


# =========================================================
# UPDATE INVENTORY ITEM
# OWNER + STAFF + SUPER_ADMIN
# =========================================================

@router.put(
    "/{inventory_item_id}",
    response_model=InventoryResponse,
)
def update_inventory(
    inventory_item_id: int,
    data: InventoryUpdate,
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
        inventory_item = get_inventory_service(
            db=db,
            inventory_item_id=inventory_item_id,
            tenant_id=tenant_id,
        )

        return update_inventory_service(
            db=db,
            inventory_item=inventory_item,
            inventory_data=data,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )


# =========================================================
# DELETE = ARCHIVE
# OWNER + STAFF + SUPER_ADMIN
# =========================================================

@router.delete(
    "/{inventory_item_id}",
)
def delete_inventory(
    inventory_item_id: int,
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
        inventory_item = get_inventory_service(
            db=db,
            inventory_item_id=inventory_item_id,
            tenant_id=tenant_id,
        )

        delete_inventory_service(
            db=db,
            inventory_item=inventory_item,
        )

        return {
            "message": "Inventory item archived successfully."
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=404,
            detail=str(exc),
        )


# =========================================================
# DIRECT MEDICINE ISSUE
#
# This is NOT a separate billing/sales module.
#
# Patient:
#     patient_id provided
#
# Non-patient:
#     patient_id = null
#
# Both cases:
#     stock decreases
#     medicine issue is recorded
#
# OWNER + STAFF + SUPER_ADMIN
# =========================================================

@router.post(
    "/{inventory_item_id}/issue",
    response_model=MedicineIssueResponse,
)
def issue_medicine(
    inventory_item_id: int,
    data: MedicineIssueCreate,
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
        return create_medicine_issue_service(
            db=db,
            tenant_id=tenant_id,
            inventory_item_id=inventory_item_id,
            quantity=data.quantity,
            patient_id=data.patient_id,
            customer_name=data.customer_name,
            current_user_id=current_user.id,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )
