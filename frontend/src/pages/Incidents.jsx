import React, { useState, useEffect } from 'react';
import { AlertOctagon, ShieldAlert, FileText, ChevronDown, ChevronUp, Cpu, CheckCircle2, AlertTriangle } from 'lucide-react';
import { incidentsAPI } from '../services/api';

const Incidents = () => {
  const [incidents, setIncidents] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    incidentsAPI.getIncidents().then(setIncidents).catch(console.error);
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <AlertOctagon size={24} color="#06b6d4" />
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#f8fafc' }}>
              Incident Response History & AI Summaries
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Complete audit trail of autonomous playbooks and structured AI incident summaries (What happened, Why malicious, Risk level, Automated actions, Next steps).
            </p>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {incidents.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
              No historical incidents recorded yet. Use the Attack Simulator to generate lab attacks.
            </div>
          ) : (
            incidents.map((inc) => {
              const isExpanded = expandedId === inc.id;
              const ai = inc.alert?.ai_analysis;
              const raw = ai?.raw_response || ai;

              return (
                <div
                  key={inc.id}
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: isExpanded ? '1px solid rgba(6, 182, 212, 0.5)' : '1px solid rgba(56, 189, 248, 0.15)',
                    borderRadius: '10px',
                    padding: '16px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {/* Summary Bar */}
                  <div
                    onClick={() => toggleExpand(inc.id)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontWeight: '800', color: '#38bdf8', fontSize: '0.95rem' }}>#INC-{inc.id}</span>
                      <span className="badge-critical" style={{ fontSize: '0.7rem' }}>
                        {ai?.risk_level || 'CRITICAL'} ({ai?.risk_score ?? 98}/100)
                      </span>
                      <span style={{ color: '#f8fafc', fontWeight: '600', fontSize: '0.9rem' }}>
                        {ai?.threat_type || inc.playbook_name}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{ color: '#10b981', fontWeight: '700', fontSize: '0.85rem' }}>MTTR: {inc.mttr_seconds}s</span>
                      <span style={{ color: '#64748b', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                        {new Date(inc.created_at).toLocaleString()}
                      </span>
                      <button style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer' }}>
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* Structured AI Summary Accordion Body */}
                  {isExpanded && (
                    <div
                      style={{
                        marginTop: '16px',
                        paddingTop: '16px',
                        borderTop: '1px solid rgba(56, 189, 248, 0.2)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '14px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#06b6d4', fontWeight: '700', fontSize: '0.85rem' }}>
                        <Cpu size={16} /> Structured AI Incident Breakdown
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #38bdf8' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                            WHAT HAPPENED
                          </span>
                          <span style={{ fontSize: '0.85rem', color: '#f8fafc' }}>
                            {raw?.what_happened || raw?.summary || `Attack from source IP ${inc.source_ip} targeting system services.`}
                          </span>
                        </div>

                        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #ef4444' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                            WHY CLASSIFIED MALICIOUS
                          </span>
                          <span style={{ fontSize: '0.85rem', color: '#f8fafc' }}>
                            {raw?.why_malicious || `Triggered threshold rule with verdict ${ai?.verdict || 'TRUE_POSITIVE'} and confidence ${((ai?.confidence_score || 0.98)*100).toFixed(0)}%.`}
                          </span>
                        </div>

                        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #10b981' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                            AUTOMATED ACTIONS TAKEN
                          </span>
                          <span style={{ fontSize: '0.85rem', color: '#f8fafc' }}>
                            {raw?.automated_actions_taken || `Executed Playbook "${inc.playbook_name}": Quarantined IP ${inc.source_ip} via UFW DROP rules.`}
                          </span>
                        </div>

                        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #eab308' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                            RECOMMENDED NEXT STEPS
                          </span>
                          <span style={{ fontSize: '0.85rem', color: '#f8fafc' }}>
                            {raw?.recommended_next_steps || raw?.recommended_action || "Keep IP in quarantine and audit system authorization logs."}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Incidents;

