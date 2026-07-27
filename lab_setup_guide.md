# SecOps Lab Setup & VM Deployment Blueprint

This guide provides step-by-step instructions for reproducing the exact cyber attack and automated incident response lab environment described in the project proposal **"Prioritizing AI to Enhance Security Operations (SecOps)"**.

---

## Lab Architecture & IP Scheme

```
+--------------------------+          +--------------------------+
|       Attacker VM        |          |        Victim VM         |
|        Kali Linux        |          |  Ubuntu Server 22.04 LTS |
|     IP: 192.168.1.100    |  ----->  |     IP: 192.168.1.50     |
| (Hydra / Password-Guess) |          |   (SSH Service / UFW)    |
+--------------------------+          +--------------------------+
                                                   |
                                                   | Log Stream / API
                                                   v
                                      +--------------------------+
                                      |     SIEM & AI Server     |
                                      |  SecOps Engine + Ollama  |
                                      |     (Host / Docker)      |
                                      +--------------------------+
```

---

## 1. Victim VM Setup (Ubuntu Server 22.04 LTS - IP: 192.168.1.50)

### Step 1.1: Install & Configure SSH Service
```bash
# Update repositories and install OpenSSH server
sudo apt update && sudo apt install -y openssh-server ufw

# Ensure SSH service is active
sudo systemctl enable --now ssh
```

### Step 1.2: Enable UFW Firewall & Ensure Baseline Rules
```bash
# Allow SSH initially for management
sudo ufw allow 22/tcp
sudo ufw enable
sudo ufw status verbose
```

---

## 2. Attacker VM Setup (Kali Linux - IP: 192.168.1.100)

### Step 2.1: Verify Connectivity to Target
```bash
ping -c 4 192.168.1.50
```

### Step 2.2: Launch SSH Brute Force Attack using Hydra
```bash
# High-frequency password-guessing attack against target SSH daemon
hydra -l root -P /usr/share/wordlists/rockyou.txt ssh://192.168.1.50 -t 4
```

---

## 3. Local AI Engine Setup (Ollama + LLaMA 3)

### Step 3.1: Install Ollama
On Linux/macOS:
```bash
curl -fsSL https://ollama.com/install.sh | sh
```
On Windows: Download the installer from [ollama.com](https://ollama.com).

### Step 3.2: Pull and Serve LLaMA 3 Model
```bash
ollama pull llama3
ollama run llama3
```

### Step 3.3: Configure SecOps System `.env`
Inside `backend/.env`:
```env
AI_ENGINE_MODE=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3
```

---

## 4. Verification & Automated Containment Workflow

1. Start SecOps System Backend:
   ```bash
   cd backend
   python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```
2. Start SecOps Web Dashboard:
   ```bash
   cd frontend
   npm run dev
   ```
3. Open Dashboard at `http://localhost:5173`.
4. Trigger Hydra attack from Kali VM (`192.168.1.100`).
5. Observe `/var/log/auth.log` failed password spikes triggering **Wazuh Rule 5712**.
6. Verify AI Threat Inference verdict: `TRUE_POSITIVE` (Critical Risk Score: 98/100).
7. Confirm automated UFW block rule applied in ~3.2 seconds MTTR:
   ```bash
   sudo ufw status
   # Output: Deny from 192.168.1.100
   ```
