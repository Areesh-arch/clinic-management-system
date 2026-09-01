"""create leads table

Revision ID: 314fb2e7a9ce
Revises: fdcb7bdb3cb1
Create Date: 2026-08-30 22:56:02.279938
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# =========================================================
# REVISION IDENTIFIERS
# =========================================================

revision: str = "314fb2e7a9ce"

down_revision: Union[str, Sequence[str], None] = "fdcb7bdb3cb1"

branch_labels: Union[str, Sequence[str], None] = None

depends_on: Union[str, Sequence[str], None] = None


# =========================================================
# UPGRADE
# =========================================================

def upgrade() -> None:
    """Create the leads table."""

    op.create_table(
        "leads",

        sa.Column(
            "id",
            sa.Integer(),
            primary_key=True,
            index=True,
        ),

        sa.Column(
            "tenant_id",
            sa.Integer(),
            sa.ForeignKey("tenants.id"),
            nullable=False,
        ),

        sa.Column(
            "full_name",
            sa.String(length=255),
            nullable=False,
        ),

        sa.Column(
            "phone",
            sa.String(length=30),
            nullable=False,
        ),

        sa.Column(
            "source",
            sa.String(length=100),
            nullable=False,
        ),

        sa.Column(
            "status",
            sa.String(length=50),
            nullable=False,
            server_default="new",
        ),

        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),

        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
    )


# =========================================================
# DOWNGRADE
# =========================================================

def downgrade() -> None:
    """Drop the leads table."""

    op.drop_table("leads")