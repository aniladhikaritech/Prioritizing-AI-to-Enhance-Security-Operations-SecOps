import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, X, ShieldAlert, Cpu, CheckCircle2 } from 'lucide-react';

const AttackReplayModal = ({ isOpen, onClose, incident }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const steps = [
    { title: "1. Attacker Launches Attack", desc: `Attacker VM (${incident?.source_ip || '192.168.1.100'}) initiates high-frequency SSH password guessing via Hydra.` },
    { title: "2. Log Ingestion & Normalization", desc: "Endpoint auth.log captures failed password events and forwards telemetry to SecOps API." },
    { title: "3. Wazuh SIEM Rule Triggered", desc: "Wazuh Rule 5712 (SSHD brute force trying to get access) fires after crossing threshold." },
    { title: "4. AI LLM Threat Inference", desc: "AI Engine evaluates payload -> Verdict: TRUE_POSITIVE (Risk Score: 98/100, Confidence: 98%)." },
    { title: "5. SOAR Playbook Execution", desc: "Automated response agent executes UFW firewall DROP command in ~3.2s MTTR." },
    { title: "6. Attacker IP Quarantined", desc: "Attacker IP blocked at host boundary; real-time dashboard updated via WebSockets." }
  ];

  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < steps.length - 1) {
      timer = setTimeout(() => setCurrentStep(prev => prev + 1), 1800);
    } else if (currentStep === steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep]);

  if (!isOpen) return null;

  const handleRestart = () => {
    setCurrentStep(0);
    setIsPlaying(true);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '560px', padding: '28px', borderRadius: '16px', border: '1px solid rgba(6, 182, 212, 0.5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Play size={22} color="#06b6d4" />
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '800', color: '#f8fafc' }}>Live Incident Attack Replay</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
          {steps.map((_, idx) => (
            <div
              key={idx}
              style={{
                flex: 1,
                height: '6px',
                borderRadius: '3px',
                background: idx <= currentStep ? '#06b6d4' : 'rgba(255,255,255,0.1)',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>

        {/* Active Replay Card */}
        <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '20px', borderRadius: '12px', minHeight: '140px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#38bdf8', fontSize: '1.05rem', fontWeight: '700' }}>
            {steps[currentStep].title}
          </h4>
          <p style={{ margin: 0, color: '#e2e8f0', fontSize: '0.85rem', lineHeight: 1.5 }}>
            {steps[currentStep].desc}
          </p>
        </div>

        {/* Replay Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', alignItems: 'center' }}>
          <button onClick={handleRestart} className="btn-cyber-outline" style={{ padding: '8px 14px', fontSize: '0.8rem', gap: '6px' }}>
            <RotateCcw size={14} /> Restart Replay
          </button>
          <button onClick={() => setIsPlaying(!isPlaying)} className="btn-cyber" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
            {isPlaying ? "Pause" : "Play Step-by-Step"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttackReplayModal;
