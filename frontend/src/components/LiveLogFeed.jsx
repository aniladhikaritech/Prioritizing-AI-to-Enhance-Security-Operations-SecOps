import React, { useState } from 'react';
import { Terminal, Filter } from 'lucide-react';

const LiveLogFeed = ({ logs = [] }) => {
  const [filter, setFilter] = useState('ALL');

  const filteredLogs = logs.filter((log) => {
    if (filter === 'ALL') return true;
    if (filter === 'FAILED') return log.event_type?.includes('FAILED') || log.severity === 'WARNING';
    if (filter === 'CRITICAL') return log.severity === 'CRITICAL' || log.event_type?.includes('SQL');
    return true;
  });

  return (
    <div className="glass-panel" style={{ padding: '20px', flex: '1' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Terminal size={18} color="#06b6d4" />
          <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#f8fafc' }}>
            Live Security Ingestion Terminal (`/var/log/auth.log`)
          </h4>
        </div>

        {/* Filter buttons */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {['ALL', 'FAILED', 'CRITICAL'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: filter === f ? 'rgba(6, 182, 212, 0.25)' : 'rgba(15, 23, 42, 0.6)',
                border: filter === f ? '1px solid #06b6d4' : '1px solid rgba(148, 163, 184, 0.2)',
                color: filter === f ? '#38bdf8' : '#94a3b8',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.7rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="terminal-window">
        {filteredLogs.length === 0 ? (
          <p style={{ color: '#64748b', fontStyle: 'italic' }}>Listening for live security events...</p>
        ) : (
          filteredLogs.map((item, index) => (
            <div key={item.id || index} style={{ marginBottom: '6px', display: 'flex', gap: '12px' }}>
              <span style={{ color: '#64748b' }}>[{new Date(item.timestamp).toLocaleTimeString()}]</span>
              <span style={{ color: item.severity === 'CRITICAL' ? '#f43f5e' : item.severity === 'WARNING' ? '#f59e0b' : '#10b981', fontWeight: '600' }}>
                [{item.severity}]
              </span>
              <span style={{ color: '#94a3b8' }}>IP: {item.source_ip}</span>
              <span style={{ color: '#e2e8f0', wordBreak: 'break-all' }}>{item.raw_payload}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LiveLogFeed;
