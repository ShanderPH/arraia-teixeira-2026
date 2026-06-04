import uuid

from fastapi import APIRouter, Response, UploadFile, File
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


@router.options("/{dish_id}/photo")
def options_dish_photo(dish_id: uuid.UUID) -> Response:
    return Response(
        status_code=200,
        headers={
            "Access-Control-Allow-Methods": "POST, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "*",
        },
    )


@router.post("/{dish_id}/photo", response_model=DishResponse)
async def upload_dish_photo(dish_id: uuid.UUID, file: UploadFile = File(...)) -> DishResponse:
    client: Client = get_supabase()
    service = DishService(client)
    file_bytes = await file.read()
    content_type = file.content_type or "image/jpeg"
    return service.upload_photo(dish_id, file_bytes, content_type)


@router.delete("/{dish_id}/photo", response_model=DishResponse)
def delete_dish_photo(dish_id: uuid.UUID) -> DishResponse:
    client: Client = get_supabase()
    service = DishService(client)
    return service.delete_photo(dish_id)
