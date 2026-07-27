from sqlalchemy.orm import Session
from app.models.user import User
from app.utils.security import get_password_hash

def init_db_data(db: Session):
    # Check if admin exists
    admin = db.query(User).filter(User.username == "admin").first()
    if not admin:
        admin_user = User(
            username="admin",
            email="admin@secops.com",
            full_name="Anil Adhikari (SecOps Admin)",
            hashed_password=get_password_hash("admin123"),
            role="admin",
            is_active=True
        )
        db.add(admin_user)

    # Check if analyst exists
    analyst = db.query(User).filter(User.username == "analyst").first()
    if not analyst:
        analyst_user = User(
            username="analyst",
            email="analyst@secops.com",
            full_name="Security Analyst",
            hashed_password=get_password_hash("analyst123"),
            role="analyst",
            is_active=True
        )
        db.add(analyst_user)

    db.commit()
