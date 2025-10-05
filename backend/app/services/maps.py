from __future__ import annotations

import hashlib
import os
from typing import List

from ..schemas import PlanStop


class MapsClient:
    """Placeholder Google Maps gateway."""

    def __init__(self, api_key: str | None = None) -> None:
        # Allow deployments to share the same key value between frontend and backend configs.
        self.api_key = api_key or os.getenv("GOOGLE_MAPS_API_KEY") or os.getenv("VITE_GOOGLE_MAPS_API_KEY")

    async def build_route_polyline(self, stops: List[PlanStop]) -> str:
        # TODO: integrate with googlemaps.Client.directions.
        seed = "|".join(stop.label for stop in stops).encode()
        return hashlib.sha256(seed).hexdigest()


def build_mock_route(stops: List[str]) -> List[PlanStop]:
    return [PlanStop(label=label, description=f"Waypoint suggested for {label}") for label in stops]
