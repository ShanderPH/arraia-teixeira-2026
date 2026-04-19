from fastapi import APIRouter
from supabase import Client

from app.core.supabase import get_supabase
from app.schemas.dish import DishCreate, DishResponse
from app.services.dish_service import DishService

router = APIRouter()


@router.get("", response_model=list[DishResponse])
def list_dishes() -> list[DishResponse]:
    client: Client = get_supabase()
    service = DishService(client)
    return service.list_dishes()


@router.post("", response_model=DishResponse, status_code=201)
def create_dish(payload: DishCreate) -> DishResponse:
    client: Client = get_supabase()
    service = DishService(client)
    return service.create_dish(payload)
