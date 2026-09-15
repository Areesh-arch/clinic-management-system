"""fix medicine issue id generation

Revision ID: e9c76c01cd5f
Revises: 664945e88531
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "e9c76c01cd5f"
down_revision: Union[str, Sequence[str], None] = "664945e88531"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # PostgreSQL sequence for MedicineIssue IDs
    op.execute(
        """
        CREATE SEQUENCE IF NOT EXISTS medicine_issues_id_seq
        OWNED BY medicine_issues.id
        """
    )

    op.execute(
        """
        SELECT setval(
            'medicine_issues_id_seq',
            COALESCE(
                (SELECT MAX(id) FROM medicine_issues),
                0
            ) + 1,
            false
        )
        """
    )

    op.alter_column(
        "medicine_issues",
        "id",
        existing_type=sa.Integer(),
        server_default=sa.text(
            "nextval('medicine_issues_id_seq'::regclass)"
        ),
        existing_nullable=False,
    )


def downgrade() -> None:
    op.alter_column(
        "medicine_issues",
        "id",
        existing_type=sa.Integer(),
        server_default=None,
        existing_nullable=False,
    )

    op.execute(
        """
        DROP SEQUENCE IF EXISTS medicine_issues_id_seq
        """
    )