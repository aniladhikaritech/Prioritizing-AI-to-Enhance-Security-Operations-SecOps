from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.incident import Incident
from app.schemas.alert import IncidentOut
from app.utils.security import get_current_user
from app.models.user import User

router = APIRouter(prefix="/incidents", tags=["Incidents"])

@router.get("", response_model=List[IncidentOut])
def get_incidents(
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    incidents = db.query(Incident).order_by(Incident.created_at.desc()).limit(limit).all()
    return [IncidentOut.from_orm(inc) for inc in incidents]

@router.get("/{incident_id}", response_model=IncidentOut)
def get_incident_by_id(
    incident_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    return IncidentOut.from_orm(incident)
