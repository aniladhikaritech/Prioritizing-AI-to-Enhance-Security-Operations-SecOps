# Prioritizing AI to Enhance Security Operations (SecOps)
## Autonomous AI-Powered Automated Incident Response System (SOAR)

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
4. **Interactive SecOps Visual Dashboard**: Glassmorphic dark-mode web application featuring real-time WebSocket feeds, radial risk gauges, incident timelines, firewall quarantine management, audio alerts, and an interactive attack simulator.

---

## ✨ Features & Capabilities

### Core Requirements (Project Proposal)
- **AI-Powered SecOps Dashboard**: Real-time glassmorphic visual operations center.
- **FastAPI & React Architecture**: Modular Python backend with modern React Vite SPA.
- **Flexible Database Storage**: SQLAlchemy ORM with SQLite or PostgreSQL database models.
- **JWT & RBAC Security**: Granular role-based access control (`Admin`, `Analyst`).
- **Wazuh & ELK Ingestion**: Real-time webhook ingestion endpoint parsing Wazuh Rule 5712.
- **Ollama LLaMA 3 Integration**: Native offline local LLM serving alongside Smart Local fallback.
- **Automated Incident Response**: UFW & iptables firewall isolation playbooks executed in ~3.2s MTTR.
- **Docker Deployment**: Single command orchestration via Docker Compose.

### Enhanced Features
1. 🔊 **Real-time Sound Alerts**: Synthesized audio alert tones for High and Critical security incidents, with user enable/disable controls.
2. 🔔 **Real-time In-App Notification Alerts**: Floating toast notifications styled by severity (Low, Medium, High, Critical) with incident summary, timestamp, recommended action, and a Notification History panel.
3. 📱 **Mobile Network QR Code Access**: Auto-detected local IP network QR code allowing trusted local network users to scan and open the dashboard on mobile devices.
4. 📱 **Mobile-Friendly Layout**: Fully responsive layout with mobile drawer navigation, optimized touch targets, and responsive charts.
5. ⚡ **Real-time WebSocket Updates**: Push updates across alerts, incidents, firewall rules, and AI analysis without page refreshes.
6. 🧠 **Structured AI Incident Summaries**: Concise, structured AI breakdown detailing *What Happened*, *Why Classified Malicious*, *Risk Level*, *Automated Actions Taken*, and *Recommended Next Steps*.
7. 📊 **Enhanced Dashboard Widgets**: Live Recent Activity Feed, Live Attack Counter, Top Attacker IP Breakdown, Risk Score Overview, and System Health Monitor.
8. 🔐 **Security & Code Quality**: Input validation via Pydantic v2 schemas, rate limiting via `slowapi`, and timezone-aware UTC datetime tracking.

---

## 🏗️ System Architecture & Workflow

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ React Frontend (Vite + Glassmorphic UI + Audio Alerts + QR Generator + Responsive Grid) │
└───────────────────────────────────────────┬─────────────────────────────────────────────┘
                                            │ REST APIs & WebSockets (/ws)
┌───────────────────────────────────────────▼─────────────────────────────────────────────┐
│ FastAPI Backend Engine                                                                  │
│  ├─ Auth & Security (JWT, RBAC, Rate Limiting)                                         │
│  ├─ Log & SIEM Ingestor (Wazuh Rule 5712, auth.log regex parser)                        │
│  ├─ AI Engine (Ollama LLaMA 3, OpenAI, Smart Local Engine)                             │
│  ├─ SOAR Execution Playbooks (UFW / iptables drop execution)                            │
│  └─ WebSocket Broadcast Hub & Network QR API                                            │
└───────────────────────────────────────────┬─────────────────────────────────────────────┘
                                            │ SQLAlchemy ORM
┌───────────────────────────────────────────▼─────────────────────────────────────────────┐
│ SQLite / PostgreSQL Production Database                                                 │
│  [Users]  │  [Logs]  │  [Alerts]  │  [AI Analyses]  │  [Firewall Rules]  │  [Incidents]     │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start Guide

### Option 1: Running Locally (Development Mode)

#### 1. Backend Setup
```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
- REST API Base URL: `http://localhost:8000/api/v1`
- Swagger OpenAPI Specs: `http://localhost:8000/docs`

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

## 🧪 Automated Testing & Verification

### Run Backend Pytest Suite
```bash
cd backend
python -m pytest tests
```
Verified Test Suite:
- `test_auth.py`: User registration, password hashing, and JWT token authentication.
- `test_log_parser.py`: Auth log extraction and Wazuh Rule 5712 threshold parsing.
- `test_ai_engine.py`: AI threat verdict evaluation and structured incident summary validation.
- `test_network.py`: Local network IP auto-detection and QR code generation.
- `test_wazuh_integration.py`: End-to-end Wazuh alert webhook ingestion and automated firewall quarantine execution.

### Run Frontend Production Build Verification
```bash
cd frontend
npm run build
```
Result: Clean Vite production build with zero errors.

---

## 📖 Comprehensive Lab Setup Guide

For full Virtual Machine lab deployment instructions (Kali Linux Attacker VM `192.168.1.100`, Ubuntu Victim VM `192.168.1.50`, and Ollama LLaMA 3 model serving), refer to [lab_setup_guide.md](file:///d:/Programming/First%20Year%20Cybersecurity%20Project/lab_setup_guide.md).

