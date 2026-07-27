from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.log import LogEntry
from app.schemas.log import LogEntryOut
from app.utils.security import get_current_user
from app.models.user import User

router = APIRouter(prefix="/logs", tags=["Logs"])

@router.get("", response_model=List[LogEntryOut])
def get_logs(
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    logs = db.query(LogEntry).order_by(LogEntry.timestamp.desc()).offset(offset).limit(limit).all()
    return [LogEntryOut.from_orm(l) for l in logs]
