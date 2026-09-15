"""add profile image to tenants

Revision ID: 3b6b75e24723
Revises: f9416f36ae38
Create Date: 2026-09-14 12:02:17.013841
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "3b6b75e24723"
down_revision: Union[str, Sequence[str], None] = "f9416f36ae38"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    op.add_column(
        "tenants",
        sa.Column(
            "profile_image_url",
            sa.String(length=500),
            nullable=True,
        ),
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_column(
        "tenants",
        "profile_image_url",
    )