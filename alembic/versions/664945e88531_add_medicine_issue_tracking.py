
"""add medicine issue tracking

Revision ID: 664945e88531
Revises: 2c0a7242288a
Create Date: 2026-09-15 02:39:04.674580

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "664945e88531"
down_revision: Union[str, Sequence[str], None] = "2c0a7242288a"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    op.create_table(
        "medicine_issues",
        sa.Column(
            "tenant_id",
            sa.Integer(),
            nullable=False,
        ),
        sa.Column(
            "inventory_item_id",
            sa.Integer(),
            nullable=False,
        ),
        sa.Column(
            "patient_id",
            sa.Integer(),
            nullable=True,
        ),
        sa.Column(
            "visit_id",
            sa.Integer(),
            nullable=True,
        ),
        sa.Column(
            "customer_name",
            sa.String(length=255),
            nullable=True,
        ),
        sa.Column(
            "medicine_name",
            sa.String(length=255),
            nullable=False,
        ),
        sa.Column(
            "medicine_unit",
            sa.String(length=50),
            nullable=False,
        ),
        sa.Column(
            "quantity",
            sa.Integer(),
            nullable=False,
        ),
        sa.Column(
            "unit_price",
            sa.Numeric(
                precision=10,
                scale=2,
            ),
            nullable=False,
        ),
        sa.Column(
            "total_amount",
            sa.Numeric(
                precision=10,
                scale=2,
            ),
            nullable=False,
        ),
        sa.Column(
            "issued_at",
            sa.DateTime(),
            nullable=False,
        ),
        sa.Column(
            "created_by",
            sa.Integer(),
            nullable=True,
        ),
        sa.Column(
            "id",
            sa.Integer(),
            nullable=False,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["created_by"],
            ["users.id"],
            ondelete="SET NULL",
        ),
        sa.ForeignKeyConstraint(
            ["inventory_item_id"],
            ["inventory_items.id"],)
    )