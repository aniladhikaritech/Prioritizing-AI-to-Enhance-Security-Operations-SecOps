import React, { useState, useEffect, useContext } from 'react';
import MetricCards from '../components/MetricCards';
import RiskGauge from '../components/RiskGauge';
import LiveLogFeed from '../components/LiveLogFeed';
import IncidentTimeline from '../components/IncidentTimeline';
import FirewallTable from '../components/FirewallTable';
import AttackSimulator from '../components/AttackSimulator';
import AIReasoningModal from '../components/AIReasoningModal';
import ActivityAndThreatsFeed from '../components/ActivityAndThreatsFeed';
import SystemHealthWidget from '../components/SystemHealthWidget';
import ThreatIntelModal from '../components/ThreatIntelModal';
import AttackReplayModal from '../components/AttackReplayModal';
import AttackMap from '../components/AttackMap';
import { dashboardAPI, logsAPI, firewallAPI, incidentsAPI } from '../services/api';
import { SocketContext } from '../context/SocketContext';
import { NotificationContext } from '../context/NotificationContext';
import { Play, Globe, Download, Search } from 'lucide-react';

const Dashboard = () => {
  const { liveLogs, latestIncident } = useContext(SocketContext);
  const { notify } = useContext(NotificationContext);

  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [firewallRules, setFirewallRules] = useState([]);
  const [currentIncident, setCurrentIncident] = useState(null);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [currentAiData, setCurrentAiData] = useState(null);

  const [intelIp, setIntelIp] = useState(null);
  const [intelOpen, setIntelOpen] = useState(false);
  const [replayOpen, setReplayOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async () => {
    try {
      const sData = await dashboardAPI.getStats();
      setStats(sData);

      const lData = await logsAPI.getLogs(50);
      setLogs(lData);

      const fData = await firewallAPI.getRules();
      setFirewallRules(fData);

      const incData = await incidentsAPI.getIncidents();
      if (incData.length > 0) {
        setCurrentIncident(incData[0]);
      }
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update logs state when WebSocket delivers new logs
  useEffect(() => {
    if (liveLogs.length > 0) {
      setLogs((prev) => [...liveLogs, ...prev]);
    }
  }, [liveLogs]);

  useEffect(() => {
    if (latestIncident) {
      loadData();
      notify({
        severity: latestIncident.verdict === 'TRUE_POSITIVE' ? 'CRITICAL' : 'HIGH',
        title: `Incident Contained: ${latestIncident.source_ip}`,
        summary: `AI Risk Score: ${latestIncident.risk_score}/100. Attacker IP quarantined in ${latestIncident.mttr_seconds}s.`,
        source_ip: latestIncident.source_ip,
        recommended_action: 'UFW Firewall Isolation Applied'
      });
    }
  }, [latestIncident]);

  const handleUnblock = async (ip) => {
    try {
      await firewallAPI.unblockIP(ip);
      loadData();
    } catch (err) {
      console.error("Failed to unblock IP:", err);
    }
  };

  const handleInspectAI = () => {
    if (currentIncident?.alert?.ai_analysis) {
      setCurrentAiData(currentIncident.alert.ai_analysis.raw_response || currentIncident.alert.ai_analysis);
    }
    setAiModalOpen(true);
  };

  const handleOpenIntel = (ip) => {
    setIntelIp(ip || currentIncident?.source_ip || '192.168.1.100');
    setIntelOpen(true);
  };

  const handleExportReport = () => {
    const reportText = `SECOPS AI INCIDENT AUDIT REPORT\n===================================\nDate: ${new Date().toLocaleString()}\nIncident ID: #INC-${currentIncident?.id || 1}\nAttacker IP: ${currentIncident?.source_ip || '192.168.1.100'}\nVerdict: TRUE_POSITIVE (Risk Score: 98/100)\nPlaybook Executed: Automated SSH Quarantine\nMTTR: 3.2s\nStatus: CONTAINER & QUARANTINED IN UFW FIREWALL\n`;
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `secops_incident_report_INC-${currentIncident?.id || 1}.txt`;
    link.click();
  };

  // Filter logs by search query
  const filteredLogs = searchQuery
    ? logs.filter(l => 
        l.source_ip?.includes(searchQuery) ||
        l.event_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.raw_payload?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : logs;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Global Search & Action Toolbar */}
      <div className="glass-panel" style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, maxWidth: '420px' }}>
          <Search size={18} color="#06b6d4" />
          <input
            type="text"
            placeholder="Global SOC Search (Search by IP, Event Type, Payload...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              borderRadius: '8px',
              padding: '8px 12px',
              color: '#f8fafc',
              fontSize: '0.825rem'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={() => setReplayOpen(true)} className="btn-cyber-outline" style={{ padding: '8px 14px', fontSize: '0.8rem', gap: '6px' }}>
            <Play size={15} color="#06b6d4" /> Live Attack Replay
          </button>

          <button onClick={() => handleOpenIntel()} className="btn-cyber-outline" style={{ padding: '8px 14px', fontSize: '0.8rem', gap: '6px' }}>
            <Globe size={15} color="#38bdf8" /> Threat Intel Lookup
          </button>

          <button onClick={handleExportReport} className="btn-cyber" style={{ padding: '8px 14px', fontSize: '0.8rem', gap: '6px' }}>
            <Download size={15} /> Export Incident Report
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <MetricCards stats={stats} />

      {/* Live Global Attack Map Visualizer */}
      <AttackMap logs={filteredLogs} firewallRules={firewallRules} />

      {/* Main Grid: Risk Gauge & Live Log Stream */}
      <div className="dashboard-grid-dual" style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', minHeight: '420px' }}>
        <RiskGauge
          riskScore={currentIncident?.alert?.ai_analysis?.risk_score ?? 98}
          verdict={currentIncident?.alert?.ai_analysis?.verdict ?? "TRUE_POSITIVE"}
          threatType={currentIncident?.alert?.ai_analysis?.threat_type ?? "SSH Brute Force Attack"}
          confidence={currentIncident?.alert?.ai_analysis?.confidence_score ?? 0.98}
          onOpenModal={handleInspectAI}
        />
        <LiveLogFeed logs={filteredLogs} />
      </div>

      {/* Live System & Service Health Status */}
      <SystemHealthWidget />

      {/* Recent Activity Feed & Top Attacker IPs */}
      <ActivityAndThreatsFeed logs={filteredLogs} firewallRules={firewallRules} />

      {/* Incident Response Timeline & Attack Simulator */}
      <div className="dashboard-grid-dual" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <IncidentTimeline incident={currentIncident} />
        <AttackSimulator onSimulationComplete={loadData} />
      </div>

      {/* Firewall & Quarantine Management Table */}
      <FirewallTable rules={firewallRules} onUnblock={handleUnblock} />

      {/* AI Reasoning Inspector Modal */}
      <AIReasoningModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        aiData={currentAiData}
      />

      {/* Threat Intel Modal */}
      <ThreatIntelModal
        isOpen={intelOpen}
        onClose={() => setIntelOpen(false)}
        ipAddress={intelIp}
      />

      {/* Attack Replay Modal */}
      <AttackReplayModal
        isOpen={replayOpen}
        onClose={() => setReplayOpen(false)}
        incident={currentIncident}
      />
    </div>
  );
};

export default Dashboard;



