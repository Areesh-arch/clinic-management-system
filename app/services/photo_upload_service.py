from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile


# =========================================================
# CONFIGURATION
# =========================================================

BASE_DIR = Path(__file__).resolve().parent.parent.parent

UPLOAD_DIR = (
    BASE_DIR
    / "uploads"
    / "treatment_photos"
)

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB


ALLOWED_CONTENT_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}


# =========================================================
# UPLOAD PHOTO
# =========================================================

async def save_treatment_photo(
    upload_file: UploadFile,
    tenant_id: int,
) -> str:

    # -----------------------------------------------------
    # Validate content type
    # -----------------------------------------------------

    if upload_file.content_type not in ALLOWED_CONTENT_TYPES:
        raise ValueError(
            "Invalid image type. "
            "Only JPG, PNG and WEBP images are allowed."
        )

    # -----------------------------------------------------
    # Read file
    # -----------------------------------------------------

    file_content = await upload_file.read()

    # -----------------------------------------------------
    # Validate file size
    # -----------------------------------------------------

    if len(file_content) > MAX_FILE_SIZE:
        raise ValueError(
            "Image size must not exceed 5 MB."
        )

    if len(file_content) == 0:
        raise ValueError(
            "The uploaded image is empty."
        )

    # -----------------------------------------------------
    # Create tenant directory
    # -----------------------------------------------------

    tenant_directory = (
        UPLOAD_DIR / str(tenant_id)
    )

    tenant_directory.mkdir(
        parents=True,
        exist_ok=True,
    )

    # -----------------------------------------------------
    # Generate safe filename
    # -----------------------------------------------------

    extension = ALLOWED_CONTENT_TYPES[
        upload_file.content_type
    ]

    filename = (
        f"{uuid4().hex}"
        f"{extension}"
    )

    file_path = (
        tenant_directory
        / filename
    )

    # -----------------------------------------------------
    # Save file
    # -----------------------------------------------------

    file_path.write_bytes(
        file_content
    )

    # -----------------------------------------------------
    # Return URL
    # -----------------------------------------------------

    return (
        f"/uploads/treatment_photos/"
        f"{tenant_id}/"
        f"{filename}"
    )