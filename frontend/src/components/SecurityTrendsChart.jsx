import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Activity } from 'lucide-react';

const SecurityTrendsChart = () => {
  const data = [
    { time: '00:00', logs: 120, threats: 2, noiseReduction: 97 },
    { time: '04:00', logs: 180, threats: 4, noiseReduction: 98 },
    { time: '08:00', logs: 450, threats: 15, noiseReduction: 99 },
    { time: '12:00', logs: 920, threats: 42, noiseReduction: 98 },
    { time: '16:00', logs: 610, threats: 18, noiseReduction: 97 },
    { time: '20:00', logs: 840, threats: 31, noiseReduction: 98 },
    { time: '24:00', logs: 1248, threats: 53, noiseReduction: 98.2 }
  ];

  return (
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <TrendingUp size={20} color="#38bdf8" />
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#f8fafc', margin: 0 }}>
              24-Hour Telemetry Volume & Noise Reduction Trend
            </h3>
            <p style={{ fontSize: '0.72rem', color: '#64748b', margin: 0 }}>
              Real-time ingestion telemetry vs automated AI threat filtering efficiency.
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#10b981', fontWeight: '700' }}>
          <Activity size={14} /> 98.2% AI Noise Reduction
        </div>
      </div>

      <div style={{ width: '100%', height: '200px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorLogs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: 'rgba(7,10,19,0.95)', border: '1px solid rgba(56,189,248,0.3)', borderRadius: '8px', color: '#f8fafc', fontSize: '0.75rem' }}
            />
            <Area type="monotone" dataKey="logs" name="Raw Ingested Logs" stroke="#06b6d4" fillOpacity={1} fill="url(#colorLogs)" />
            <Area type="monotone" dataKey="threats" name="Mitigated Threats" stroke="#ef4444" fillOpacity={1} fill="url(#colorThreats)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SecurityTrendsChart;
