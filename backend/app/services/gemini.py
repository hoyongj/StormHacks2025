from __future__ import annotations

import os
import uuid
from typing import List

from ..schemas import PlanStop, TravelPlan


class GeminiClient:
    """Placeholder client; swap with real Google Gemini SDK when available."""

    def __init__(self, api_key: str | None = None) -> None:
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")

    async def suggest_plan(self, prompt: str) -> TravelPlan:
        # Until Gemini SDK is wired, return a deterministic stub so the UI flows.
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

