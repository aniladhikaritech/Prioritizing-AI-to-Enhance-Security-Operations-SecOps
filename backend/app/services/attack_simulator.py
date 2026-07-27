import time
import asyncio
from typing import Dict, Any
from sqlalchemy.orm import Session
from app.services.log_parser import process_log_entry
from app.services.ai_engine import ai_engine
from app.services.soar_engine import soar_engine
from app.models.ai_analysis import AIAnalysis
from app.services.websocket_manager import ws_manager

class AttackSimulator:
    async def simulate_attack(
        self,
        db: Session,
        attack_type: str = "SSH_BRUTE_FORCE",
        attacker_ip: str = "192.168.1.100",
        attempt_count: int = 10
    ) -> Dict[str, Any]:
        """
        Generates simulated log streams, triggers log parser, AI inference engine,
        and automated SOAR mitigation pipeline end-to-end.
        """
        start_time_ms = time.time() * 1000

        logs_generated = []

        if attack_type == "SSH_BRUTE_FORCE":
            usernames = ["root", "admin", "user", "postgres", "guest", "ubuntu", "test"]
            for i in range(attempt_count):
                user = usernames[i % len(usernames)]
                raw_log = f"Jul 27 12:14:25 victim-server sshd[14221]: Failed password for invalid user {user} from {attacker_ip} port {49000 + i} ssh2"
                logs_generated.append(raw_log)

        elif attack_type == "DISTRIBUTED_BRUTE_FORCE":
            subnets = ["192.168.1.100", "192.168.1.101", "192.168.1.102"]
            for i in range(attempt_count):
                ip = subnets[i % len(subnets)]
                raw_log = f"Jul 27 12:14:25 victim-server sshd[14221]: Failed password for root from {ip} port {50000 + i} ssh2"
                logs_generated.append(raw_log)

        elif attack_type == "SQL_INJECTION":
            logs_generated = [
                f"Jul 27 12:14:25 victim-server nginx[8080]: GET /api/v1/users?id=1%27%20OR%20%271%27%3D%271 HTTP/1.1 from {attacker_ip} 400 SQL_INJECTION_DETECTED"
            ]

        else: # BENIGN_TRAFFIC
            logs_generated = [
                f"Jul 27 12:14:25 victim-server sshd[14221]: Accepted password for sysadmin from {attacker_ip} port 52110 ssh2"
            ]

        last_alert = None
        for raw_log in logs_generated:
            log_entry, alert = process_log_entry(db, raw_log, source_ip_override=attacker_ip)
            
            # Broadcast raw log entry to live WebSocket feed
            await ws_manager.broadcast("NEW_LOG", {
                "id": log_entry.id,
                "timestamp": log_entry.timestamp.isoformat(),
                "source_ip": log_entry.source_ip,
                "event_type": log_entry.event_type,
                "severity": log_entry.severity,
                "raw_payload": log_entry.raw_payload
            })

            if alert:
                last_alert = alert

        if last_alert:
            # Broadcast Alert Triggered
            await ws_manager.broadcast("ALERT_TRIGGERED", {
                "id": last_alert.id,
                "rule_id": last_alert.rule_id,
                "title": last_alert.title,
                "severity": last_alert.severity,
                "source_ip": last_alert.source_ip,
                "trigger_count": last_alert.trigger_count
            })

            # Run AI Inference
            ai_result = await ai_engine.analyze_alert(
                {
                    "rule_id": last_alert.rule_id,
                    "title": last_alert.title,
                    "source_ip": last_alert.source_ip,
                    "trigger_count": last_alert.trigger_count
                },
                logs_generated
            )

            ai_analysis = AIAnalysis(
                alert_id=last_alert.id,
                verdict=ai_result.get("verdict", "TRUE_POSITIVE"),
                risk_level=ai_result.get("risk_level", "CRITICAL"),
                risk_score=ai_result.get("risk_score", 98),
                confidence_score=ai_result.get("confidence_score", 0.98),
                threat_type=ai_result.get("threat_type", "SSH Brute Force Attack"),
                summary=ai_result.get("summary", ""),
                recommended_action=ai_result.get("recommended_action", ""),
                network_action=ai_result.get("network_action", "IMMEDIATE_ISOLATION"),
                raw_response=ai_result
            )
            db.add(ai_analysis)
            db.commit()
            db.refresh(ai_analysis)

            # Broadcast AI Analysis Completed
            await ws_manager.broadcast("AI_ANALYSIS_COMPLETED", {
                "alert_id": last_alert.id,
                "verdict": ai_analysis.verdict,
                "risk_score": ai_analysis.risk_score,
                "risk_level": ai_analysis.risk_level,
                "confidence_score": ai_analysis.confidence_score,
                "threat_type": ai_analysis.threat_type,
                "summary": ai_analysis.summary,
                "recommended_action": ai_analysis.recommended_action
            })

            # Execute SOAR Engine Playbook
            incident = await soar_engine.execute_playbook(db, last_alert, ai_analysis, start_time_ms)

            return {
                "status": "SUCCESS",
                "attack_type": attack_type,
                "attacker_ip": attacker_ip,
                "alert_id": last_alert.id,
                "incident_id": incident.id,
                "verdict": ai_analysis.verdict,
                "risk_score": ai_analysis.risk_score,
                "mttr_seconds": incident.mttr_seconds,
                "playbook_executed": True
            }

        return {
            "status": "SUCCESS",
            "attack_type": attack_type,
            "attacker_ip": attacker_ip,
            "logs_processed": len(logs_generated),
            "alert_triggered": False
        }

attack_simulator = AttackSimulator()
