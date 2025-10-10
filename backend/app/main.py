from __future__ import annotations

import asyncio

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .dependencies import get_google_maps_api_key
from .repository import get_plan, init_db, list_plans as fetch_travel_plans, save_plan
from .schemas import (
    ChatRequest,
    ChatResponse,
    LocationSearchRequest,
    LocationSearchResult,
    MapRoute,
    PromptRequest,
    SuggestionOptions,
    TravelPlan,
    TripAdvisorRequest,
    TripAdvisorResponse,
)
from .services.gemini import GeminiClient
from .services.maps import MapsClient
from .services.tripadvisor import TripAdvisorService
from .auth import controller as auth_controller

app = FastAPI(title="Pathfinder API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

gemini_client = GeminiClient()
maps_client = MapsClient(get_google_maps_api_key())
tripadvisor_service = TripAdvisorService(get_google_maps_api_key())

init_db()

# mount auth router
app.include_router(auth_controller.router)


@app.get("/api/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/generate-plan", response_model=TravelPlan)
async def generate_plan(request: PromptRequest) -> TravelPlan:
    plan = await gemini_client.suggest_plan(request.prompt)
    save_plan(plan)
    return plan


@app.post("/api/assistant/chat", response_model=ChatResponse)
async def assistant_chat(request: ChatRequest) -> ChatResponse:
    reply = await gemini_client.chat_reply(request.message, request.context or [])
    return ChatResponse(reply=reply)


@app.get("/api/plans", response_model=SuggestionOptions)
async def list_plans_endpoint() -> SuggestionOptions:
    return SuggestionOptions(options=fetch_travel_plans())


@app.put("/api/plan/{plan_id}", response_model=TravelPlan)
async def update_plan(plan_id: str, plan: TravelPlan) -> TravelPlan:
    if plan.id != plan_id:
        raise HTTPException(status_code=400, detail="Plan ID mismatch")

    save_plan(plan)
    updated = get_plan(plan_id)
    if not updated:
        raise HTTPException(status_code=500, detail="Failed to persist plan")
    return updated


@app.get("/api/plan/{plan_id}/route", response_model=MapRoute)
async def get_route(plan_id: str) -> MapRoute:
    plan = get_plan(plan_id)
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")

    polyline = await maps_client.build_route_polyline(plan.stops)
    segments = maps_client.get_last_segments()
    return MapRoute(
        plan_id=plan_id,
        polyline=polyline,
        warnings=maps_client.get_last_warnings(),
        segments=segments,
    )


@app.get("/api/config/maps-key")
def get_maps_key() -> dict[str, str]:
    api_key = maps_client.api_key
    if not api_key:
        raise HTTPException(status_code=404, detail="Google Maps API key is not configured")
    return {"googleMapsApiKey": api_key}


@app.post("/api/maps/search", response_model=LocationSearchResult)
async def search_map_location(request: LocationSearchRequest) -> LocationSearchResult:
    result = await maps_client.search_location(request.query)
    if not result:
        raise HTTPException(status_code=404, detail="No British Columbia location found for that query")
    return LocationSearchResult(**result)


@app.post("/api/tripadvisor", response_model=TripAdvisorResponse)
async def describe_place(request: TripAdvisorRequest) -> TripAdvisorResponse:
    info = await tripadvisor_service.describe_location(request)
    return TripAdvisorResponse(info=info)


# Provide compatibility for uvicorn --factory
async def create_app() -> FastAPI:
    await asyncio.sleep(0)
    return app
