from fastapi import APIRouter
from app.api import auth, dashboard, logs, alerts, incidents, firewall, simulator, wazuh, network

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(dashboard.router)
api_router.include_router(logs.router)
api_router.include_router(alerts.router)
api_router.include_router(incidents.router)
api_router.include_router(firewall.router)
api_router.include_router(simulator.router)
api_router.include_router(wazuh.router)
api_router.include_router(network.router)

