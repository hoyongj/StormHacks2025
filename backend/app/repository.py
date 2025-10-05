from __future__ import annotations

import sqlite3
from contextlib import contextmanager
from datetime import datetime
from pathlib import Path
from typing import Generator, Iterable, List, Optional

from .schemas import PlanStop, TravelPlan

DB_PATH = Path(__file__).resolve().parent / "travel_plans.db"


def init_db() -> None:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS plans (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                summary TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS plan_stops (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                plan_id TEXT NOT NULL,
                label TEXT NOT NULL,
                description TEXT,
                place_id TEXT,
                position INTEGER NOT NULL,
                latitude REAL,
                longitude REAL,
                FOREIGN KEY(plan_id) REFERENCES plans(id) ON DELETE CASCADE
            )
            """
        )
        _ensure_column(conn, "plan_stops", "latitude", "REAL")
        _ensure_column(conn, "plan_stops", "longitude", "REAL")
        conn.commit()

    if not list_plan_ids():
        seed_sample_plan()


@contextmanager
def get_connection() -> Generator[sqlite3.Connection, None, None]:
    conn = sqlite3.connect(DB_PATH)
    conn.execute("PRAGMA foreign_keys = ON")
    try:
        yield conn
    finally:
        conn.close()


def list_plan_ids() -> List[str]:
    with get_connection() as conn:
        rows = conn.execute("SELECT id FROM plans").fetchall()
    return [row[0] for row in rows]


def save_plan(plan: TravelPlan) -> None:
    with get_connection() as conn:
        conn.execute(
            "INSERT OR REPLACE INTO plans (id, title, summary, created_at) VALUES (?, ?, ?, ?)",
            (
                plan.id,
                plan.title,
                plan.summary,
                plan.created_at.isoformat(),
            ),
        )
        conn.execute("DELETE FROM plan_stops WHERE plan_id = ?", (plan.id,))
        for position, stop in enumerate(plan.stops):
            conn.execute(
                """
                INSERT INTO plan_stops (plan_id, label, description, place_id, position, latitude, longitude)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    plan.id,
                    stop.label,
                    stop.description,
                    stop.place_id,
                    position,
                    stop.latitude,
                    stop.longitude,
                ),
            )
        conn.commit()


def list_plans() -> List[TravelPlan]:
    with get_connection() as conn:
        plan_rows = conn.execute(
            "SELECT id, title, summary, created_at FROM plans ORDER BY created_at DESC"
        ).fetchall()
        plans = []
        for row in plan_rows:
            plan_id, title, summary, created_at = row
            stops = _fetch_stops(conn, plan_id)
            plans.append(
                TravelPlan(
                    id=plan_id,
                    title=title,
                    summary=summary,
                    stops=stops,
                    created_at=datetime.fromisoformat(created_at),
                )
            )
    return plans


def get_plan(plan_id: str) -> Optional[TravelPlan]:
    with get_connection() as conn:
        row = conn.execute(
            "SELECT id, title, summary, created_at FROM plans WHERE id = ?",
            (plan_id,),
        ).fetchone()
        if not row:
            return None
        stops = _fetch_stops(conn, plan_id)
        return TravelPlan(
            id=row[0],
            title=row[1],
            summary=row[2],
            created_at=datetime.fromisoformat(row[3]),
            stops=stops,
        )


def _fetch_stops(conn: sqlite3.Connection, plan_id: str) -> List[PlanStop]:
    stop_rows = conn.execute(
        """
        SELECT label, description, place_id, latitude, longitude
        FROM plan_stops
        WHERE plan_id = ?
        ORDER BY position ASC
        """,
        (plan_id,),
    ).fetchall()
    return [
        PlanStop(
            label=label,
            description=description,
            place_id=place_id,
            latitude=latitude,
            longitude=longitude,
        )
        for label, description, place_id, latitude, longitude in stop_rows
    ]


def seed_sample_plan() -> None:
    sample = TravelPlan(
        id="sample-sfu",
        title="Simon Fraser University Day",
        summary="Explore the Burnaby Mountain campus with study spots, coffee breaks, and scenic viewpoints.",
        created_at=datetime.utcnow(),
        stops=[
            PlanStop(
                label="Simon Fraser University",
                description="Meet at the AQ and take in the Arthur Erickson architecture around Freedom Square.",
                latitude=49.278093,
                longitude=-122.919883,
            ),
            PlanStop(
                label="Strand Hall Coffee",
                description="Grab a latte before exploring the upper campus gardens.",
                latitude=49.278986,
                longitude=-122.917792,
            ),
            PlanStop(
                label="Burnaby Mountain Park Lookout",
                description="Walk to the Kamui Mintara totems and catch the Burrard Inlet views.",
                latitude=49.280715,
                longitude=-122.960502,
            ),
            PlanStop(
                label="Convocation Mall",
                description="Wrap up under the iconic canopy—perfect for photos and group meetups.",
                latitude=49.277055,
                longitude=-122.9173,
            ),
        ],
    )
    save_plan(sample)


def _ensure_column(conn: sqlite3.Connection, table: str, column: str, definition: str) -> None:
    existing = {row[1] for row in conn.execute(f"PRAGMA table_info({table})")}
    if column not in existing:
        conn.execute(f"ALTER TABLE {table} ADD COLUMN {column} {definition}")
