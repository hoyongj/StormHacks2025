from __future__ import annotations

import asyncio
from typing import Dict

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .schemas import MapRoute, PromptRequest, SuggestionOptions, TravelPlan
from .services.gemini import GeminiClient
from .services.maps import MapsClient

app = FastAPI(title="Pathfinder API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

gemini_client = GeminiClient()
maps_client = MapsClient()
_plan_store: Dict[str, TravelPlan] = {}


@app.get("/api/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/generate-plan", response_model=TravelPlan)
async def generate_plan(request: PromptRequest) -> TravelPlan:
    plan = await gemini_client.suggest_plan(request.prompt)
    _plan_store[plan.id] = plan
    return plan


@app.get("/api/plans", response_model=SuggestionOptions)
async def list_plans() -> SuggestionOptions:
    return SuggestionOptions(options=list(_plan_store.values()))


@app.get("/api/plan/{plan_id}/route", response_model=MapRoute)
async def get_route(plan_id: str) -> MapRoute:
    plan = _plan_store.get(plan_id)
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")

    polyline = await maps_client.build_route_polyline(plan.stops)
    return MapRoute(plan_id=plan_id, polyline=polyline, warnings=[])


# Provide compatibility for uvicorn --factory
async def create_app() -> FastAPI:
    await asyncio.sleep(0)
    return app
