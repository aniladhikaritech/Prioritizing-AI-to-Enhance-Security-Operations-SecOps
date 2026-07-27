import React, { useState } from 'react';
import { Crosshair, Play, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';
import { simulatorAPI } from '../services/api';

const AttackSimulator = ({ onSimulationComplete }) => {
  const [attackType, setAttackType] = useState('SSH_BRUTE_FORCE');
  const [attackerIp, setAttackerIp] = useState('192.168.1.100');
  const [attemptCount, setAttemptCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  const handleLaunch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLastResult(null);
    try {
      const res = await simulatorAPI.launchSimulation(attackType, attackerIp, parseInt(attemptCount));
      setLastResult(res);
      if (onSimulationComplete) onSimulationComplete(res);
    } catch (err) {
      console.error("Simulation failed:", err);
      setLastResult({ status: 'ERROR', message: 'Simulation request failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <Crosshair size={22} color="#f43f5e" />
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#f8fafc' }}>
            Interactive Cyber Attack Vector Simulator
          </h4>
          <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Generate synthetic lab attack traffic to test rule triggers, LLM threat analysis, and automated UFW isolation live.
          </p>
        </div>
      </div>

      <form onSubmit={handleLaunch} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'end' }}>
        {/* Attack Vector Select */}
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>
            Attack Scenario
          </label>
          <select
            id="attack-type-select"
            value={attackType}
            onChange={(e) => setAttackType(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              color: '#f8fafc',
              padding: '10px',
              borderRadius: '8px',
              fontSize: '0.85rem'
            }}
          >
            <option value="SSH_BRUTE_FORCE">SSH Brute Force Attack (Single IP)</option>
            <option value="DISTRIBUTED_BRUTE_FORCE">Distributed SSH Brute Force (Multi-IP)</option>
            <option value="SQL_INJECTION">Web Application Attack (SQL Injection)</option>
            <option value="BENIGN_TRAFFIC">Legitimate Auth Traffic (Harmless Noise)</option>
          </select>
        </div>

        {/* Attacker IP input */}
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>
            Attacker Source IP
          </label>
          <input
            id="attacker-ip-input"
            type="text"
            value={attackerIp}
            onChange={(e) => setAttackerIp(e.target.value)}
            placeholder="192.168.1.100"
            style={{
              width: '100%',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              color: '#f8fafc',
              padding: '10px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontFamily: 'var(--font-mono)'
            }}
          />
        </div>

        {/* Failed Attempt Count */}
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>
            Attempt Burst Rate
          </label>
          <input
            id="attempt-count-input"
            type="number"
            value={attemptCount}
            onChange={(e) => setAttemptCount(e.target.value)}
            min="1"
            max="50"
            style={{
              width: '100%',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              color: '#f8fafc',
              padding: '10px',
              borderRadius: '8px',
              fontSize: '0.85rem'
            }}
          />
        </div>

        {/* Launch Button */}
        <div>
          <button
            id="launch-attack-btn"
            type="submit"
            disabled={loading}
            className="btn-danger"
            style={{ width: '100%', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            {loading ? <RefreshCw size={16} className="spin" /> : <Play size={16} />}
            {loading ? "Simulating Attack..." : "Execute Attack Vector"}
          </button>
        </div>
      </form>

      {/* Simulation Result Notification */}
      {lastResult && (
        <div style={{
          marginTop: '16px',
          padding: '12px 16px',
          borderRadius: '8px',
          background: lastResult.verdict === 'TRUE_POSITIVE' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)',
          border: `1px solid ${lastResult.verdict === 'TRUE_POSITIVE' ? '#f43f5e' : '#10b981'}`,
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <span style={{ fontWeight: '700', fontSize: '0.85rem', color: '#f8fafc' }}>
              Simulation Status: {lastResult.status}
            </span>
            {lastResult.verdict && (
              <span style={{ marginLeft: '12px', fontSize: '0.8rem', color: '#cbd5e1' }}>
                Verdict: <strong>{lastResult.verdict}</strong> (Score: {lastResult.risk_score}/100) — MTTR: <strong>{lastResult.mttr_seconds}s</strong>
              </span>
            )}
          </div>
          <span className={lastResult.verdict === 'TRUE_POSITIVE' ? "badge-critical" : "badge-success"}>
            {lastResult.playbook_executed ? "UFW IP ISOLATED" : "NO BLOCK NEEDED"}
          </span>
        </div>
      )}
    </div>
  );
};

export default AttackSimulator;
