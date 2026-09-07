from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status

from app.api.permissions import require_roles
from app.api.tenant_context import get_effective_tenant_id
from app.models.enums import UserRole
from app.services.cms_image_upload_service import save_cms_image


router = APIRouter()


@router.post("/", status_code=status.HTTP_201_CREATED)
async def upload_cms_image(
    image: UploadFile = File(...),
    tenant_id: int = Depends(get_effective_tenant_id),
    current_user=Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
):
    try:
        image_url = await save_cms_image(
            upload_file=image,
            tenant_id=tenant_id,
        )

        return {
            "image_url": image_url,
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )