import datetime
import time
import jwt
from typing import Optional
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jwt.exceptions import InvalidSignatureError, ExpiredSignatureError, InvalidTokenError
from config import Settings

http_scheme = HTTPBearer()
setting = Settings()

def generate_token(user_id: str) -> str:
    payload = {
        "exp": int(time.time()) + setting.JWT_EXPIRE_SECONDS,
        "iss": "Jobs-Jr",
        "iat": int(time.time()),
        "user_id": user_id,
    }
    # print(setting.JWT_PRIVATE_KEY)
    token = jwt.encode(payload=payload, key=setting.JWT_PRIVATE_KEY, algorithm="RS256")
    return token

def credentials_exception(detail: str = "Could not validate credentials") -> HTTPException:
    return HTTPException(
        status_code=401,
        detail=detail,
        headers={"WWW-Authenticate": "Bearer"},
    )

def check_authenticated(token: Optional[HTTPAuthorizationCredentials] = Depends(http_scheme)) -> dict:
    # return check_jwt(token=token.credentials, audience="test")
    return check_jwt(token=token, audience="test")


def check_jwt(token: str, audience: str = None, algorithms: str = 'RS256') -> dict:
    payload = {}
    if token is None:
        raise credentials_exception("Token not found.")
    try:
        payload = jwt.decode(jwt=token, key=setting.JWT_PUBLIC_KEY, algorithms=algorithms)
    except InvalidSignatureError:
        raise credentials_exception("JWT token signature is invalid.")
    except ExpiredSignatureError:
        raise credentials_exception("JWT token has expired.")
    except InvalidTokenError:
        raise credentials_exception("JWT token is invalid.")
    except ValueError:
        raise credentials_exception('JWT_PUBLIC_KEY is invalid.')
    except Exception as e:
        raise credentials_exception(f"Verify JWT Failed. {str(e)}")
    return payload