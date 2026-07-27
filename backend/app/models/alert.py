from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    rule_id = Column(String, default="5712", index=True) # e.g. Wazuh Rule 5712 (SSHD Brute Force)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    source_ip = Column(String, index=True, nullable=False)
    severity = Column(String, default="HIGH") # LOW, MEDIUM, HIGH, CRITICAL
    trigger_count = Column(Integer, default=1)
    status = Column(String, default="NEW") # NEW, ANALYZING, RESOLVED, AUTO_MITIGATED
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    # Relationships
    ai_analysis = relationship("AIAnalysis", back_populates="alert", uselist=False)
    incident = relationship("Incident", back_populates="alert", uselist=False)
