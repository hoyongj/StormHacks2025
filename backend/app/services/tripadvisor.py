from __future__ import annotations

import os
import random
import uuid
from typing import Dict, List, Optional

import httpx

from ..schemas import Coordinates, PlaceInfo, TripAdvisorInterface, TripAdvisorRequest

PLACES_DETAILS_URL = "https://maps.googleapis.com/maps/api/place/details/json"
PLACES_NEARBY_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"


class TripAdvisorService(TripAdvisorInterface):
    """Google Places powered suggestion service with graceful fallbacks."""

    def __init__(self, api_key: Optional[str] = None) -> None:
        self.api_key = api_key or os.getenv("GOOGLE_PLACES_API_KEY") or os.getenv("GOOGLE_MAPS_API_KEY")
        self._last_viewed: Dict[str, PlaceInfo] = {}

    async def describe_location(self, request: TripAdvisorRequest) -> PlaceInfo:
        if not self.api_key:
            return self._fallback_info(request)

        try:
            details = await self._fetch_place_details(request)
            coord_lat = details.get("lat")
            coord_lng = details.get("lng")

            restaurants = await self._fetch_nearby(coord_lat, coord_lng, "restaurant")
            attractions = await self._fetch_nearby(coord_lat, coord_lng, "tourist_attraction")
            hotels = await self._fetch_nearby(coord_lat, coord_lng, "lodging")

            info = PlaceInfo(
                id=details.get("id") or request.place_id or f"poi-{uuid.uuid4().hex[:8]}",
                name=details.get("name") or request.name,
                city=details.get("city") or request.city,
                country=details.get("country") or request.country,
                address=details.get("address") or request.address,
                coordinates=Coordinates(latitude=coord_lat or 0.0, longitude=coord_lng or 0.0),
                summary=details.get("summary")
                or request.description
                or f"Discover {request.name} and explore the surrounding neighbourhood.",
                nearby_restaurants=restaurants or self._fallback_category("Restaurant", request.name),
                nearby_hotels=hotels or self._fallback_category("Hotel", request.name),
                nearby_attractions=attractions or self._fallback_category("Activity", request.name),
                tags=[],
                primary_category="Landmark",
                source="tripadvisor",
            )
        except Exception:
            info = self._fallback_info(request)

        if request.user_id:
            self.persist_last_viewed(request.user_id, info)
        return info

    def suggest_nearby_experiences(self, place_info: PlaceInfo) -> List[str]:
        base = place_info.city or place_info.name
        return [
            f"Explore local favourites near {base} for authentic tastes.",
            f"Capture the best photo spots around {place_info.name}.",
            "Consider extending the evening with nearby live music venues.",
        ]

    def persist_last_viewed(self, user_id: str, place_info: PlaceInfo) -> None:
        self._last_viewed[user_id] = place_info

    def get_last_viewed(self, user_id: str) -> Optional[PlaceInfo]:
        return self._last_viewed.get(user_id)

    async def _fetch_place_details(self, request: TripAdvisorRequest) -> Dict[str, Optional[str]]:
        if not request.place_id and (request.latitude is None or request.longitude is None):
            return {
                "name": request.name,
                "address": request.address,
                "city": request.city,
                "country": request.country,
                "lat": request.latitude,
                "lng": request.longitude,
            }

        params = {
            "key": self.api_key,
            "place_id": request.place_id,
            "fields": "place_id,name,formatted_address,geometry/location,adr_address,address_components",
        }

        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(PLACES_DETAILS_URL, params=params)
        response.raise_for_status()
        payload = response.json()

        if payload.get("status") != "OK":
            return {
                "name": request.name,
                "address": request.address,
                "city": request.city,
                "country": request.country,
                "lat": request.latitude,
                "lng": request.longitude,
            }

        result = payload.get("result", {})
        geometry = result.get("geometry", {}).get("location", {})
        components = _parse_address_components(result.get("address_components", []))

        return {
            "id": result.get("place_id"),
            "name": result.get("name"),
            "address": result.get("formatted_address") or request.address,
            "city": components.get("locality") or components.get("administrative_area_level_1") or request.city,
            "country": components.get("country") or request.country,
            "lat": geometry.get("lat") or request.latitude,
            "lng": geometry.get("lng") or request.longitude,
            "summary": request.description,
        }

    async def _fetch_nearby(self, latitude: Optional[float], longitude: Optional[float], place_type: str) -> List[str]:
        if latitude is None or longitude is None:
            return []

        def _build_params(radius: int, keyword: Optional[str] = None) -> dict:
            params = {
                "key": self.api_key,
                "location": f"{latitude},{longitude}",
                "radius": radius,
                "type": place_type,
            }
            if keyword:
                params["keyword"] = keyword
            return params

        async def _query(params: dict) -> List[str]:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(PLACES_NEARBY_URL, params=params)
            response.raise_for_status()
            payload = response.json()
            if payload.get("status") != "OK":
                return []
            results = payload.get("results", [])
            names: List[str] = []
            for item in results:
                name = item.get("name")
                if name:
                    names.append(name)
                if len(names) >= 3:
                    break
            return names

        # First attempt: tight radius around the location.
        names = await _query(_build_params(radius=800))
        if names:
            return names

        # For lodging (and other sparse categories) broaden search radius and add keyword hints.
        if place_type == "lodging":
            wider = await _query(_build_params(radius=5000, keyword="hotel"))
            if wider:
                return wider

        # As a last attempt for any category, expand radius moderately.
        if not names:
            names = await _query(_build_params(radius=2500))
        return names

    def _fallback_info(self, request: TripAdvisorRequest) -> PlaceInfo:
        latitude = request.latitude if request.latitude is not None else 48.0 + random.random()
        longitude = request.longitude if request.longitude is not None else -123.0 + random.random()
        return PlaceInfo(
            id=request.place_id or f"fallback-{uuid.uuid4().hex[:8]}",
            name=request.name,
            city=request.city,
            country=request.country,
            address=request.address,
            coordinates=Coordinates(latitude=latitude, longitude=longitude),
            summary=request.description or f"Explore {request.name} and nearby neighbourhood gems.",
            nearby_restaurants=self._fallback_category("Restaurant", request.name),
            nearby_hotels=self._fallback_category("Hotel", request.name),
            nearby_attractions=self._fallback_category("Activity", request.name),
            tags=[],
            primary_category="Landmark",
            source="tripadvisor",
        )

    def _fallback_category(self, category: str, context: str) -> List[str]:
        random.seed(f"{category}-{context}")
        return [
            f"{category} {random.randint(101, 199)}",
            f"{context} {category} Lounge",
            f"{category} at {context} Plaza",
        ]


def _parse_address_components(components: List[dict]) -> Dict[str, str]:
    mapping: Dict[str, str] = {}
    for component in components:
        types = component.get("types", [])
        long_name = component.get("long_name")
        for component_type in types:
            mapping[component_type] = long_name
    return mapping
