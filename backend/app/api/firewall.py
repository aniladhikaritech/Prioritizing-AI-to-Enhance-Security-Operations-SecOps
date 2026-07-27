from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.firewall import FirewallRule
from app.schemas.alert import FirewallRuleOut
from app.services.soar_engine import soar_engine
from app.utils.security import get_current_user, require_role
from app.models.user import User

router = APIRouter(prefix="/firewall", tags=["Firewall"])

@router.get("", response_model=List[FirewallRuleOut])
def get_firewall_rules(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    rules = db.query(FirewallRule).order_by(FirewallRule.blocked_at.desc()).all()
    return [FirewallRuleOut.from_orm(r) for r in rules]

@router.post("/{ip}/unblock", response_model=FirewallRuleOut)
def unblock_ip(
    ip: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin", "analyst"]))
):
    success = soar_engine.unblock_firewall_ip(db, ip, unblocked_by=current_user.username)
    if not success:
        raise HTTPException(status_code=404, detail=f"IP address {ip} not found in firewall block list")
    
    rule = db.query(FirewallRule).filter(FirewallRule.ip_address == ip).first()
    return FirewallRuleOut.from_orm(rule)
