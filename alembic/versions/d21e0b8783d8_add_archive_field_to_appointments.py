"""add archive field to appointments

Revision ID: ADD_YOUR_GENERATED_REVISION
Revises: b0aa1e6f3da7
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "ADD_YOUR_GENERATED_REVISION"
down_revision: Union[str, Sequence[str], None] = "b0aa1e6f3da7"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "appointments",
        sa.Column(
            "is_archived",
            sa.Boolean(),
            server_default="false",
            nullable=False,
        ),
    )

    op.create_index(
        op.f("ix_appointments_is_archived"),
        "appointments",
        ["is_archived"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(
        op.f("ix_appointments_is_archived"),
        table_name="appointments",
    )

    op.drop_column(
        "appointments",
        "is_archived",
    )