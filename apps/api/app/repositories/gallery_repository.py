from uuid import UUID

from supabase import Client


class GalleryRepository:
    def __init__(self, client: Client) -> None:
        self._client = client

    def get_all(self) -> list[dict]:
        result = (
            self._client.table("gallery_photos")
            .select("*")
            .order("sort_order")
            .execute()
        )
        return result.data or []

    def create(self, title: str, photo_url: str, sort_order: int = 0) -> dict:
        result = (
            self._client.table("gallery_photos")
            .insert({"title": title, "photo_url": photo_url, "sort_order": sort_order})
            .execute()
        )
        return result.data[0]

    def delete(self, photo_id: UUID) -> None:
        self._client.table("gallery_photos").delete().eq("id", str(photo_id)).execute()

    def update_sort_order(self, photo_id: UUID, sort_order: int) -> None:
        (
            self._client.table("gallery_photos")
            .update({"sort_order": sort_order})
            .eq("id", str(photo_id))
            .execute()
        )

    def count(self) -> int:
        result = (
            self._client.table("gallery_photos")
            .select("id", count="exact")
            .execute()
        )
        return result.count or 0
