"""link prescription items to inventory

Revision ID: 00125fd6ebca
Revises: 6f274499d698
Create Date: 2026-09-13 07:04:21.926508

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "00125fd6ebca"
down_revision: Union[str, Sequence[str], None] = "6f274499d698"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    # ---------------------------------------------------------
    # LINK PRESCRIPTION ITEM TO INVENTORY
    # ---------------------------------------------------------

    op.add_column(
        "prescription_items",
        sa.Column(
            "inventory_item_id",
            sa.Integer(),
            nullable=True,
        ),
    )

    op.create_foreign_key(
        "fk_prescription_items_inventory_item_id",
        "prescription_items",
        "inventory_items",
        ["inventory_item_id"],
        ["id"],
        ondelete="RESTRICT",
    )

    op.create_index(
        "ix_prescription_items_inventory_item_id",
        "prescription_items",
        ["inventory_item_id"],
        unique=False,
    )

    # ---------------------------------------------------------
    # HISTORICAL PRICE
    # ---------------------------------------------------------

    op.add_column(
        "prescription_items",
        sa.Column(
            "unit_price",
            sa.Numeric(10, 2),
            nullable=True,
        ),
    )

    # ---------------------------------------------------------
    # TOTAL MEDICINE AMOUNT
    # ---------------------------------------------------------

    op.add_column(
        "prescription_items",
        sa.Column(
            "total_amount",
            sa.Numeric(10, 2),
            nullable=True,
        ),
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_index(
        "ix_prescription_items_inventory_item_id",
        table_name="prescription_items",
    )

    op.drop_constraint(
        "fk_prescription_items_inventory_item_id",
        "prescription_items",
        type_="foreignkey",
    )

    op.drop_column(
        "prescription_items",
        "total_amount",
    )

    op.drop_column(
        "prescription_items",
        "unit_price",
    )

    op.drop_column(
        "prescription_items",
        "inventory_item_id",
    )