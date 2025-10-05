from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class PlanStop(BaseModel):
    label: str
    description: Optional[str] = None
    place_id: Optional[str] = Field(
        default=None,
        description="Optional Google Place ID for mapping the stop.",
        alias="placeId",
    )
    latitude: Optional[float] = Field(default=None, alias="latitude")
    longitude: Optional[float] = Field(default=None, alias="longitude")

    class Config:
        allow_population_by_field_name = True


class TravelPlan(BaseModel):
    id: str
    title: str
    summary: str
    stops: List[PlanStop]
    created_at: datetime = Field(default_factory=datetime.utcnow, alias="createdAt")

    class Config:
        allow_population_by_field_name = True


class PromptRequest(BaseModel):
    prompt: str = Field(
        ..., min_length=5, description="Natural language description of the desired outing."
    )


class MapRoute(BaseModel):
    plan_id: str
    polyline: str = Field(
        ..., description="Encoded polyline string returned by Google Directions API."
    )
    warnings: List[str] = Field(default_factory=list)


class SuggestionOptions(BaseModel):
    options: List[TravelPlan]
