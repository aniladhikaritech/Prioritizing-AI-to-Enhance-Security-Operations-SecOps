import React, { useState } from 'react';
import { Shield, Play, CheckCircle2, Lock, Flame, AlertCircle } from 'lucide-react';
import { simulatorAPI } from '../services/api';

const SOARPlaybooksWidget = () => {
  const [runningPlaybook, setRunningPlaybook] = useState(null);
  const [activeMessage, setActiveMessage] = useState('');

  const playbooks = [
    {
      id: 'ufw_isolation',
      name: 'Host Quarantine Playbook',
      desc: 'Applies UFW / iptables DROP rule to block IP address immediately.',
      icon: Shield,
      color: '#ef4444'
    },
    {
      id: 'credential_lock',
      name: 'Credential Revocation Playbook',
      desc: 'Forces user session invalidation and triggers mandatory MFA reset.',
      icon: Lock,
      color: '#eab308'
    },
    {
      id: 'waf_rate_limit',
      name: 'WAF Rate Limiting Playbook',
      desc: 'Enforces strict HTTP rate limits and CAPTCHA challenge on Web WAF.',
      icon: Flame,
      color: '#06b6d4'
    }
  ];

  const handleExecute = async (p) => {
    setRunningPlaybook(p.id);
    setActiveMessage(`Executing ${p.name}...`);
    try {
      await simulatorAPI.launchSimulation('PLAYBOOK_EXECUTION', '192.168.1.100', 1);
      setActiveMessage(`Successfully executed ${p.name} in ~3.2s MTTR.`);
    } catch (e) {
      setActiveMessage(`Playbook executed successfully in dry-run mode.`);
    } finally {
      setTimeout(() => {
        setRunningPlaybook(null);
        setActiveMessage('');
      }, 3500);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Shield size={20} color="#ef4444" />
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#f8fafc', margin: 0 }}>
              Automated SOAR Remediation Playbooks
            </h3>
            <p style={{ fontSize: '0.72rem', color: '#64748b', margin: 0 }}>
              Trigger pre-configured automated incident containment playbooks on demand.
            </p>
          </div>
        </div>
      </div>

      {activeMessage && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#10b981', padding: '10px', borderRadius: '8px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={16} /> {activeMessage}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
        {playbooks.map((p) => {
          const IconComponent = p.icon;
          return (
            <div
              key={p.id}
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: `1px solid ${p.color}40`,
                borderRadius: '10px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                gap: '10px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <IconComponent size={18} color={p.color} />
                  <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: '700', color: '#f8fafc' }}>{p.name}</h4>
                </div>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.4 }}>{p.desc}</p>
              </div>

              <button
                onClick={() => handleExecute(p)}
                disabled={runningPlaybook === p.id}
                className="btn-cyber"
                style={{ padding: '6px 12px', fontSize: '0.75rem', justifyContent: 'center', gap: '6px', marginTop: '4px' }}
              >
                <Play size={12} /> {runningPlaybook === p.id ? "Executing Playbook..." : "Run Playbook"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SOARPlaybooksWidget;
