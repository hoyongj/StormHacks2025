from __future__ import annotations

import os
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[2]
FRONTEND_DIR = REPO_ROOT / "frontend"


def get_google_maps_api_key() -> str | None:
    """Return whichever Google Maps key is configured."""

    key = os.getenv("GOOGLE_MAPS_API_KEY")
    if key:
        return key

    key = os.getenv("VITE_GOOGLE_MAPS_API_KEY")
    if key:
        return key

    key_path = os.getenv("GOOGLE_MAPS_API_KEY_FILE")
    if key_path and os.path.exists(key_path):
        with open(key_path, "r", encoding="utf-8") as file:
            value = file.read().strip()
        if value:
            return value

    for filename in (".env.local", ".env"):
        candidate = FRONTEND_DIR / filename
        if candidate.exists():
            value = _read_key_from_env_file(candidate)
            if value:
                return value

    return None


def _read_key_from_env_file(path: Path) -> str | None:
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        if line.startswith("VITE_GOOGLE_MAPS_API_KEY="):
            _, raw_value = line.split("=", 1)
            value = raw_value.strip().strip('"').strip("'")
            return value or None
        if line.startswith("GOOGLE_MAPS_API_KEY="):
            _, raw_value = line.split("=", 1)
            value = raw_value.strip().strip('"').strip("'")
            return value or None
    return None
