from fastapi import APIRouter

from app.api.v1.endpoints import dishes, gallery, guests, rsvp

router = APIRouter(prefix="/v1")

router.include_router(rsvp.router, prefix="/rsvp", tags=["rsvp"])
router.include_router(dishes.router, prefix="/dishes", tags=["dishes"])
router.include_router(guests.router, prefix="/guests", tags=["guests"])
router.include_router(gallery.router, prefix="/gallery", tags=["gallery"])
