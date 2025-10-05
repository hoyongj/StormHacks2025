from __future__ import annotations

from typing import Iterable, List, Optional

from .schemas import *


class AIChatbotInterface:
    """Describes interactions for the Gemini-powered chatbot panel."""

    def send_message(self, user_id: str, request: ChatRequest) -> ChatResponse:
        """Send a free-form user prompt to Gemini and return the assistant reply.

        Args:
            user_id: Stable identifier for the authenticated user.
            request: Structured payload containing the latest message and optional context history.

        Returns:
            ChatResponse: Assistant reply, follow-up suggestions, and refreshed context.
        """
        raise NotImplementedError

    def add_place_from_chat(self, user_id: str, place: Place) -> None:
        """Append a resolved place into the active itinerary based on a chat command.

        Args:
            user_id: Stable identifier for the authenticated user.
            place: Place entity selected or inferred by the assistant.
        """
        raise NotImplementedError

    def remove_place_from_chat(self, user_id: str, place_id: str) -> None:
        """Remove a place from the user's itinerary when requested in chat.

        Args:
            user_id: Stable identifier for the authenticated user.
            place_id: Identifier of the place in the itinerary to remove.
        """
        raise NotImplementedError

    def suggest_places(self, user_id: str, city: str) -> List[PlaceInfo]:
        """Fetch assistant-curated suggestions for a target city.

        Args:
            user_id: Stable identifier for the authenticated user.
            city: City or region that the user wants recommendations for.

        Returns:
            List[PlaceInfo]: Ranked list of places the assistant recommends adding.
        """
        raise NotImplementedError


class MapInteractionInterface:
    """Coordinates map exploration, selection, and list management."""

    def search_area(self, query: str) -> Iterable[PlaceInfo]:
        """Return candidate places matching user input within the map viewport.

        Args:
            query: Free-form text describing the desired place.

        Returns:
            Iterable[PlaceInfo]: Stream of matching places with coordinates.
        """
        raise NotImplementedError

    def select_pin(self, latitude: float, longitude: float) -> PlaceInfo:
        """Resolve a map pin click into detailed place metadata.

        Args:
            latitude: Latitude of the selected pin.
            longitude: Longitude of the selected pin.

        Returns:
            PlaceInfo: Enriched information about the selected location.
        """
        raise NotImplementedError

    def add_selected_place(self, user_id: str, place_info: PlaceInfo) -> None:
        """Insert the selected place into the temporary list displayed beside the map.

        Args:
            user_id: Stable identifier for the authenticated user.
            place_info: Place data returned from `select_pin` or search results.
        """
        raise NotImplementedError

    def reorder_places(self, user_id: str, ordered_place_ids: List[str]) -> None:
        """Persist a drag-and-drop reordering coming from the map list UI.

        Args:
            user_id: Stable identifier for the authenticated user.
            ordered_place_ids: New sequence of place identifiers representing the desired order.
        """
        raise NotImplementedError


class TripAdvisorInterface:
    """Surfaces nearby recommendations using Gemini for narrative context."""

    def describe_location(self, place_info: PlaceInfo) -> str:
        """Generate a user-friendly summary for the location chosen on the map.

        Args:
            place_info: Enriched details about the selected place, including name and address.

        Returns:
            str: Markdown-safe narrative describing what to expect at the location.
        """
        raise NotImplementedError

    def suggest_nearby_experiences(self, place_info: PlaceInfo) -> List[str]:
        """List experiences (restaurants, sights, events) adjacent to the selected location.

        Args:
            place_info: Base place data that the user interacted with in the map component.

        Returns:
            List[str]: Human-readable bullet points recommending nearby activities.
        """
        raise NotImplementedError

    def persist_last_viewed(self, user_id: str, place_info: PlaceInfo) -> None:
        """Cache the last TripAdvisor lookup for quick recall if the user revisits it.

        Args:
            user_id: Stable identifier for the authenticated user.
            place_info: Location data that was most recently displayed to the user.
        """
        raise NotImplementedError


class TripSummaryInterface:
    """Produces, stores, and retrieves the authoritative trip plan summary."""

    def generate_plan(self, user_id: str, request: PlanGenerationRequest) -> TripPlan:
        """Combine current selections and preferences into a final itinerary.

        Args:
            user_id: Stable identifier for the authenticated user.
            request: Payload containing ordered place identifiers and optional preferences.

        Returns:
            TripPlan: Complete plan with stops, legs, and summary copy.
        """
        raise NotImplementedError

    def save_plan_snapshot(self, plan: TripPlan) -> None:
        """Persist the generated itinerary into the database for later retrieval.

        Args:
            plan: Fully materialized trip plan that should be saved.
        """
        raise NotImplementedError

    def fetch_plan(self, plan_id: str) -> TripPlan:
        """Retrieve a previously generated plan by its identifier.

        Args:
            plan_id: Unique identifier for the trip plan record.

        Returns:
            TripPlan: Stored plan including stops, legs, and summary data.
        """
        raise NotImplementedError

    def summarize_stops(self, plan: TripPlan) -> List[TripStop]:
        """Return the ordered stops with timing for the summary sidebar component.

        Args:
            plan: Trip plan whose stops should be formatted for display.

        Returns:
            List[TripStop]: Ordered list containing arrival / departure details per stop.
        """
        raise NotImplementedError

    def apply_preferences(self, preferences: PlanPreferences, plan: TripPlan) -> TripPlan:
        """Adjust plan timings and notes based on updated user preferences.

        Args:
            preferences: Preference settings such as optimization goal or cuisine focus.
            plan: Existing plan to adjust in memory before saving.

        Returns:
            TripPlan: Modified plan reflecting the new preferences.
        """
        raise NotImplementedError
