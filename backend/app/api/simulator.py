from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.attack_simulator import attack_simulator
from app.utils.security import get_current_user
from app.models.user import User

router = APIRouter(prefix="/simulator", tags=["Attack Simulator"])

class SimulationRequest(BaseModel):
    attack_type: str = "SSH_BRUTE_FORCE" # SSH_BRUTE_FORCE, DISTRIBUTED_BRUTE_FORCE, SQL_INJECTION, BENIGN_TRAFFIC
    attacker_ip: str = "192.168.1.100"
    attempt_count: int = 10

@router.post("/launch")
async def launch_simulation(
    req: SimulationRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await attack_simulator.simulate_attack(
        db,
        attack_type=req.attack_type,
        attacker_ip=req.attacker_ip,
        attempt_count=req.attempt_count
    )
    return result
