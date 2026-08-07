from sqlalchemy.orm import Session

from app.crud.inventory import (
    create_inventory_item,
    get_inventory_item_by_id,
    get_inventory_items,
    update_inventory_item,
    delete_inventory_item,
)

from app.models.inventory_item import InventoryItem

from app.schemas.inventory import (
    InventoryCreate,
    InventoryUpdate,
)


def create_inventory_service(
    db: Session,
    inventory_data: InventoryCreate,
    tenant_id: int,
):
    """
    Create an inventory item after checking
    whether the item already exists for this tenant.
    """

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


def list_inventory_service(
    db: Session,
    tenant_id: int,
):
    return get_inventory_items(
        db=db,
        tenant_id=tenant_id,
    )


def update_inventory_service(
    db: Session,
    inventory_item: InventoryItem,
    inventory_data: InventoryUpdate,
):
    return update_inventory_item(
        db=db,
        inventory_item=inventory_item,
        inventory_data=inventory_data,
    )


def delete_inventory_service(
    db: Session,
    inventory_item: InventoryItem,
):
    delete_inventory_item(
        db=db,
        inventory_item=inventory_item,
    )