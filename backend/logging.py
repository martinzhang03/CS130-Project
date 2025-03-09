import asyncpg
from fastapi import Request, Response
from fastapi.routing import APIRoute
from datetime import datetime, timedelta
from collections import defaultdict
import asyncio
from typing import Dict, Tuple, List
from database import get_db
import logging

# __________________________________________________________________________
# THIS LOGGING FUNCTIONALITY IS NOT INCLUDED IN MAIN SCRIPT RIGHT NOW
# __________________________________________________________________________
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

class APIMonitor:
    def __init__(self):
        self.api_counts = defaultdict(int)
        self.api_timestamps = defaultdict(list)
        self.peak_users = 0
        self.current_users = 0
        self.db_pool = None
        
        asyncio.create_task(self.database_size_monitor())
        asyncio.create_task(self.user_count_monitor())

    async def connect_db(self):
        if not self.db_pool:
            self.db_pool = await get_db()

    async def database_size_monitor(self):
        await self.connect_db()
        while True:
            try:
                async with self.db_pool.acquire() as conn:
                    user_count = await conn.fetchval("SELECT COUNT(*) FROM users;")
                    
                    task_count = await conn.fetchval("SELECT COUNT(*) FROM tasks;")
                    
                    logger.info(f"Database Sizes - Users: {user_count}, Tasks: {task_count}")
                    
            except Exception as e:
                logger.error(f"Database size monitoring error: {str(e)}")
            
            await asyncio.sleep(60)

    async def user_count_monitor(self):
        await self.connect_db()
        while True:
            try:
                async with self.db_pool.acquire() as conn:
                    current = await conn.fetchval(
                        "SELECT COUNT(*) FROM users WHERE login = TRUE;"
                    )
                    self.current_users = current
                    if current > self.peak_users:
                        self.peak_users = current
                        
                    logger.info(f"User Counts - Current: {current}, Peak: {self.peak_users}")
                    
            except Exception as e:
                logger.error(f"User count monitoring error: {str(e)}")
            
            await asyncio.sleep(30)

    def track_api_call(self, path: str):
        now = datetime.now()
        self.api_counts[path] += 1
        self.api_timestamps[path].append(now)
        
        cutoff = now - timedelta(minutes=1)
        self.api_timestamps[path] = [t for t in self.api_timestamps[path] if t > cutoff]

    def get_api_metrics(self) -> Dict:
        metrics = {
            "total_calls": dict(self.api_counts),
            "calls_per_minute": {
                path: len(timestamps) 
                for path, timestamps in self.api_timestamps.items()
            },
            "current_users": self.current_users,
            "peak_users": self.peak_users
        }
        return metrics

class LoggingMiddleware(APIRoute):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.monitor = APIMonitor()

    def get_route_handler(self):
        original_route_handler = super().get_route_handler()

        async def custom_route_handler(request: Request) -> Response:
            start_time = datetime.now()
            response = await original_route_handler(request)
            
            path = request.url.path
            self.monitor.track_api_call(path)
            
            duration = (datetime.now() - start_time).total_seconds() * 1000
            logger.info(
                f"{request.method} {path} - Status: {response.status_code} "
                f"- Duration: {duration:.2f}ms"
            )
            
            return response

        return custom_route_handler