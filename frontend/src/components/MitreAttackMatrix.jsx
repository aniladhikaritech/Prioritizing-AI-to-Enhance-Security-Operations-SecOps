import React from 'react';
import { Target, ShieldCheck, Zap } from 'lucide-react';

const MitreAttackMatrix = () => {
  const tactics = [
    {
      tactic: 'Reconnaissance',
      technique: 'T1595 - Active Scanning',
      subtechnique: 'Port & Service Scan',
      detected: true,
      status: 'MONITORED',
      color: '#38bdf8'
    },
    {
      tactic: 'Initial Access',
      technique: 'T1190 - Public-Facing App',
      subtechnique: 'Exploit Vulnerable Endpoint',
      detected: true,
      status: 'MITIGATED',
      color: '#eab308'
    },
    {
      tactic: 'Credential Access',
      technique: 'T1110.001 - Password Guessing',
      subtechnique: 'SSH Brute Force Hydra Attack',
      detected: true,
      status: 'QUARANTINED',
      color: '#ef4444'
    },
    {
      tactic: 'Execution',
      technique: 'T1059 - Command Interpreter',
      subtechnique: 'Unix Shell Execution Attempt',
      detected: false,
      status: 'PREVENTED',
      color: '#10b981'
    }
  ];

  return (
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Target size={20} color="#06b6d4" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#f8fafc', margin: 0 }}>
            MITRE ATT&CK® Enterprise Framework Mapping
          </h3>
        </div>
        <span className="badge-info" style={{ fontSize: '0.68rem' }}>
          NIST 800-53 Compliant
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '12px' }}>
        {tactics.map((item, idx) => (
          <div
            key={idx}
            style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: `1px solid ${item.color}40`,
              borderRadius: '10px',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <span style={{ fontSize: '0.68rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
              TACTIC: {item.tactic}
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#f8fafc' }}>
              {item.technique}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              {item.subtechnique}
            </span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: '800',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: `${item.color}20`,
                  color: item.color,
                  border: `1px solid ${item.color}60`
                }}
              >
                {item.status}
              </span>
              <span style={{ fontSize: '0.65rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <ShieldCheck size={12} /> Auto AI Mapped
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MitreAttackMatrix;
