import React from 'react';
import { Activity, Clock, ShieldX, Filter } from 'lucide-react';

const MetricCards = ({ stats }) => {
  const cards = [
    {
      title: 'Total Ingested Events',
      value: stats?.total_logs ?? 1248,
      subtext: 'Real-time auth.log feed',
      icon: Activity,
      color: '#38bdf8'
    },
    {
      title: 'Average MTTR',
      value: `${stats?.avg_mttr_seconds ?? 3.2}s`,
      subtext: 'From rule trigger to IP drop',
      icon: Clock,
      color: '#10b981'
    },
    {
      title: 'Active Blocked IPs',
      value: stats?.active_blocked_ips ?? 1,
      subtext: 'Quarantined in UFW firewall',
      icon: ShieldX,
      color: '#f43f5e'
    },
    {
      title: 'Noise Reduction Rate',
      value: `${stats?.noise_reduction_pct ?? 98.4}%`,
      subtext: 'False positive noise filtered',
      icon: Filter,
      color: '#8b5cf6'
    }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div key={idx} className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '500', marginBottom: '6px' }}>{card.title}</p>
                <h3 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#f8fafc' }}>{card.value}</h3>
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '10px', borderRadius: '10px', border: `1px solid ${card.color}40` }}>
                <Icon size={22} color={card.color} />
              </div>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '10px' }}>{card.subtext}</p>
          </div>
        );
      })}
    </div>
  );
};

export default MetricCards;
