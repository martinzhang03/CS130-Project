from fastapi import APIRouter

router = APIRouter(
    prefix="/tasks",
    tags=["tasks"]
)

@router.get("/{user_id}")
async def get_user_tasks(user_id: str):
    return {"uid": user_id}
