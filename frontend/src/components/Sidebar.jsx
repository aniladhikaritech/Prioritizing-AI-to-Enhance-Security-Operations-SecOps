import React from 'react';
import { LayoutDashboard, AlertOctagon, ShieldAlert, Settings, Crosshair } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, isMobileOpen, onCloseMobile }) => {
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
        width: '240px',
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
    </aside>
  );
};

export default Sidebar;
