import uuid

from supabase import Client

from app.repositories.gallery_repository import GalleryRepository
from app.schemas.gallery import GalleryPhotoResponse, GalleryReorderPayload


class GalleryService:
    BUCKET = "gallery"

    def __init__(self, client: Client) -> None:
        self._repo = GalleryRepository(client)
        self._storage = client.storage

    def list_photos(self) -> list[GalleryPhotoResponse]:
        photos = self._repo.get_all()
        return [GalleryPhotoResponse(**p) for p in photos]

    def upload_photo(self, title: str, file_bytes: bytes, content_type: str) -> GalleryPhotoResponse:
        file_name = f"{uuid.uuid4()}.jpg"
        self._storage.from_(self.BUCKET).upload(
            path=file_name,
            file=file_bytes,
            file_options={"content-type": content_type, "upsert": "false"},
        )
        public_url = self._storage.from_(self.BUCKET).get_public_url(file_name)
        sort_order = self._repo.count()
        photo = self._repo.create(title=title, photo_url=public_url, sort_order=sort_order)
        return GalleryPhotoResponse(**photo)

    def delete_photo(self, photo_id: uuid.UUID) -> None:
        self._repo.delete(photo_id)

    def reorder(self, payload: GalleryReorderPayload) -> None:
        for item in payload.items:
            self._repo.update_sort_order(item.id, item.sort_order)
