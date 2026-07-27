from app.services.log_parser import parse_raw_log

def test_parse_failed_password_log():
    raw = "Jul 27 12:14:25 victim-server sshd[14221]: Failed password for invalid user root from 192.168.1.100 port 49152 ssh2"
    meta = parse_raw_log(raw)
    assert meta["source_ip"] == "192.168.1.100"
    assert meta["event_type"] == "FAILED_PASSWORD"
    assert meta["target_user"] == "root"
    assert meta["severity"] == "WARNING"

def test_parse_accepted_password_log():
    raw = "Jul 27 12:14:25 victim-server sshd[14221]: Accepted password for sysadmin from 192.168.1.50 port 52110 ssh2"
    meta = parse_raw_log(raw)
    assert meta["source_ip"] == "192.168.1.50"
    assert meta["event_type"] == "SUCCESSFUL_LOGIN"
    assert meta["target_user"] == "sysadmin"
    assert meta["severity"] == "INFO"

def test_parse_sql_injection_log():
    raw = "GET /api/v1/users?id=1%27%20OR%20%271%27%3D%271 HTTP/1.1 from 192.168.1.100"
    meta = parse_raw_log(raw)
    assert meta["event_type"] == "SQL_INJECTION"
    assert meta["severity"] == "CRITICAL"
