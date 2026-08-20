from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.api.dependencies import get_current_user

router = APIRouter(prefix="", tags=["Dashboard"])

@router.get("", response_model=dict)
@router.get("/", response_model=dict, include_in_schema=False)
def get_dashboard_data(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    # Return your dashboard stats/data here
    return {"status": "success"}