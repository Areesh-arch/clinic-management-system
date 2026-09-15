from sqlalchemy.orm import Session

from app.crud.inventory import (
    create_inventory_item,
    get_inventory_item_by_id,
    get_archived_inventory_item_by_id,
    get_inventory_items,
    get_archived_inventory_items,
    update_inventory_item,
    delete_inventory_item,
    archive_inventory_item,
    restore_inventory_item,
    permanently_delete_inventory_item,
)

from app.models.inventory_item import InventoryItem

from app.schemas.inventory import (
    InventoryCreate,
    InventoryUpdate,
)


# =========================================================
# CREATE
# =========================================================

def create_inventory_service(
    db: Session,
    inventory_data: InventoryCreate,
    tenant_id: int,
):
    """
    Create an inventory item.

    Example:

        Stock Unit: Box
        Sale Unit: Pack
        Units per Box: 10
        Quantity: 5

    The system internally understands:

        5 Boxes = 50 Packs
    """

    if inventory_data.units_per_stock_unit < 1:
        raise ValueError(
            "Units per stock unit must be at least 1."
        )

    if inventory_data.quantity < 0:
        raise ValueError(
            "Quantity cannot be negative."
        )

    if inventory_data.minimum_stock < 0:
        raise ValueError(
            "Minimum stock cannot be negative."
        )

    if inventory_data.purchase_price < 0:
        raise ValueError(
            "Purchase price cannot be negative."
        )

    if inventory_data.selling_price < 0:
        raise ValueError(
            "Selling price cannot be negative."
        )

    existing_item = (
        db.query(InventoryItem)
        .filter(
            InventoryItem.tenant_id == tenant_id,
            InventoryItem.name == inventory_data.name,
        )
        .first()
    )

    if existing_item:
        raise ValueError(
            "Inventory item already exists."
        )

    return create_inventory_item(
        db=db,
        inventory_data=inventory_data,
        tenant_id=tenant_id,
    )


# =========================================================
# GET ONE ACTIVE
# =========================================================

def get_inventory_service(
    db: Session,
    inventory_item_id: int,
    tenant_id: int,
):
    inventory_item = get_inventory_item_by_id(
        db=db,
        inventory_item_id=inventory_item_id,
        tenant_id=tenant_id,
    )

    if inventory_item is None:
        raise ValueError(
            "Inventory item not found."
        )

    return inventory_item


# =========================================================
# LIST ACTIVE
# =========================================================

def list_inventory_service(
    db: Session,
    tenant_id: int,
):
    return get_inventory_items(
        db=db,
        tenant_id=tenant_id,
    )


# =========================================================
# LIST ARCHIVED
# =========================================================

def list_archived_inventory_service(
    db: Session,
    tenant_id: int,
):
    return get_archived_inventory_items(
        db=db,
        tenant_id=tenant_id,
    )


# =========================================================
# UPDATE
# =========================================================

def update_inventory_service(
    db: Session,
    inventory_item: InventoryItem,
    inventory_data: InventoryUpdate,
):
    """
    Update inventory.

    Existing loose stock is preserved.
    """

    if (
        inventory_data.units_per_stock_unit is not None
        and inventory_data.units_per_stock_unit < 1
    ):
        raise ValueError(
            "Units per stock unit must be at least 1."
        )

    if (
        inventory_data.quantity is not None
        and inventory_data.quantity < 0
    ):
        raise ValueError(
            "Quantity cannot be negative."
        )

    if (
        inventory_data.minimum_stock is not None
        and inventory_data.minimum_stock < 0
    ):
        raise ValueError(
            "Minimum stock cannot be negative."
        )

    if (
        inventory_data.purchase_price is not None
        and inventory_data.purchase_price < 0
    ):
        raise ValueError(
            "Purchase price cannot be negative."
        )

    if (
        inventory_data.selling_price is not None
        and inventory_data.selling_price < 0
    ):
        raise ValueError(
            "Selling price cannot be negative."
        )

    return update_inventory_item(
        db=db,
        inventory_item=inventory_item,
        inventory_data=inventory_data,
    )


# =========================================================
# ARCHIVE
# =========================================================

def archive_inventory_service(
    db: Session,
    inventory_item_id: int,
    tenant_id: int,
):
    inventory_item = get_inventory_item_by_id(
        db=db,
        inventory_item_id=inventory_item_id,
        tenant_id=tenant_id,
    )

    if inventory_item is None:
        raise ValueError(
            "Inventory item not found."
        )

    return archive_inventory_item(
        db=db,
        inventory_item=inventory_item,
    )


# =========================================================
# RESTORE
# =========================================================

def restore_inventory_service(
    db: Session,
    inventory_item_id: int,
    tenant_id: int,
):
    inventory_item = get_archived_inventory_item_by_id(
        db=db,
        inventory_item_id=inventory_item_id,
        tenant_id=tenant_id,
    )

    if inventory_item is None:
        raise ValueError(
            "Archived inventory item not found."
        )

    return restore_inventory_item(
        db=db,
        inventory_item=inventory_item,
    )


# =========================================================
# PERMANENT DELETE
# =========================================================

def permanently_delete_inventory_service(
    db: Session,
    inventory_item_id: int,
    tenant_id: int,
):
    inventory_item = get_archived_inventory_item_by_id(
        db=db,
        inventory_item_id=inventory_item_id,
        tenant_id=tenant_id,
    )

    if inventory_item is None:
        raise ValueError(
            "Archived inventory item not found."
        )

    permanently_delete_inventory_item(
        db=db,
        inventory_item=inventory_item,
    )


# =========================================================
# LEGACY DELETE = ARCHIVE
# =========================================================

def delete_inventory_service(
    db: Session,
    inventory_item: InventoryItem,
):
    return delete_inventory_item(
        db=db,
        inventory_item=inventory_item,
    )