"""add archive fields to payments and expenses

Revision ID: f567154bfbc2
Revises: c63b7bff374c
Create Date: 2026-09-14 04:02:09.930530
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "f567154bfbc2"
down_revision: Union[str, Sequence[str], None] = "c63b7bff374c"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    # Add archive flag to expenses.
    op.add_column(
        "expenses",
        sa.Column(
            "is_archived",
            sa.Boolean(),
            server_default="false",
            nullable=False,
        ),
    )

    op.create_index(
        op.f("ix_expenses_is_archived"),
        "expenses",
        ["is_archived"],
        unique=False,
    )

    # Add archive flag to payments.
    op.add_column(
        "payments",
        sa.Column(
            "is_archived",
            sa.Boolean(),
            server_default="false",
            nullable=False,
        ),
    )

    op.create_index(
        op.f("ix_payments_is_archived"),
        "payments",
        ["is_archived"],
        unique=False,
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_index(
        op.f("ix_payments_is_archived"),
        table_name="payments",
    )

    op.drop_column(
        "payments",
        "is_archived",
    )

    op.drop_index(
        op.f("ix_expenses_is_archived"),
        table_name="expenses",
    )

    op.drop_column(
        "expenses",
        "is_archived",
    )