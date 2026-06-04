from uuid import UUID

from supabase import Client

from app.repositories.guest_repository import GuestRepository
from app.schemas.guest import GuestResponse, RSVPCreate
from app.services.dish_service import DishService


class GuestService:
    def __init__(self, client: Client) -> None:
        self._repo = GuestRepository(client)
        self._dish_service = DishService(client)

    def submit_rsvp(self, payload: RSVPCreate) -> GuestResponse:
        dish_id: UUID | None = None

        if payload.attending and payload.dish_name:
            dish = self._dish_service.get_or_create_by_name(payload.dish_name)
            dish_id = UUID(dish["id"])

        guest = self._repo.create(
            name=payload.name,
            attending=payload.attending,
            guest_count=payload.guest_count,
            dish_id=dish_id,
        )
        return GuestResponse(**guest)

    def delete_guest(self, guest_id: UUID) -> None:
        self._repo.delete(guest_id)

    def list_guests(self) -> list[GuestResponse]:
        guests = self._repo.get_all()
        return [GuestResponse(**g) for g in guests]
