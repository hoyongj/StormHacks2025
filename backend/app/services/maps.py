from __future__ import annotations

import hashlib
import html
import os
import re
from typing import Dict, Iterable, List, Optional, Tuple

import httpx

from ..schemas import PlanStop, RouteSegment

DIRECTIONS_URL = "https://maps.googleapis.com/maps/api/directions/json"
GEOCODE_URL = "https://maps.googleapis.com/maps/api/geocode/json"


class MapsClient:
    """Google Maps Directions API gateway with graceful fallbacks."""

    def __init__(self, api_key: str | None = None) -> None:
        # Allow deployments to share the same key value between frontend and backend configs.
        self.api_key = (
            api_key
            or os.getenv("GOOGLE_DIRECTIONS_API_KEY")
            or os.getenv("GOOGLE_MAPS_API_KEY")
            or os.getenv("VITE_GOOGLE_MAPS_API_KEY")
        )
        self._last_warnings: List[str] = []
        self._last_payload: Optional[dict] = None
        self._geocode_cache: Dict[str, Tuple[float, float]] = {}

    async def build_route_polyline(self, stops: List[PlanStop]) -> str:
        """Return an encoded polyline for the ordered stops."""

        self._last_warnings = []
        self._last_payload = None

        enriched_stops = await self._ensure_coordinates(stops)

        payload = await self._request_directions(enriched_stops)
        if not payload:
            return self._fallback_polyline(enriched_stops)

        routes = payload.get("routes") or []
        if not routes:
            return self._fallback_polyline(enriched_stops)

        route = routes[0]
        overview = route.get("overview_polyline") or {}
        points = overview.get("points")
        if not points:
            return self._fallback_polyline(enriched_stops)

        warnings = route.get("warnings") or []
        self._last_warnings = [str(item) for item in warnings if item]
        return points

    def get_last_warnings(self) -> List[str]:
        return list(self._last_warnings)

    def get_last_segments(self) -> List[RouteSegment]:
        if not self._last_payload:
            return []

        routes = self._last_payload.get("routes") or []
        if not routes:
            return []

        legs = routes[0].get("legs") or []
        segments: List[RouteSegment] = []
        for index, leg in enumerate(legs):
            duration_text = _safe_text(leg.get("duration", {}).get("text"))
            distance_text = _safe_text(leg.get("distance", {}).get("text"))
            steps = leg.get("steps") or []
            mode, agency, line_name = _extract_mode_details(steps)
            instructions = _summarise_steps(steps)

            segments.append(
                RouteSegment(
                    from_index=index,
                    to_index=index + 1,
                    mode=mode,
                    duration_text=duration_text,
                    distance_text=distance_text,
                    instructions=instructions,
                    agency=agency,
                    line_name=line_name,
                )
            )
        return segments

    async def _ensure_coordinates(self, stops: List[PlanStop]) -> List[PlanStop]:
        if not self.api_key:
            return list(stops)

        enriched: List[PlanStop] = []
        for stop in stops:
            if stop.latitude is not None and stop.longitude is not None:
                enriched.append(stop)
                continue

            cache_key = self._geocode_cache_key(stop)
            coordinates = self._geocode_cache.get(cache_key) if cache_key else None
            if coordinates is None:
                coordinates = await self._geocode_stop(stop)
                if coordinates is not None and cache_key:
                    self._geocode_cache[cache_key] = coordinates

            if coordinates is None:
                enriched.append(stop)
                continue

            enriched.append(
                PlanStop(
                    label=stop.label,
                    description=stop.description,
                    place_id=stop.place_id,
                    latitude=coordinates[0],
                    longitude=coordinates[1],
                )
            )

        return enriched

    async def _request_directions(self, stops: List[PlanStop]) -> Optional[dict]:
        if not self.api_key or len(stops) < 2:
            return None

        origin = self._format_waypoint(stops[0])
        destination = self._format_waypoint(stops[-1])
        waypoints = [self._format_waypoint(stop) for stop in stops[1:-1] if self._format_waypoint(stop)]

        params = {
            "origin": origin,
            "destination": destination,
            "key": self.api_key,
            "mode": "transit",
            "transit_mode": "train",
        }
        if waypoints:
            params["waypoints"] = "|".join(waypoints)

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.get(DIRECTIONS_URL, params=params)
            response.raise_for_status()
            payload = response.json()
        except Exception:
            return None

        if payload.get("status") != "OK":
            return None

        self._last_payload = payload
        return payload

    async def _geocode_stop(self, stop: PlanStop) -> Optional[Tuple[float, float]]:
        if not self.api_key:
            return None

        params: dict[str, str] = {"key": self.api_key}
        if stop.place_id:
            params["place_id"] = stop.place_id
        else:
            address = stop.description or stop.label
            if not address:
                return None
            params["address"] = address

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(GEOCODE_URL, params=params)
            response.raise_for_status()
            payload = response.json()
        except Exception:
            return None

        if payload.get("status") != "OK":
            return None

        results = payload.get("results") or []
        if not results:
            return None

        location = results[0].get("geometry", {}).get("location") or {}
        lat = location.get("lat")
        lng = location.get("lng")
        if isinstance(lat, (int, float)) and isinstance(lng, (int, float)):
            return float(lat), float(lng)
        return None

    def _geocode_cache_key(self, stop: PlanStop) -> str:
        token = stop.place_id or stop.description or stop.label
        return token or ""

    def _format_waypoint(self, stop: PlanStop) -> str:
        if stop.place_id:
            return f"place_id:{stop.place_id}"
        if stop.latitude is not None and stop.longitude is not None:
            return f"{stop.latitude},{stop.longitude}"
        return stop.label

    def _fallback_polyline(self, stops: Iterable[PlanStop]) -> str:
        coordinates = [
            (stop.latitude, stop.longitude)
            for stop in stops
            if stop.latitude is not None and stop.longitude is not None
        ]
        if len(coordinates) >= 2:
            return encode_polyline(coordinates)
        seed = "|".join(stop.label for stop in stops).encode()
        return hashlib.sha256(seed).hexdigest()


def encode_polyline(points: List[tuple[float, float]]) -> str:
    result: List[str] = []
    prev_lat = 0
    prev_lng = 0

    for latitude, longitude in points:
        lat = int(round(latitude * 1e5))
        lng = int(round(longitude * 1e5))

        result.extend(_encode_value(lat - prev_lat))
        result.extend(_encode_value(lng - prev_lng))

        prev_lat = lat
        prev_lng = lng

    return "".join(result)


def _encode_value(value: int) -> List[str]:
    value = value << 1
    if value < 0:
        value = ~value

    chunks: List[str] = []
    while value >= 0x20:
        chunks.append(chr((0x20 | (value & 0x1F)) + 63))
        value >>= 5
    chunks.append(chr(value + 63))
    return chunks


def _safe_text(value: Optional[str]) -> Optional[str]:
    return str(value) if value else None


def _extract_mode_details(steps: List[dict]) -> tuple[str, Optional[str], Optional[str]]:
    if not steps:
        return ("TRANSIT", None, None)

    for step in steps:
        mode = step.get("travel_mode") or "TRANSIT"
        if mode.upper() == "TRANSIT":
            transit = step.get("transit_details") or {}
            line = transit.get("line") or {}
            agency = None
            agencies = line.get("agencies")
            if isinstance(agencies, list) and agencies:
                agency = agencies[0].get("name")
            line_name = line.get("short_name") or line.get("name")
            return (mode.upper(), agency, line_name)
    # fallback to first step mode
    first_mode = steps[0].get("travel_mode", "TRANSIT")
    return (first_mode.upper(), None, None)


def _summarise_steps(steps: List[dict]) -> Optional[str]:
    instructions: List[str] = []
    for step in steps:
        raw = step.get("html_instructions")
        if not raw:
            continue
        text = _strip_html(raw)
        if text:
            instructions.append(text)
    summary = " • ".join(instructions[:3])
    return summary or None


def _strip_html(value: str) -> str:
    cleaned = re.sub(r"<[^>]+>", "", value)
    return html.unescape(cleaned).strip()
