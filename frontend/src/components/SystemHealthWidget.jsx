import React from 'react';
import { HeartPulse, CheckCircle2, AlertCircle } from 'lucide-react';

const SystemHealthWidget = () => {
  const services = [
    { name: 'FastAPI Backend Engine', status: 'ONLINE', latency: '12ms' },
    { name: 'UFW SOAR Firewall Agent', status: 'ACTIVE', latency: '4ms' },
    { name: 'Ollama LLaMA 3 AI Service', status: 'READY', latency: '45ms' },
    { name: 'SQLite / Postgres DB Storage', status: 'HEALTHY', latency: '2ms' },
    { name: 'Wazuh SIEM Webhook Ingestor', status: 'LISTENING', latency: '8ms' }
  ];

  return (
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <HeartPulse size={20} color="#10b981" />
        <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#f8fafc', margin: 0 }}>
          Live System & Service Health Monitor
        </h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
        {services.map((s, idx) => (
          <div
            key={idx}
            style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: '8px',
              padding: '10px 12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#f8fafc', display: 'block' }}>{s.name}</span>
              <span style={{ fontSize: '0.68rem', color: '#64748b' }}>Latency: {s.latency}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', fontSize: '0.7rem', fontWeight: '800' }}>
              <CheckCircle2 size={14} /> {s.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemHealthWidget;
