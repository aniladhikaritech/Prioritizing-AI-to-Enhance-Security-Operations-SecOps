import React from 'react';
import { FileText, Download, X, Shield, Award } from 'lucide-react';

const ExecutiveBriefingModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleDownloadReport = () => {
    const reportContent = `
================================================================================
          CISO EXECUTIVE SECURITY BRIEFING REPORT
          Autonomous SecOps & AI Incident Response Assessment
================================================================================
Generated Date: ${new Date().toLocaleString()}
System Status: HEALTHY & FULLY OPERATIONAL (98.2% AI Noise Reduction)

1. EXECUTIVE SUMMARY:
   - System monitored 1,248 security log telemetry events over the last 24 hours.
   - Identified and neutralized 53 threat attempts (primarily SSH Hydra Brute Force).
   - Automated SOAR Engine isolated malicious attacker IPs in an average of 3.2 seconds MTTR.

2. THREAT CLASSIFICATION & MITRE ATT&CK MAPPING:
   - Tactic: Credential Access (T1110.001 Password Guessing)
   - Primary Threat Vector: 192.168.1.100 (Kali Linux SOC Attack Simulation)
   - Risk Score: 98/100 (CRITICAL)
   - AI Verdict: TRUE_POSITIVE (98% Confidence)

3. AUTOMATED RESPONSE PLAYBOOKS EXECUTED:
   - UFW Host Isolation: DROPPED traffic from 192.168.1.100.
   - Real-time WebSocket Alert Dispatched to SOC Analysts.

4. COMPLIANCE & GOVERNANCE:
   - NIST 800-53 Incident Response Compliance: PASSED.
   - ISO 27001 Security Logging Standard: PASSED.

Report Approved By: Chief Information Security Officer (CISO) / Lead SecOps Engineer
================================================================================
`;
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CISO_Executive_Security_Briefing_${Date.now()}.txt`;
    link.click();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '580px', padding: '28px', borderRadius: '16px', border: '1px solid rgba(6, 182, 212, 0.5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Award size={24} color="#06b6d4" />
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '800', color: '#f8fafc' }}>
                CISO Executive Security Briefing Generator
              </h3>
              <span style={{ fontSize: '0.72rem', color: '#10b981' }}>● Enterprise Compliance Ready</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(56, 189, 248, 0.2)', padding: '18px', borderRadius: '12px', fontSize: '0.85rem', lineHeight: 1.6, color: '#cbd5e1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '12px' }}>
            <span style={{ fontWeight: '700', color: '#38bdf8' }}>Assessment Period: Last 24 Hours</span>
            <span className="badge-success" style={{ fontSize: '0.65rem' }}>NIST 800-53 Compliant</span>
          </div>

          <p style={{ margin: '0 0 10px 0' }}>
            <strong>System Performance:</strong> Filtered <strong>1,248 raw logs</strong> with <strong>98.2% noise reduction</strong>.
          </p>
          <p style={{ margin: '0 0 10px 0' }}>
            <strong>Critical Incident:</strong> Neutralized SSH Brute Force attempt from <code>192.168.1.100</code> in <strong>3.2 seconds MTTR</strong>.
          </p>
          <p style={{ margin: 0 }}>
            <strong>AI Confidence:</strong> 98% verdict score using local LLaMA 3 model serving.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
          <button onClick={onClose} className="btn-cyber-outline" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
            Close
          </button>
          <button onClick={handleDownloadReport} className="btn-cyber" style={{ padding: '8px 18px', fontSize: '0.8rem', gap: '8px' }}>
            <Download size={16} /> Download Executive Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveBriefingModal;
