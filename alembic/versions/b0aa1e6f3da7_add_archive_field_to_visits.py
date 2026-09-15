"""add archive field to visits

Revision ID: b0aa1e6f3da7
Revises: f567154bfbc2
Create Date: 2026-09-14 06:57:11.177295
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "b0aa1e6f3da7"
down_revision: Union[str, Sequence[str], None] = "f567154bfbc2"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    # Add archive flag to visits.
    op.add_column(
        "visits",
        sa.Column(
            "is_archived",
            sa.Boolean(),
            server_default="false",
            nullable=False,
        ),
    )

    op.create_index(
        op.f("ix_visits_is_archived"),
        "visits",
        ["is_archived"],
        unique=False,
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_index(
        op.f("ix_visits_is_archived"),
        table_name="visits",
    )

    op.drop_column(
        "visits",
        "is_archived",
    )