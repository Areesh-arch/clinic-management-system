from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.api.dependencies import get_current_user

from app.models.user import User
from app.models.visit import Visit

from app.schemas.visit import (
    VisitCreate,
    VisitUpdate,
    VisitResponse,
)

from app.services.visit_service import (
    create_visit_service,
    get_visit_service,
    list_visits_service,
    update_visit_service,
    delete_visit_service,
)

router = APIRouter(
    prefix="/visits",
    tags=["Visits"],
)


@router.post(
    "/",
    response_model=VisitResponse,
    status_code=status.HTTP_201_CREATED,
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
            status_code=400,
            detail=str(e),
        )


@router.get(
    "/",
    response_model=list[VisitResponse],
)
def list_visits(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return list_visits_service(
        db=db,
        tenant_id=current_user.tenant_id,
    )


@router.get(
    "/{visit_id}",
    response_model=VisitResponse,
)
def get_visit(
    visit_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return get_visit_service(
            db=db,
            visit_id=visit_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )


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
    visit = get_visit_service(
        db=db,
        visit_id=visit_id,
    )

    return update_visit_service(
        db=db,
        visit=visit,
        visit_data=visit_data,
    )


@router.delete(
    "/{visit_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_visit(
    visit_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    visit = get_visit_service(
        db=db,
        visit_id=visit_id,
    )

    delete_visit_service(
        db=db,
        visit=visit,
    )

    return None