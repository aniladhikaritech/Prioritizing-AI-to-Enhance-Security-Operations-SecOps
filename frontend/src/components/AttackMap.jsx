import React from 'react';
import { Globe, ShieldAlert } from 'lucide-react';

const AttackMap = ({ logs = [], firewallRules = [] }) => {
  // Map simulated IP locations / coordinates
  const locations = [
    { ip: '192.168.1.100', country: 'Kali Lab Attacker (Nepal / Local)', city: 'Kathmandu SOC Lab', lat: 27.7172, lng: 85.3240, count: 53, severity: 'CRITICAL' },
    { ip: '185.220.101.5', country: 'Germany', city: 'Frankfurt', lat: 50.1109, lng: 8.6821, count: 18, severity: 'HIGH' },
    { ip: '45.142.120.10', country: 'Russia', city: 'Moscow', lat: 55.7558, lng: 37.6173, count: 24, severity: 'CRITICAL' },
    { ip: '103.251.16.2', country: 'China', city: 'Beijing', lat: 39.9042, lng: 116.4074, count: 31, severity: 'HIGH' },
    { ip: '198.51.100.42', country: 'United States', city: 'Ashburn, VA', lat: 39.0438, lng: -77.4874, count: 12, severity: 'MEDIUM' }
  ];

  return (
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Globe size={22} color="#06b6d4" />
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#f8fafc', margin: 0 }}>
              Live Global Attack Map & Geolocation Radar
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>
              Real-time geographical origins of incoming threat vectors and SSH brute force attempts.
            </p>
          </div>
        </div>
        <span className="badge-critical" style={{ fontSize: '0.7rem' }}>
          5 Threat Vectors Active
        </span>
      </div>

      {/* SVG Interactive Cyber World Map Visualizer */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '320px',
          background: '#04060c',
          borderRadius: '12px',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* World Grid Lines Background */}
        <svg
          viewBox="0 0 1000 500"
          style={{ width: '100%', height: '100%', opacity: 0.25, position: 'absolute', inset: 0 }}
        >
          {/* Latitude Lines */}
          <line x1="0" y1="100" x2="1000" y2="100" stroke="#06b6d4" strokeWidth="0.5" strokeDasharray="5,5" />
          <line x1="0" y1="200" x2="1000" y2="200" stroke="#06b6d4" strokeWidth="0.5" strokeDasharray="5,5" />
          <line x1="0" y1="250" x2="1000" y2="250" stroke="#38bdf8" strokeWidth="1" />
          <line x1="0" y1="300" x2="1000" y2="300" stroke="#06b6d4" strokeWidth="0.5" strokeDasharray="5,5" />
          <line x1="0" y1="400" x2="1000" y2="400" stroke="#06b6d4" strokeWidth="0.5" strokeDasharray="5,5" />

          {/* Longitude Lines */}
          <line x1="200" y1="0" x2="200" y2="500" stroke="#06b6d4" strokeWidth="0.5" strokeDasharray="5,5" />
          <line x1="400" y1="0" x2="400" y2="500" stroke="#06b6d4" strokeWidth="0.5" strokeDasharray="5,5" />
          <line x1="500" y1="0" x2="500" y2="500" stroke="#38bdf8" strokeWidth="1" />
          <line x1="600" y1="0" x2="600" y2="500" stroke="#06b6d4" strokeWidth="0.5" strokeDasharray="5,5" />
          <line x1="800" y1="0" x2="800" y2="500" stroke="#06b6d4" strokeWidth="0.5" strokeDasharray="5,5" />

          {/* Simplified Continents Outline */}
          {/* North America */}
          <path d="M 150 120 Q 220 100 280 150 Q 250 220 180 200 Z" fill="rgba(6,182,212,0.15)" stroke="rgba(6,182,212,0.4)" />
          {/* South America */}
          <path d="M 280 260 Q 340 280 320 380 Q 280 400 260 300 Z" fill="rgba(6,182,212,0.15)" stroke="rgba(6,182,212,0.4)" />
          {/* Europe */}
          <path d="M 480 100 Q 560 90 580 150 Q 520 180 470 140 Z" fill="rgba(6,182,212,0.15)" stroke="rgba(6,182,212,0.4)" />
          {/* Africa */}
          <path d="M 480 190 Q 580 190 560 320 Q 500 350 460 250 Z" fill="rgba(6,182,212,0.15)" stroke="rgba(6,182,212,0.4)" />
          {/* Asia / Nepal / China / Russia */}
          <path d="M 600 90 Q 820 80 850 200 Q 720 280 620 180 Z" fill="rgba(6,182,212,0.2)" stroke="rgba(6,182,212,0.5)" />
          {/* Australia */}
          <path d="M 780 320 Q 860 310 850 380 Q 780 400 760 350 Z" fill="rgba(6,182,212,0.15)" stroke="rgba(6,182,212,0.4)" />
        </svg>

        {/* Pulsing Attack Nodes on Map */}
        {/* Nepal / Lab (720px, 190px) */}
        <div style={{ position: 'absolute', left: '725px', top: '185px', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="pulse-dot-red" style={{ width: '16px', height: '16px' }} />
          <div style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid #ef4444', padding: '3px 8px', borderRadius: '4px', fontSize: '0.65rem', color: '#f8fafc', whiteSpace: 'nowrap', marginTop: '4px' }}>
            🚩 192.168.1.100 (Nepal / Lab) - 53 Attacks [QUARANTINED]
          </div>
        </div>

        {/* Germany (520px, 120px) */}
        <div style={{ position: 'absolute', left: '520px', top: '120px', transform: 'translate(-50%, -50%)' }}>
          <div className="pulse-dot-red" style={{ width: '12px', height: '12px' }} />
        </div>

        {/* Russia (680px, 100px) */}
        <div style={{ position: 'absolute', left: '660px', top: '105px', transform: 'translate(-50%, -50%)' }}>
          <div className="pulse-dot-red" style={{ width: '14px', height: '14px' }} />
        </div>

        {/* China (780px, 150px) */}
        <div style={{ position: 'absolute', left: '780px', top: '150px', transform: 'translate(-50%, -50%)' }}>
          <div className="pulse-dot-red" style={{ width: '14px', height: '14px' }} />
        </div>

        {/* USA (220px, 140px) */}
        <div style={{ position: 'absolute', left: '220px', top: '140px', transform: 'translate(-50%, -50%)' }}>
          <div className="pulse-dot" style={{ width: '10px', height: '10px' }} />
        </div>

        {/* Legend Overlay */}
        <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(7,10,19,0.85)', border: '1px solid rgba(56,189,248,0.3)', padding: '8px 12px', borderRadius: '8px', fontSize: '0.72rem', color: '#94a3b8' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></span>
            <span style={{ color: '#f8fafc', fontWeight: '600' }}>Critical / Quarantined Threat</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
            <span style={{ color: '#f8fafc', fontWeight: '600' }}>Active Monitoring Target</span>
          </div>
        </div>
      </div>

      {/* Geolocation IP Data Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
        {locations.map((loc, idx) => (
          <div
            key={idx}
            style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: loc.severity === 'CRITICAL' ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(56, 189, 248, 0.15)',
              borderRadius: '8px',
              padding: '10px 12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', fontSize: '0.825rem', color: '#38bdf8' }}>{loc.ip}</span>
              <span className={loc.severity === 'CRITICAL' ? "badge-critical" : "badge-info"} style={{ fontSize: '0.625rem' }}>
                {loc.count} Attacks
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#f8fafc', fontWeight: '600' }}>{loc.country} ({loc.city})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttackMap;
