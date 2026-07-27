from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    alert_id = Column(Integer, ForeignKey("alerts.id"), unique=True, nullable=False)
    status = Column(String, default="CONTAINED") # OPEN, MITIGATING, CONTAINED, CLOSED
    source_ip = Column(String, index=True, nullable=False)
    playbook_name = Column(String, default="Automated SSH Quarantine")
    mttr_seconds = Column(Float, default=3.2) # Mean time to respond in seconds
    total_execution_ms = Column(Integer, default=3200)
    timeline_steps = Column(JSON, nullable=False) # List of steps with timestamps
    resolution_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    # Relationship
    alert = relationship("Alert", back_populates="incident")
