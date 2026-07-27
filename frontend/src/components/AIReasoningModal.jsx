import React from 'react';
import { X, Cpu, CheckCircle2, ShieldAlert } from 'lucide-react';

const AIReasoningModal = ({ isOpen, onClose, aiData }) => {
  if (!isOpen) return null;

  const defaultData = aiData || {
    verdict: "TRUE_POSITIVE",
    risk_level: "CRITICAL",
    risk_score: 98,
    confidence_score: 0.98,
    threat_type: "SSH Brute Force Attack",
    summary: "Pattern indicates a highly automated SSH brute-force attempt from source IP 192.168.1.100 targeting Ubuntu server 192.168.1.50. Crosses 10 failed login attempts within 60s window.",
    recommended_action: "Immediate Network Isolation via UFW firewall drop rule for 192.168.1.100.",
    network_action: "IMMEDIATE_ISOLATION"
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(4, 6, 12, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto', padding: '28px', border: '1px solid rgba(6, 182, 212, 0.4)' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'rgba(6, 182, 212, 0.15)', padding: '8px', borderRadius: '8px', border: '1px solid #06b6d4' }}>
              <Cpu size={22} color="#06b6d4" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#f8fafc' }}>
                AI Threat Intelligence JSON Payload
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Structured inference produced by Ollama LLaMA 3 / SecOps Engine</p>
            </div>
          </div>
          <button id="close-ai-modal-btn" onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {/* Summary Card */}
        <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.2)', marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '10px' }}>
            <span className={defaultData.risk_score >= 80 ? "badge-critical" : "badge-high"}>
              {defaultData.verdict} ({defaultData.risk_score}/100)
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#38bdf8' }}>{defaultData.threat_type}</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#e2e8f0', lineHeight: '1.5' }}>
            <strong>Analysis Summary:</strong> {defaultData.summary}
          </p>
          <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(148, 163, 184, 0.1)' }}>
            <p style={{ fontSize: '0.825rem', color: '#10b981', fontWeight: '600' }}>
              <strong>Recommended Remediation:</strong> {defaultData.recommended_action}
            </p>
          </div>
        </div>

        {/* JSON Code Viewer */}
        <h5 style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Raw Structured Output
        </h5>
        <pre className="terminal-window" style={{ maxHeight: '240px', color: '#a7f3d0' }}>
          {JSON.stringify(defaultData, null, 2)}
        </pre>

        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <button id="close-modal-bottom-btn" onClick={onClose} className="btn-cyber" style={{ padding: '8px 20px' }}>
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIReasoningModal;
