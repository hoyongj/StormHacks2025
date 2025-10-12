from __future__ import annotations

import bcrypt
import hashlib
import sqlite3
from contextlib import contextmanager
from datetime import datetime
from pathlib import Path
from typing import Generator, Iterable, List, Optional
import uuid

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
                created_at TEXT NOT NULL,
                owner_id TEXT
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS plan_stops (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                plan_id TEXT NOT NULL,
                label TEXT NOT NULL,
                display_label TEXT,
                description TEXT,
                place_id TEXT,
                position INTEGER NOT NULL,
                latitude REAL,
                longitude REAL,
                time_days INTEGER,
                time_hours INTEGER,
                time_minutes INTEGER,
                FOREIGN KEY(plan_id) REFERENCES plans(id) ON DELETE CASCADE
            )
            """
        )
        _ensure_column(conn, "plan_stops", "latitude", "REAL")
        _ensure_column(conn, "plan_stops", "longitude", "REAL")
        _ensure_column(conn, "plan_stops", "display_label", "TEXT")
        _ensure_column(conn, "plan_stops", "notes", "TEXT")
        _ensure_column(conn, "plan_stops", "time_days", "INTEGER")
        _ensure_column(conn, "plan_stops", "time_hours", "INTEGER")
        _ensure_column(conn, "plan_stops", "time_minutes", "INTEGER")
        _ensure_column(conn, "plans", "owner_id", "TEXT")
        conn.execute(
            """
            CREATE INDEX IF NOT EXISTS idx_plans_owner_id ON plans(owner_id)
            """
        )
        conn.execute(
            """
            UPDATE plans
            SET owner_id = NULL
            WHERE owner_id IS NULL OR owner_id = '' OR owner_id = 'default-user'
            """
        )
        conn.commit()

        # Create a simple users table for lightweight authentication storage.
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                email TEXT NOT NULL UNIQUE,
                first_name TEXT,
                last_name TEXT,
                password_hash TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
            """
        )

    """ Sample plan """
    if not list_plan_ids():
        # seed_sample_plan()
        # seed_ubc_plan()
        seed_admin()


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


UNASSIGNED_OWNER_VALUES = {None, "", "default-user"}


def save_plan(plan: TravelPlan, owner_id: Optional[str]) -> None:
    with get_connection() as conn:
        existing_owner = conn.execute(
            "SELECT owner_id FROM plans WHERE id = ?",
            (plan.id,),
        ).fetchone()
        if existing_owner:
            owner_value = existing_owner[0]
            if (
                owner_value
                and owner_value not in UNASSIGNED_OWNER_VALUES
                and owner_value != owner_id
            ):
                raise PermissionError("Plan belongs to a different user.")

        conn.execute(
            """
            INSERT INTO plans (id, title, summary, created_at, owner_id)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                title=excluded.title,
                summary=excluded.summary,
                created_at=excluded.created_at,
                owner_id=excluded.owner_id
            """,
            (
                plan.id,
                plan.title,
                plan.summary,
                plan.created_at.isoformat(),
                owner_id,
            ),
        )
        conn.execute("DELETE FROM plan_stops WHERE plan_id = ?", (plan.id,))
        for position, stop in enumerate(plan.stops):
            conn.execute(
                """
                INSERT INTO plan_stops (plan_id, label, display_label, description, notes, place_id, position, latitude, longitude, time_days, time_hours, time_minutes)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    plan.id,
                    stop.label,
                    stop.display_name,
                    stop.description,
                    stop.notes,
                    stop.place_id,
                    position,
                    stop.latitude,
                    stop.longitude,
                    stop.time_to_spend_days,
                    stop.time_to_spend_hours,
                    stop.time_to_spend_minutes,
                ),
            )
        conn.commit()


def list_plans(owner_id: str) -> List[TravelPlan]:
    with get_connection() as conn:
        plan_rows = conn.execute(
            "SELECT id, title, summary, created_at FROM plans WHERE owner_id = ? ORDER BY created_at DESC",
            (owner_id,),
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
                    createdAt=datetime.fromisoformat(created_at),
                )
            )
    return plans


def get_plan(plan_id: str, owner_id: str) -> Optional[TravelPlan]:
    with get_connection() as conn:
        row = conn.execute(
            "SELECT id, title, summary, created_at FROM plans WHERE id = ? AND owner_id = ?",
            (plan_id, owner_id),
        ).fetchone()
        if not row:
            return None
        stops = _fetch_stops(conn, plan_id)
        return TravelPlan(
            id=row[0],
            title=row[1],
            summary=row[2],
            createdAt=datetime.fromisoformat(row[3]),
            stops=stops,
        )


def delete_plan(plan_id: str, owner_id: str) -> bool:
    with get_connection() as conn:
        cursor = conn.execute(
            "DELETE FROM plans WHERE id = ? AND owner_id = ?",
            (plan_id, owner_id),
        )
        conn.commit()
        return cursor.rowcount > 0


def _fetch_stops(conn: sqlite3.Connection, plan_id: str) -> List[PlanStop]:
    stop_rows = conn.execute(
        """
        SELECT label, display_label, description, notes, place_id, latitude, longitude, time_days, time_hours, time_minutes
        FROM plan_stops
        WHERE plan_id = ?
        ORDER BY position ASC
        """,
        (plan_id,),
    ).fetchall()
    return [
        PlanStop(
            label=label,
            displayName=display_label,
            description=description,
            notes=notes,
            place_id=place_id,
            latitude=latitude,
            longitude=longitude,
            timeToSpendDays=time_days,
            timeToSpendHours=time_hours,
            timeToSpendMinutes=time_minutes,
        )
        for label, display_label, description, notes, place_id, latitude, longitude, time_days, time_hours, time_minutes in stop_rows
    ]


def seed_sample_plan() -> None:
    sample = TravelPlan(
        id="sample-sfu",
        title="Simon Fraser University Day",
        summary="Explore the Burnaby Mountain campus with study spots, coffee breaks, and scenic viewpoints.",
        createdAt=datetime.utcnow(),
        stops=[
            PlanStop(
                label="Burnaby Mountain Park Lookout",
                description="Walk to the Kamui Mintara totems and catch the Burrard Inlet views.",
                latitude=49.28314,
                longitude=-122.93475,
            ),
            PlanStop(
                label="Simon Fraser University",
                description="Meet at the AQ and take in the Arthur Erickson architecture around Freedom Square.",
                latitude=49.278093,
                longitude=-122.919883,
            ),
            PlanStop(
                label="Convocation Mall",
                description="Wrap up under the iconic canopy—perfect for photos and group meetups.",
                latitude=49.277055,
                longitude=-122.9173,
            ),
            PlanStop(
                label="Steve Pokébar SFU",
                description="Enjoy a fresh poke bowl before exploring the upper campus gardens.",
                latitude=49.27790,
                longitude=-122.91182,
            )
        ],
    )
    save_plan(sample, owner_id=None)


def seed_ubc_plan() -> None:
    sample = TravelPlan(
        id="sample-ubc",
        title="University of British Columbia Day",
        summary="Discover UBC's vibrant Vancouver campus with ocean views, museums, and hidden study spots.",
        createdAt=datetime.utcnow(),
        stops=[
            PlanStop(
                label="Main Mall",
                description="Start at the heart of campus with views down to the Clock Tower.",
                latitude=49.26461,
                longitude=-123.25240,
            ),
            PlanStop(
                label="UBC Museum of Anthropology",
                description="Explore world-renowned Indigenous art and architecture.",
                latitude=49.26968,
                longitude=-123.25963,
            ),
            PlanStop(
                label="Nitobe Memorial Garden",
                description="Take a peaceful stroll through the Japanese garden's greenery.",
                latitude=49.26658,
                longitude=-123.25958,
            ),
            PlanStop(
                label="Wreck Beach Lookout",
                description="Wrap up with sunset views over the Strait of Georgia.",
                latitude=49.26240,
                longitude=-123.26136,
            ),
        ],
    )
    save_plan(sample, owner_id=None)


def seed_admin() -> None:
    import bcrypt

    admin_email = "admin@example.com"
    admin_password = "admin123"  # Replace with a secure password in production
    hashed_password = bcrypt.hashpw(admin_password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    with get_connection() as conn:
        conn.execute(
            """
            INSERT OR IGNORE INTO users (id, email, first_name, last_name, password_hash, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (str(uuid.uuid4()), admin_email, "Admin", "User", hashed_password, datetime.utcnow().isoformat()),
        )
        conn.commit()


def _ensure_column(conn: sqlite3.Connection, table: str, column: str, definition: str) -> None:
    existing = {row[1] for row in conn.execute(f"PRAGMA table_info({table})")}
    if column not in existing:
        conn.execute(f"ALTER TABLE {table} ADD COLUMN {column} {definition}")
