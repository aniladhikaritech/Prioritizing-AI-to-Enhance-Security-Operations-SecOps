import React, { useState, useContext } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Incidents from './pages/Incidents';
import FirewallPage from './pages/FirewallPage';
import SettingsPage from './pages/SettingsPage';
import Login from './pages/Login';
import AttackSimulator from './components/AttackSimulator';

const MainLayout = () => {
  const { user, loading } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('dashboard');

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06b6d4' }}>
        <h2>Loading SecOps Security Operations Center...</h2>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1, padding: '0 28px 28px 28px', gap: '24px' }}>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main style={{ flex: 1 }}>
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'incidents' && <Incidents />}
          {activeTab === 'firewall' && <FirewallPage />}
          {activeTab === 'simulator' && (
            <div className="glass-panel" style={{ padding: '24px' }}>
              <AttackSimulator />
            </div>
          )}
          {activeTab === 'settings' && <SettingsPage />}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <MainLayout />
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
