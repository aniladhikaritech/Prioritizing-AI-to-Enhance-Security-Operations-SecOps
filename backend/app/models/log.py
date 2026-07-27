from sqlalchemy import Column, Integer, String, DateTime, Text
from datetime import datetime
from app.database import Base

class LogEntry(Base):
    __tablename__ = "log_entries"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    source_ip = Column(String, index=True, nullable=False)
    dest_ip = Column(String, default="192.168.1.50") # Victim VM default IP
    service = Column(String, default="sshd", index=True)
    event_type = Column(String, index=True) # FAILED_PASSWORD, SUCCESSFUL_LOGIN, CONNECTION_CLOSED, SQL_INJECTION
    target_user = Column(String, nullable=True)
    severity = Column(String, default="INFO") # INFO, WARNING, ERROR, CRITICAL
    raw_payload = Column(Text, nullable=False)
