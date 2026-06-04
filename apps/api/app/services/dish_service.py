import uuid

from supabase import Client

from app.repositories.dish_repository import DishRepository
from app.schemas.dish import DishCreate, DishResponse


class DishService:
    BUCKET = "dish-photos"

    def __init__(self, client: Client) -> None:
        self._repo = DishRepository(client)
        self._storage = client.storage

    def list_dishes(self) -> list[DishResponse]:
        dishes = self._repo.get_all()
        counts = self._repo.get_guest_counts()
        return [
            DishResponse(
                **dish,
                guest_count=counts.get(dish["id"], 0),
            )
            for dish in dishes
        ]

    def create_dish(self, payload: DishCreate) -> DishResponse:
        existing = self._repo.get_by_name(payload.name)
        if existing:
            counts = self._repo.get_guest_counts()
            return DishResponse(
                **existing,
                guest_count=counts.get(existing["id"], 0),
            )
        dish = self._repo.create(payload.name)
        return DishResponse(**dish, guest_count=0)

    def get_or_create_by_name(self, name: str) -> dict:
        existing = self._repo.get_by_name(name)
        if existing:
            return existing
        return self._repo.create(name)

    def upload_photo(self, dish_id: uuid.UUID, file_bytes: bytes, content_type: str) -> DishResponse:
        file_name = f"{dish_id}.jpg"
        self._storage.from_(self.BUCKET).upload(
            path=file_name,
            file=file_bytes,
            file_options={"content-type": content_type, "upsert": "true"},
        )
        public_url = self._storage.from_(self.BUCKET).get_public_url(file_name)
        dish = self._repo.update_photo(dish_id, public_url)
        counts = self._repo.get_guest_counts()
        return DishResponse(**dish, guest_count=counts.get(dish["id"], 0))

    def delete_photo(self, dish_id: uuid.UUID) -> DishResponse:
        file_name = f"{dish_id}.jpg"
        self._storage.from_(self.BUCKET).remove([file_name])
        dish = self._repo.update_photo(dish_id, None)
        counts = self._repo.get_guest_counts()
        return DishResponse(**dish, guest_count=counts.get(dish["id"], 0))
