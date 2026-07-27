import React, { useState } from 'react';
import { Globe, ShieldAlert, X, AlertTriangle } from 'lucide-react';
import { aiAPI } from '../services/api';

const ThreatIntelModal = ({ isOpen, onClose, ipAddress }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  React.useEffect(() => {
    if (isOpen && ipAddress) {
      setLoading(true);
      aiAPI.getThreatIntel(ipAddress)
        .then(setData)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isOpen, ipAddress]);

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '24px', borderRadius: '16px', border: '1px solid rgba(6, 182, 212, 0.4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Globe size={22} color="#06b6d4" />
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: '#f8fafc' }}>Threat Intelligence Lookup</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '30px', textAlign: 'center', color: '#38bdf8' }}>Analyzing IP Reputation & Geolocation...</div>
        ) : data ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>TARGET IP ADDRESS</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '800', fontSize: '1.1rem', color: '#38bdf8' }}>{data.ip}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '10px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>GEOLOCATION</span>
                <p style={{ margin: '4px 0 0 0', fontWeight: '700', color: '#f8fafc' }}>{data.country} ({data.country_code})</p>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '10px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>REPUTATION SCORE</span>
                <p style={{ margin: '4px 0 0 0', fontWeight: '800', color: '#ef4444' }}>{data.reputation_score}/100 Malicious</p>
              </div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '10px', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>ASN & NETWORK ISP</span>
              <p style={{ margin: '4px 0 0 0', color: '#cbd5e1' }}>{data.asn} - {data.isp}</p>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '10px', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>ABUSE REPORT COUNT</span>
              <p style={{ margin: '4px 0 0 0', color: '#eab308', fontWeight: '700' }}>{data.abuse_reports} reported attacks</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ThreatIntelModal;
