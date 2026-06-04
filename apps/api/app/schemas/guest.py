from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, field_validator


class RSVPCreate(BaseModel):
    name: str
    attending: bool
    guest_count: int = 1
    dish_name: str | None = None

    @field_validator("name")
    @classmethod
    def name_must_not_be_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("name must not be blank")
        return v.strip()

    @field_validator("dish_name")
    @classmethod
    def dish_name_strip(cls, v: str | None) -> str | None:
        return v.strip() if v else None

    @field_validator("guest_count")
    @classmethod
    def guest_count_min_one(cls, v: int) -> int:
        if v < 1:
            return 1
        return v


class GuestResponse(BaseModel):
    id: UUID
    name: str
    attending: bool
    guest_count: int = 1
    dish_id: UUID | None
    created_at: datetime
