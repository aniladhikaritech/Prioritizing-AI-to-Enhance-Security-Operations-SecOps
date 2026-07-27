import pytest
from app.services.ai_engine import ai_engine

@pytest.mark.asyncio
async def test_ai_engine_brute_force_analysis():
    alert_data = {
        "rule_id": "5712",
        "title": "SSHD Brute Force Attack Detected",
        "source_ip": "192.168.1.100",
        "trigger_count": 10
    }
    logs = [
        "Failed password for root from 192.168.1.100 port 49152 ssh2",
        "Failed password for invalid user admin from 192.168.1.100 port 49153 ssh2"
    ]
    result = await ai_engine.analyze_alert(alert_data, logs)
    assert result["verdict"] == "TRUE_POSITIVE"
    assert result["risk_score"] >= 80
    assert result["risk_level"] in ["CRITICAL", "HIGH"]
    assert "SSH Brute Force" in result["threat_type"]
    assert "192.168.1.100" in result["summary"]
