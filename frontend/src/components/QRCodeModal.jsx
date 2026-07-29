import React, { useState, useEffect } from 'react';
import { QrCode, X, Copy, Check, Smartphone, Wifi } from 'lucide-react';
import { networkAPI } from '../services/api';

const QRCodeModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchQRData();
    }
  }, [isOpen]);

  const fetchQRData = async () => {
    setLoading(true);
    try {
      const data = await networkAPI.getQR();
      setQrData(data);
    } catch (err) {
      console.error("Failed to load QR code data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = () => {
    if (qrData?.dashboard_url) {
      navigator.clipboard.writeText(qrData.dashboard_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
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
          maxWidth: '440px',
          padding: '28px',
          borderRadius: '16px',
          border: '1px solid rgba(6, 182, 212, 0.4)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <QrCode size={24} color="#06b6d4" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#f8fafc', margin: 0 }}>
              Mobile Network Access
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.825rem', color: '#94a3b8', margin: 0 }}>
          Scan this QR code with your mobile device or tablet connected to the same trusted Wi-Fi/LAN network to access the SecOps Dashboard.
        </p>

        {loading ? (
          <div style={{ padding: '40px', color: '#38bdf8' }}>Generating Network QR Code...</div>
        ) : qrData && qrData.qr_code_base64 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', width: '100%' }}>
            <div
              style={{
                padding: '16px',
                background: '#0D1117',
                borderRadius: '12px',
                border: '2px solid rgba(6, 182, 212, 0.4)',
                boxShadow: '0 0 25px rgba(6, 182, 212, 0.25)'
              }}
            >
              <img
                src={qrData.qr_code_base64}
                alt="SecOps Dashboard Access QR Code"
                style={{ width: '200px', height: '200px', display: 'block', borderRadius: '4px' }}
              />
            </div>

            <div
              style={{
                width: '100%',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                borderRadius: '8px',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px'
              }}
            >
              <div style={{ textAlign: 'left', flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'block', fontWeight: '600', letterSpacing: '0.05em' }}>
                  MOBILE ACCESSIBLE URL
                </span>
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    color: '#38bdf8',
                    fontFamily: 'var(--font-mono)',
                    display: 'block',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                  title={qrData.dashboard_url}
                >
                  {qrData.dashboard_url}
                </span>
              </div>
              <button
                onClick={handleCopyUrl}
                className="btn-cyber-outline"
                style={{ padding: '6px 10px', fontSize: '0.75rem', flexShrink: 0 }}
                title="Copy URL"
              >
                {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              </button>
            </div>

            <div style={{ display: 'flex', gap: '16px', fontSize: '0.75rem', color: '#64748b' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Wifi size={14} color="#10b981" /> Trusted Network
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Smartphone size={14} color="#38bdf8" /> Mobile Responsive
              </span>
            </div>
          </div>
        ) : (
          <div style={{ color: '#ef4444', fontSize: '0.85rem' }}>Failed to generate QR Code.</div>
        )}
      </div>
    </div>
  );
};

export default QRCodeModal;
