from __future__ import annotations

from datetime import datetime
from typing import Iterable, List, Literal, Optional

from pydantic import BaseModel, Field, HttpUrl

# Prompt templates leveraged by assistant, map, and summary flows.
CHATBOT_PROMPT: str = ""
TRIPADVISOR_PROMPT: str = ""
SUMMARY_PROMPT: str = ""


class PlanStop(BaseModel):
    """Lightweight stop used by the legacy travel-plan endpoints."""

    label: str
    description: Optional[str] = None
    place_id: Optional[str] = Field(
        default=None,
        description="Optional place identifier (e.g., Google Place ID)",
    )


class TravelPlan(BaseModel):
    """Simplified plan structure surfaced by the introductory prototype UI."""

    id: str
    title: str
    summary: str
    stops: List[PlanStop]
    created_at: datetime = Field(default_factory=datetime.utcnow)


class PromptRequest(BaseModel):
    """Represents a free-form user prompt for basic plan generation."""

    prompt: str = Field(
        ..., min_length=5, description="Natural language description of the desired itinerary."
    )


class MapRoute(BaseModel):
    """Polyline produced for a stored plan via third-party mapping services."""

    plan_id: str
    polyline: str = Field(..., description="Encoded polyline string returned by the maps provider.")
    warnings: List[str] = Field(default_factory=list)


class SuggestionOptions(BaseModel):
    """Collection of existing plans returned by the lightweight listing endpoint."""

    options: List[TravelPlan]


class Coordinates(BaseModel):
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)


class Place(BaseModel):
    id: str
    name: str
    city: Optional[str] = None
    country: Optional[str] = None
    address: Optional[str] = None
    coordinates: Coordinates
    primary_category: Optional[str] = None
    tags: List[str] = Field(default_factory=list)


class PlaceInfo(Place):
    summary: Optional[str] = None
    nearby_restaurants: List[str] = Field(default_factory=list)
    nearby_hotels: List[str] = Field(default_factory=list)
    nearby_attractions: List[str] = Field(default_factory=list)
    external_url: Optional[HttpUrl] = None
    source: Literal["tripadvisor", "stub"] = "stub"


class PlaceListEntry(BaseModel):
    place: Place
    order_index: int
    added_at: datetime = Field(default_factory=datetime.utcnow)


class PlanPreferences(BaseModel):
    optimization_goal: Literal[
        "scenic",
        "fastest",
        "shortest",
        "foodie",
        "balanced",
    ] = "balanced"
    cuisine_focus: Optional[str] = None
    budget_level: Optional[Literal["budget", "midrange", "premium"]] = None
    mobility_notes: Optional[str] = None
    include_rest_breaks: bool = True


class TripStop(BaseModel):
    order_index: int
    place_id: str
    place: Optional[Place] = None
    arrival_time: Optional[datetime] = None
    departure_time: Optional[datetime] = None
    stay_duration_minutes: Optional[int] = None
    notes: Optional[str] = None


class SegmentLeg(BaseModel):
    from_stop_order: int
    to_stop_order: int
    mode: Literal["train"] = "train"
    carrier: Literal["OpenTripPlanner", "OpenTripPlanner-stub"] = "OpenTripPlanner"
    departure_time: Optional[datetime] = None
    arrival_time: Optional[datetime] = None
    duration_minutes: Optional[int] = None
    distance_km: Optional[float] = None
    eurail_connection_id: Optional[str] = None
    warnings: List[str] = Field(default_factory=list)


class TripPlan(BaseModel):
    id: str
    user_id: str
    title: str
    summary: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    status: Literal["draft", "processing", "ready", "failed"] = "draft"
    stops: List[TripStop] = Field(default_factory=list)
    legs: List[SegmentLeg] = Field(default_factory=list)
    preferences: Optional[PlanPreferences] = None
    total_travel_minutes: Optional[int] = None
    total_distance_km: Optional[float] = None


class TripPlanListResponse(BaseModel):
    items: List[TripPlan]


class TripPlanCreateRequest(BaseModel):
    place_ids: List[str]
    preferences: Optional[PlanPreferences] = None


class TripPlanUpdateRequest(BaseModel):
    title: Optional[str] = None
    preferences: Optional[PlanPreferences] = None
    notes: Optional[str] = None


class PlanGenerationRequest(BaseModel):
    place_ids: List[str]
    preferences: Optional[PlanPreferences] = None


class PlanGenerationResponse(BaseModel):
    plan_id: str
    status: Literal["processing", "ready"]


class PlaceInfoRequest(BaseModel):
    latitude: float
    longitude: float


class PlaceInfoResponse(BaseModel):
    info: PlaceInfo


class PlaceListResponse(BaseModel):
    places: List[PlaceListEntry]


class PlaceOrderUpdate(BaseModel):
    ordered_place_ids: List[str]


class ChatMessage(BaseModel):
    role: Literal["user", "assistant", "system"]
    content: str


class ChatRequest(BaseModel):
    message: str
    context: Optional[List[ChatMessage]] = None


class ChatResponse(BaseModel):
    reply: str
    suggestions: List[str] = Field(default_factory=list)
    updated_context: List[ChatMessage] = Field(default_factory=list)


class TripAdvisorRequest(BaseModel):
    latitude: float
    longitude: float


class TripAdvisorResponse(BaseModel):
    info: PlaceInfo


class PlanReferences(BaseModel):
    user_id: str
    plan_ids: List[str] = Field(default_factory=list)


class HealthResponse(BaseModel):
    status: str


class AIChatbotInterface:
    """Describes interactions for the Gemini-powered chatbot panel."""

    def send_message(self, user_id: str, request: ChatRequest) -> ChatResponse:
        """Send a free-form user prompt to Gemini and return the assistant reply."""

        raise NotImplementedError

    def add_place_from_chat(self, user_id: str, place: Place) -> None:
        """Append a resolved place into the active itinerary based on a chat command."""

        raise NotImplementedError

    def remove_place_from_chat(self, user_id: str, place_id: str) -> None:
        """Remove a place from the user's itinerary when requested in chat."""

        raise NotImplementedError

    def suggest_places(self, user_id: str, city: str) -> List[PlaceInfo]:
        """Fetch assistant-curated suggestions for a target city."""

        raise NotImplementedError


class MapInteractionInterface:
    """Coordinates map exploration, selection, and list management."""

    def search_area(self, query: str) -> Iterable[PlaceInfo]:
        """Return candidate places matching user input within the map viewport."""

        raise NotImplementedError

    def select_pin(self, latitude: float, longitude: float) -> PlaceInfo:
        """Resolve a map pin click into detailed place metadata."""

        raise NotImplementedError

    def add_selected_place(self, user_id: str, place_info: PlaceInfo) -> None:
        """Insert the selected place into the temporary list displayed beside the map."""

        raise NotImplementedError

    def reorder_places(self, user_id: str, ordered_place_ids: List[str]) -> None:
        """Persist a drag-and-drop reordering coming from the map list UI."""

        raise NotImplementedError


class TripAdvisorInterface:
    """Surfaces nearby recommendations using Gemini for narrative context."""

    def describe_location(self, place_info: PlaceInfo) -> str:
        """Generate a user-friendly summary for the location chosen on the map."""

        raise NotImplementedError

    def suggest_nearby_experiences(self, place_info: PlaceInfo) -> List[str]:
        """List experiences adjacent to the selected location."""

        raise NotImplementedError

    def persist_last_viewed(self, user_id: str, place_info: PlaceInfo) -> None:
        """Cache the last TripAdvisor lookup for quick recall."""

        raise NotImplementedError


class TripSummaryInterface:
    """Produces, stores, and retrieves the authoritative trip plan summary."""

    def generate_plan(self, user_id: str, request: PlanGenerationRequest) -> TripPlan:
        """Combine current selections and preferences into a final itinerary."""

        raise NotImplementedError

    def save_plan_snapshot(self, plan: TripPlan) -> None:
        """Persist the generated itinerary into the database for later retrieval."""

        raise NotImplementedError

    def fetch_plan(self, plan_id: str) -> TripPlan:
        """Retrieve a previously generated plan by its identifier."""

        raise NotImplementedError

    def summarize_stops(self, plan: TripPlan) -> List[TripStop]:
        """Return the ordered stops with timing for the summary sidebar component."""

        raise NotImplementedError

    def apply_preferences(self, preferences: PlanPreferences, plan: TripPlan) -> TripPlan:
        """Adjust plan timings and notes based on updated user preferences."""

        raise NotImplementedError


__all__ = [
    "CHATBOT_PROMPT",
    "TRIPADVISOR_PROMPT",
    "SUMMARY_PROMPT",
    "AIChatbotInterface",
    "ChatMessage",
    "ChatRequest",
    "ChatResponse",
    "Coordinates",
    "HealthResponse",
    "MapRoute",
    "MapInteractionInterface",
    "Place",
    "PlaceInfo",
    "PlaceInfoRequest",
    "PlaceInfoResponse",
    "PlaceListEntry",
    "PlaceListResponse",
    "PlaceOrderUpdate",
    "PlanGenerationRequest",
    "PlanGenerationResponse",
    "PlanPreferences",
    "PlanReferences",
    "PlanStop",
    "SegmentLeg",
    "SuggestionOptions",
    "TravelPlan",
    "TripAdvisorRequest",
    "TripAdvisorResponse",
    "TripAdvisorInterface",
    "TripPlan",
    "TripPlanCreateRequest",
    "TripPlanListResponse",
    "TripPlanUpdateRequest",
    "TripSummaryInterface",
    "TripStop",
    "PromptRequest",
]
