from fastapi import APIRouter
from supabase import Client

from app.core.supabase import get_supabase
from app.schemas.guest import GuestResponse
from app.services.guest_service import GuestService

router = APIRouter()


@router.get("", response_model=list[GuestResponse])
def list_guests() -> list[GuestResponse]:
    client: Client = get_supabase()
    service = GuestService(client)
    return service.list_guests()
