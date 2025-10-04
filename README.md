# Pathfinder Travel Advisor

Collaborative travel planning platform built for StormHacks 2025. Pathfinder lets travelers describe the vibe of their day, receive curated stop suggestions with Gemini, and visualize the journey on an interactive map backed by Google Maps services.

## Features
- Guided prompt workflow to request food, scenery, and custom detours between major stops.
- Plan history sidebar and info panel aligned with the initial wireframe for quick context switching.
- FastAPI backend prepared for Google Gemini content generation and Google Maps route lookups.
- Containerized React + Nginx frontend and Python backend orchestrated via `docker-compose`.

## Project Structure
```
.
├── backend          # FastAPI application
│   ├── app
│   │   ├── main.py
│   │   ├── schemas.py
│   │   └── services
│   │       ├── gemini.py
│   │       └── maps.py
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .dockerignore
├── frontend         # React + Vite single-page app
│   ├── Dockerfile
│   ├── index.html
│   ├── nginx.conf
│   ├── package.json
│   ├── src
│   │   ├── App.tsx
│   │   └── components
│   └── .dockerignore
├── docker-compose.yml
└── README.md
```

## Local Development

### Backend
1. Create and activate a virtual environment (optional but recommended).
2. Install dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```
3. Start the API server:
   ```bash
   uvicorn app.main:app --reload --app-dir backend/app --host 0.0.0.0 --port 8000
   ```

### Frontend
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start the Vite dev server:
   ```bash
   npm run dev
   ```
3. Visit `http://localhost:5173`. The React client proxies API calls to `http://localhost:8000` when running locally.

## Docker Workflow

Ensure Docker Desktop (or compatible runtime) is running, then from the repository root execute:
```bash
docker-compose up --build
```
This spins up:
- `pathfinder-backend` on `http://localhost:8000`
- `pathfinder-frontend` served by Nginx on `http://localhost:5173`

## Environment Variables

The backend expects Google credentials when you connect real services:
- `GEMINI_API_KEY`
- `GOOGLE_MAPS_API_KEY`

You can export them in your shell before `docker-compose up`, or place them in a `.env` file alongside `docker-compose.yml` (Compose reads it automatically). Without keys, the app falls back to deterministic mock data so the UI remains interactive.

## Next Steps
- Integrate official Google Gemini SDK and replace the mocked `GeminiClient` implementation.
- Swap the mock route hashing with a Google Maps Directions API call and render polylines on the map canvas.
- Persist plans in a database (e.g., Supabase, PostgreSQL) instead of the in-memory cache.
- Wire in authentication for multi-user travel boards.
