from __future__ import annotations

import os
from typing import List

from ..schemas import PlanStop


class MapsClient:
    """Placeholder Google Maps gateway."""

    def __init__(self, api_key: str | None = None) -> None:
        # Allow deployments to share the same key value between frontend and backend configs.
        self.api_key = api_key or os.getenv("GOOGLE_MAPS_API_KEY") or os.getenv("VITE_GOOGLE_MAPS_API_KEY")

    async def build_route_polyline(self, stops: List[PlanStop]) -> str:
        coordinates = [
            (stop.latitude, stop.longitude)
            for stop in stops
            if stop.latitude is not None and stop.longitude is not None
        ]

        if len(coordinates) >= 2:
            return encode_polyline(coordinates)

        # TODO: integrate with googlemaps.Client.directions when API access is available.
        return ""


def build_mock_route(stops: List[str]) -> List[PlanStop]:
    return [PlanStop(label=label, description=f"Waypoint suggested for {label}") for label in stops]


def encode_polyline(points: List[tuple[float, float]]) -> str:
    """Encode a sequence of latitude/longitude pairs into a Google polyline string."""

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
