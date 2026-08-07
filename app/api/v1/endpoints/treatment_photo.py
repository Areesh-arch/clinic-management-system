from sqlalchemy.orm import Session

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from app.database.session import get_db

from app.api.permissions import require_roles

from app.models.user import User
from app.models.treatment_photo import TreatmentPhoto

from app.api.dependencies import get_current_user

from app.schemas.treatment_photo import (
    TreatmentPhotoCreate,
    TreatmentPhotoUpdate,
    TreatmentPhotoResponse,
)

from app.services.treatment_photo_service import (
    create_treatment_photo_service,
    get_treatment_photo_service,
    list_treatment_photos_service,
    update_treatment_photo_service,
    delete_treatment_photo_service,
)

router = APIRouter(
    prefix="/treatment-photos",
    tags=["Treatment Photos"],
)


@router.post(
    "/",
    response_model=TreatmentPhotoResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_treatment_photo(
    photo_data: TreatmentPhotoCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            "owner",
            "staff",
        )
    ),
):
    try:
        return create_treatment_photo_service(
            db=db,
            photo_data=photo_data,
            tenant_id=current_user.tenant_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.get(
    "/",
    response_model=list[TreatmentPhotoResponse],
)
def list_treatment_photos(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            "owner",
            "staff",
        )
    ),
):
    return list_treatment_photos_service(
        db=db,
        tenant_id=current_user.tenant_id,
    )


@router.get(
    "/{photo_id}",
    response_model=TreatmentPhotoResponse,
)
def get_treatment_photo(
    photo_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            "owner",
            "staff",
        )
    ),
):
    try:
        return get_treatment_photo_service(
            db=db,
            photo_id=photo_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


@router.put(
    "/{photo_id}",
    response_model=TreatmentPhotoResponse,
)
def update_treatment_photo(
    photo_id: int,
    photo_data: TreatmentPhotoUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            "owner",
            "staff",
        )
    ),
):
    photo = get_treatment_photo_service(
        db=db,
        photo_id=photo_id,
    )

    return update_treatment_photo_service(
        db=db,
        photo=photo,
        photo_data=photo_data,
    )


@router.delete(
    "/{photo_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_treatment_photo(
    photo_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            "owner",
            "staff",
        )
    ),
):
    photo = get_treatment_photo_service(
        db=db,
        photo_id=photo_id,
    )

    delete_treatment_photo_service(
        db=db,
        photo=photo,
    )