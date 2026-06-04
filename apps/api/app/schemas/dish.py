from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class DishCreate(BaseModel):
    name: str


class DishResponse(BaseModel):
    id: UUID
    name: str
    category: str = "Outros"
    emoji: str = "🍽️"
    photo_url: str | None = None
    created_at: datetime
    guest_count: int = 0
