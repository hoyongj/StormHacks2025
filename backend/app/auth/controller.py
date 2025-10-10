from typing import Annotated
from fastapi import APIRouter, Depends, Request, HTTPException
from starlette import status
from . import  models
from . import service
from fastapi.security import OAuth2PasswordRequestForm
from ..repository import get_connection
import sqlite3
router = APIRouter(
    prefix='/auth',
    tags=['auth']
)


@router.post("/", status_code=status.HTTP_201_CREATED)
async def register_user(request: Request, register_user_request: models.RegisterUserRequest):
    try:
        # Log request shape and password byte length for debugging
        try:
            body = await request.json()
            pwd = body.get('password')
            pwd_len = len(pwd.encode('utf-8')) if isinstance(pwd, str) else None
            request.app.logger if hasattr(request.app, 'logger') else None
            print(f"Register controller: keys={list(body.keys())} password_bytes={pwd_len}")
        except Exception:
            # ignore logging errors
            pass
        with get_connection() as conn:
            service.register_user(conn, register_user_request)
    except sqlite3.IntegrityError as e:
        # Likely email uniqueness violation
        raise HTTPException(status_code=400, detail="A user with that email already exists")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        # Return a meaningful error to the client for debugging
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/token", response_model=models.Token)
async def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    try:
        # Log incoming form password length for debugging
        try:
            pwd = form_data.password
            pwd_len = len(pwd.encode('utf-8')) if isinstance(pwd, str) else None
            print(f"Login controller: username={form_data.username} password_bytes={pwd_len}")
        except Exception:
            pass
        with get_connection() as conn:
            return service.login_for_access_token(form_data, conn)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=str(e))







