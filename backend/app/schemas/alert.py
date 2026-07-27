from pydantic import BaseModel
from typing import Optional, Any, Dict, List
from datetime import datetime

class AIAnalysisOut(BaseModel):
    id: int
    alert_id: int
    verdict: str
    risk_level: str
    risk_score: int
    confidence_score: float
    threat_type: str
    summary: str
    recommended_action: str
    network_action: str
    raw_response: Optional[Dict[str, Any]] = None
    created_at: datetime

    class Config:
        from_attributes = True

class IncidentOut(BaseModel):
    id: int
    alert_id: int
    status: str
    source_ip: str
    playbook_name: str
    mttr_seconds: float
    total_execution_ms: int
    timeline_steps: List[Dict[str, Any]]
    resolution_notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class AlertOut(BaseModel):
    id: int
    rule_id: str
    title: str
    description: str
    source_ip: str
    severity: str
    trigger_count: int
    status: str
    created_at: datetime
    ai_analysis: Optional[AIAnalysisOut] = None
    incident: Optional[IncidentOut] = None

    class Config:
        from_attributes = True

class FirewallRuleOut(BaseModel):
    id: int
    ip_address: str
    status: str
    block_type: str
    reason: str
    risk_score: int
    blocked_at: datetime
    unblocked_at: Optional[datetime] = None
    unblocked_by: Optional[str] = None

    class Config:
        from_attributes = True
