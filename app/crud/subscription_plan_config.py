from sqlalchemy.orm import Session

from app.models.enums import SubscriptionPlan
from app.models.subscription_plan_config import (
    SubscriptionPlanConfig,
)
from app.schemas.subscription_plan_config import (
    SubscriptionPlanConfigUpdate,
)


def get_plan_configs(
    db: Session,
) -> list[SubscriptionPlanConfig]:
    return (
        db.query(SubscriptionPlanConfig)
        .order_by(SubscriptionPlanConfig.id)
        .all()
    )


def get_plan_config(
    db: Session,
    plan: SubscriptionPlan,
) -> SubscriptionPlanConfig | None:
    return (
        db.query(SubscriptionPlanConfig)
        .filter(
            SubscriptionPlanConfig.plan == plan
        )
        .first()
    )


def update_plan_config(
    db: Session,
    config: SubscriptionPlanConfig,
    data: SubscriptionPlanConfigUpdate,
) -> SubscriptionPlanConfig:

    update_data = data.model_dump(
        exclude_unset=True,
    )

    for key, value in update_data.items():
        setattr(
            config,
            key,
            value,
        )

    db.commit()
    db.refresh(config)

    return config