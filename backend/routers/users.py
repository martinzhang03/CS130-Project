from fastapi import APIRouter, Depends, HTTPException
import asyncpg
import datetime
from database import *
import schemas
import crud
import auth

router = APIRouter(
    prefix="/api/user",
    tags=["user"]
)

@router.post("/register")
async def register_user(user: schemas.UserEmail, db: asyncpg.Connection = Depends(get_db)):
    try:
        existing_user, _, _ = await crud.find_existing_user(db, user.email, "formal")
        if existing_user:
            raise HTTPException(
                status_code=401,
                detail="Registration Failed: Existing User, please login or reset password.",
            )

        code = crud.send_confirmation_email(user.email)  
        salt, hashed_password = crud.hash_info(code)
        result = await crud.insert_temp_user(db, user.email, salt, hashed_password)

        if not result:
            raise HTTPException(
                status_code=500,
                detail="Some Error Occurred, please try again",
            )
        return {"status": "success", "message": "Sent confirmation email"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

    
@router.post("/login")
async def login_user(user: schemas.UserLogin, db: asyncpg.Connection = Depends(get_db)):
    try:
        existing_user, password, salt = await crud.find_existing_user(db, user.email, "formal")
        
        encrypt_code = crud.hash_info(user.password, salt)[1] if existing_user else ""
        if not existing_user or password != encrypt_code:
            raise HTTPException(
                status_code=401,
                detail="Email doesn't exist or incorrect password",
            )
    
        user_id = await crud.user_login(db, user.email)
        if user_id is None: 
            raise HTTPException(
                status_code=500,
                detail="Some error occurred, please try again",
            )
        
        token = auth.generate_token(str(user_id))
        return {"status": "success", "message": "successfully logged in", "jwt_token": token}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))