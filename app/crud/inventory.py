from sqlalchemy.orm import Session

from app.models.inventory_item import InventoryItem

from app.schemas.inventory import (
    InventoryCreate,
    InventoryUpdate,
)


def create_inventory_item(
    db: Session,
    inventory_data: InventoryCreate,
    tenant_id: int,
) -> InventoryItem:

    inventory_item = InventoryItem(
        tenant_id=tenant_id,
        name=inventory_data.name,
        category=inventory_data.category,
        brand=inventory_data.brand,
        unit=inventory_data.unit,
        quantity=inventory_data.quantity,
        minimum_stock=inventory_data.minimum_stock,
        purchase_price=inventory_data.purchase_price,
        selling_price=inventory_data.selling_price,
        expiry_date=inventory_data.expiry_date,
    )

    db.add(inventory_item)
    db.commit()
    db.refresh(inventory_item)

    return inventory_item


def get_inventory_item_by_id(
    db: Session,
    inventory_item_id: int,
    tenant_id: int,
):
    return (
        db.query(InventoryItem)
        .filter(
            InventoryItem.id == inventory_item_id,
            InventoryItem.tenant_id == tenant_id,
        )
        .first()
    )


def get_inventory_items(
    db: Session,
    tenant_id: int,
):
    return (
        db.query(InventoryItem)
        .filter(
            InventoryItem.tenant_id == tenant_id,
        )
        .all()
    )


def update_inventory_item(
    db: Session,
    inventory_item: InventoryItem,
    inventory_data: InventoryUpdate,
):
    update_data = inventory_data.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(
            inventory_item,
            key,
            value,
        )

    db.commit()
    db.refresh(inventory_item)

    return inventory_item


def delete_inventory_item(
    db: Session,
    inventory_item: InventoryItem,
):
    db.delete(inventory_item)
    db.commit()