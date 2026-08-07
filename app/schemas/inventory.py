from datetime import date, datetime

from pydantic import BaseModel, ConfigDict


class InventoryBase(BaseModel):
    name: str
    category: str
    brand: str | None = None
    unit: str
    quantity: int
    minimum_stock: int
    purchase_price: float
    selling_price: float
    expiry_date: date | None = None


class InventoryCreate(InventoryBase):
    pass


class InventoryUpdate(BaseModel):
    name: str | None = None
    category: str | None = None
    brand: str | None = None
    unit: str | None = None
    quantity: int | None = None
    minimum_stock: int | None = None
    purchase_price: float | None = None
    selling_price: float | None = None
    expiry_date: date | None = None


class InventoryResponse(InventoryBase):
    id: int
    tenant_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )