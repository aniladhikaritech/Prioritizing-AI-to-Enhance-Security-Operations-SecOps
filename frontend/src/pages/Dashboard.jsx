import React, { useState, useEffect, useContext } from 'react';
import MetricCards from '../components/MetricCards';
import RiskGauge from '../components/RiskGauge';
import LiveLogFeed from '../components/LiveLogFeed';
import IncidentTimeline from '../components/IncidentTimeline';
import FirewallTable from '../components/FirewallTable';
import AttackSimulator from '../components/AttackSimulator';
import AIReasoningModal from '../components/AIReasoningModal';
import { dashboardAPI, logsAPI, firewallAPI, incidentsAPI } from '../services/api';
import { SocketContext } from '../context/SocketContext';

const Dashboard = () => {
  const { liveLogs, latestIncident } = useContext(SocketContext);

  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [firewallRules, setFirewallRules] = useState([]);
  const [currentIncident, setCurrentIncident] = useState(null);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [currentAiData, setCurrentAiData] = useState(null);

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

  // Refresh stats & firewall rules when a new incident is mitigated via WebSocket
  useEffect(() => {
    if (latestIncident) {
      loadData();
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Metrics Row */}
      <MetricCards stats={stats} />

      {/* Main Grid: Risk Gauge & Live Log Stream */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', minHeight: '420px' }}>
        <RiskGauge
          riskScore={currentIncident?.alert?.ai_analysis?.risk_score ?? 98}
          verdict={currentIncident?.alert?.ai_analysis?.verdict ?? "TRUE_POSITIVE"}
          threatType={currentIncident?.alert?.ai_analysis?.threat_type ?? "SSH Brute Force Attack"}
          confidence={currentIncident?.alert?.ai_analysis?.confidence_score ?? 0.98}
          onOpenModal={handleInspectAI}
        />
        <LiveLogFeed logs={logs} />
      </div>

      {/* Incident Response Timeline & Attack Simulator */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
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
    </div>
  );
};

export default Dashboard;
