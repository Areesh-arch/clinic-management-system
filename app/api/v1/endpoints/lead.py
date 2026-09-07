from urllib.parse import urlparse

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.api.permissions import require_roles
from app.database.session import get_db
from app.models.enums import UserRole
from app.models.tenant import Tenant
from app.models.user import User
from app.schemas.lead import (
    LeadCreate,
    LeadResponse,
    LeadStatsResponse,
    LeadUpdate,
)
from app.services.lead_service import (
    create_lead_service,
    delete_lead_service,
    get_lead_service,
    get_lead_stats_service,
    list_leads_service,
    update_lead_service,
)


router = APIRouter(
    prefix="",
    tags=["CRM / Leads"],
)


def resolve_public_tenant(
    request: Request,
    db: Session,
) -> Tenant:
    """
    Resolve the clinic/tenant for a public website request.

    Production:
        The clinic is identified from the website's domain/origin.

        Example:
            https://glowskin.example.com
            -> glowskin

            https://smiledental.example.com
            -> smiledental

    Local development:
        We can use:
            http://glowskin.localhost:5173
            http://smiledental.localhost:5173

        The first hostname segment becomes the tenant subdomain.
    """

    origin = request.headers.get("origin")

    hostname = None

    if origin:
        try:
            parsed_origin = urlparse(origin)
            hostname = parsed_origin.hostname
        except Exception:
            hostname = None

    # Fallback to Host when Origin is unavailable.
    if not hostname:
        hostname = request.url.hostname

    if not hostname:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unable to determine the clinic website.",
        )

    hostname = hostname.lower().strip().rstrip(".")

    # ---------------------------------------------------------
    # LOCAL DEVELOPMENT
    # ---------------------------------------------------------
    #
    # Examples:
    #   glowskin.localhost
    #   smiledental.localhost
    #   testderma.localhost
    #
    # The first part identifies the tenant.
    #
    if hostname.endswith(".localhost"):
        clinic_subdomain = hostname[: -len(".localhost")].strip(".")

    # ---------------------------------------------------------
    # LOCAL DEVELOPMENT USING 127.0.0.1
    # ---------------------------------------------------------
    #
    # Plain 127.0.0.1 cannot identify a tenant.
    #
    elif hostname in {"localhost", "127.0.0.1", "::1"}:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Clinic could not be identified from localhost. "
                "Open the public website using a clinic hostname, "
                "for example glowskin.localhost:5173."
            ),
        )

    # ---------------------------------------------------------
    # PRODUCTION / SaaS SUBDOMAIN
    # ---------------------------------------------------------
    #
    # Example:
    #   glowskin.yoursaas.com
    #
    # This extracts:
    #   glowskin
    #
    else:
        hostname_parts = hostname.split(".")

        if len(hostname_parts) < 3:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Clinic could not be identified from the website domain.",
            )

        clinic_subdomain = hostname_parts[0]

    if not clinic_subdomain:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Clinic could not be identified from the website domain.",
        )

    tenant = (
        db.query(Tenant)
        .filter(Tenant.subdomain == clinic_subdomain)
        .first()
    )

    if tenant is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Clinic not found for this website.",
        )

    return tenant


# ============================================================
# PUBLIC WEBSITE — CREATE LEAD
# ============================================================

@router.post(
    "/public",
    response_model=LeadResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_public_lead(
    lead: LeadCreate,
    request: Request,
    db: Session = Depends(get_db),
):
    """
    Create a lead from a clinic's public website.

    The tenant is automatically resolved from the website
    domain/origin. The frontend does NOT provide tenant_id
    or a hardcoded clinic subdomain.
    """

    tenant = resolve_public_tenant(
        request=request,
        db=db,
    )

    return create_lead_service(
        db=db,
        lead_data=lead,
        tenant_id=tenant.id,
    )


# ============================================================
# AUTHENTICATED CRM — CREATE
# ============================================================

@router.post(
    "/",
    response_model=LeadResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_lead(
    lead: LeadCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
):
    return create_lead_service(
        db=db,
        lead_data=lead,
        tenant_id=current_user.tenant_id,
    )


# ============================================================
# AUTHENTICATED CRM — LIST
# ============================================================

@router.get(
    "/",
    response_model=list[LeadResponse],
)
def list_leads(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
):
    return list_leads_service(
        db=db,
        tenant_id=current_user.tenant_id,
    )


# ============================================================
# AUTHENTICATED CRM — STATS
# ============================================================

@router.get(
    "/stats",
    response_model=LeadStatsResponse,
)
def lead_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
):
    return get_lead_stats_service(
        db=db,
        tenant_id=current_user.tenant_id,
    )


# ============================================================
# AUTHENTICATED CRM — GET ONE
# ============================================================

@router.get(
    "/{lead_id}",
    response_model=LeadResponse,
)
def get_lead(
    lead_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
):
    lead = get_lead_service(
        db=db,
        lead_id=lead_id,
        tenant_id=current_user.tenant_id,
    )

    if lead is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead not found.",
        )

    return lead


# ============================================================
# AUTHENTICATED CRM — UPDATE
# ============================================================

@router.put(
    "/{lead_id}",
    response_model=LeadResponse,
)
def update_lead(
    lead_id: int,
    lead_data: LeadUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
):
    lead = get_lead_service(
        db=db,
        lead_id=lead_id,
        tenant_id=current_user.tenant_id,
    )

    if lead is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead not found.",
        )

    return update_lead_service(
        db=db,
        lead=lead,
        lead_data=lead_data,
    )


# ============================================================
# AUTHENTICATED CRM — DELETE
# ============================================================

@router.delete(
    "/{lead_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_lead(
    lead_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
):
    lead = get_lead_service(
        db=db,
        lead_id=lead_id,
        tenant_id=current_user.tenant_id,
    )

    if lead is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lead not found.",
        )

    delete_lead_service(
        db=db,
        lead=lead,
    )

    return None