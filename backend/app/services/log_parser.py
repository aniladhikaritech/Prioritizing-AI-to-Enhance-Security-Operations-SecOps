import re
import urllib.parse
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.log import LogEntry
from app.models.alert import Alert
from app.config import settings

# Regular expressions for auth.log parsing
FAILED_PWD_REGEX = re.compile(
    r"Failed password for (invalid user )?(?P<user>\S+) from (?P<ip>\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}) port \d+ ssh2"
)
INVALID_USER_REGEX = re.compile(
    r"Invalid user (?P<user>\S+) from (?P<ip>\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})"
)
ACCEPTED_PWD_REGEX = re.compile(
    r"Accepted password for (?P<user>\S+) from (?P<ip>\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})"
)
SQL_INJECTION_REGEX = re.compile(
    r"(?i)(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|OR\s+['\"]?1['\"]?\s*=\s*['\"]?1|SQL_INJECTION)"
)

def parse_raw_log(raw_log: str, source_ip_override: Optional[str] = None) -> Dict[str, Any]:
    """Extract metadata from raw auth.log format string"""
    decoded_log = urllib.parse.unquote(raw_log)
    metadata = {
        "source_ip": source_ip_override or "192.168.1.100",
        "service": "sshd",
        "event_type": "UNKNOWN",
        "target_user": "root",
        "severity": "INFO",
        "raw_payload": raw_log
    }

    # Check Web SQL Injection
    if SQL_INJECTION_REGEX.search(decoded_log):
        metadata["event_type"] = "SQL_INJECTION"
        metadata["severity"] = "CRITICAL"
        return metadata

    # Check Failed Password
    match_failed = FAILED_PWD_REGEX.search(decoded_log)
    if match_failed:
        metadata["source_ip"] = source_ip_override or match_failed.group("ip")
        metadata["target_user"] = match_failed.group("user")
        metadata["event_type"] = "FAILED_PASSWORD"
        metadata["severity"] = "WARNING"
        return metadata

    # Check Invalid User
    match_invalid = INVALID_USER_REGEX.search(decoded_log)
    if match_invalid:
        metadata["source_ip"] = source_ip_override or match_invalid.group("ip")
        metadata["target_user"] = match_invalid.group("user")
        metadata["event_type"] = "INVALID_USER"
        metadata["severity"] = "WARNING"
        return metadata

    # Check Accepted Password
    match_accepted = ACCEPTED_PWD_REGEX.search(decoded_log)
    if match_accepted:
        metadata["source_ip"] = source_ip_override or match_accepted.group("ip")
        metadata["target_user"] = match_accepted.group("user")
        metadata["event_type"] = "SUCCESSFUL_LOGIN"
        metadata["severity"] = "INFO"
        return metadata

    if "Failed" in raw_log or "failed" in raw_log or "invalid" in raw_log:
        metadata["event_type"] = "FAILED_PASSWORD"
        metadata["severity"] = "WARNING"

    return metadata


def process_log_entry(db: Session, raw_log: str, source_ip_override: Optional[str] = None) -> tuple[LogEntry, Optional[Alert]]:
    """
    Ingest a new log entry into database, check against detection rules (e.g. Wazuh Rule 5712: SSH Brute Force),
    and generate an Alert if threshold is exceeded.
    """
    meta = parse_raw_log(raw_log, source_ip_override)

    # Save log entry
    log_entry = LogEntry(
        source_ip=meta["source_ip"],
        dest_ip="192.168.1.50",
        service=meta["service"],
        event_type=meta["event_type"],
        target_user=meta["target_user"],
        severity=meta["severity"],
        raw_payload=meta["raw_payload"]
    )
    db.add(log_entry)
    db.commit()
    db.refresh(log_entry)

    alert = None

    # Check for SSH Brute Force Rule 5712
    if meta["event_type"] in ["FAILED_PASSWORD", "INVALID_USER"]:
        time_threshold = datetime.utcnow() - timedelta(seconds=settings.TIME_WINDOW_SECONDS)
        
        # Count failed attempts from this source IP in the window
        recent_failed_count = db.query(LogEntry).filter(
            LogEntry.source_ip == meta["source_ip"],
            LogEntry.event_type.in_(["FAILED_PASSWORD", "INVALID_USER"]),
            LogEntry.timestamp >= time_threshold
        ).count()

        # If threshold crossed (e.g., >= 5 attempts in window), trigger Wazuh Rule 5712 alert
        if recent_failed_count >= settings.FAILED_LOGIN_THRESHOLD:
            # Check if there is already an active NEW or ANALYZING alert for this IP recently
            existing_alert = db.query(Alert).filter(
                Alert.source_ip == meta["source_ip"],
                Alert.status.in_(["NEW", "ANALYZING"]),
                Alert.created_at >= time_threshold
            ).first()

            if existing_alert:
                existing_alert.trigger_count += 1
                db.commit()
                db.refresh(existing_alert)
                alert = existing_alert
            else:
                alert = Alert(
                    rule_id="5712",
                    title="SSHD Brute Force Attack Detected",
                    description=f"Wazuh Rule 5712 Fired: Multiple failed SSH login attempts detected from source IP {meta['source_ip']} ({recent_failed_count} attempts within {settings.TIME_WINDOW_SECONDS}s).",
                    source_ip=meta["source_ip"],
                    severity="CRITICAL" if recent_failed_count > 10 else "HIGH",
                    trigger_count=recent_failed_count,
                    status="NEW"
                )
                db.add(alert)
                db.commit()
                db.refresh(alert)

    elif meta["event_type"] == "SQL_INJECTION":
        alert = Alert(
            rule_id="31101",
            title="SQL Injection Web Attack Detected",
            description=f"Web Application Firewall Rule Fired: Malicious SQL payload detected from source IP {meta['source_ip']}.",
            source_ip=meta["source_ip"],
            severity="CRITICAL",
            trigger_count=1,
            status="NEW"
        )
        db.add(alert)
        db.commit()
        db.refresh(alert)

    return log_entry, alert
