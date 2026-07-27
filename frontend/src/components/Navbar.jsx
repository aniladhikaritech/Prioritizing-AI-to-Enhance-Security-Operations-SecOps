import React, { useContext, useState } from 'react';
import { Shield, User, LogOut, Cpu, QrCode, Bell, Volume2, VolumeX, Menu, X, Bot } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';
import { NotificationContext } from '../context/NotificationContext';
import QRCodeModal from './QRCodeModal';
import NotificationHistoryModal from './NotificationHistoryModal';
import AIChatBotModal from './AIChatBotModal';

const Navbar = ({ onToggleMobileSidebar, isMobileSidebarOpen }) => {
  const { user, logout } = useContext(AuthContext);
  const { connected } = useContext(SocketContext);
  const { soundEnabled, setSoundEnabled, history } = useContext(NotificationContext);

  const [qrOpen, setQrOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);


  return (
    <>
      <header className="glass-panel" style={{ borderRadius: '0', borderLeft: 'none', borderRight: 'none', borderTop: 'none', padding: '14px 28px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          {/* Brand Logo & Mobile Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={onToggleMobileSidebar}
              className="btn-cyber-outline mobile-only-flex"
              style={{ padding: '8px', display: 'none' }}
              aria-label="Toggle Navigation Menu"
            >
              {isMobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

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

          {/* Status Indicators & Action Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            {/* AI Engine Status */}
            <div className="desktop-only-flex" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(15, 23, 42, 0.6)', padding: '6px 14px', borderRadius: '20px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
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

            {/* Sound Alert Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="btn-cyber-outline"
              style={{ padding: '8px', borderRadius: '50%' }}
              title={soundEnabled ? "Disable Alert Audio" : "Enable Alert Audio"}
            >
              {soundEnabled ? <Volume2 size={18} color="#10b981" /> : <VolumeX size={18} color="#94a3b8" />}
            </button>

            {/* Notification History Bell Button */}
            <button
              onClick={() => setHistoryOpen(true)}
              className="btn-cyber-outline"
              style={{ padding: '8px', borderRadius: '50%', position: 'relative' }}
              title="Notification Alert History"
            >
              <Bell size={18} color="#38bdf8" />
              {history.length > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    background: '#ef4444',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    fontSize: '0.65rem',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {history.length > 99 ? '99+' : history.length}
                </span>
              )}
            </button>

            {/* QR Code Network Access Button */}
            <button
              onClick={() => setQrOpen(true)}
              className="btn-cyber-outline"
              style={{ padding: '6px 12px', fontSize: '0.8rem', gap: '6px' }}
              title="Generate QR Code for Mobile Access"
            >
              <QrCode size={16} color="#06b6d4" />
              <span>Mobile QR</span>
            </button>

            {/* AI SOC Assistant Chatbot Button */}
            <button
              onClick={() => setChatOpen(!chatOpen)}
              className="btn-cyber"
              style={{ padding: '6px 12px', fontSize: '0.8rem', gap: '6px' }}
              title="Open AI SOC Assistant Chat"
            >
              <Bot size={16} />
              <span>AI Chat</span>
            </button>

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

      {/* QR Code Modal */}
      <QRCodeModal isOpen={qrOpen} onClose={() => setQrOpen(false)} />

      {/* Notification History Modal */}
      <NotificationHistoryModal isOpen={historyOpen} onClose={() => setHistoryOpen(false)} />

      {/* AI SOC Assistant Chatbot */}
      <AIChatBotModal isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
};


export default Navbar;

