from __future__ import annotations

import asyncio
import logging
import os
import uuid
from typing import List, Sequence

try:
    import google.generativeai as genai
except ImportError:  # pragma: no cover - optional dependency for air-gapped tests
    genai = None  # type: ignore

from ..schemas import ChatMessage, PlanStop, TravelPlan

LOGGER = logging.getLogger(__name__)


DEFAULT_MODEL_CANDIDATES = [
    os.getenv("GEMINI_MODEL_NAME"),
    "gemini-2.5-flash-lite",
    "gemini-2.5-flash",
    "gemini-pro",
]


class GeminiClient:
    """Lightweight Gemini wrapper with graceful fallbacks when not configured."""

    def __init__(self, api_key: str | None = None, model_candidates: Sequence[str] | None = None) -> None:
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        self._model_name: str | None = None
        self._model = self._initialise_model(model_candidates)

    def _initialise_model(self, model_candidates: Sequence[str] | None):
        if not self.api_key:
            LOGGER.warning("Gemini API key is not configured; falling back to deterministic replies.")
            return None

        if genai is None:
            LOGGER.warning(
                "google-generativeai package is not installed; install it to enable live Gemini calls."
            )
            return None

        genai.configure(api_key=self.api_key)

        candidates = [candidate for candidate in (model_candidates or DEFAULT_MODEL_CANDIDATES) if candidate]
        for candidate in candidates:
            try:
                model = genai.GenerativeModel(candidate)
                # Probe with minimal generateContent call to confirm availability.
                model.generate_content("Ping", safety_settings=None)
                self._model_name = candidate
                LOGGER.info("Gemini model initialised: %s", candidate)
                return model
            except Exception as error:  # pragma: no cover - network/service failures
                LOGGER.warning("Gemini model '%s' unavailable: %s", candidate, error)

        LOGGER.error("No Gemini model could be initialised; falling back to deterministic replies.")
        return None

    async def suggest_plan(self, prompt: str) -> TravelPlan:
        # Until Gemini itinerary generation is wired, reuse the deterministic stub.
        synthetic_id = f"plan-{uuid.uuid4().hex[:8]}"
        stops = _derive_stops_from_prompt(prompt)
        summary = (
            "Customized route generated from prompt. Replace with Gemini response when integrated."
        )
        return TravelPlan(
            id=synthetic_id,
            title=_title_from_prompt(prompt),
            summary=summary,
            stops=[PlanStop(label=stop, description=f"Suggested stop: {stop}") for stop in stops],
        )

    async def chat_reply(self, message: str, context: Sequence[ChatMessage] | None = None) -> str:
        if self._model:
            try:
                return await self._generate_with_gemini(message, context)
            except Exception as error:  # pragma: no cover - guardrail for runtime failures
                LOGGER.error("Gemini request failed: %s", error, exc_info=True)

        return _fallback_reply(message, context)

    async def _generate_with_gemini(
        self, message: str, context: Sequence[ChatMessage] | None = None
    ) -> str:
        assert self._model is not None  # for type checkers

        def _build_prompt() -> str:
            lines: List[str] = [
                "You are a travel planner that returns concise suggestions in bullet form.",
                "Incorporate the user's interests and avoid repeating the same stops unless requested.",
            ]
            if context:
                lines.append("Recent conversation:")
                for item in context[-6:]:
                    prefix = "Traveler" if item.role == "user" else "Assistant"
                    lines.append(f"{prefix}: {item.content}")
            lines.append("Traveler question:")
            lines.append(message)
            lines.append(
                "Respond with 2-4 bullet points plus a short closing sentence suggesting a follow-up prompt."
            )
            return "\n".join(lines)

        prompt_text = _build_prompt()

        loop = asyncio.get_running_loop()

        response = await loop.run_in_executor(
            None,
            lambda: self._model.generate_content(prompt_text, safety_settings=None),
        )

        if hasattr(response, "text") and response.text:
            return response.text.strip()

        if getattr(response, "candidates", None):
            for candidate in response.candidates:
                if candidate.content.parts:
                    return "\n".join(part.text for part in candidate.content.parts if getattr(part, "text", "")).strip()

        raise RuntimeError("Gemini returned an empty response")


def _derive_stops_from_prompt(prompt: str) -> List[str]:
    keywords = [token.strip().title() for token in prompt.split(',') if token.strip()]
    if not keywords:
        keywords = [prompt.title()]

    if len(keywords) < 3:
        keywords.extend(["Local Cafe", "Scenic Overlook"])
    return keywords[:5]


def _title_from_prompt(prompt: str) -> str:
    cleaned = prompt.strip().split('.')[0]
    return cleaned[:40].title() if cleaned else "Custom Adventure"


def _fallback_reply(message: str, context: Sequence[ChatMessage] | None = None) -> str:
    topics = _derive_stops_from_prompt(message)
    intro = "Here are a few ideas to explore next:"
    bullets = "\n".join(f"- {topic}" for topic in topics)

    if context:
        last_locations = [entry.content for entry in context if entry.role == "assistant"]
        if last_locations:
            intro = "Building on what we've discussed, here are more ideas:"

    closing = (
        "\n\nAsk again if you'd like me to focus on coffee shops, nature spots, or nightlife!"
    )

    return f"{intro}\n{bullets}{closing}"
