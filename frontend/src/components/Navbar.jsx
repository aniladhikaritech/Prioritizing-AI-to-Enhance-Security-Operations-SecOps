import React, { useContext } from 'react';
import { Shield, Radio, User, LogOut, Cpu } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { connected } = useContext(SocketContext);

  return (
    <header className="glass-panel" style={{ borderRadius: '0', borderLeft: 'none', borderRight: 'none', borderTop: 'none', padding: '14px 28px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Brand Logo & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)',
            padding: '10px',
            borderRadius: '10px',
            border: '1px solid rgba(6, 182, 212, 0.4)',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Shield size={26} color="#06b6d4" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: '800', background: 'linear-gradient(90deg, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              SecOps AI | Incident Response Center
            </h1>
            <p style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '500' }}>
              Autonomous Cyber Incident Containment System & Playbook Automation
            </p>
          </div>
        </div>

        {/* Status Indicators & User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* AI Engine Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(15, 23, 42, 0.6)', padding: '6px 14px', borderRadius: '20px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
            <Cpu size={16} color="#06b6d4" />
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600' }}>AI Agent: <span style={{ color: '#10b981' }}>SMART LOCAL (LLaMA 3 Ready)</span></span>
          </div>

          {/* WebSocket Connection Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(15, 23, 42, 0.6)', padding: '6px 14px', borderRadius: '20px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
            <div className={connected ? "pulse-dot" : "pulse-dot-red"}></div>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600' }}>
              {connected ? "LIVE SIEM STREAM" : "DISCONNECTED"}
            </span>
          </div>

          {/* User Badge */}
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '12px', borderLeft: '1px solid rgba(148, 163, 184, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={18} color="#38bdf8" />
                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#f8fafc' }}>{user.full_name || user.username}</span>
                <span className="badge-critical" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>{user.role}</span>
              </div>
              <button 
                id="logout-button"
                onClick={logout} 
                className="btn-cyber-outline" 
                style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                title="Sign out"
              >
                <LogOut size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
