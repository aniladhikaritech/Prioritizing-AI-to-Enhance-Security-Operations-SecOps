import React from 'react';
import { ShieldAlert, Unlock, CheckCircle } from 'lucide-react';

const FirewallTable = ({ rules = [], onUnblock }) => {
  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldAlert size={20} color="#f43f5e" />
          <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#f8fafc' }}>
            Active Firewall Quarantine & Block List (UFW / iptables)
          </h4>
        </div>
        <span className="badge-critical" style={{ fontSize: '0.75rem' }}>
          {rules.filter(r => r.status === 'BLOCKED').length} Active Blocks
        </span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(56, 189, 248, 0.2)', color: '#94a3b8' }}>
              <th style={{ padding: '12px 16px' }}>Attacker IP Address</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
              <th style={{ padding: '12px 16px' }}>Risk Score</th>
              <th style={{ padding: '12px 16px' }}>Quarantine Reason</th>
              <th style={{ padding: '12px 16px' }}>Blocked At</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {rules.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
                  No active IP quarantines currently enforced.
                </td>
              </tr>
            ) : (
              rules.map((rule) => (
                <tr key={rule.id} style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.1)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '700', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                    {rule.ip_address}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className={rule.status === 'BLOCKED' ? "badge-critical" : "badge-success"}>
                      {rule.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: '700', color: '#f43f5e' }}>
                    {rule.risk_score} / 100
                  </td>
                  <td style={{ padding: '12px 16px', color: '#cbd5e1' }}>
                    {rule.reason}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#64748b', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                    {new Date(rule.blocked_at).toLocaleTimeString()}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    {rule.status === 'BLOCKED' ? (
                      <button
                        id={`unblock-btn-${rule.ip_address}`}
                        onClick={() => onUnblock(rule.ip_address)}
                        className="btn-cyber-outline"
                        style={{ padding: '4px 12px', fontSize: '0.75rem', borderColor: '#f43f5e', color: '#f43f5e' }}
                      >
                        <Unlock size={12} style={{ marginRight: '4px' }} />
                        Unblock IP
                      </button>
                    ) : (
                      <span style={{ color: '#10b981', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle size={14} /> Unblocked
                      </span>
                    )}
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

export default FirewallTable;
