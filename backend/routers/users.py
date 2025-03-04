from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import asyncpg
import datetime
from database import *
import schemas
import crud
import auth
import logging

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/user",
    tags=["user"]
)

security = HTTPBearer()

@router.post("/register")
async def register_user(user: schemas.UserEmail, db: asyncpg.Connection = Depends(get_db)):
    try:
        existing_user, _, _ = await crud.find_existing_user(db, user.email, "formal")

        if existing_user:
            return {"status": "fail", "message": "Registration Failed: Existing User, please login or reset password."}

        # code = crud.send_confirmation_email(user.email)  
        salt, hashed_password = crud.hash_info(user.password)
        result = await crud.insert_temp_user(db, user.email, salt, hashed_password, user.user_name)

        if result is None or result is False:
            return {"status": "fail", "message": "Some Error Occurred, please try again"}
        
        logger.info("Attempting user login")
        user_id = await crud.user_login(db, user.email)
        if user_id is None: 
            return {"status": "fail", "message": "Some Error Occurred, please try again"}
        
        token = auth.generate_token(str(user_id))
        return {"status": "success", "message": "User Registered", "jwt_token": token, "user_id": user_id}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

    
@router.post("/login")
async def login_user(user: schemas.UserLogin, db: asyncpg.Connection = Depends(get_db)):
    try:
        existing_user, password, salt = await crud.find_existing_user(db, user.email, "formal")
        
        encrypt_code = crud.hash_info(user.password, salt)[1] if existing_user else ""
        if not existing_user or password != encrypt_code:
            return {"status": "fail", "message": "Email doesn't exist or incorrect password"}
        	
        user_id = await crud.user_login(db, user.email)
        if user_id is None: 
            return {"status": "fail", "message": "Email doesn't exist or incorrect password"}
        print(user_id)
        token = auth.generate_token(str(user_id))
        return {"status": "success", "message": "successfully logged in", "jwt_token": token, "user_id": user_id}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/lists")
async def user_lists(request: Request, token: HTTPAuthorizationCredentials = Depends(security), db: asyncpg.Connection = Depends(get_db)):
    try:
        payload = auth.check_authenticated(token)  # Removed await and pass the token object
        id = payload.get("user_id")

        status = await crud.check_login_status(db, id)
        if not status:
            return {"status": "fail", "message": "Please login again"}

        users = await db.fetch("SELECT id, username FROM users;")
        res = [{"id": user["id"], "username": user["username"]} for user in users]
        return {"status": "success", "user_list": res}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))