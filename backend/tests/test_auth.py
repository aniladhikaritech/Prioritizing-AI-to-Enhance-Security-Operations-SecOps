import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import Base, get_db

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_secops.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

def test_login_admin():
    from app.utils.initial_data import init_db_data
    db = TestingSessionLocal()
    init_db_data(db)
    db.close()

    response = client.post(
        "/api/v1/auth/login",
        data={"username": "admin", "password": "admin123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["username"] == "admin"
    assert data["user"]["role"] == "admin"

def test_register_user():
    response = client.post(
        "/api/v1/auth/register",
        json={
            "username": "newanalyst",
            "email": "analyst@test.com",
            "password": "password123",
            "full_name": "Test Analyst",
            "role": "analyst"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "newanalyst"
    assert data["role"] == "analyst"
