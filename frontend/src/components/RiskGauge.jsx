import React from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';

const RiskGauge = ({ riskScore = 98, verdict = "TRUE_POSITIVE", threatType = "SSH Brute Force Attack", confidence = 0.98, onOpenModal }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return '#f43f5e';
    if (score >= 50) return '#f59e0b';
    return '#10b981';
  };

  const color = getScoreColor(riskScore);
  const strokeDashoffset = 440 - (440 * riskScore) / 100;

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <h4 style={{ fontSize: '0.9rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
        AI Threat Risk Assessment
      </h4>

      {/* SVG Radial Circular Gauge */}
      <div style={{ position: 'relative', width: '160px', height: '160px' }}>
        <svg width="160" height="160" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r="70" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="12" fill="transparent" />
          <circle
            cx="80"
            cy="80"
            r="70"
            stroke={color}
            strokeWidth="12"
            strokeDasharray="440"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{ transition: 'stroke-dashoffset 1s ease-in-out', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
          />
        </svg>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <span style={{ fontSize: '2.4rem', fontWeight: '800', color: '#f8fafc' }}>{riskScore}</span>
          <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>/ 100</span>
        </div>
      </div>

      {/* Verdict & Confidence Badge */}
      <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
        <div className={riskScore >= 80 ? "badge-critical" : riskScore >= 50 ? "badge-high" : "badge-success"} style={{ fontSize: '0.85rem' }}>
          VERDICT: {verdict.replace('_', ' ')}
        </div>
        <p style={{ fontSize: '0.85rem', fontWeight: '600', color: '#f8fafc' }}>{threatType}</p>
        <p style={{ fontSize: '0.75rem', color: '#64748b' }}>AI Confidence Score: <span style={{ color: '#10b981', fontWeight: '700' }}>{(confidence * 100).toFixed(0)}%</span></p>

        {/* Threat Severity Meter Bar (LOW / MEDIUM / HIGH / CRITICAL) */}
        <div style={{ width: '100%', marginTop: '14px', background: 'rgba(15, 23, 42, 0.6)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.15)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: '800', marginBottom: '6px' }}>
            <span style={{ color: riskScore < 40 ? '#10b981' : '#64748b' }}>LOW</span>
            <span style={{ color: riskScore >= 40 && riskScore < 70 ? '#eab308' : '#64748b' }}>MEDIUM</span>
            <span style={{ color: riskScore >= 70 && riskScore < 85 ? '#f97316' : '#64748b' }}>HIGH</span>
            <span style={{ color: riskScore >= 85 ? '#ef4444' : '#64748b' }}>CRITICAL</span>
          </div>
          <div style={{ height: '8px', width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${riskScore}%`,
                background: color,
                borderRadius: '4px',
                transition: 'width 0.8s ease'
              }}
            />
          </div>
        </div>

        {onOpenModal && (
          <button 
            id="view-ai-reasoning-btn"
            onClick={onOpenModal} 
            className="btn-cyber-outline" 
            style={{ marginTop: '10px', fontSize: '0.75rem', width: '100%' }}
          >
            Inspect LLM Reasoning JSON
          </button>
        )}
      </div>
    </div>
  );
};

export default RiskGauge;

