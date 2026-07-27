import React, { useState, useEffect } from 'react';
import FirewallTable from '../components/FirewallTable';
import { firewallAPI } from '../services/api';

const FirewallPage = () => {
  const [rules, setRules] = useState([]);

  const loadRules = () => {
    firewallAPI.getRules().then(setRules).catch(console.error);
  };

  useEffect(() => {
    loadRules();
  }, []);

  const handleUnblock = async (ip) => {
    await firewallAPI.unblockIP(ip);
    loadRules();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <FirewallTable rules={rules} onUnblock={handleUnblock} />
    </div>
  );
};

export default FirewallPage;
