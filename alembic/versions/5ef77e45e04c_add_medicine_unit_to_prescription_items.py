"""add medicine unit to prescription items

Revision ID: 5ef77e45e04c
Revises: 5119dfdadfd7
Create Date: 2026-09-13 22:01:19.981437
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "5ef77e45e04c"
down_revision: Union[str, Sequence[str], None] = "5119dfdadfd7"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add medicine sale/issue unit to prescription items."""

    op.add_column(
        "prescription_items",
        sa.Column(
            "medicine_unit",
            sa.String(length=50),
            nullable=True,
        ),
    )

    # Existing prescription items were issued using the inventory item's
    # previous unit field. Preserve that information for historical records.
    op.execute(
        """
        UPDATE prescription_items pi
        SET medicine_unit = COALESCE(ii.issue_unit, ii.unit, 'unit')
        FROM inventory_items ii
        WHERE pi.inventory_item_id = ii.id
          AND pi.medicine_unit IS NULL
        """
    )

    # Any historical prescription item without an inventory reference
    # gets a safe fallback.
    op.execute(
        """
        UPDATE prescription_items
        SET medicine_unit = 'unit'
        WHERE medicine_unit IS NULL
        """
    )

    op.alter_column(
        "prescription_items",
        "medicine_unit",
        existing_type=sa.String(length=50),
        nullable=False,
    )


def downgrade() -> None:
    """Remove medicine sale/issue unit from prescription items."""

    op.drop_column(
        "prescription_items",
        "medicine_unit",
    )