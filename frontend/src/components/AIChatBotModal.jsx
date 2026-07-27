import React, { useState } from 'react';
import { Bot, X, Send, Cpu, User } from 'lucide-react';
import { aiAPI } from '../services/api';

const AIChatBotModal = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am your AI SecOps Assistant. Ask me anything about current threats, incident explanations, or security hardening recommendations.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await aiAPI.chat(userMsg);
      setMessages((prev) => [...prev, { sender: 'ai', text: res.reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'ai', text: 'Error querying AI SOC Assistant.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '380px',
        maxHeight: '520px',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div
        className="glass-panel"
        style={{
          borderRadius: '16px',
          border: '1px solid rgba(6, 182, 212, 0.4)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
        }}
      >
        {/* Header */}
        <div style={{ background: 'linear-gradient(90deg, rgba(6, 182, 212, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(56, 189, 248, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bot size={22} color="#06b6d4" />
            <div>
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '800', color: '#f8fafc' }}>AI SOC Analyst Chat</h4>
              <span style={{ fontSize: '0.7rem', color: '#10b981' }}>● Online (LLaMA 3 Ready)</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {/* Message Log */}
        <div style={{ padding: '14px', height: '320px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(7, 10, 19, 0.9)' }}>
          {messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                background: m.sender === 'user' ? 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)' : 'rgba(15, 23, 42, 0.8)',
                color: '#f8fafc',
                padding: '10px 14px',
                borderRadius: m.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                border: m.sender === 'user' ? 'none' : '1px solid rgba(56, 189, 248, 0.2)',
                fontSize: '0.8rem',
                lineHeight: 1.45
              }}
            >
              {m.text}
            </div>
          ))}
          {loading && <div style={{ fontSize: '0.75rem', color: '#38bdf8' }}>AI Analyst is thinking...</div>}
        </div>

        {/* Form Input */}
        <form onSubmit={handleSend} style={{ display: 'flex', padding: '10px', background: 'rgba(15, 23, 42, 0.95)', borderTop: '1px solid rgba(56, 189, 248, 0.2)' }}>
          <input
            type="text"
            placeholder="Ask AI SOC Assistant..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              flex: 1,
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '8px',
              padding: '8px 12px',
              color: '#f8fafc',
              fontSize: '0.8rem'
            }}
          />
          <button type="submit" className="btn-cyber" style={{ marginLeft: '8px', padding: '8px 12px' }}>
            <Send size={14} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIChatBotModal;
