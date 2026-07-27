import React, { createContext, useState, useEffect } from 'react';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [liveLogs, setLiveLogs] = useState([]);
  const [latestAlert, setLatestAlert] = useState(null);
  const [latestIncident, setLatestIncident] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const wsUrl = `ws://${window.location.hostname}:8000/ws`;
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

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, connected, liveLogs, latestAlert, latestIncident }}>
      {children}
    </SocketContext.Provider>
  );
};
