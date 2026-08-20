from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.models.visit import Visit
from app.schemas.visit import (
    VisitCreate,
    VisitResponse,
    VisitUpdate,
)
from app.services.visit_service import (
    create_visit_service,
    delete_visit_service,
    get_visit_service,
    list_visits_service,
    update_visit_service,
)


router = APIRouter()


# =========================================================
# GET ALL VISITS
# =========================================================

@router.get(
    "",
    response_model=list[VisitResponse],
)
@router.get(
    "/",
    response_model=list[VisitResponse],
    include_in_schema=False,
)
def list_visits(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return list_visits_service(
        db=db,
        tenant_id=current_user.tenant_id,
    )


# =========================================================
# GET SINGLE VISIT
# =========================================================

@router.get(
    "/{visit_id}",
    response_model=VisitResponse,
)
def get_visit(
    visit_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    visit = (
        db.query(Visit)
        .filter(
            Visit.id == visit_id,
            Visit.tenant_id == current_user.tenant_id,
        )
        .first()
    )

    if visit is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Visit not found.",
        )

    return get_visit_service(
        db=db,
        visit_id=visit_id,
    )


# =========================================================
# CREATE VISIT
# =========================================================

@router.post(
    "",
    response_model=VisitResponse,
    status_code=status.HTTP_201_CREATED,
)
@router.post(
    "/",
    response_model=VisitResponse,
    status_code=status.HTTP_201_CREATED,
    include_in_schema=False,
)
def create_visit(
    visit: VisitCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return create_visit_service(
            db=db,
            visit_data=visit,
            tenant_id=current_user.tenant_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


# =========================================================
# UPDATE VISIT
# =========================================================

@router.put(
    "/{visit_id}",
    response_model=VisitResponse,
)
def update_visit(
    visit_id: int,
    visit_data: VisitUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    visit = (
        db.query(Visit)
        .filter(
            Visit.id == visit_id,
            Visit.tenant_id == current_user.tenant_id,
        )
        .first()
    )

    if visit is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Visit not found.",
        )

    return update_visit_service(
        db=db,
        visit=visit,
        visit_data=visit_data,
    )


# =========================================================
# DELETE VISIT
# =========================================================

@router.delete(
    "/{visit_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_visit(
    visit_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    visit = (
        db.query(Visit)
        .filter(
            Visit.id == visit_id,
            Visit.tenant_id == current_user.tenant_id,
        )
        .first()
    )

    if visit is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Visit not found.",
        )

    delete_visit_service(
        db=db,
        visit=visit,
    )

    return None