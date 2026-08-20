from pathlib import Path
from uuid import uuid4

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
    Form,
    status,
)
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.api.permissions import require_roles
from app.models.user import User

from app.schemas.treatment_photo import (
    TreatmentPhotoCreate,
    TreatmentPhotoUpdate,
    TreatmentPhotoResponse,
)

from app.services.treatment_photo_service import (
    create_treatment_photo_service,
    create_uploaded_treatment_photo_service,
    get_treatment_photo_service,
    list_treatment_photos_service,
    update_treatment_photo_service,
    delete_treatment_photo_service,
)


router = APIRouter(
    tags=["Treatment Photos"],
)


# =========================================================
# CREATE PHOTO FROM IMAGE UPLOAD
# =========================================================

@router.post(
    "/upload",
    response_model=TreatmentPhotoResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_treatment_photo(
    visit_id: int = Form(...),
    photo_type: str = Form(...),
    caption: str | None = Form(None),
    image: UploadFile = File(...),

    db: Session = Depends(get_db),

    current_user: User = Depends(
        require_roles(
            "owner",
            "staff",
        )
    ),
):
    try:
        return await create_uploaded_treatment_photo_service(
            db=db,
            visit_id=visit_id,
            photo_type=photo_type,
            caption=caption,
            image=image,
            tenant_id=current_user.tenant_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


# =========================================================
# CREATE PHOTO FROM URL
# =========================================================
# Keeping this endpoint is useful for future integrations.

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


# =========================================================
# LIST PHOTOS
# =========================================================

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


# =========================================================
# GET PHOTO
# =========================================================

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
            tenant_id=current_user.tenant_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


# =========================================================
# UPDATE PHOTO
# =========================================================

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
    try:
        photo = get_treatment_photo_service(
            db=db,
            photo_id=photo_id,
            tenant_id=current_user.tenant_id,
        )

        return update_treatment_photo_service(
            db=db,
            photo=photo,
            photo_data=photo_data,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


# =========================================================
# DELETE PHOTO
# =========================================================

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
    try:
        photo = get_treatment_photo_service(
            db=db,
            photo_id=photo_id,
            tenant_id=current_user.tenant_id,
        )

        delete_treatment_photo_service(
            db=db,
            photo=photo,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )