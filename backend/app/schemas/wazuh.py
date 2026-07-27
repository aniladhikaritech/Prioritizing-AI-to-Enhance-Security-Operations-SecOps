from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime

class WazuhAgent(BaseModel):
    id: Optional[str] = "000"
    name: Optional[str] = "ubuntu-victim-server"
    ip: Optional[str] = "192.168.1.50"

class WazuhRule(BaseModel):
    id: str = Field(..., example="5712")
    level: int = Field(default=10, example=10)
    description: str = Field(..., example="SSHD brute force trying to get access")
    groups: Optional[List[str]] = ["syslog", "sshd", "authentication_failures"]

class WazuhData(BaseModel):
    srcip: Optional[str] = Field(default="192.168.1.100")
    dstip: Optional[str] = Field(default="192.168.1.50")
    srcuser: Optional[str] = None
    dstuser: Optional[str] = "root"
    srcport: Optional[str] = "49152"

class WazuhAlertPayload(BaseModel):
    timestamp: Optional[str] = None
    rule: WazuhRule
    agent: Optional[WazuhAgent] = None
    data: Optional[WazuhData] = None
    full_log: str = Field(..., example="Jul 27 12:14:25 victim-server sshd[14221]: Failed password for root from 192.168.1.100 port 49152 ssh2")
    location: Optional[str] = "/var/log/auth.log"
    id: Optional[str] = None
