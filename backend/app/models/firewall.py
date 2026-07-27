from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text
from datetime import datetime
from app.database import Base

class FirewallRule(Base):
    __tablename__ = "firewall_rules"

    id = Column(Integer, primary_key=True, index=True)
    ip_address = Column(String, unique=True, index=True, nullable=False)
    status = Column(String, default="BLOCKED") # BLOCKED, UNBLOCKED
    block_type = Column(String, default="AUTOMATED_SOAR") # AUTOMATED_SOAR, MANUAL_ADMIN
    reason = Column(Text, nullable=False)
    risk_score = Column(Integer, default=98)
    blocked_at = Column(DateTime, default=datetime.utcnow, index=True)
    unblocked_at = Column(DateTime, nullable=True)
    unblocked_by = Column(String, nullable=True)
