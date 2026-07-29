import React, { useContext, useState } from 'react';
import { Shield, User, LogOut, Cpu, QrCode, Bell, Volume2, VolumeX, Menu, X, Bot } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';
import { NotificationContext } from '../context/NotificationContext';
import QRCodeModal from './QRCodeModal';
import NotificationHistoryModal from './NotificationHistoryModal';
import AIChatBotModal, { AIBotAvatar } from './AIChatBotModal';

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', flexWrap: 'nowrap' }}>
          {/* Left: Brand Logo & Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
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
              <h1 style={{ fontSize: '1.25rem', fontWeight: '800', background: 'linear-gradient(90deg, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0, lineHeight: 1.2 }}>
                SecOps AI | Incident Response Center
              </h1>
              <p style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '500', margin: '2px 0 0 0' }}>
                Autonomous Cyber Incident Containment System & Playbook Automation
              </p>
            </div>
          </div>

          {/* Center: System Status Badges */}
          <div className="desktop-only-flex" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(15, 23, 42, 0.6)', padding: '7px 14px', borderRadius: '20px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
              <Cpu size={16} color="#06b6d4" />
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600' }}>AI Agent: <span style={{ color: '#10b981' }}>SMART LOCAL (LLaMA 3 Ready)</span></span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(15, 23, 42, 0.6)', padding: '7px 14px', borderRadius: '20px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
              <div className={connected ? "pulse-dot" : "pulse-dot-red"}></div>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600' }}>
                {connected ? "LIVE SIEM STREAM" : "DISCONNECTED"}
              </span>
            </div>
          </div>

          {/* Right: Action Controls & User Profile Card */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
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

            {/* User Profile Card (Positioned at Far Right where AI Assistant was) */}
            {user && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'rgba(11, 17, 32, 0.75)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  borderRadius: '14px',
                  padding: '6px 10px 6px 8px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
                }}
              >
                {/* Circular User Avatar */}
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(6, 182, 212, 0.12)',
                    border: '1px solid rgba(6, 182, 212, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <User size={16} color="#38bdf8" />
                </div>

                {/* Name & Role Stack */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span
                    style={{
                      fontSize: '0.825rem',
                      fontWeight: '700',
                      color: '#f8fafc',
                      lineHeight: 1.2
                    }}
                    title={user.full_name || user.username}
                  >
                    {user.full_name || user.username}
                  </span>
                  <div>
                    <span
                      className="badge-critical"
                      style={{
                        fontSize: '0.6rem',
                        padding: '1px 6px',
                        borderRadius: '10px',
                        letterSpacing: '0.04em'
                      }}
                    >
                      {user.role}
                    </span>
                  </div>
                </div>

                {/* Rounded Square Logout Button */}
                <button
                  id="logout-button"
                  onClick={logout}
                  className="btn-cyber-outline"
                  style={{
                    padding: '7px 9px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: '4px'
                  }}
                  title="Sign out"
                >
                  <LogOut size={15} color="#38bdf8" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Floating AI Bot Avatar Widget Button (matching screenshot) */}
      {!chatOpen && (
        <div
          className="ai-chat-fab-float"
          style={{
            position: 'fixed',
            bottom: '28px',
            right: '28px',
            zIndex: 9999
          }}
          title="Open AI SOC Assistant Chat"
        >
          <AIBotAvatar
            size={54}
            iconSize={26}
            showLine={true}
            onClick={() => setChatOpen(true)}
          />
        </div>
      )}

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

