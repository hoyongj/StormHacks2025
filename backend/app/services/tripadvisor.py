from __future__ import annotations

import random
import uuid
from typing import Dict, List, Optional

from ..schemas import (
    Coordinates,
    PlaceInfo,
    TripAdvisorInterface,
    TripAdvisorRequest,
)


class TripAdvisorService(TripAdvisorInterface):
    """Generates lightweight TripAdvisor-style suggestions."""

    def __init__(self) -> None:
        self._last_viewed: Dict[str, PlaceInfo] = {}

    def describe_location(self, request: TripAdvisorRequest) -> PlaceInfo:
        latitude, longitude = self._resolve_coordinates(request)
        info = PlaceInfo(
            id=request.place_id or f"poi-{uuid.uuid4().hex[:8]}",
            name=request.name,
            city=request.city,
            country=request.country,
            address=request.address,
            coordinates=Coordinates(latitude=latitude, longitude=longitude),
            summary=request.description
            or f"Discover {request.name} in {request.city or 'this area'} and enjoy a tailored experience.",
            nearby_restaurants=self._suggest_category("Restaurant", request.city or request.name, latitude, longitude),
            nearby_hotels=self._suggest_category("Hotel", request.city or request.name, latitude, longitude),
            nearby_attractions=self._build_experiences(request.name, request.city),
            tags=[],
            primary_category="Landmark",
            source="tripadvisor",
        )
        if request.user_id:
            self.persist_last_viewed(request.user_id, info)
        return info

    def suggest_nearby_experiences(self, place_info: PlaceInfo) -> List[str]:
        base = place_info.city or place_info.name
        return [
            f"Walk a few minutes to explore local markets around {base}.",
            f"Check out the artisan shops near {place_info.name}.",
            "Catch a sunset lookout recommended by locals.",
        ]

    def persist_last_viewed(self, user_id: str, place_info: PlaceInfo) -> None:
        self._last_viewed[user_id] = place_info

    def get_last_viewed(self, user_id: str) -> Optional[PlaceInfo]:
        return self._last_viewed.get(user_id)

    def _resolve_coordinates(self, request: TripAdvisorRequest) -> tuple[float, float]:
        if request.latitude is not None and request.longitude is not None:
            return request.latitude, request.longitude
        random.seed(request.name)
        return 48.0 + random.random(), -123.0 + random.random()

    def _suggest_category(
        self, category: str, context: str, latitude: float, longitude: float
    ) -> List[str]:
        random.seed(f"{category}-{context}-{latitude}-{longitude}")
        options = [
            f"{category} {random.randint(101, 199)}",
            f"{context} {category} Lounge",
            f"{category} at {context} Plaza",
        ]
        return options

    def _build_experiences(self, name: str, city: Optional[str]) -> List[str]:
        base = city or name
        return [
            f"Guided tour of {base} cultural highlights",
            f"Scenic photo spots around {name}",
            f"Local bites near {name}",
        ]
