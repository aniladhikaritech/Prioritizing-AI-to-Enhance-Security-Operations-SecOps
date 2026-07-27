import axios from 'axios';

const getApiBaseUrl = () => {
  const hostname = window.location.hostname || 'localhost';
  if (hostname.includes('github.io') || hostname.includes('vercel.app')) {
    return 'http://localhost:8000/api/v1';
  }
  return `http://${hostname}:8000/api/v1`;
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 4000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('secops_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Fallback Mock Data for Live Web Demo (GitHub Pages)
const MOCK_USER = {
  id: 1,
  username: 'admin',
  full_name: 'Anil Adhikari (SecOps Admin)',
  role: 'Admin',
  is_active: true
};

const MOCK_STATS = {
  total_logs: 1248,
  processed_alerts: 53,
  active_incidents: 1,
  blocked_ips: 1,
  avg_mttr_seconds: 3.2,
  noise_reduction_percent: 98.2,
  system_health: '100% HEALTHY'
};

const MOCK_LOGS = [
  { id: 101, timestamp: new Date().toISOString(), source_ip: '192.168.1.100', event_type: 'SSH_FAILED_LOGIN', raw_payload: 'Failed password for root from 192.168.1.100 port 49152 ssh2', severity: 'HIGH' },
  { id: 102, timestamp: new Date(Date.now() - 30000).toISOString(), source_ip: '185.220.101.5', event_type: 'PORT_SCAN', raw_payload: 'SYN scan detected on port 22, 80, 443', severity: 'MEDIUM' },
  { id: 103, timestamp: new Date(Date.now() - 60000).toISOString(), source_ip: '45.142.120.10', event_type: 'WAF_SQLI_ATTEMPT', raw_payload: 'SELECT * FROM users WHERE username = \'admin\' OR 1=1--', severity: 'CRITICAL' }
];

const MOCK_INCIDENT = {
  id: 1,
  source_ip: '192.168.1.100',
  threat_type: 'SSH Brute Force Attack',
  risk_score: 98,
  verdict: 'TRUE_POSITIVE',
  mttr_seconds: 3.2,
  created_at: new Date().toISOString(),
  alert: {
    ai_analysis: {
      risk_score: 98,
      verdict: 'TRUE_POSITIVE',
      threat_type: 'SSH Brute Force Attack',
      confidence_score: 0.98,
      summary: 'High-frequency SSH password guessing detected (53 attempts in 90 seconds). Automated UFW isolation playbook executed.',
      raw_response: {
        verdict: 'TRUE_POSITIVE',
        risk_score: 98,
        threat_type: 'SSH Brute Force Attack',
        confidence_score: 0.98,
        summary: 'Attacker VM 192.168.1.100 attempted automated credential harvesting.',
        recommended_action: 'UFW Firewall Isolation Applied'
      }
    }
  }
};

const MOCK_FIREWALL_RULES = [
  { id: 1, ip_address: '192.168.1.100', action: 'DROP', reason: 'AI SOAR Quarantine (Risk 98/100)', created_at: new Date().toISOString() }
];

export const authAPI = {
  login: async (username, password) => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);
      const response = await axios.post(`${getApiBaseUrl()}/auth/login`, formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: 4000
      });
      return response.data;
    } catch (err) {
      console.warn("Backend API offline - switching to SecOps Live Demo Mode.");
      return {
        access_token: "demo_access_token_secops",
        token_type: "bearer",
        user: MOCK_USER
      };
    }
  },
  getMe: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (err) {
      return MOCK_USER;
    }
  }
};

export const dashboardAPI = {
  getStats: async () => {
    try {
      const response = await api.get('/dashboard/stats');
      return response.data;
    } catch (err) {
      return MOCK_STATS;
    }
  }
};

export const logsAPI = {
  getLogs: async (limit = 50) => {
    try {
      const response = await api.get(`/logs?limit=${limit}`);
      return response.data;
    } catch (err) {
      return MOCK_LOGS;
    }
  }
};

export const alertsAPI = {
  getAlerts: async () => {
    try {
      const response = await api.get('/alerts');
      return response.data;
    } catch (err) {
      return [MOCK_INCIDENT.alert];
    }
  },
  getAlertById: async (id) => {
    try {
      const response = await api.get(`/alerts/${id}`);
      return response.data;
    } catch (err) {
      return MOCK_INCIDENT.alert;
    }
  }
};

export const incidentsAPI = {
  getIncidents: async () => {
    try {
      const response = await api.get('/incidents');
      return response.data;
    } catch (err) {
      return [MOCK_INCIDENT];
    }
  }
};

export const firewallAPI = {
  getRules: async () => {
    try {
      const response = await api.get('/firewall');
      return response.data;
    } catch (err) {
      return MOCK_FIREWALL_RULES;
    }
  },
  unblockIP: async (ip) => {
    try {
      const response = await api.post(`/firewall/${ip}/unblock`);
      return response.data;
    } catch (err) {
      return { message: `IP ${ip} unblocked successfully` };
    }
  }
};

export const simulatorAPI = {
  launchSimulation: async (attackType, attackerIp, attemptCount) => {
    try {
      const response = await api.post('/simulator/launch', {
        attack_type: attackType,
        attacker_ip: attackerIp,
        attempt_count: attemptCount
      });
      return response.data;
    } catch (err) {
      return { message: `Simulated ${attackType} from ${attackerIp} executed.` };
    }
  }
};

export const networkAPI = {
  getQR: async () => {
    try {
      const response = await api.get('/network/qr');
      return response.data;
    } catch (err) {
      return { local_ip: '192.168.1.67', qr_code_base64: '' };
    }
  }
};

export const aiAPI = {
  chat: async (message) => {
    try {
      const response = await api.post('/ai/chat', { message });
      return response.data;
    } catch (err) {
      return {
        reply: `AI Analyst: High-frequency SSH brute force attack detected from IP 192.168.1.100. Automated UFW firewall isolation playbook executed with 98% risk score and 3.2s MTTR response time.`
      };
    }
  },
  getThreatIntel: async (ip) => {
    try {
      const response = await api.get(`/ai/threat-intel/${ip}`);
      return response.data;
    } catch (err) {
      return {
        ip: ip || '192.168.1.100',
        reputation_score: 98,
        country: 'Kali Lab Attacker (Nepal)',
        country_code: 'NP',
        city: 'Kathmandu SOC Lab',
        isp: 'SecOps Local Attack Vector',
        asn: 'AS1337',
        abuse_reports: 53
      };
    }
  }
};

export default api;
