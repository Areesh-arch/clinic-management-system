"""add inventory sale unit conversion

Revision ID: 5119dfdadfd7
Revises: 00125fd6ebca
Create Date: 2026-09-13 21:57:06.033721
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "5119dfdadfd7"
down_revision: Union[str, Sequence[str], None] = "00125fd6ebca"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add inventory stock-unit / sale-unit conversion fields."""

    # Add the new columns with safe defaults so existing inventory rows
    # can be migrated without losing any data.
    op.add_column(
        "inventory_items",
        sa.Column(
            "issue_unit",
            sa.String(length=50),
            nullable=True,
        ),
    )

    op.add_column(
        "inventory_items",
        sa.Column(
            "units_per_stock_unit",
            sa.Integer(),
            nullable=False,
            server_default="1",
        ),
    )

    op.add_column(
        "inventory_items",
        sa.Column(
            "loose_quantity",
            sa.Integer(),
            nullable=False,
            server_default="0",
        ),
    )

    # Existing medicines previously had only one unit field.
    # Preserve that meaning by using the old unit as the new sale/issue unit.
    op.execute(
        """
        UPDATE inventory_items
        SET issue_unit = unit
        WHERE issue_unit IS NULL
        """
    )

    # issue_unit is now required.
    op.alter_column(
        "inventory_items",
        "issue_unit",
        existing_type=sa.String(length=50),
        nullable=False,
    )

    # Remove database-level defaults after existing rows are populated.
    # The application model already provides the defaults for new records.
    op.alter_column(
        "inventory_items",
        "units_per_stock_unit",
        existing_type=sa.Integer(),
        server_default=None,
    )

    op.alter_column(
        "inventory_items",
        "loose_quantity",
        existing_type=sa.Integer(),
        server_default=None,
    )


def downgrade() -> None:
    """Remove inventory stock-unit / sale-unit conversion fields."""

    op.drop_column("inventory_items", "loose_quantity")
    op.drop_column("inventory_items", "units_per_stock_unit")
    op.drop_column("inventory_items", "issue_unit")