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
# REMOVE USER PROFILE IMAGE
# ============================================================

def delete_profile_image(
    image_url: str | None,
    user_id: int,
) -> None:
    """
    Delete the user's profile image from disk.

    Only files inside the user's own profile-image directory
    are allowed to be deleted.
    """

    if not image_url:
        return

    expected_prefix = (
        f"/uploads/profile_images/{user_id}/"
    )

    if not image_url.startswith(expected_prefix):
        return

    relative_path = image_url.lstrip("/")

    file_path = BASE_DIR / relative_path

    user_directory = (
        PROFILE_UPLOAD_DIR
        / str(user_id)
    ).resolve()

    try:
        resolved_file = file_path.resolve()
    except OSError:
        return

    # Security check: make sure the file is really inside
    # this user's profile-image directory.
    try:
        resolved_file.relative_to(user_directory)
    except ValueError:
        return

    if resolved_file.is_file():
        try:
            resolved_file.unlink()
        except OSError:
            # Do not break profile removal if physical file
            # deletion fails.
            pass

    # Remove empty user directory if possible.
    try:
        if (
            user_directory.exists()
            and not any(user_directory.iterdir())
        ):
            user_directory.rmdir()
    except OSError:
        pass


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