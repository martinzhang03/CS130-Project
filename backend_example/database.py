
from motor.motor_asyncio import AsyncIOMotorClient
from config import Settings

setting = Settings()

client = AsyncIOMotorClient(setting.DB_URL)
db = client.main_db
# training_sheet = db["training_sheet"]
# users = db["users"]

def get_db():
    try: 
        yield db
    finally:
        pass



