import { useState, useEffect, useRef } from 'react';

// Safe way to check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

const useWebSocket = (url, initialData, location = 'default') => {
  // Create location-specific storage key
  const LOCAL_STORAGE_KEY = `buyersAgentDashboardData_${location}`;
  
  // Try to load data from localStorage only in browser environment
  const [data, setData] = useState(() => {
    if (isBrowser) {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          return Array.isArray(parsedData) ? parsedData[0] : parsedData;
        } catch (e) {
          console.error('Failed to parse saved data:', e);
        }
      }
    }
    return initialData;
  });
  
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  // Function to add connection messages
  const addMessage = (message) => {
    setMessages(prev => {
      const newMessages = [...prev, { 
        message, 
        timestamp: new Date().toLocaleTimeString() 
      }];
      return newMessages.slice(-5);
    });
  };

  useEffect(() => {
    if (!isBrowser || !url) return;
    
    const connectWebSocket = () => {
      try {
        if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) {
          wsRef.current.close();
        }
        
        addMessage(`Attempting to connect to ${location}...`);
        const ws = new WebSocket(url);
        
        ws.onopen = () => {
          setConnected(true);
          addMessage(`Connected to ${location} server`);
        };
        
        ws.onclose = (event) => {
          setConnected(false);
          addMessage(`Disconnected from ${location} server (code: ${event.code})`);
          
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
          }
          
          reconnectTimeoutRef.current = setTimeout(connectWebSocket, 5000);
        };
        
        ws.onerror = (error) => {
          addMessage(`${location} connection error`);
          console.error('WebSocket error:', error);
        };
        
        ws.onmessage = (event) => {
          try {
            const receivedData = JSON.parse(event.data);
            console.log(`${location} raw received data:`, receivedData);
            
            // Handle array format from n8n
            let processedData;
            if (Array.isArray(receivedData)) {
              processedData = receivedData[0];
            } else {
              processedData = receivedData;
            }
            
            console.log(`${location} processed data:`, processedData);
            addMessage(`Received update from ${location} server`);
            
            if (isBrowser) {
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(processedData));
            }
            
            setData(processedData);
          } catch (error) {
            addMessage(`Error parsing ${location} data: ${error.message}`);
            console.error('Error parsing WebSocket message:', error);
          }
        };
        
        wsRef.current = ws;
      } catch (error) {
        console.error('Error creating WebSocket connection:', error);
        setConnected(false);
        reconnectTimeoutRef.current = setTimeout(connectWebSocket, 5000);
      }
    };
    
    connectWebSocket();
    
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [url, location]);

  return { data, connected, messages };
};

export default useWebSocket;