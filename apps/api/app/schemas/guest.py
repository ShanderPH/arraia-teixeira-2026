from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, field_validator


class RSVPCreate(BaseModel):
    name: str
    attending: bool
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


class GuestResponse(BaseModel):
    id: UUID
    name: str
    attending: bool
    dish_id: UUID | None
    created_at: datetime
