from datetime import datetime, timedelta
from typing import Optional, List
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from core.config import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token", auto_error=False)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_token(token: str):
    if settings.DEBUG:
        if token == "dev-token":
            return {"sub": "dev-user", "role": "teacher"}
        if token == "dev-debug-token":
            return {"sub": "debug-console", "role": "debug"}
        if token == "dev-unity-token":
            return {"sub": "unity-client", "role": "unity"}

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None

async def get_current_user(token: str = Depends(oauth2_scheme)):
    # DEBUG MODE: Auto-authenticate if no valid token
    if settings.DEBUG:
        if not token or token == "undefined":
            return {"sub": "dev-user", "role": "teacher"}
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = decode_token(token)
    if payload is None:
        # In DEBUG mode, return dev user instead of raising exception
        if settings.DEBUG:
            return {"sub": "dev-user", "role": "teacher"}
        raise credentials_exception
    return payload


def check_role(roles: List[str]):
    async def role_checker(token_payload: dict = Depends(get_current_user)):
        user_role = token_payload.get("role")
        if user_role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Operation not permitted for your role"
            )
        return token_payload
    return role_checker
