"""add subscription plan configuration

Revision ID: 2c0a7242288a
Revises: 3b6b75e24723
Create Date: 2026-09-14 22:27:55.204941

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "2c0a7242288a"
down_revision: Union[str, Sequence[str], None] = "3b6b75e24723"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    op.create_table(
        "subscription_plan_configs",

        sa.Column(
            "plan",
            sa.Enum(
                "BASIC",
                "STANDARD",
                "PREMIUM",
                name="subscriptionplan",
                native_enum=False,
            ),
            nullable=False,
        ),

        sa.Column(
            "display_name",
            sa.String(length=100),
            nullable=False,
        ),

        sa.Column(
            "price",
            sa.Numeric(
                precision=12,
                scale=2,
            ),
            nullable=False,
        ),

        sa.Column(
            "currency",
            sa.String(length=10),
            nullable=False,
        ),

        sa.Column(
            "billing_interval",
            sa.String(length=30),
            nullable=False,
        ),

        sa.Column(
            "description",
            sa.String(length=500),
            nullable=False,
        ),

        sa.Column(
            "features",
            sa.JSON(),
            nullable=False,
        ),

        sa.Column(
            "is_active",
            sa.Boolean(),
            nullable=False,
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

        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index(
        op.f("ix_subscription_plan_configs_id"),
        "subscription_plan_configs",
        ["id"],
        unique=False,
    )

    op.create_index(
        op.f("ix_subscription_plan_configs_plan"),
        "subscription_plan_configs",
        ["plan"],
        unique=True,
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_index(
        op.f("ix_subscription_plan_configs_plan"),
        table_name="subscription_plan_configs",
    )

    op.drop_index(
        op.f("ix_subscription_plan_configs_id"),
        table_name="subscription_plan_configs",
    )

    op.drop_table(
        "subscription_plan_configs",
    )