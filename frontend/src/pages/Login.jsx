import React, { useState, useContext } from 'react';
import { Shield, Lock, User, Key, ArrowRight } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid username or password credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.1) 0%, rgba(7, 10, 19, 1) 70%)'
    }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '420px', padding: '36px', borderRadius: '16px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            display: 'inline-flex',
            padding: '14px',
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)',
            borderRadius: '16px',
            border: '1px solid rgba(6, 182, 212, 0.4)',
            marginBottom: '16px'
          }}>
            <Shield size={36} color="#06b6d4" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f8fafc' }}>
            SecOps AI Portal
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '6px' }}>
            Autonomous Security Operations & Incident Containment
          </p>
        </div>

        {error && (
          <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid #f43f5e', color: '#f43f5e', padding: '10px 14px', borderRadius: '8px', fontSize: '0.8rem', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>
              Username
            </label>
            <div style={{ position: 'relative' }}>
              <User size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                id="login-username-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 38px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '8px',
                  color: '#f8fafc',
                  fontSize: '0.875rem'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                id="login-password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 38px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '8px',
                  color: '#f8fafc',
                  fontSize: '0.875rem'
                }}
              />
            </div>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            disabled={loading}
            className="btn-cyber"
            style={{ width: '100%', padding: '12px', justifyContent: 'center', marginTop: '10px' }}
          >
            {loading ? "Authenticating..." : "Sign In to SOC Center"}
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Demo Credentials Helper */}
        <div style={{ marginTop: '24px', padding: '12px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '8px', border: '1px dashed rgba(148, 163, 184, 0.2)', fontSize: '0.75rem', color: '#94a3b8' }}>
          <p style={{ fontWeight: '700', color: '#38bdf8', marginBottom: '4px' }}>Demo Lab Credentials:</p>
          <p>Admin: <code style={{ color: '#a7f3d0' }}>admin</code> / <code style={{ color: '#a7f3d0' }}>admin123</code></p>
          <p>Analyst: <code style={{ color: '#a7f3d0' }}>analyst</code> / <code style={{ color: '#a7f3d0' }}>analyst123</code></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
