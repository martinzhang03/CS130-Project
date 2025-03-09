import pytest
from httpx import AsyncClient
from main import app
import schemas

VALID_USER = {
    "first_name": "John",
    "user_name": "johndoe",
    "email": "john@example.com",
    "password": "Password123!"
}

EXISTING_USER = {
    "first_name": "Existing",
    "user_name": "existing",
    "email": "existing@example.com",
    "password": "Password123!"
}


# User Registration Tests
@pytest.mark.asyncio
async def test_register_existing_user():
    async with AsyncClient(app=app, base_url="http://test") as client:
        # First register the user
        await client.post("/user/register", json=EXISTING_USER)
        
        # Try registering again
        response = await client.post("/user/register", json=EXISTING_USER)
        
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "fail"
    assert "Existing User" in data["message"]

@pytest.mark.asyncio
async def test_register_success():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post("/user/register", json=VALID_USER)
        
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "jwt_token" in data


# User Login Tests
@pytest.mark.asyncio
async def test_login_invalid_email():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post("/user/login", json={
            "email": "nonexistent@example.com",
            "password": "wrong"
        })
        
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "fail"
    assert "Email doesn't exist" in data["message"]

@pytest.mark.asyncio
async def test_login_wrong_password():
    async with AsyncClient(app=app, base_url="http://test") as client:
        # First register a user
        await client.post("/user/register", json=VALID_USER)
        
        # Try logging in with wrong password
        response = await client.post("/user/login", json={
            "email": VALID_USER["email"],
            "password": "wrong_password"
        })
        
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "fail"
    assert "Incorrect password" in data["message"]

@pytest.mark.asyncio
async def test_login_success():
    async with AsyncClient(app=app, base_url="http://test") as client:
        # Register first
        await client.post("/user/register", json=VALID_USER)
        
        # Valid login
        response = await client.post("/user/login", json={
            "email": VALID_USER["email"],
            "password": VALID_USER["password"]
        })
        
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "jwt_token" in data


# Password Reset Tests
@pytest.mark.asyncio
async def test_reset_code_invalid_email():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post("/user/reset/code", json={
            "email": "invalid@example.com"
        })
        
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "fail"
    assert "register first" in data["message"]

@pytest.mark.asyncio
async def test_reset_confirm_success():
    async with AsyncClient(app=app, base_url="http://test") as client:
        # Register user
        await client.post("/user/register", json=VALID_USER)
        
        # Get reset code (would normally come via email)
        code_response = await client.post("/user/reset/code", json={
            "email": VALID_USER["email"]
        })
        
        # Reset password with code
        reset_response = await client.post("/user/reset/confirm", json={
            "email": VALID_USER["email"],
            "confirm_code": "123456",  # Mock code
            "password": "NewPassword123!"
        })
        
    assert reset_response.status_code == 200
    data = reset_response.json()
    assert data["status"] == "success"
    assert "jwt_token" in data

@pytest.mark.asyncio
async def test_reset_confirm_wrong_code():
    async with AsyncClient(app=app, base_url="http://test") as client:
        # Register user
        await client.post("/user/register", json=VALID_USER)
        
        # Try reset with wrong code
        response = await client.post("/user/reset/confirm", json={
            "email": VALID_USER["email"],
            "confirm_code": "wrong_code",
            "password": "NewPassword123!"
        })
        
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "fail"
    assert "Incorrect confirm code" in data["message"]