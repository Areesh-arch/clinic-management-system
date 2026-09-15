
from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile


BASE_DIR = Path(__file__).resolve().parent.parent.parent


# ============================================================
# PROFILE IMAGES
# ============================================================

PROFILE_UPLOAD_DIR = (
    BASE_DIR
    / "uploads"
    / "profile_images"
)


# ============================================================
# CLINIC IMAGES
# ============================================================

CLINIC_UPLOAD_DIR = (
    BASE_DIR
    / "uploads"
    / "clinic_images"
)


MAX_FILE_SIZE = 10 * 1024 * 1024


ALLOWED_CONTENT_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}


# ============================================================
# SUPER_ADMIN / USER PROFILE IMAGE
# ============================================================

async def save_profile_image(
    upload_file: UploadFile,
    user_id: int,
) -> str:

    content_type = upload_file.content_type

    if content_type not in ALLOWED_CONTENT_TYPES:
        raise ValueError(
            "Only JPG, PNG, and WEBP images are allowed."
        )


    file_content = await upload_file.read()


    if not file_content:
        raise ValueError(
            "The uploaded image is empty."
        )


    if len(file_content) > MAX_FILE_SIZE:
        raise ValueError(
            "Image size must be 10 MB or less."
        )


    user_directory = (
        PROFILE_UPLOAD_DIR
        / str(user_id)
    )


    user_directory.mkdir(
        parents=True,
        exist_ok=True,
    )


    extension = ALLOWED_CONTENT_TYPES[
        content_type
    ]


    filename = (
        f"{uuid4().hex}{extension}"
    )


    file_path = (
        user_directory
        / filename
    )


    file_path.write_bytes(
        file_content
    )


    return (
        f"/uploads/profile_images/"
        f"{user_id}/{filename}"
    )


# ============================================================
# CLINIC / TENANT IMAGE
# ============================================================

async def save_clinic_image(
    upload_file: UploadFile,
    tenant_id: int,
) -> str:

    content_type = upload_file.content_type

    if content_type not in ALLOWED_CONTENT_TYPES:
        raise ValueError(
            "Only JPG, PNG, and WEBP images are allowed."
        )


    file_content = await upload_file.read()


    if not file_content:
        raise ValueError(
            "The uploaded image is empty."
        )


    if len(file_content) > MAX_FILE_SIZE:
        raise ValueError(
            "Image size must be 10 MB or less."
        )


    tenant_directory = (
        CLINIC_UPLOAD_DIR
        / str(tenant_id)
    )


    tenant_directory.mkdir(
        parents=True,
        exist_ok=True,
    )


    extension = ALLOWED_CONTENT_TYPES[
        content_type
    ]


    filename = (
        f"{uuid4().hex}{extension}"
    )


    file_path = (
        tenant_directory
        / filename
    )


    file_path.write_bytes(
        file_content
    )


    return (
        f"/uploads/clinic_images/"
        f"{tenant_id}/{filename}"
    )
