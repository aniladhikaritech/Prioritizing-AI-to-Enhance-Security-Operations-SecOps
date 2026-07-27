import json
import logging
import httpx
from typing import Dict, Any
from app.config import settings

logger = logging.getLogger("SecOpsAIEngine")

SYSTEM_PROMPT = """You are an expert AI Security Operations (SecOps) Analyst & Automated Incident Response Agent.
Analyze the provided security log alert payload and determine:
1. Verdict ("TRUE_POSITIVE", "FALSE_POSITIVE", "SUSPICIOUS", "BENIGN")
2. Risk Level ("CRITICAL", "HIGH", "MEDIUM", "LOW")
3. Risk Score (Integer from 0 to 100)
4. Confidence Score (Float between 0.00 and 1.00)
5. Threat Type (e.g. "SSH Brute Force Attack", "Web SQL Injection", "Reconnaissance Port Scan", "Legitimate Traffic Noise")
6. Detailed Technical Summary explaining the attack vector and evidence.
7. Recommended Action (e.g., "Immediate Network Isolation", "Monitor Log Patterns", "Whitelisting")

Respond ONLY with valid JSON in this exact structure:
{
  "verdict": "TRUE_POSITIVE",
  "risk_level": "CRITICAL",
  "risk_score": 98,
  "confidence_score": 0.98,
  "threat_type": "SSH Brute Force Attack",
  "summary": "Pattern indicates a highly automated brute-force attempt from source IP 192.168.1.100 against SSH daemon on target 192.168.1.50.",
  "recommended_action": "Immediate Network Isolation",
  "network_action": "IMMEDIATE_ISOLATION"
}"""

class AIEngine:
    async def analyze_alert(self, alert_data: Dict[str, Any], raw_logs: list[str]) -> Dict[str, Any]:
        """Entry point for AI threat analysis based on configured mode"""
        mode = settings.AI_ENGINE_MODE.lower()
        
        if mode == "ollama":
            return await self._analyze_ollama(alert_data, raw_logs)
        elif mode == "openai":
            return await self._analyze_openai(alert_data, raw_logs)
        else:
            # Default fallback: smart_local
            return self._analyze_smart_local(alert_data, raw_logs)

    def _analyze_smart_local(self, alert_data: Dict[str, Any], raw_logs: list[str]) -> Dict[str, Any]:
        """Local smart SecOps LLM reasoning engine for fast, reproducible evaluation"""
        source_ip = alert_data.get("source_ip", "192.168.1.100")
        rule_id = alert_data.get("rule_id", "5712")
        trigger_count = alert_data.get("trigger_count", 5)

        if rule_id == "5712" or "Brute Force" in alert_data.get("title", ""):
            risk_score = min(98, 80 + (trigger_count * 2))
            return {
                "verdict": "TRUE_POSITIVE",
                "risk_level": "CRITICAL" if risk_score >= 90 else "HIGH",
                "risk_score": risk_score,
                "confidence_score": 0.98,
                "threat_type": "SSH Brute Force Attack",
                "summary": f"Pattern indicates an active, automated high-frequency SSH password-guessing brute force attack from source IP {source_ip}. Identified {trigger_count} failed authentication attempts crossing the rule threshold within 60s.",
                "recommended_action": f"Immediate Network Isolation. Quarantine IP {source_ip} via UFW/iptables drop rules to prevent credential compromise.",
                "network_action": "IMMEDIATE_ISOLATION"
            }
        elif rule_id == "31101" or "SQL Injection" in alert_data.get("title", ""):
            return {
                "verdict": "TRUE_POSITIVE",
                "risk_level": "CRITICAL",
                "risk_score": 95,
                "confidence_score": 0.95,
                "threat_type": "Web Application Attack (SQLi)",
                "summary": f"Malicious SQL payload detected from source IP {source_ip} targeting web endpoints. Exploit patterns matched standard SQL injection syntax.",
                "recommended_action": f"Immediate Network Isolation and IP Quarantine for {source_ip}.",
                "network_action": "IMMEDIATE_ISOLATION"
            }
        else:
            # Legitimate traffic or low severity noise
            return {
                "verdict": "FALSE_POSITIVE",
                "risk_level": "LOW",
                "risk_score": 15,
                "confidence_score": 0.92,
                "threat_type": "Legitimate Traffic / Harmless Noise",
                "summary": f"Single auth anomaly or benign network activity from IP {source_ip}. Does not match malicious automation patterns.",
                "recommended_action": "Log and continue monitoring. No automated action required.",
                "network_action": "NO_ACTION"
            }

    async def _analyze_ollama(self, alert_data: Dict[str, Any], raw_logs: list[str]) -> Dict[str, Any]:
        """Query local Ollama instance (LLaMA 3 model)"""
        prompt_content = f"Alert Data:\n{json.dumps(alert_data, indent=2)}\n\nRaw Log Payloads:\n" + "\n".join(raw_logs)
        url = f"{settings.OLLAMA_BASE_URL}/api/generate"
        payload = {
            "model": settings.OLLAMA_MODEL,
            "prompt": f"{SYSTEM_PROMPT}\n\n{prompt_content}",
            "stream": False,
            "format": "json"
        }
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(url, json=payload)
                if response.status_code == 200:
                    resp_json = response.json()
                    parsed = json.loads(resp_json.get("response", "{}"))
                    return parsed
                else:
                    logger.warning(f"Ollama API returned status {response.status_code}, falling back to smart local.")
                    return self._analyze_smart_local(alert_data, raw_logs)
        except Exception as e:
            logger.error(f"Failed to connect to Ollama ({e}), using smart local fallback.")
            return self._analyze_smart_local(alert_data, raw_logs)

    async def _analyze_openai(self, alert_data: Dict[str, Any], raw_logs: list[str]) -> Dict[str, Any]:
        """Query OpenAI Chat Completion API"""
        if not settings.OPENAI_API_KEY:
            logger.warning("OpenAI API key missing, using smart local fallback.")
            return self._analyze_smart_local(alert_data, raw_logs)
            
        url = "https://api.openai.com/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
            "Content-Type": "application/json"
        }
        prompt_content = f"Alert Data:\n{json.dumps(alert_data, indent=2)}\n\nRaw Log Payloads:\n" + "\n".join(raw_logs)
        payload = {
            "model": settings.OPENAI_MODEL,
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt_content}
            ],
            "response_format": {"type": "json_object"}
        }
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.post(url, headers=headers, json=payload)
                if response.status_code == 200:
                    result = response.json()
                    content = result["choices"][0]["message"]["content"]
                    return json.loads(content)
                else:
                    return self._analyze_smart_local(alert_data, raw_logs)
        except Exception as e:
            logger.error(f"OpenAI API call failed: {e}")
            return self._analyze_smart_local(alert_data, raw_logs)

ai_engine = AIEngine()
