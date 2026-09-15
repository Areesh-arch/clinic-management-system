"""add profile image to users

Revision ID: f9416f36ae38
Revises: 31e8870ac48d
Create Date: 2026-09-14 11:03:20.223351

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "f9416f36ae38"
down_revision: Union[str, Sequence[str], None] = "31e8870ac48d"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    op.add_column(
        "users",
        sa.Column(
            "profile_image_url",
            sa.String(length=500),
            nullable=True,
        ),
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_column(
        "users",
        "profile_image_url",
    )