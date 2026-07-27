from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class AIAnalysis(Base):
    __tablename__ = "ai_analyses"

    id = Column(Integer, primary_key=True, index=True)
    alert_id = Column(Integer, ForeignKey("alerts.id"), unique=True, nullable=False)
    verdict = Column(String, nullable=False) # TRUE_POSITIVE, FALSE_POSITIVE, SUSPICIOUS, BENIGN
    risk_level = Column(String, nullable=False) # CRITICAL, HIGH, MEDIUM, LOW
    risk_score = Column(Integer, nullable=False) # 0 to 100
    confidence_score = Column(Float, nullable=False) # 0.0 to 1.0 (e.g. 0.98)
    threat_type = Column(String, nullable=False) # SSH Brute Force, Web Attack, Port Scan, etc.
    summary = Column(Text, nullable=False)
    recommended_action = Column(Text, nullable=False)
    network_action = Column(String, default="IMMEDIATE_ISOLATION")
    raw_response = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship
    alert = relationship("Alert", back_populates="ai_analysis")
