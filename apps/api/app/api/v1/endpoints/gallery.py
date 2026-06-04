import uuid

from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from supabase import Client

from app.core.supabase import get_supabase
from app.schemas.gallery import GalleryPhotoResponse, GalleryReorderPayload
from app.services.gallery_service import GalleryService

router = APIRouter()


@router.get("", response_model=list[GalleryPhotoResponse])
def list_gallery() -> list[GalleryPhotoResponse]:
    client: Client = get_supabase()
    service = GalleryService(client)
    return service.list_photos()


@router.post("", response_model=GalleryPhotoResponse, status_code=201)
async def upload_gallery_photo(
    title: str = Form(...),
    file: UploadFile = File(...),
) -> GalleryPhotoResponse:
    client: Client = get_supabase()
    service = GalleryService(client)
    file_bytes = await file.read()
    content_type = file.content_type or "image/jpeg"
    return service.upload_photo(title=title, file_bytes=file_bytes, content_type=content_type)


@router.delete("/{photo_id}", status_code=204)
def delete_gallery_photo(photo_id: uuid.UUID) -> None:
    client: Client = get_supabase()
    service = GalleryService(client)
    service.delete_photo(photo_id)


@router.patch("/reorder", status_code=204)
def reorder_gallery(payload: GalleryReorderPayload) -> None:
    client: Client = get_supabase()
    service = GalleryService(client)
    service.reorder(payload)
