from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class LogEntryBase(BaseModel):
    source_ip: str
    dest_ip: Optional[str] = "192.168.1.50"
    service: Optional[str] = "sshd"
    event_type: str
    target_user: Optional[str] = None
    severity: Optional[str] = "INFO"
    raw_payload: str

class LogEntryCreate(LogEntryBase):
    pass

class LogEntryOut(LogEntryBase):
    id: int
    timestamp: datetime

    model_config = {"from_attributes": True}

