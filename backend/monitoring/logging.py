import asyncpg
from fastapi import Request, Response
from fastapi.routing import APIRoute
from datetime import datetime, timedelta
from collections import defaultdict
import asyncio
import psutil
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
        self.error_count = 0 
        self.response_times = []
        self.cpu_usage = 0.0
        self.memory_usage = 0.0
        self.uptime = 0
        
        asyncio.create_task(self.database_size_monitor())
        asyncio.create_task(self.user_count_monitor())
        asyncio.create_task(self.database_size_monitor())
        asyncio.create_task(self.user_count_monitor())

        asyncio.create_task(self.system_health_monitor())
        asyncio.create_task(self.alert_checker())

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
    async def system_health_monitor(self):
        while True:
            try:
                # Track CPU/memory usage
                self.cpu_usage = psutil.cpu_percent()
                self.memory_usage = psutil.virtual_memory().percent
                # Track uptime
                self.uptime += 5  # Update every 5 seconds
                
                logger.info(
                    f"System Health - CPU: {self.cpu_usage}% | "
                    f"Memory: {self.memory_usage}% | Uptime: {self.uptime}s"
                )
                
            except Exception as e:
                logger.error(f"System health monitoring error: {str(e)}")
            
            await asyncio.sleep(5)

    async def alert_checker(self):
        while True:
            try:
                # P0
                if len(self.api_timestamps) == 0 or max(
                    [max(times) for times in self.api_timestamps.values()]
                ) < datetime.now() - timedelta(minutes=30):
                    self.send_alert("P0", "Service is down")
                    
                # P1
                if self.cpu_usage > 80 or self.memory_usage > 80:
                    self.send_alert("P1", 
                        f"High resource usage (CPU: {self.cpu_usage}%, Memory: {self.memory_usage}%)")
                total_calls = sum(self.api_counts.values())
                error_rate = (self.error_count / total_calls) * 100 if total_calls > 0 else 0
                if error_rate > 2:
                    self.send_alert("P1", f"High error rate: {error_rate:.1f}%")
                    
            except Exception as e:
                logger.error(f"Alert check failed: {str(e)}")
            
            await asyncio.sleep(60)

    def send_alert(self, priority: str, message: str):
        logger.critical(f"ALERT {priority}: {message}")

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
            try:
                response = await original_route_handler(request)
            except Exception as e:
                response = Response(content=str(e), status_code=500)
                self.monitor.error_count += 1
                
            duration = (datetime.now() - start_time).total_seconds() * 1000
            self.monitor.response_times.append(duration)
            
            if len(self.monitor.response_times) > 1000:
                self.monitor.response_times.pop(0)
                
            return response