from uuid import UUID

from supabase import Client


class GuestRepository:
    def __init__(self, client: Client) -> None:
        self._client = client

    def get_all(self) -> list[dict]:
        result = (
            self._client.table("guests")
            .select("*, dishes(name)")
            .order("created_at", desc=True)
            .execute()
        )
        return result.data or []

    def create(self, name: str, attending: bool, dish_id: UUID | None = None) -> dict:
        payload: dict = {"name": name, "attending": attending}
        if dish_id is not None:
            payload["dish_id"] = str(dish_id)
        result = self._client.table("guests").insert(payload).execute()
        return result.data[0]
