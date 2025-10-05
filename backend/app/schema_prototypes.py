"""Prototype schema definitions for core travel-planning entities.

These classes outline the expected constructor signatures and return types
without providing concrete implementations. They serve as documentation for
how the frontend and services communicate before the real Pydantic models are
wired in.
"""

from __future__ import annotations

from typing import List, Optional


class ChatMessage:
    """Lightweight prototype representing a single conversational turn."""

    def __init__(self, *, role: str, content: str) -> None:
        """Build a message with a speaker role and body text.

        Args:
            role: Either ``"user"`` or ``"assistant"`` indicating the speaker.
            content: Natural language text produced by that speaker.
        """
        ...


class ChatRequest:
    """Prototype payload sent from the client chatbot to the backend."""

    def __init__(self, *, message: str, context: Optional[List[ChatMessage]] = None) -> None:
        """Create a chat request bound to the most recent user prompt.

        Args:
            message: Latest user-entered prompt destined for Gemini.
            context: Optional rolling transcript to give the model continuity.
        """
        ...


class ChatResponse:
    """Prototype response returned by the backend chatbot handler."""

    def __init__(
        self,
        *,
        reply: str,
        suggestions: Optional[List[str]] = None,
        updated_context: Optional[List[ChatMessage]] = None,
    ) -> None:
        """Bundle the assistant reply with follow-up actions.

        Args:
            reply: Natural language text produced by Gemini.
            suggestions: Optional quick-action prompts for the user to tap.
            updated_context: Revised transcript to persist client side.
        """
        ...


class Place:
    """Prototype describing a location the user can visit."""

    def __init__(
        self,
        *,
        place_id: str,
        name: str,
        latitude: float,
        longitude: float,
        address: Optional[str] = None,
        city: Optional[str] = None,
        country: Optional[str] = None,
    ) -> None:
        """Instantiate a canonical place record.

        Args:
            place_id: Stable identifier (e.g., Google Place ID).
            name: Human-readable name for the spot.
            latitude: Geographic latitude in decimal degrees.
            longitude: Geographic longitude in decimal degrees.
            address: Optional formatted street address.
            city: Optional city portion of the address.
            country: Optional country portion of the address.
        """
        ...


class PlaceInfo(Place):
    """Prototype enriched place details shown in map and TripAdvisor panels."""

    def __init__(
        self,
        *,
        place_id: str,
        name: str,
        latitude: float,
        longitude: float,
        address: Optional[str] = None,
        city: Optional[str] = None,
        country: Optional[str] = None,
        summary: Optional[str] = None,
        nearby_restaurants: Optional[List[str]] = None,
        nearby_attractions: Optional[List[str]] = None,
    ) -> None:
        """Extend :class:`Place` with summary copy and nearby highlights.

        Args mirror :class:`Place` with extra narrative fields for UI display.
        """
        ...


class TripStop:
    """Prototype representing a single stop within an itinerary."""

    def __init__(
        self,
        *,
        order_index: int,
        place: Place,
        arrival_time_iso: Optional[str] = None,
        departure_time_iso: Optional[str] = None,
        stay_duration_minutes: Optional[int] = None,
        notes: Optional[str] = None,
    ) -> None:
        """Capture ordering and timing information for a stop.

        Args:
            order_index: Zero-based sequence position in the route.
            place: The location being visited at this stop.
            arrival_time_iso: Optional ISO8601 arrival timestamp for the stop.
            departure_time_iso: Optional ISO8601 departure timestamp.
            stay_duration_minutes: Planned time to spend at this stop.
            notes: Free-form notes or guidance for the traveler.
        """
        ...


class PlanGenerationRequest:
    """Prototype request for producing a full itinerary."""

    def __init__(
        self,
        *,
        place_ids: List[str],
        preferences: Optional['PlanPreferences'] = None,
    ) -> None:
        """Describe which places and preferences should inform plan generation.

        Args:
            place_ids: Ordered sequence referencing places the user selected.
            preferences: Optional high-level tuning options (speed, cuisine, etc.).
        """
        ...


class PlanPreferences:
    """Prototype capturing knobs the user can adjust for itinerary generation."""

    def __init__(
        self,
        *,
        optimization_goal: str,
        cuisine_focus: Optional[str] = None,
        budget_level: Optional[str] = None,
        mobility_notes: Optional[str] = None,
    ) -> None:
        """Store user-specific preferences affecting suggestion tone and routing.

        Args:
            optimization_goal: Desired optimization mode (e.g., ``"scenic"``).
            cuisine_focus: Optional cuisine or diet emphasis.
            budget_level: Optional price sensitivity indicator.
            mobility_notes: Optional notes about accessibility or pacing.
        """
        ...


class TripPlan:
    """Prototype representing the final trip summary shown in the left sidebar."""

    def __init__(
        self,
        *,
        plan_id: str,
        title: str,
        summary: str,
        stops: List[TripStop],
        total_travel_minutes: Optional[int] = None,
        total_distance_km: Optional[float] = None,
    ) -> None:
        """Aggregate the full itinerary output returned by plan generation.

        Args:
            plan_id: Stored identifier for the itinerary.
            title: Human-friendly title for the trip.
            summary: Narrative overview of the route.
            stops: Ordered stops composing the plan.
            total_travel_minutes: Optional sum of travel time between stops.
            total_distance_km: Optional total distance covered.
        """
        ...


class PlanReferences:
    """Prototype linking a user to previously generated plans for history access."""

    def __init__(self, *, user_id: str, plan_ids: Optional[List[str]] = None) -> None:
        """Maintain references to saved plans so the UI can fetch summaries.

        Args:
            user_id: Stable identifier for the traveler.
            plan_ids: Optional ordered list of plan identifiers in recency order.
        """
        ...
