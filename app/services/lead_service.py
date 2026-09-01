from sqlalchemy.orm import Session

from app.crud.lead import (
    create_lead,
    delete_lead,
    get_lead_by_id,
    get_leads,
    get_lead_stats,
    update_lead,
)
from app.models.lead import Lead
from app.schemas.lead import (
    LeadCreate,
    LeadUpdate,
)


# =========================================================
# CREATE LEAD
# =========================================================

def create_lead_service(
    db: Session,
    lead_data: LeadCreate,
    tenant_id: int,
) -> Lead:

    return create_lead(
        db=db,
        lead_data=lead_data,
        tenant_id=tenant_id,
    )


# =========================================================
# GET LEAD
# =========================================================

def get_lead_service(
    db: Session,
    lead_id: int,
    tenant_id: int,
) -> Lead | None:

    return get_lead_by_id(
        db=db,
        lead_id=lead_id,
        tenant_id=tenant_id,
    )


# =========================================================
# LIST LEADS
# =========================================================

def list_leads_service(
    db: Session,
    tenant_id: int,
) -> list[Lead]:

    return get_leads(
        db=db,
        tenant_id=tenant_id,
    )


# =========================================================
# UPDATE LEAD
# =========================================================

def update_lead_service(
    db: Session,
    lead: Lead,
    lead_data: LeadUpdate,
) -> Lead:

    return update_lead(
        db=db,
        lead=lead,
        lead_data=lead_data,
    )


# =========================================================
# DELETE LEAD
# =========================================================

def delete_lead_service(
    db: Session,
    lead: Lead,
) -> None:

    delete_lead(
        db=db,
        lead=lead,
    )


# =========================================================
# LEAD STATISTICS
# =========================================================

def get_lead_stats_service(
    db: Session,
    tenant_id: int,
) -> dict[str, int]:

    return get_lead_stats(
        db=db,
        tenant_id=tenant_id,
    )