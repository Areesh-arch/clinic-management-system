"""add archive field to inventory items

Revision ID: 31e8870ac48d
Revises: ADD_YOUR_GENERATED_REVISION
Create Date: 2026-09-14 10:26:31.636924
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.

revision: str = "31e8870ac48d"

down_revision: Union[str, Sequence[str], None] = (
    "ADD_YOUR_GENERATED_REVISION"
)

branch_labels: Union[str, Sequence[str], None] = None

depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    op.add_column(
        "inventory_items",
        sa.Column(
            "is_archived",
            sa.Boolean(),
            server_default="false",
            nullable=False,
        ),
    )

    op.create_index(
        op.f("ix_inventory_items_is_archived"),
        "inventory_items",
        ["is_archived"],
        unique=False,
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_index(
        op.f("ix_inventory_items_is_archived"),
        table_name="inventory_items",
    )

    op.drop_column(
        "inventory_items",
        "is_archived",
    )