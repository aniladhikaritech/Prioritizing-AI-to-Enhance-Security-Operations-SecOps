import React, { createContext, useState, useEffect } from 'react';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('secops_sound_enabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [toasts, setToasts] = useState([]);
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('secops_notification_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('secops_sound_enabled', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('secops_notification_history', JSON.stringify(history.slice(0, 100)));
  }, [history]);

  const playAlertSound = (severity) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = severity === 'CRITICAL' ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(severity === 'CRITICAL' ? 880 : 587.33, audioCtx.currentTime); // A5 or D5
      
      if (severity === 'CRITICAL') {
        osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.3);
      }

      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch (e) {
      console.warn("Web Audio API blocked or not supported:", e);
    }
  };

  const notify = ({ severity, summary, title, timestamp, source_ip, recommended_action }) => {
    const id = Date.now() + Math.random();
    const newNotif = {
      id,
      severity: severity || 'MEDIUM',
      title: title || 'Security Incident Event',
      summary: summary || 'Suspicious network activity detected.',
      source_ip: source_ip || 'N/A',
      recommended_action: recommended_action || 'Review incident payload',
      timestamp: timestamp || new Date().toLocaleTimeString()
    };

    if (newNotif.severity === 'HIGH' || newNotif.severity === 'CRITICAL') {
      playAlertSound(newNotif.severity);
    }

    setToasts((prev) => [newNotif, ...prev.slice(0, 4)]);
    setHistory((prev) => [newNotif, ...prev]);

    // Auto dismiss toast after 6 seconds
    setTimeout(() => {
      removeToast(id);
    }, 6000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        soundEnabled,
        setSoundEnabled,
        toasts,
        history,
        notify,
        removeToast,
        clearHistory
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
