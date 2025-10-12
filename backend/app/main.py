from __future__ import annotations

import asyncio

from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware

from .dependencies import get_google_maps_api_key
from .repository import (
    delete_plan as remove_plan,
    get_plan,
    init_db,
    list_plans as fetch_travel_plans,
    save_plan,
    seed_admin,
)
from .schemas import (
    ChatRequest,
    ChatResponse,
    LocationSearchRequest,
    LocationSearchResult,
    MapRoute,
    MultiLegRoute,
    LegPolyline,
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
from .auth.service import CurrentUser

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

# mount auth router under /api to align with frontend proxy
app.include_router(auth_controller.router, prefix="/api")


@app.get("/api/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


def _require_user_id(current_user: CurrentUser) -> str:
    user_id = current_user.user_id
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    return user_id


@app.post("/api/generate-plan", response_model=TravelPlan)
async def generate_plan(request: PromptRequest, current_user: CurrentUser) -> TravelPlan:
    user_id = _require_user_id(current_user)
    plan = await gemini_client.suggest_plan(request.prompt)
    try:
        save_plan(plan, user_id)
    except PermissionError:
        raise HTTPException(status_code=403, detail="You cannot modify this plan") from None
    stored = get_plan(plan.id, user_id)
    if not stored:
        raise HTTPException(status_code=500, detail="Failed to persist plan")
    return stored


@app.post("/api/assistant/chat", response_model=ChatResponse)
async def assistant_chat(request: ChatRequest) -> ChatResponse:
    reply = await gemini_client.chat_reply(request.message, request.context or [])
    return ChatResponse(reply=reply)


@app.get("/api/plans", response_model=SuggestionOptions)
async def list_plans_endpoint(current_user: CurrentUser) -> SuggestionOptions:
    user_id = _require_user_id(current_user)
    return SuggestionOptions(options=fetch_travel_plans(user_id))


@app.put("/api/plan/{plan_id}", response_model=TravelPlan)
async def update_plan(plan_id: str, plan: TravelPlan, current_user: CurrentUser) -> TravelPlan:
    user_id = _require_user_id(current_user)
    if plan.id != plan_id:
        raise HTTPException(status_code=400, detail="Plan ID mismatch")

    try:
        save_plan(plan, user_id)
    except PermissionError:
        raise HTTPException(status_code=403, detail="You cannot modify this plan") from None
    updated = get_plan(plan_id, user_id)
    if not updated:
        raise HTTPException(status_code=500, detail="Failed to persist plan")
    return updated


@app.delete("/api/plan/{plan_id}", status_code=204)
def delete_plan(plan_id: str, current_user: CurrentUser) -> Response:
    user_id = _require_user_id(current_user)
    removed = remove_plan(plan_id, user_id)
    if not removed:
        raise HTTPException(status_code=404, detail="Plan not found")
    return Response(status_code=204)


@app.get("/api/plan/{plan_id}/route", response_model=MapRoute)
async def get_route(plan_id: str, current_user: CurrentUser) -> MapRoute:
    user_id = _require_user_id(current_user)
    plan = get_plan(plan_id, user_id)
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


@app.get("/api/plan/{plan_id}/route-multileg", response_model=MultiLegRoute)
async def get_route_multileg(plan_id: str, current_user: CurrentUser) -> MultiLegRoute:
    user_id = _require_user_id(current_user)
    plan = get_plan(plan_id, user_id)
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")

    stops = plan.stops
    legs: list[LegPolyline] = []
    # For each adjacent pair, request a route and capture its polyline and segments
    for i in range(len(stops) - 1):
        pair = [stops[i], stops[i + 1]]
        polyline = await maps_client.build_route_polyline(pair)
        segments = maps_client.get_last_segments()
        warnings = maps_client.get_last_warnings()
        legs.append(
            LegPolyline(
                from_index=i,
                to_index=i + 1,
                polyline=polyline,
                warnings=warnings,
                segments=segments,
            )
        )

    return MultiLegRoute(plan_id=plan_id, legs=legs)


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
    # Narrow dynamic types before constructing the pydantic model
    lat_obj = result.get("latitude")
    lng_obj = result.get("longitude")
    if not isinstance(lat_obj, (int, float)) or not isinstance(lng_obj, (int, float)):
        raise HTTPException(status_code=500, detail="Invalid location coordinates from maps provider")

    address_val = result.get("address")
    place_id_val = result.get("place_id")
    return LocationSearchResult(
        label=str(result.get("label", "")),
        address=str(address_val) if isinstance(address_val, str) else None,
        place_id=str(place_id_val) if isinstance(place_id_val, str) else None,
        latitude=float(lat_obj),
        longitude=float(lng_obj),
    )


@app.post("/api/tripadvisor", response_model=TripAdvisorResponse)
async def describe_place(request: TripAdvisorRequest) -> TripAdvisorResponse:
    info = await tripadvisor_service.describe_location(request)
    return TripAdvisorResponse(info=info)


@app.post("/api/admin/seed")
def seed_admin_user():
    seed_admin()
    return {"message": "Admin user seeded successfully."}


# Provide compatibility for uvicorn --factory
async def create_app() -> FastAPI:
    await asyncio.sleep(0)
    return app
