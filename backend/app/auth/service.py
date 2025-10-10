from __future__ import annotations

import os
import logging
import sqlite3
from datetime import timedelta, datetime, timezone
from typing import Annotated
from uuid import UUID, uuid4
from passlib.context import CryptContext
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from . import models
from ..repository import get_connection
from ..exceptions import AuthenticationError

# Load secret from env (provide a sensible dev default but override in production)
SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-change-me")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

oauth2_bearer = OAuth2PasswordBearer(tokenUrl="/auth/token")
# Use bcrypt_sha256 to avoid the 72-byte input limit of raw bcrypt for new hashes.
# Keep "bcrypt" in the context so verification still works if any legacy bcrypt hashes exist.
bcrypt_context = CryptContext(
    schemes=["bcrypt_sha256", "bcrypt"],
    deprecated="auto",
    bcrypt__truncate_error=False,
)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt_context.verify(plain_password, hashed_password)
    except Exception:
        return False


def get_password_hash(password: str) -> str:
    # Explicitly use bcrypt_sha256 for new hashes
    return bcrypt_context.hash(password, scheme="bcrypt_sha256")


def _fetch_user_by_email(conn: sqlite3.Connection, email: str) -> dict | None:
    row = conn.execute("SELECT id, email, first_name, last_name, password_hash FROM users WHERE email = ?", (email,)).fetchone()
    if not row:
        return None
    return {
        "id": row[0],
        "email": row[1],
        "first_name": row[2],
        "last_name": row[3],
        "password_hash": row[4],
    }


def _fetch_user_by_id(conn: sqlite3.Connection, user_id: str) -> dict | None:
    row = conn.execute("SELECT id, email, first_name, last_name, password_hash FROM users WHERE id = ?", (user_id,)).fetchone()
    if not row:
        return None
    return {
        "id": row[0],
        "email": row[1],
        "first_name": row[2],
        "last_name": row[3],
        "password_hash": row[4],
    }


def authenticate_user(email: str, password: str, conn: sqlite3.Connection) -> dict | None:
    user = _fetch_user_by_email(conn, email)
    if not user or not verify_password(password, user["password_hash"]):
        logging.warning(f"Failed authentication attempt for email: {email}")
        return None
    return user


def create_access_token(email: str, user_id: UUID, expires_delta: timedelta) -> str:
    to_encode = {
        "sub": email,
        "id": str(user_id),
        "exp": datetime.now(timezone.utc) + expires_delta,
    }
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(token: str) -> models.TokenData:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str | None = payload.get("id")
        return models.TokenData(user_id=user_id)
    except JWTError as e:
        logging.warning(f"Token verification failed: {str(e)}")
        raise AuthenticationError()


def register_user(conn: sqlite3.Connection, register_user_request: models.RegisterUserRequest) -> None:
    try:
        # bcrypt has a 72-byte input limit. Reject overly long passwords rather than silently truncating.
        pwd_bytes = (register_user_request.password or "").encode("utf-8")
        pwd_len = len(pwd_bytes)
        has_non_ascii = any(b > 127 for b in pwd_bytes)
        logging.info("Register: received password bytes length=%d, non_ascii=%s", pwd_len, has_non_ascii)
        user_id = str(uuid4())
        password_hash = get_password_hash(register_user_request.password)
        conn.execute(
            "INSERT INTO users (id, email, first_name, last_name, password_hash, created_at) VALUES (?, ?, ?, ?, ?, ?)",
            (
                user_id,
                register_user_request.email,
                register_user_request.first_name,
                register_user_request.last_name,
                password_hash,
                datetime.utcnow().isoformat(),
            ),
        )
        conn.commit()
    except sqlite3.IntegrityError as e:
        logging.error(f"Failed to register user (integrity): {register_user_request.email}. Error: {str(e)}")
        raise
    except Exception as e:
        logging.error(f"Failed to register user: {register_user_request.email}. Error: {str(e)}")
        raise


def get_current_user(token: Annotated[str, Annotated[str, OAuth2PasswordBearer(tokenUrl='/auth/token')]]) -> models.TokenData:
    return verify_token(token)


CurrentUser = Annotated[models.TokenData, Annotated[models.TokenData, get_current_user]]


def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Annotated[OAuth2PasswordRequestForm, None]], conn: sqlite3.Connection) -> models.Token:
    # Validate password byte length for login attempt as well.
    pwd_bytes = (form_data.password or "").encode("utf-8")
    pwd_len = len(pwd_bytes)
    has_non_ascii = any(b > 127 for b in pwd_bytes)
    logging.info("Login attempt: username=%s password_bytes_length=%d non_ascii=%s", form_data.username, pwd_len, has_non_ascii)
    # No manual 72-byte enforcement here; bcrypt_sha256 handles long passwords safely for new hashes.

    user = authenticate_user(form_data.username, form_data.password, conn)
    if user is None:
        raise AuthenticationError()
    token = create_access_token(user["email"], UUID(user["id"]), timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    return models.Token(access_token=token, token_type="bearer")


def change_password(conn: sqlite3.Connection, user_id: str, current_password: str, new_password: str) -> None:
    user = _fetch_user_by_id(conn, user_id)
    if not user:
        raise AuthenticationError()
    if not verify_password(current_password, user["password_hash"]):
        raise ValueError("Current password is incorrect")
    # Hash the new password and update
    new_hash = get_password_hash(new_password)
    conn.execute("UPDATE users SET password_hash = ? WHERE id = ?", (new_hash, user_id))
    conn.commit()
