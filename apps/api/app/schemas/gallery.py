from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class GalleryPhotoResponse(BaseModel):
    id: UUID
    title: str
    photo_url: str
    sort_order: int = 0
    created_at: datetime


class GalleryReorderItem(BaseModel):
    id: UUID
    sort_order: int


class GalleryReorderPayload(BaseModel):
    items: list[GalleryReorderItem]
