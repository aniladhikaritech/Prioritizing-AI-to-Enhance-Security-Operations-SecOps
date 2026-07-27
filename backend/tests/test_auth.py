import pytest

def test_login_admin(client):
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "admin", "password": "admin123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["username"] == "admin"
    assert data["user"]["role"] == "admin"

def test_register_user(client):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "username": "newanalyst",
            "email": "new_unique_analyst@secops.com",
            "password": "password123",
            "full_name": "Test Analyst",
            "role": "analyst"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "newanalyst"
    assert data["role"] == "analyst"
