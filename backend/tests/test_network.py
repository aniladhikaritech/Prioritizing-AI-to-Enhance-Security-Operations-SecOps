def test_network_qr_code(client):
    login_resp = client.post("/api/v1/auth/login", data={"username": "admin", "password": "admin123"})
    assert login_resp.status_code == 200
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    response = client.get("/api/v1/network/qr", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "local_ip" in data
    assert "dashboard_url" in data
    assert "qr_code_base64" in data
    assert data["qr_code_base64"].startswith("data:image/png;base64,")
