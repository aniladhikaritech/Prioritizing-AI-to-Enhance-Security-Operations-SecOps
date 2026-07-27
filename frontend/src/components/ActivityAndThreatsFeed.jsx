import React from 'react';
import { Radio, ShieldAlert, Cpu, AlertTriangle } from 'lucide-react';

const ActivityAndThreatsFeed = ({ logs = [], firewallRules = [] }) => {
  // Extract top attacker IPs from logs & firewall rules
  const ipCounts = {};
  logs.forEach(l => {
    if (l.source_ip) {
      ipCounts[l.source_ip] = (ipCounts[l.source_ip] || 0) + 1;
    }
  });

  const sortedIPs = Object.entries(ipCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
      {/* Live Recent Activity Feed */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Radio size={20} color="#06b6d4" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#f8fafc', margin: 0 }}>
            Live Recent Activity Feed
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto' }}>
          {logs.slice(0, 6).map((log, i) => (
            <div
              key={log.id || i}
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(56, 189, 248, 0.1)',
                padding: '10px 12px',
                borderRadius: '6px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.8rem'
              }}
            >
              <div>
                <span style={{ fontWeight: '700', color: log.severity === 'CRITICAL' ? '#ef4444' : '#38bdf8', marginRight: '8px' }}>
                  [{log.event_type || 'SSH_FAILED'}]
                </span>
                <span style={{ color: '#e2e8f0', fontFamily: 'var(--font-mono)' }}>{log.source_ip}</span>
              </div>
              <span style={{ color: '#64748b', fontSize: '0.72rem' }}>
                {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : 'Just now'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Attacker IP Addresses & Attack Trends */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldAlert size={20} color="#f43f5e" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#f8fafc', margin: 0 }}>
            Top Attacker IP Breakdown & Threat Vectors
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {sortedIPs.length === 0 ? (
            <div style={{ color: '#64748b', fontSize: '0.8rem', padding: '20px 0', textAlign: 'center' }}>
              No malicious IPs recorded yet.
            </div>
          ) : (
            sortedIPs.map(([ip, count], idx) => {
              const isBlocked = firewallRules.some(r => r.ip_address === ip && r.status === 'BLOCKED');
              return (
                <div
                  key={ip}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'rgba(15, 23, 42, 0.6)',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid rgba(244, 63, 94, 0.2)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b' }}>#{idx + 1}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: '700', color: '#f8fafc' }}>{ip}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>{count} attack attempts</span>
                    {isBlocked ? (
                      <span className="badge-critical" style={{ fontSize: '0.65rem' }}>QUARANTINED</span>
                    ) : (
                      <span className="badge-warning" style={{ fontSize: '0.65rem' }}>SUSPICIOUS</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityAndThreatsFeed;
