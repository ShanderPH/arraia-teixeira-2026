from fastapi import APIRouter
from supabase import Client

from app.core.supabase import get_supabase
from app.schemas.guest import GuestResponse, RSVPCreate
from app.services.guest_service import GuestService

router = APIRouter()


@router.post("", response_model=GuestResponse, status_code=201)
def submit_rsvp(payload: RSVPCreate) -> GuestResponse:
    client: Client = get_supabase()
    service = GuestService(client)
    return service.submit_rsvp(payload)
