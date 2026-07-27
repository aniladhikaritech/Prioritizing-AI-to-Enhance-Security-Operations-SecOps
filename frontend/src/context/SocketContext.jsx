import React, { createContext, useState, useEffect } from 'react';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [liveLogs, setLiveLogs] = useState([]);
  const [latestAlert, setLatestAlert] = useState(null);
  const [latestIncident, setLatestIncident] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    try {
      const hostname = window.location.hostname || 'localhost';
      // Disable WebSocket attempt on static HTTPS demo hosts (e.g. GitHub Pages) to prevent Mixed Content security errors
      if (hostname.includes('github.io') || hostname.includes('vercel.app')) {
        console.log("Static web host detected - running in Live Demo Mode.");
        return;
      }

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${hostname}:8000/ws`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log("Connected to SecOps WebSocket Server");
        setConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          const { event: evtType, data } = payload;

          if (evtType === "NEW_LOG") {
            setLiveLogs((prev) => [data, ...prev.slice(0, 100)]);
          } else if (evtType === "ALERT_TRIGGERED") {
            setLatestAlert(data);
          } else if (evtType === "INCIDENT_MITIGATED") {
            setLatestIncident(data);
          }
        } catch (err) {
          console.error("Failed to parse WebSocket message:", err);
        }
      };

      ws.onclose = () => {
        console.log("WebSocket Disconnected");
        setConnected(false);
      };

      ws.onerror = (err) => {
        console.warn("WebSocket connection error:", err);
        setConnected(false);
      };

      setSocket(ws);

      return () => {
        ws.close();
      };
    } catch (e) {
      console.warn("WebSocket initialization skipped:", e);
    }
  }, []);

  return (
    <SocketContext.Provider value={{ socket, connected, liveLogs, latestAlert, latestIncident }}>
      {children}
    </SocketContext.Provider>
  );
};
