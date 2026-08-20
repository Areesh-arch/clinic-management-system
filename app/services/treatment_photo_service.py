from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.crud.treatment_photo import (
    create_treatment_photo,
    get_treatment_photo_by_id,
    get_treatment_photos,
    update_treatment_photo,
    delete_treatment_photo,
)

from app.models.treatment_photo import TreatmentPhoto
from app.models.visit import Visit
from app.models.enums import PhotoType

from app.schemas.treatment_photo import (
    TreatmentPhotoCreate,
    TreatmentPhotoUpdate,
)


# =========================================================
# UPLOAD CONFIGURATION
# =========================================================

UPLOAD_DIR = Path("uploads/treatment_photos")

ALLOWED_IMAGE_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


# =========================================================
# CREATE FROM URL
# =========================================================

def create_treatment_photo_service(
    db: Session,
    photo_data: TreatmentPhotoCreate,
    tenant_id: int,
):
    visit = (
        db.query(Visit)
        .filter(
            Visit.id == photo_data.visit_id,
            Visit.tenant_id == tenant_id,
        )
        .first()
    )

    if visit is None:
        raise ValueError("Visit not found.")

    return create_treatment_photo(
        db=db,
        photo_data=photo_data,
        tenant_id=tenant_id,
    )


# =========================================================
# CREATE FROM UPLOADED IMAGE
# =========================================================

async def create_uploaded_treatment_photo_service(
    db: Session,
    visit_id: int,
    photo_type: str,
    caption: str | None,
    image: UploadFile,
    tenant_id: int,
):

    # -----------------------------------------------------
    # Validate visit
    # -----------------------------------------------------

    visit = (
        db.query(Visit)
        .filter(
            Visit.id == visit_id,
            Visit.tenant_id == tenant_id,
        )
        .first()
    )

    if visit is None:
        raise ValueError("Visit not found.")

    # -----------------------------------------------------
    # Normalize photo type
    # -----------------------------------------------------

    normalized_photo_type = photo_type.strip().upper()

    if normalized_photo_type not in {"BEFORE", "AFTER"}:
        raise ValueError(
            "Photo type must be 'before' or 'after'."
        )

    photo_type_enum = PhotoType(
        normalized_photo_type
    )

    # -----------------------------------------------------
    # Validate image type
    # -----------------------------------------------------

    if image.content_type not in ALLOWED_IMAGE_TYPES:
        raise ValueError(
            "Only JPG, PNG, and WEBP images are allowed."
        )

    # -----------------------------------------------------
    # Read file
    # -----------------------------------------------------

    file_content = await image.read()

    # -----------------------------------------------------
    # Validate file size
    # -----------------------------------------------------

    if len(file_content) > MAX_FILE_SIZE:
        raise ValueError(
            "Image size must not exceed 10 MB."
        )

    # -----------------------------------------------------
    # Create upload directory
    # -----------------------------------------------------

    UPLOAD_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    # -----------------------------------------------------
    # Generate unique filename
    # -----------------------------------------------------

    extension = ALLOWED_IMAGE_TYPES[
        image.content_type
    ]

    filename = (
        f"tenant_{tenant_id}_"
        f"visit_{visit_id}_"
        f"{uuid4().hex}"
        f"{extension}"
    )

    file_path = UPLOAD_DIR / filename

    # -----------------------------------------------------
    # Save image
    # -----------------------------------------------------

    with open(file_path, "wb") as file:
        file.write(file_content)

    # -----------------------------------------------------
    # URL stored in database
    # -----------------------------------------------------

    image_url = (
        f"/uploads/treatment_photos/{filename}"
    )

    # -----------------------------------------------------
    # Create database object
    # -----------------------------------------------------

    photo = TreatmentPhoto(
        tenant_id=tenant_id,
        visit_id=visit_id,
        photo_type=photo_type_enum,
        image_url=image_url,
        caption=caption.strip() if caption else None,
    )

    try:
        db.add(photo)
        db.commit()
        db.refresh(photo)

    except Exception:
        db.rollback()

        # Remove uploaded file if database insertion fails
        if file_path.exists():
            file_path.unlink()

        raise

    return photo


# =========================================================
# GET PHOTO
# =========================================================

def get_treatment_photo_service(
    db: Session,
    photo_id: int,
    tenant_id: int,
):

    photo = (
        db.query(TreatmentPhoto)
        .filter(
            TreatmentPhoto.id == photo_id,
            TreatmentPhoto.tenant_id == tenant_id,
        )
        .first()
    )

    if photo is None:
        raise ValueError(
            "Treatment photo not found."
        )

    return photo


# =========================================================
# LIST PHOTOS
# =========================================================

def list_treatment_photos_service(
    db: Session,
    tenant_id: int,
):

    return get_treatment_photos(
        db=db,
        tenant_id=tenant_id,
    )


# =========================================================
# UPDATE PHOTO
# =========================================================

def update_treatment_photo_service(
    db: Session,
    photo: TreatmentPhoto,
    photo_data: TreatmentPhotoUpdate,
):

    return update_treatment_photo(
        db=db,
        photo=photo,
        photo_data=photo_data,
    )


# =========================================================
# DELETE PHOTO
# =========================================================

def delete_treatment_photo_service(
    db: Session,
    photo: TreatmentPhoto,
):

    # Delete physical image if it is a local upload.

    if photo.image_url.startswith(
        "/uploads/treatment_photos/"
    ):

        file_path = Path(
            "." + photo.image_url
        )

        if file_path.exists():
            file_path.unlink()

    delete_treatment_photo(
        db=db,
        photo=photo,
    )