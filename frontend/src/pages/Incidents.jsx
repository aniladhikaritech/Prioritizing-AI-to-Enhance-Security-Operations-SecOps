import React, { useState, useEffect } from 'react';
import { AlertOctagon, Clock, ShieldAlert, FileText } from 'lucide-react';
import { incidentsAPI } from '../services/api';

const Incidents = () => {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    incidentsAPI.getIncidents().then(setIncidents).catch(console.error);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <AlertOctagon size={24} color="#06b6d4" />
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#f8fafc' }}>
              Incident Response History & Playbook Executions
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Complete audit trail of autonomous containment playbooks executed by the SecOps AI Engine.
            </p>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '24px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(56, 189, 248, 0.2)', color: '#94a3b8' }}>
              <th style={{ padding: '12px' }}>Incident ID</th>
              <th style={{ padding: '12px' }}>Attacker IP</th>
              <th style={{ padding: '12px' }}>Playbook Name</th>
              <th style={{ padding: '12px' }}>Status</th>
              <th style={{ padding: '12px' }}>MTTR</th>
              <th style={{ padding: '12px' }}>Execution Date</th>
            </tr>
          </thead>
          <tbody>
            {incidents.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
                  No historical incidents recorded yet. Use the Attack Simulator to generate lab attacks.
                </td>
              </tr>
            ) : (
              incidents.map((inc) => (
                <tr key={inc.id} style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.1)' }}>
                  <td style={{ padding: '12px', fontWeight: '700', color: '#38bdf8' }}>#INC-{inc.id}</td>
                  <td style={{ padding: '12px', fontFamily: 'var(--font-mono)' }}>{inc.source_ip}</td>
                  <td style={{ padding: '12px', color: '#e2e8f0' }}>{inc.playbook_name}</td>
                  <td style={{ padding: '12px' }}>
                    <span className="badge-success">{inc.status}</span>
                  </td>
                  <td style={{ padding: '12px', color: '#10b981', fontWeight: '700' }}>{inc.mttr_seconds}s</td>
                  <td style={{ padding: '12px', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                    {new Date(inc.created_at).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Incidents;
