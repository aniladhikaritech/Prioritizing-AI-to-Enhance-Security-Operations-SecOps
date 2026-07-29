import React, { useContext } from 'react';
import { LayoutDashboard, AlertOctagon, ShieldAlert, Settings, Crosshair, User, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = ({ activeTab, setActiveTab, isMobileOpen, onCloseMobile }) => {
  const { user, logout } = useContext(AuthContext);

  const navItems = [
    { id: 'dashboard', label: 'SOC Dashboard', icon: LayoutDashboard },
    { id: 'incidents', label: 'Incidents & Playbooks', icon: AlertOctagon },
    { id: 'firewall', label: 'Firewall & Quarantine', icon: ShieldAlert },
    { id: 'simulator', label: 'Attack Simulator', icon: Crosshair },
    { id: 'settings', label: 'AI Configuration', icon: Settings },
  ];

  const handleSelect = (id) => {
    setActiveTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside
      className={`glass-panel sidebar-responsive ${isMobileOpen ? 'mobile-open' : ''}`}
      style={{
        width: '250px',
        minHeight: 'calc(100vh - 120px)',
        padding: '16px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}
    >
      <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '8px 12px' }}>
        Navigation Menu
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => handleSelect(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: '8px',
                border: isActive ? '1px solid rgba(6, 182, 212, 0.5)' : '1px solid transparent',
                background: isActive ? 'linear-gradient(90deg, rgba(6, 182, 212, 0.15) 0%, rgba(15, 23, 42, 0.6) 100%)' : 'transparent',
                color: isActive ? '#38bdf8' : '#94a3b8',
                fontFamily: 'var(--font-heading)',
                fontWeight: isActive ? '700' : '500',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={18} color={isActive ? '#06b6d4' : '#64748b'} />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* User Profile Section placed at the VERY BOTTOM of Left Sidebar */}
      {user && (
        <div
          style={{
            marginTop: 'auto',
            padding: '14px 12px',
            background: 'rgba(15, 23, 42, 0.75)',
            borderRadius: '12px',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)',
                border: '1px solid rgba(6, 182, 212, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <User size={18} color="#38bdf8" />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                style={{
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  color: '#f8fafc',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
                title={user.full_name || user.username}
              >
                {user.full_name || user.username}
              </div>
              <span className="badge-critical" style={{ fontSize: '0.6rem', padding: '1px 6px', display: 'inline-block', marginTop: '2px' }}>
                {user.role}
              </span>
            </div>
          </div>
          <button
            id="logout-button"
            onClick={logout}
            className="btn-cyber-outline"
            style={{ padding: '7px 9px', borderRadius: '8px', flexShrink: 0 }}
            title="Sign out"
          >
            <LogOut size={15} />
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
