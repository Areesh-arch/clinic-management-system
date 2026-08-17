from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.user import User

from app.services.dashboard_services import get_dashboard_data

# IMPORTANT:
# Replace this import with the dependency you already use
# for getting the authenticated user.
from app.api.dependencies import get_current_user


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get("/")
def dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_dashboard_data(
        db=db,
        tenant_id=current_user.tenant_id,
    )