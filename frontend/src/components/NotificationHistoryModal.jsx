import React, { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';
import { Bell, Trash2, X, ShieldAlert, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

const NotificationHistoryModal = ({ isOpen, onClose }) => {
  const { history, clearHistory } = useContext(NotificationContext);

  if (!isOpen) return null;

  const getIcon = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return <ShieldAlert size={18} color="#ef4444" />;
      case 'HIGH':
        return <AlertTriangle size={18} color="#f97316" />;
      case 'MEDIUM':
        return <Info size={18} color="#eab308" />;
      default:
        return <CheckCircle2 size={18} color="#10b981" />;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '600px',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px',
          borderRadius: '16px',
          border: '1px solid rgba(56, 189, 248, 0.3)'
        }}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bell size={22} color="#06b6d4" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#f8fafc', margin: 0 }}>
              Notification Alert History ({history.length})
            </h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="btn-cyber-outline"
                style={{ padding: '6px 12px', fontSize: '0.75rem', color: '#ef4444', borderColor: 'rgba(239,68,68,0.4)' }}
              >
                <Trash2 size={14} /> Clear Log
              </button>
            )}
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* History Item List */}
        <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '6px' }}>
          {history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
              No notification alerts in history yet.
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(56, 189, 248, 0.15)',
                  borderRadius: '8px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {getIcon(item.severity)}
                    <span style={{ fontWeight: '700', fontSize: '0.85rem', color: '#f8fafc' }}>
                      {item.title}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.timestamp}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#cbd5e1', margin: 0 }}>{item.summary}</p>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Source IP: {item.source_ip}</span>
                  <span style={{ color: '#38bdf8' }}>Action: {item.recommended_action}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationHistoryModal;
