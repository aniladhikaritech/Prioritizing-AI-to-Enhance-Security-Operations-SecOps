import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT access token to requests
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

export const authAPI = {
  login: async (username, password) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    const response = await axios.post(`${API_BASE_URL}/auth/login`, formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

export const dashboardAPI = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  }
};

export const logsAPI = {
  getLogs: async (limit = 50) => {
    const response = await api.get(`/logs?limit=${limit}`);
    return response.data;
  }
};

export const alertsAPI = {
  getAlerts: async () => {
    const response = await api.get('/alerts');
    return response.data;
  },
  getAlertById: async (id) => {
    const response = await api.get(`/alerts/${id}`);
    return response.data;
  }
};

export const incidentsAPI = {
  getIncidents: async () => {
    const response = await api.get('/incidents');
    return response.data;
  }
};

export const firewallAPI = {
  getRules: async () => {
    const response = await api.get('/firewall');
    return response.data;
  },
  unblockIP: async (ip) => {
    const response = await api.post(`/firewall/${ip}/unblock`);
    return response.data;
  }
};

export const simulatorAPI = {
  launchSimulation: async (attackType, attackerIp, attemptCount) => {
    const response = await api.post('/simulator/launch', {
      attack_type: attackType,
      attacker_ip: attackerIp,
      attempt_count: attemptCount
    });
    return response.data;
  }
};

export const networkAPI = {
  getQR: async () => {
    const response = await api.get('/network/qr');
    return response.data;
  }
};

export default api;

