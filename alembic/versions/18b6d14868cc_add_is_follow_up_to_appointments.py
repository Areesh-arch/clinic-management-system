"""add is follow up to appointments

Revision ID: 18b6d14868cc
Revises: 093e4a609650
Create Date: 2026-09-07
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "18b6d14868cc"
down_revision: Union[str, Sequence[str], None] = "093e4a609650"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "appointments",
        sa.Column(
            "is_follow_up",
            sa.Boolean(),
            nullable=False,
            server_default=sa.false(),
        ),
    )

    op.alter_column(
        "appointments",
        "is_follow_up",
        server_default=None,
    )


def downgrade() -> None:
    op.drop_column(
        "appointments",
        "is_follow_up",
    )