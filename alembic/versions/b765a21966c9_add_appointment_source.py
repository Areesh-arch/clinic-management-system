"""add appointment source

Revision ID: b765a21966c9
Revises: db72b2d92653
Create Date: 2026-09-10 04:15:45.535578
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "b765a21966c9"
down_revision: Union[str, Sequence[str], None] = "db72b2d92653"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    appointment_source_enum = sa.Enum(
        "CLINIC",
        "WEBSITE",
        "WALK_IN",
        name="appointmentsource",
        native_enum=False,
    )

    op.add_column(
        "appointments",
        sa.Column(
            "source",
            appointment_source_enum,
            nullable=False,
            server_default="clinic",
        ),
    )

    op.alter_column(
        "appointments",
        "source",
        server_default=None,
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_column(
        "appointments",
        "source",
    )