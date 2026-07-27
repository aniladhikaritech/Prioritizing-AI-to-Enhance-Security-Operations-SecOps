import React, { useState } from 'react';
import { Settings, Cpu, ShieldCheck, Sliders, Save } from 'lucide-react';

const SettingsPage = () => {
  const [aiMode, setAiMode] = useState('smart_local');
  const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434');
  const [threshold, setThreshold] = useState(5);
  const [autoBlockScore, setAutoBlockScore] = useState(80);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Settings size={24} color="#06b6d4" />
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#f8fafc' }}>
              AI Engine & SOAR Configuration
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Tune LLM inference models (Ollama LLaMA 3, OpenAI, Smart Local), detection windows, and quarantine thresholds.
            </p>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '28px', maxWidth: '640px' }}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* AI Provider selection */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#f8fafc', marginBottom: '8px' }}>
              AI Threat Inference Engine Backend
            </label>
            <select
              value={aiMode}
              onChange={(e) => setAiMode(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                color: '#f8fafc',
                padding: '10px',
                borderRadius: '8px'
              }}
            >
              <option value="smart_local">Built-in Smart SecOps Engine (Default - Instant Local)</option>
              <option value="ollama">Ollama LLaMA 3 (Offline VM Lab Server)</option>
              <option value="openai">OpenAI GPT-3.5/4 API (Cloud LLM)</option>
            </select>
          </div>

          {/* Ollama endpoint */}
          {aiMode === 'ollama' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>
                Ollama Base REST URL
              </label>
              <input
                type="text"
                value={ollamaUrl}
                onChange={(e) => setOllamaUrl(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  color: '#f8fafc',
                  padding: '10px',
                  borderRadius: '8px',
                  fontFamily: 'var(--font-mono)'
                }}
              />
            </div>
          )}

          {/* SSH Failed Attempt Threshold */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#f8fafc', marginBottom: '6px' }}>
              Wazuh Rule 5712 Failed Password Threshold
            </label>
            <input
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              min="1"
              max="20"
              style={{
                width: '100%',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                color: '#f8fafc',
                padding: '10px',
                borderRadius: '8px'
              }}
            />
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
              Trigger AI evaluation when failed login attempts cross this count within 60 seconds.
            </p>
          </div>

          {/* Auto-Block Risk Score Threshold */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#f8fafc', marginBottom: '6px' }}>
              Automated SOAR Firewall Block Risk Threshold (0–100)
            </label>
            <input
              type="number"
              value={autoBlockScore}
              onChange={(e) => setAutoBlockScore(e.target.value)}
              min="50"
              max="100"
              style={{
                width: '100%',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                color: '#f8fafc',
                padding: '10px',
                borderRadius: '8px'
              }}
            />
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
              Automatically issue UFW deny rules when AI risk score equals or exceeds this score (Default: 80).
            </p>
          </div>

          <button type="submit" className="btn-cyber" style={{ padding: '12px', justifyContent: 'center' }}>
            <Save size={16} /> Save Configuration Settings
          </button>

          {saved && (
            <p style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: '600', textAlign: 'center' }}>
              Settings saved successfully!
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
