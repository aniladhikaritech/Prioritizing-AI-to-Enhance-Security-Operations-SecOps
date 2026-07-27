import React, { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';
import { ShieldAlert, AlertTriangle, Info, CheckCircle2, X } from 'lucide-react';

const NotificationToast = () => {
  const { toasts, removeToast } = useContext(NotificationContext);

  if (!toasts || toasts.length === 0) return null;

  const getStyle = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return {
          border: '1px solid rgba(239, 68, 68, 0.8)',
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(15, 23, 42, 0.95) 100%)',
          color: '#f8fafc',
          icon: ShieldAlert,
          iconColor: '#ef4444'
        };
      case 'HIGH':
        return {
          border: '1px solid rgba(249, 115, 22, 0.8)',
          background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.25) 0%, rgba(15, 23, 42, 0.95) 100%)',
          color: '#f8fafc',
          icon: AlertTriangle,
          iconColor: '#f97316'
        };
      case 'MEDIUM':
        return {
          border: '1px solid rgba(234, 179, 8, 0.8)',
          background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.2) 0%, rgba(15, 23, 42, 0.95) 100%)',
          color: '#f8fafc',
          icon: Info,
          iconColor: '#eab308'
        };
      default:
        return {
          border: '1px solid rgba(16, 185, 129, 0.8)',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(15, 23, 42, 0.95) 100%)',
          color: '#f8fafc',
          icon: CheckCircle2,
          iconColor: '#10b981'
        };
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '80px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxWidth: '420px',
        width: 'calc(100vw - 48px)'
      }}
    >
      {toasts.map((toast) => {
        const style = getStyle(toast.severity);
        const Icon = style.icon;

        return (
          <div
            key={toast.id}
            className="glass-panel"
            style={{
              padding: '16px',
              borderRadius: '12px',
              border: style.border,
              background: style.background,
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              animation: 'slideInRight 0.3s ease-out'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icon size={20} color={style.iconColor} />
                <span style={{ fontWeight: '800', fontSize: '0.85rem', color: style.iconColor }}>
                  [{toast.severity}] {toast.title}
                </span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            <p style={{ fontSize: '0.8rem', color: '#cbd5e1', margin: 0, lineHeight: 1.4 }}>
              {toast.summary}
            </p>

            <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
              <span>Src: {toast.source_ip}</span>
              <span>{toast.timestamp}</span>
            </div>

            {toast.recommended_action && (
              <div style={{ fontSize: '0.75rem', background: 'rgba(0,0,0,0.3)', padding: '4px 8px', borderRadius: '4px', color: '#38bdf8' }}>
                💡 Action: {toast.recommended_action}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default NotificationToast;
