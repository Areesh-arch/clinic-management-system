from __future__ import annotations

from collections import Counter

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.api.dependencies import get_current_user
from app.api.permissions import require_roles

from app.models.user import User
from app.models.enums import (
    UserRole,
    SubscriptionStatus,
)
from app.models.tenant import Tenant
from app.models.subscription import Subscription
from app.models.patient import Patient


router = APIRouter(
    prefix="",
    tags=["Platform"],
)


@router.get("/overview")
def get_platform_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.SUPER_ADMIN)
    ),
):
    # ---------------------------------------------------------
    # PLATFORM COUNTS
    # ---------------------------------------------------------

    total_clinics = (
        db.query(func.count(Tenant.id))
        .scalar()
        or 0
    )

    active_subscriptions = (
        db.query(func.count(Subscription.id))
        .filter(
            Subscription.status == SubscriptionStatus.ACTIVE
        )
        .scalar()
        or 0
    )

    total_patients = (
        db.query(func.count(Patient.id))
        .scalar()
        or 0
    )

    # ---------------------------------------------------------
    # SUBSCRIPTION PLAN BREAKDOWN
    # ---------------------------------------------------------

    plan_rows = (
        db.query(
            Subscription.plan,
            func.count(Subscription.id),
        )
        .group_by(Subscription.plan)
        .all()
    )

    subscription_breakdown = {
        plan.value: count
        for plan, count in plan_rows
    }

    # ---------------------------------------------------------
    # SUBSCRIPTION STATUS BREAKDOWN
    # ---------------------------------------------------------

    status_rows = (
        db.query(
            Subscription.status,
            func.count(Subscription.id),
        )
        .group_by(Subscription.status)
        .all()
    )

    subscription_status_breakdown = {
        status.value: count
        for status, count in status_rows
    }

    # ---------------------------------------------------------
    # RECENT CLINICS
    # ---------------------------------------------------------

    recent_tenants = (
        db.query(Tenant)
        .order_by(Tenant.created_at.desc())
        .limit(5)
        .all()
    )

    recent_clinics = []

    for tenant in recent_tenants:
        owner = next(
            (
                user
                for user in tenant.users
                if user.role == UserRole.OWNER
            ),
            None,
        )

        subscription = (
            sorted(
                tenant.subscriptions,
                key=lambda item: item.created_at,
                reverse=True,
            )[0]
            if tenant.subscriptions
            else None
        )

        recent_clinics.append(
            {
                "id": tenant.id,
                "business_name": tenant.business_name,
                "subdomain": tenant.subdomain,
                "status": (
                    tenant.status.value
                    if tenant.status
                    else None
                ),
                "owner_name": (
                    owner.full_name
                    if owner
                    else None
                ),
                "owner_email": (
                    owner.email
                    if owner
                    else None
                ),
                "plan": (
                    subscription.plan.value
                    if subscription
                    else None
                ),
                "subscription_status": (
                    subscription.status.value
                    if subscription
                    else None
                ),
                "created_at": tenant.created_at,
            }
        )

    # ---------------------------------------------------------
    # PLATFORM REVENUE
    # ---------------------------------------------------------
    #
    # There is currently no SaaS subscription price/payment
    # amount in the Subscription model, so do NOT fabricate
    # revenue.
    #
    platform_revenue = None

    # ---------------------------------------------------------
    # RESPONSE
    # ---------------------------------------------------------

    return {
        "stats": {
            "total_clinics": total_clinics,
            "active_subscriptions": active_subscriptions,
            "total_patients": total_patients,
            "platform_revenue": platform_revenue,
        },
        "subscription_breakdown": subscription_breakdown,
        "subscription_status_breakdown": (
            subscription_status_breakdown
        ),
        "recent_clinics": recent_clinics,
    }