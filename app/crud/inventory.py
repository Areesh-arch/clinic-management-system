from sqlalchemy.orm import Session

from app.models.inventory_item import InventoryItem

from app.schemas.inventory import (
    InventoryCreate,
    InventoryUpdate,
)


# =========================================================
# CREATE
# =========================================================

def create_inventory_item(
    db: Session,
    inventory_data: InventoryCreate,
    tenant_id: int,
) -> InventoryItem:

    inventory_item = InventoryItem(
        tenant_id=tenant_id,
        is_archived=False,

        name=inventory_data.name,
        category=inventory_data.category,
        brand=inventory_data.brand,

        unit=inventory_data.unit,
        issue_unit=inventory_data.issue_unit,
        units_per_stock_unit=inventory_data.units_per_stock_unit,

        quantity=inventory_data.quantity,
        loose_quantity=0,

        minimum_stock=inventory_data.minimum_stock,

        purchase_price=inventory_data.purchase_price,
        selling_price=inventory_data.selling_price,

        expiry_date=inventory_data.expiry_date,
    )

    db.add(inventory_item)
    db.commit()
    db.refresh(inventory_item)

    return inventory_item


# =========================================================
# GET ONE ACTIVE
# =========================================================

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
            InventoryItem.is_archived.is_(False),
        )
        .first()
    )


# =========================================================
# GET ONE ARCHIVED
# =========================================================

def get_archived_inventory_item_by_id(
    db: Session,
    inventory_item_id: int,
    tenant_id: int,
):
    return (
        db.query(InventoryItem)
        .filter(
            InventoryItem.id == inventory_item_id,
            InventoryItem.tenant_id == tenant_id,
            InventoryItem.is_archived.is_(True),
        )
        .first()
    )


# =========================================================
# GET ALL ACTIVE
# =========================================================

def get_inventory_items(
    db: Session,
    tenant_id: int,
):
    return (
        db.query(InventoryItem)
        .filter(
            InventoryItem.tenant_id == tenant_id,
            InventoryItem.is_archived.is_(False),
        )
        .all()
    )


# =========================================================
# GET ALL ARCHIVED
# =========================================================

def get_archived_inventory_items(
    db: Session,
    tenant_id: int,
):
    return (
        db.query(InventoryItem)
        .filter(
            InventoryItem.tenant_id == tenant_id,
            InventoryItem.is_archived.is_(True),
        )
        .order_by(
            InventoryItem.updated_at.desc(),
        )
        .all()
    )


# =========================================================
# UPDATE
# =========================================================

def update_inventory_item(
    db: Session,
    inventory_item: InventoryItem,
    inventory_data: InventoryUpdate,
):
    update_data = inventory_data.model_dump(
        exclude_unset=True,
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


# =========================================================
# ARCHIVE
# =========================================================

def archive_inventory_item(
    db: Session,
    inventory_item: InventoryItem,
):
    inventory_item.is_archived = True

    db.commit()
    db.refresh(inventory_item)

    return inventory_item


# =========================================================
# RESTORE
# =========================================================

def restore_inventory_item(
    db: Session,
    inventory_item: InventoryItem,
):
    inventory_item.is_archived = False

    db.commit()
    db.refresh(inventory_item)

    return inventory_item


# =========================================================
# PERMANENT DELETE
# =========================================================

def permanently_delete_inventory_item(
    db: Session,
    inventory_item: InventoryItem,
):
    db.delete(inventory_item)
    db.commit()


# =========================================================
# LEGACY DELETE = ARCHIVE
# =========================================================

def delete_inventory_item(
    db: Session,
    inventory_item: InventoryItem,
):
    return archive_inventory_item(
        db=db,
        inventory_item=inventory_item,
    )