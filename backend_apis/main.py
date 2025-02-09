from fastapi import Depends, HTTPException, APIRouter, Request, FastAPI


app = FastAPI()
# router = APIRouter()
security = HTTPBearer()
