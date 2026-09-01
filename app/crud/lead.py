from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.lead import Lead
from app.schemas.lead import LeadCreate, LeadUpdate


# =========================================================
# CREATE LEAD
# =========================================================

def create_lead(
    db: Session,
    lead_data: LeadCreate,
    tenant_id: int,
) -> Lead:
    lead = Lead(
        tenant_id=tenant_id,
        **lead_data.model_dump(),
    )

    db.add(lead)
    db.commit()
    db.refresh(lead)

    return lead


# =========================================================
# GET LEAD BY ID
# =========================================================

def get_lead_by_id(
    db: Session,
    lead_id: int,
    tenant_id: int,
) -> Lead | None:
    statement = select(Lead).where(
        Lead.id == lead_id,
        Lead.tenant_id == tenant_id,
    )

    return db.scalar(statement)


# =========================================================
# GET ALL LEADS
# =========================================================

def get_leads(
    db: Session,
    tenant_id: int,
) -> list[Lead]:
    statement = (
        select(Lead)
        .where(
            Lead.tenant_id == tenant_id,
        )
        .order_by(Lead.created_at.desc())
    )

    return list(db.scalars(statement).all())


# =========================================================
# UPDATE LEAD
# =========================================================

def update_lead(
    db: Session,
    lead: Lead,
    lead_data: LeadUpdate,
) -> Lead:
    updates = lead_data.model_dump(
        exclude_unset=True,
    )

    for key, value in updates.items():
        setattr(lead, key, value)

    db.commit()
    db.refresh(lead)

    return lead


# =========================================================
# DELETE LEAD
# =========================================================

def delete_lead(
    db: Session,
    lead: Lead,
) -> None:
    db.delete(lead)
    db.commit()


# =========================================================
# LEAD STATISTICS
# =========================================================

def get_lead_stats(
    db: Session,
    tenant_id: int,
) -> dict[str, int]:

    total_statement = select(func.count(Lead.id)).where(
        Lead.tenant_id == tenant_id,
    )

    new_statement = select(func.count(Lead.id)).where(
        Lead.tenant_id == tenant_id,
        Lead.status == "new",
    )

    contacted_statement = select(func.count(Lead.id)).where(
        Lead.tenant_id == tenant_id,
        Lead.status == "contacted",
    )

    converted_statement = select(func.count(Lead.id)).where(
        Lead.tenant_id == tenant_id,
        Lead.status == "converted",
    )

    lost_statement = select(func.count(Lead.id)).where(
        Lead.tenant_id == tenant_id,
        Lead.status == "lost",
    )

    return {
        "total": db.scalar(total_statement) or 0,
        "new": db.scalar(new_statement) or 0,
        "contacted": db.scalar(contacted_statement) or 0,
        "converted": db.scalar(converted_statement) or 0,
        "lost": db.scalar(lost_statement) or 0,
    }