from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.crud.cms_result import (
    create_cms_result,
    delete_cms_result,
    get_all_cms_results,
    get_cms_result,
    update_cms_result,
)
from app.models.cms_result import CMSResult


# =========================================================
# UPLOAD CONFIGURATION
# =========================================================

UPLOAD_ROOT = Path("uploads/cms_results")

BEFORE_UPLOAD_DIR = UPLOAD_ROOT / "before"
AFTER_UPLOAD_DIR = UPLOAD_ROOT / "after"

ALLOWED_IMAGE_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}

MAX_FILE_SIZE = 10 * 1024 * 1024


# =========================================================
# VALIDATE AND SAVE IMAGE
# =========================================================

async def _save_image(
    image: UploadFile,
    directory: Path,
) -> str:

    if image.content_type not in ALLOWED_IMAGE_TYPES:
        raise ValueError(
            "Only JPG, PNG, and WEBP images are allowed."
        )

    content = await image.read()

    if len(content) > MAX_FILE_SIZE:
        raise ValueError(
            "Image size must not exceed 10 MB."
        )

    directory.mkdir(
        parents=True,
        exist_ok=True,
    )

    extension = ALLOWED_IMAGE_TYPES[
        image.content_type
    ]

    filename = (
        f"{uuid4().hex}"
        f"{extension}"
    )

    file_path = directory / filename

    with open(file_path, "wb") as file:
        file.write(content)

    relative_path = (
        f"/uploads/cms_results/"
        f"{directory.name}/"
        f"{filename}"
    )

    return relative_path


# =========================================================
# DELETE LOCAL IMAGE
# =========================================================

def _delete_image(image_url: str | None) -> None:

    if not image_url:
        return

    if not image_url.startswith(
        "/uploads/cms_results/"
    ):
        return

    file_path = Path(
        "." + image_url
    )

    if file_path.exists():
        file_path.unlink()


# =========================================================
# CREATE RESULT
# =========================================================

async def create_cms_result_service(
    db: Session,
    title: str,
    slug: str,
    description: str | None,
    treatment_name: str | None,
    display_order: int,
    is_active: bool,
    before_image: UploadFile | None,
    after_image: UploadFile | None,
    tenant_id: int,
) -> CMSResult:

    before_image_url = None
    after_image_url = None

    try:

        if before_image is not None:
            before_image_url = await _save_image(
                before_image,
                BEFORE_UPLOAD_DIR,
            )

        if after_image is not None:
            after_image_url = await _save_image(
                after_image,
                AFTER_UPLOAD_DIR,
            )

        return create_cms_result(
            db=db,
            tenant_id=tenant_id,
            title=title,
            slug=slug,
            description=description,
            before_image_url=before_image_url,
            after_image_url=after_image_url,
            treatment_name=treatment_name,
            display_order=display_order,
            is_active=is_active,
        )

    except Exception:

        _delete_image(
            before_image_url
        )

        _delete_image(
            after_image_url
        )

        raise


# =========================================================
# GET RESULT
# =========================================================

def get_cms_result_service(
    db: Session,
    result_id: int,
    tenant_id: int,
) -> CMSResult | None:

    return get_cms_result(
        db=db,
        result_id=result_id,
        tenant_id=tenant_id,
    )


# =========================================================
# GET ALL RESULTS
# =========================================================

def get_cms_results_service(
    db: Session,
    tenant_id: int,
) -> list[CMSResult]:

    return get_all_cms_results(
        db=db,
        tenant_id=tenant_id,
    )


# =========================================================
# UPDATE RESULT
# =========================================================

async def update_cms_result_service(
    db: Session,
    db_result: CMSResult,
    title: str | None,
    slug: str | None,
    description: str | None,
    treatment_name: str | None,
    display_order: int | None,
    is_active: bool | None,
    before_image: UploadFile | None,
    after_image: UploadFile | None,
) -> CMSResult:

    old_before_url = db_result.before_image_url
    old_after_url = db_result.after_image_url

    new_before_url = None
    new_after_url = None

    try:

        if before_image is not None:
            new_before_url = await _save_image(
                before_image,
                BEFORE_UPLOAD_DIR,
            )

        if after_image is not None:
            new_after_url = await _save_image(
                after_image,
                AFTER_UPLOAD_DIR,
            )

        updated_result = update_cms_result(
            db=db,
            db_result=db_result,
            title=title,
            slug=slug,
            description=description,
            before_image_url=new_before_url,
            after_image_url=new_after_url,
            treatment_name=treatment_name,
            display_order=display_order,
            is_active=is_active,
        )

        if new_before_url:
            _delete_image(
                old_before_url
            )

        if new_after_url:
            _delete_image(
                old_after_url
            )

        return updated_result

    except Exception:

        _delete_image(
            new_before_url
        )

        _delete_image(
            new_after_url
        )

        raise


# =========================================================
# DELETE RESULT
# =========================================================

def delete_cms_result_service(
    db: Session,
    db_result: CMSResult,
) -> None:

    _delete_image(
        db_result.before_image_url
    )

    _delete_image(
        db_result.after_image_url
    )

    delete_cms_result(
        db=db,
        db_result=db_result,
    )