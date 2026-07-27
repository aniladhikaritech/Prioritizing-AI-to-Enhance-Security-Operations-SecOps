import React from 'react';
import { CheckCircle2, Clock, Zap, ShieldCheck } from 'lucide-react';

const IncidentTimeline = ({ incident }) => {
  const steps = incident?.timeline_steps || [
    { time: "12:14:25", step: "Alert Triggered (Rule 5712)", detail: "SSH Brute Force threshold crossed from IP 192.168.1.100", status: "COMPLETED" },
    { time: "12:14:26", step: "Log Sent to AI Engine", detail: "Payload normalized & dispatched to Local LLM (LLaMA 3)", status: "COMPLETED" },
    { time: "12:14:27", step: "AI Analysis Completed", detail: "Verdict: True Positive (Critical Risk - 98/100)", status: "COMPLETED" },
    { time: "12:14:28", step: "Executing SOAR Playbook", detail: "Applying remote UFW firewall block rule for IP 192.168.1.100", status: "COMPLETED" },
    { time: "12:14:29", step: "Attacker IP Quarantined", detail: "All traffic dropped. Total Response Time: 3.2s", status: "SUCCESS" }
  ];

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Zap size={20} color="#10b981" />
          <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#f8fafc' }}>
            Automated Incident Response Timeline
          </h4>
        </div>
        <div className="badge-success" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Clock size={12} />
          Total Response Time: {incident?.mttr_seconds ?? 3.2}s
        </div>
      </div>

      {/* Timeline Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', paddingLeft: '20px', borderLeft: '2px solid rgba(6, 182, 212, 0.3)' }}>
        {steps.map((item, idx) => (
          <div key={idx} style={{ position: 'relative' }}>
            {/* Dot marker */}
            <div style={{
              position: 'absolute',
              left: '-27px',
              top: '2px',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: item.status === 'SUCCESS' ? '#10b981' : '#06b6d4',
              boxShadow: `0 0 10px ${item.status === 'SUCCESS' ? '#10b981' : '#06b6d4'}`
            }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h5 style={{ fontSize: '0.875rem', fontWeight: '700', color: '#f8fafc' }}>{item.step}</h5>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>{item.detail}</p>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncidentTimeline;
