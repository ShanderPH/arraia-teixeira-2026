from uuid import UUID

from supabase import Client


class DishRepository:
    def __init__(self, client: Client) -> None:
        self._client = client

    def get_all(self) -> list[dict]:
        result = self._client.table("dishes").select("*").order("name").execute()
        return result.data or []

    def get_by_id(self, dish_id: UUID) -> dict | None:
        result = (
            self._client.table("dishes")
            .select("*")
            .eq("id", str(dish_id))
            .maybe_single()
            .execute()
        )
        return result.data

    def get_by_name(self, name: str) -> dict | None:
        result = (
            self._client.table("dishes")
            .select("*")
            .ilike("name", name)
            .maybe_single()
            .execute()
        )
        return result.data

    def create(self, name: str) -> dict:
        result = (
            self._client.table("dishes")
            .insert({"name": name})
            .execute()
        )
        return result.data[0]

    def update_photo(self, dish_id: UUID, photo_url: str | None) -> dict:
        result = (
            self._client.table("dishes")
            .update({"photo_url": photo_url})
            .eq("id", str(dish_id))
            .select()
            .execute()
        )
        return result.data[0]

    def get_guest_counts(self) -> dict[str, int]:
        """Returns a mapping of dish_id -> count of attending guests."""
        result = (
            self._client.table("guests")
            .select("dish_id")
            .eq("attending", True)
            .not_.is_("dish_id", "null")
            .execute()
        )
        counts: dict[str, int] = {}
        for row in result.data or []:
            dish_id = row["dish_id"]
            counts[dish_id] = counts.get(dish_id, 0) + 1
        return counts
