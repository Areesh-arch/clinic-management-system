from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class CMSBlogCreate(BaseModel):
    title: str = Field(
        ...,
        min_length=2,
        max_length=255,
    )

    slug: str = Field(
        ...,
        min_length=2,
        max_length=255,
    )

    excerpt: str | None = Field(
        default=None,
        max_length=500,
    )

    content: str | None = None

    featured_image_url: str | None = Field(
        default=None,
        max_length=500,
    )

    author_name: str | None = Field(
        default=None,
        max_length=255,
    )

    category: str | None = Field(
        default=None,
        max_length=100,
    )

    display_order: int = Field(
        default=0,
        ge=0,
    )

    is_published: bool = False

    published_at: datetime | None = None


class CMSBlogUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=2,
        max_length=255,
    )

    slug: str | None = Field(
        default=None,
        min_length=2,
        max_length=255,
    )

    excerpt: str | None = Field(
        default=None,
        max_length=500,
    )

    content: str | None = None

    featured_image_url: str | None = Field(
        default=None,
        max_length=500,
    )

    author_name: str | None = Field(
        default=None,
        max_length=255,
    )

    category: str | None = Field(
        default=None,
        max_length=100,
    )

    display_order: int | None = Field(
        default=None,
        ge=0,
    )

    is_published: bool | None = None

    published_at: datetime | None = None


class CMSBlogResponse(BaseModel):
    id: int
    tenant_id: int

    title: str
    slug: str
    excerpt: str | None
    content: str | None

    featured_image_url: str | None
    author_name: str | None
    category: str | None

    display_order: int
    is_published: bool
    published_at: datetime | None

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )