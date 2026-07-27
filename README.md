# Prioritizing AI to Enhance Security Operations (SecOps)
## AI-Powered Automated Incident Response System

**Student Name:** Anil Adhikari  
**Project Title:** Prioritizing AI to Enhance Security Operations (SecOps)  
**System Category:** Autonomous SOAR & SOC Security Operations Platform  

---

## 🛡️ Project Overview & Purpose

Modern enterprise security operation centers (SOCs) face a massive operational challenge: **Alert Fatigue**. Security teams receive thousands of log alerts daily, making manual triage slow and error-prone. Sophisticated attacks move at machine speed, rendering traditional manual response times (15 minutes to hours) ineffective.

This project implements a complete **AI-Powered Automated Incident Response System (SOAR)** capable of:
1. **Real-Time Security Log Ingestion & Normalization**: Continuous monitoring of endpoint auth logs (`/var/log/auth.log`), Web WAF payloads, and SIEM rules (e.g., **Wazuh Rule 5712** for SSH Brute Force attempts).
2. **LLM Threat Analysis & Inference Engine**: Applying AI (Ollama LLaMA 3, OpenAI, or Smart Local Engine) to evaluate suspicious behavior, determine threat verdicts (`TRUE_POSITIVE` vs `FALSE_POSITIVE`), assign risk scores (0–100), and produce structured JSON explanations.
3. **Automated SOAR Quarantine Playbooks**: Instant execution of firewall drop commands (`UFW` / `iptables`) to isolate attacker IP addresses in **~3.2 seconds MTTR** (Mean Time to Respond).
4. **Interactive SecOps Visual Dashboard**: Glassmorphic dark-mode web application featuring real-time WebSocket feeds, radial risk gauges, incident timelines, firewall quarantine management, and an interactive attack simulator.

---

## 🏗️ System Architecture & Workflow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          SecOps Web Dashboard (Frontend)                        │
│   React (Vite) / HSL Cyber Glassmorphism / Lucide Icons / Real-Time WebSockets  │
└───────────────────────────────────────┬─────────────────────────────────────────┘
                                        │ REST APIs & WebSockets (/ws)
┌───────────────────────────────────────▼─────────────────────────────────────────┐
│                             FastAPI Backend Engine                              │
│  ┌─────────────────┬───────────────────┬────────────────────┬────────────────┐  │
│  │ Authentication  │  Log Ingestion    │   AI Engine        │  SOAR Engine   │  │
│  │ JWT & RBAC      │  Parser & Watcher │   (Ollama/OpenAI/  │  Automated     │  │
│  │ (Admin/Analyst) │  SIEM Rule 5712   │    SecOps Local)   │  Firewall/UFW  │  │
│  └─────────────────┴───────────────────┴────────────────────┴────────────────┘  │
└───────────────────────────────────────┬─────────────────────────────────────────┘
                                        │ SQLAlchemy ORM
┌───────────────────────────────────────▼─────────────────────────────────────────┐
│                               SQLite / PostgreSQL DB                            │
│     [Users]  │  [Logs]  │  [Alerts]  │  [AI Analyses]  │  [Firewall Rules]      │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Response Pipeline Breakdown
```
1. Attack Generation  --> Attacker VM (192.168.1.100) launches SSH brute force via Hydra.
2. Ingestion & Rule   --> Log parser extracts metadata, fires Wazuh Rule 5712 when failed attempts cross threshold.
3. AI Inference       --> LLM analyzes payload, returns Verdict: True Positive, Risk Score: 98/100, 98% Confidence.
4. SOAR Playbook      --> System executes UFW deny rule for 192.168.1.100 in 3.2s total MTTR.
5. Real-Time Feed     --> Live WebSocket broadcasts timeline update & quarantine state to dashboard.
```

---

## ⚡ Tech Stack & Technologies

- **Backend**: Python 3.11+, FastAPI, SQLAlchemy ORM, Pydantic v2, Pytest, WebSockets.
- **Frontend**: React 18, Vite, Lucide Icons, Axios, HSL CSS Glassmorphism Design Tokens.
- **AI & LLM Integration**: Ollama (LLaMA 3 offline), OpenAI API, Smart SecOps Local Inference Engine.
- **Database & Storage**: SQLite / PostgreSQL with seed user roles (`Admin`, `Analyst`).
- **Security & Containment**: UFW / iptables firewall execution, JWT authentication, bcrypt password hashing, RBAC control.
- **Deployment**: Docker, Docker Compose.

---

## 🚀 Quick Start Guide

### Option 1: Running Locally (Development Mode)

#### 1. Backend Setup
```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
- API Base URL: `http://localhost:8000/api/v1`
- OpenAPI Documentation: `http://localhost:8000/docs`

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
- Open Web Dashboard: `http://localhost:5173`

#### 3. Default Credentials
- **Admin**: Username: `admin`, Password: `admin123`
- **Analyst**: Username: `analyst`, Password: `analyst123`

---

### Option 2: Running with Docker Compose

```bash
docker-compose up --build
```
Access the dashboard at `http://localhost:5173`.

---

## 🧪 Automated Testing

Run the backend Pytest test suite:
```bash
cd backend
python -m pytest tests
```
Verified Test Coverage:
- `test_auth.py`: JWT login, password verification, and RBAC registration.
- `test_log_parser.py`: Auth log regex extraction and Wazuh Rule 5712 triggers.
- `test_ai_engine.py`: Structured JSON threat analysis & verdict validation.

---

## 📖 Comprehensive Lab Setup Guide

For full Virtual Machine deployment instructions (Kali Linux Attacker VM `192.168.1.100`, Ubuntu Victim VM `192.168.1.50`, and Ollama LLaMA 3 model serving), refer to [lab_setup_guide.md](file:///d:/Programming/First%20Year%20Cybersecurity%20Project/lab_setup_guide.md).
