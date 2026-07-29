import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, User, Sparkles, RefreshCw } from 'lucide-react';
import { aiAPI } from '../services/api';

export const AIBotAvatar = ({ size = 46, iconSize = 24, showLine = true, onClick }) => {
  return (
    <div
      className="ai-bot-avatar-container"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {showLine && <div className="ai-bot-timeline-line" />}
      <div
        className="ai-bot-avatar-circle"
        style={{
          width: `${size}px`,
          height: `${size}px`
        }}
      >
        <Bot size={iconSize} color="#070a13" strokeWidth={2.3} />
        <div className="ai-bot-status-badge">
          <div className="ai-bot-status-dot" />
        </div>
      </div>
    </div>
  );
};

const AIChatBotModal = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Greetings, Analyst! I am your AI SecOps SOC Assistant. I am monitoring live security telemetry, threat indicators, and incident mitigation playbooks.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const sendMessageText = async (textToSend) => {
    if (!textToSend.trim() || loading) return;

    setMessages((prev) => [...prev, { sender: 'user', text: textToSend }]);
    setLoading(true);

    try {
      const res = await aiAPI.chat(textToSend);
      setMessages((prev) => [...prev, { sender: 'ai', text: res.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: '⚠️ Connection issue contacting AI SOC Engine. Automated fallback playbook engaged.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    const userMsg = input;
    setInput('');
    sendMessageText(userMsg);
  };

  const handleQuickPrompt = (promptText) => {
    sendMessageText(promptText);
  };

  const handleClear = () => {
    setMessages([
      {
        sender: 'ai',
        text: 'Chat history cleared. How can I assist with your SecOps telemetry analysis?'
      }
    ]);
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '420px',
        maxWidth: 'calc(100vw - 32px)',
        height: '560px',
        maxHeight: 'calc(100vh - 40px)',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div
        className="glass-panel"
        style={{
          height: '100%',
          borderRadius: '20px',
          border: '1px solid rgba(54, 250, 175, 0.4)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(54, 250, 175, 0.15)',
          background: 'rgba(9, 14, 28, 0.95)'
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(90deg, rgba(6, 182, 212, 0.15) 0%, rgba(54, 250, 175, 0.12) 100%)',
            padding: '14px 18px',
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(54, 250, 175, 0.2)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <AIBotAvatar size={42} iconSize={22} showLine={true} />
            <div>
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '800', color: '#f8fafc', letterSpacing: '-0.01em' }}>
                AI SOC Analyst Assistant
              </h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                <span style={{ fontSize: '0.68rem', color: '#36FAAF', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles size={11} color="#36FAAF" /> LLaMA-3 Security Fine-Tuned
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleClear}
              style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}
              title="Reset Chat"
            >
              <RefreshCw size={15} />
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#94a3b8',
                cursor: 'pointer'
              }}
              title="Close Chat"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Quick Prompts */}
        <div
          style={{
            padding: '8px 12px',
            background: 'rgba(7, 10, 19, 0.8)',
            borderBottom: '1px solid rgba(56, 189, 248, 0.1)',
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            scrollbarWidth: 'none'
          }}
        >
          <button
            onClick={() => handleQuickPrompt('Analyze SSH brute force attack metrics.')}
            className="btn-cyber-outline"
            style={{ padding: '4px 10px', fontSize: '0.7rem', borderRadius: '14px', whiteSpace: 'nowrap', background: 'rgba(6, 182, 212, 0.08)' }}
          >
            ⚡ Analyze SSH Attack
          </button>
          <button
            onClick={() => handleQuickPrompt('Generate automated firewall isolation playbook.')}
            className="btn-cyber-outline"
            style={{ padding: '4px 10px', fontSize: '0.7rem', borderRadius: '14px', whiteSpace: 'nowrap', background: 'rgba(54, 250, 175, 0.08)' }}
          >
            🛡️ Remediation Playbook
          </button>
          <button
            onClick={() => handleQuickPrompt('What is the current system health and threat risk score?')}
            className="btn-cyber-outline"
            style={{ padding: '4px 10px', fontSize: '0.7rem', borderRadius: '14px', whiteSpace: 'nowrap', background: 'rgba(139, 92, 246, 0.08)' }}
          >
            📊 System Health
          </button>
        </div>

        {/* Message Log */}
        <div
          style={{
            padding: '16px',
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            background: 'rgba(6, 10, 20, 0.95)'
          }}
        >
          {messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                gap: '10px',
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '90%',
                flexDirection: m.sender === 'user' ? 'row-reverse' : 'row'
              }}
            >
              {m.sender === 'ai' ? (
                <AIBotAvatar size={32} iconSize={16} showLine={false} />
              ) : (
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <User size={16} color="#ffffff" />
                </div>
              )}

              <div
                style={{
                  background:
                    m.sender === 'user'
                      ? 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)'
                      : 'rgba(15, 23, 42, 0.85)',
                  color: '#f8fafc',
                  padding: '11px 15px',
                  borderRadius: m.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                  border: m.sender === 'user' ? 'none' : '1px solid rgba(54, 250, 175, 0.2)',
                  fontSize: '0.825rem',
                  lineHeight: 1.5,
                  boxShadow: m.sender === 'user' ? '0 4px 14px rgba(6, 182, 212, 0.3)' : 'none'
                }}
              >
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <AIBotAvatar size={30} iconSize={15} showLine={false} />
              <div style={{ fontSize: '0.78rem', color: '#36FAAF', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#36FAAF' }} />
                AI SOC Analyst is analyzing telemetry...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSend}
          style={{
            display: 'flex',
            padding: '12px 14px',
            background: 'rgba(11, 17, 33, 0.98)',
            borderTop: '1px solid rgba(54, 250, 175, 0.2)',
            gap: '8px',
            alignItems: 'center'
          }}
        >
          <input
            type="text"
            placeholder="Ask AI SOC Assistant..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              flex: 1,
              background: 'rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(54, 250, 175, 0.3)',
              borderRadius: '10px',
              padding: '10px 14px',
              color: '#f8fafc',
              fontSize: '0.825rem',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            className="btn-cyber"
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #00F2FE 0%, #36FAAF 100%)',
              color: '#070a13',
              border: 'none',
              fontWeight: '700'
            }}
          >
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIChatBotModal;
