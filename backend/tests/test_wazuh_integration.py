import pytest

def test_wazuh_status_endpoint(client):
    response = client.get("/api/v1/wazuh/status")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ONLINE"
    assert "wazuh_webhook_endpoint" in data

@pytest.mark.asyncio
async def test_wazuh_webhook_ingestion(client):
    payload = {
        "rule": {
            "id": "5712",
            "level": 10,
            "description": "SSHD brute force trying to get access",
            "groups": ["sshd", "authentication_failures"]
        },
        "agent": {
            "id": "001",
            "name": "ubuntu-victim-server",
            "ip": "192.168.1.50"
        },
        "data": {
            "srcip": "192.168.1.100",
            "dstip": "192.168.1.50",
            "dstuser": "root"
        },
        "full_log": "Jul 27 12:14:25 victim-server sshd[14221]: Failed password for root from 192.168.1.100 port 49152 ssh2",
        "location": "/var/log/auth.log"
    }

    response = client.post("/api/v1/wazuh/webhook", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["status"] == "PROCESSED"
    assert data["wazuh_rule_id"] == "5712"
    assert data["source_ip"] == "192.168.1.100"
    assert data["verdict"] == "TRUE_POSITIVE"
    assert data["firewall_blocked"] is True
