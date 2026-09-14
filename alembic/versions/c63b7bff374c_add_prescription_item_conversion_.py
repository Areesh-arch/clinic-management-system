"""add prescription item conversion snapshot

Revision ID: c63b7bff374c

Revises: 5ef77e45e04c

Create Date: 2026-09-13 22:46:29.494472

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "c63b7bff374c"
down_revision: Union[str, Sequence[str], None] = "5ef77e45e04c"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    op.add_column(
        "prescription_items",
        sa.Column(
            "units_per_stock_unit",
            sa.Integer(),
            nullable=True,
        ),
    )

    # Existing prescription items were created before the
    # conversion snapshot existed.
    #
    # Use the current inventory conversion where possible.
    # If the inventory item no longer exists, use 1.
    op.execute(
        """
        UPDATE prescription_items
        SET units_per_stock_unit = COALESCE(
            (
                SELECT inventory_items.units_per_stock_unit
                FROM inventory_items
                WHERE inventory_items.id = prescription_items.inventory_item_id
            ),
            1
        )
        WHERE units_per_stock_unit IS NULL
        """
    )

    op.alter_column(
        "prescription_items",
        "units_per_stock_unit",
        existing_type=sa.Integer(),
        nullable=False,
        server_default="1",
    )

    # Remove the server default after existing rows have been
    # safely populated. The SQLAlchemy model itself has default=1.
    op.alter_column(
        "prescription_items",
        "units_per_stock_unit",
        existing_type=sa.Integer(),
        server_default=None,
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_column(
        "prescription_items",
        "units_per_stock_unit",
    )