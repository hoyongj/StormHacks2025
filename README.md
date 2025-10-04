# Pathfinder Travel Advisor

Collaborative travel planning platform built for StormHacks 2025. Pathfinder lets travelers describe the vibe of their day, receive curated stop suggestions with Gemini, and visualize the journey on an interactive map backed by Google Maps services.

## Features
- Guided prompt workflow to request food, scenery, and custom detours between major stops.
- Plan history sidebar and info panel aligned with the initial wireframe for quick context switching.
- FastAPI backend prepared for Google Gemini content generation and Google Maps route lookups.
- Live Google Map embed that highlights generated stops once a key is configured.
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

> Tip: Vite reads environment variables prefixed with `VITE_`. Create `frontend/.env.local` with `VITE_GOOGLE_MAPS_API_KEY=...` (or export the variable in your shell) before running the dev server to unlock the interactive Google Map.

## Docker Workflow

Ensure Docker Desktop (or compatible runtime) is running, then from the repository root execute:
```bash
docker-compose up --build
```
This spins up:
- `pathfinder-backend` on `http://localhost:8000`
- `pathfinder-frontend` served by Nginx on `http://localhost:5173`

## Environment Variables

The stack expects Google credentials when you connect real services:
- `GEMINI_API_KEY`
- `GOOGLE_MAPS_API_KEY`
- `VITE_GOOGLE_MAPS_API_KEY`

Copy `.env.example` to `.env` in the project root and replace the placeholder values. The `.env` file is git-ignored and is automatically consumed by Docker Compose:

```bash
cp .env.example .env
# then edit .env to insert your actual keys
```

`VITE_GOOGLE_MAPS_API_KEY` is used at build time by the React app; point it to the same value as `GOOGLE_MAPS_API_KEY` unless you maintain separate public keys. You can also export the variables in your shell if you prefer. Without keys, the app falls back to deterministic mock data so the UI remains interactive, but the Google Map will display an overlay prompting you to add a key.

## Next Steps
- Integrate official Google Gemini SDK and replace the mocked `GeminiClient` implementation.
- Swap the mock route hashing with a Google Maps Directions API call and render polylines on the map canvas.
- Persist plans in a database (e.g., Supabase, PostgreSQL) instead of the in-memory cache.
- Wire in authentication for multi-user travel boards.