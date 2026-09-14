from datetime import date, datetime

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
)


class InventoryBase(BaseModel):
    name: str
    category: str
    brand: str | None = None

    # Stock unit
    unit: str

    # Sale/issue unit
    issue_unit: str = "unit"

    # Example:
    # 1 Box = 10 Packs
    units_per_stock_unit: int = Field(
        default=1,
        ge=1,
    )

    # Complete stock units
    quantity: int = Field(
        default=0,
        ge=0,
    )

    # Minimum stock in complete stock units
    minimum_stock: int = Field(
        default=0,
        ge=0,
    )

    # Prices are for one complete stock unit
    purchase_price: float = Field(
        ge=0,
    )

    selling_price: float = Field(
        ge=0,
    )

    expiry_date: date | None = None


class InventoryCreate(InventoryBase):
    pass


class InventoryUpdate(BaseModel):
    name: str | None = None
    category: str | None = None
    brand: str | None = None

    unit: str | None = None
    issue_unit: str | None = None

    units_per_stock_unit: int | None = Field(
        default=None,
        ge=1,
    )

    quantity: int | None = Field(
        default=None,
        ge=0,
    )

    minimum_stock: int | None = Field(
        default=None,
        ge=0,
    )

    purchase_price: float | None = Field(
        default=None,
        ge=0,
    )

    selling_price: float | None = Field(
        default=None,
        ge=0,
    )

    expiry_date: date | None = None


class InventoryResponse(InventoryBase):
    id: int
    tenant_id: int

    loose_quantity: int

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )