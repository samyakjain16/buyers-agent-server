import { useState, useEffect, useRef } from 'react';

const LOCAL_STORAGE_KEY = 'buyersAgentDashboardData';

const useWebSocket = (url, initialData) => {
  // Try to load data from localStorage first, fall back to initialData
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (e) {
        console.error('Failed to parse saved data:', e);
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
      // Keep only the last 5 messages
      return newMessages.slice(-5);
    });
  };

  useEffect(() => {
    const connectWebSocket = () => {
      try {
        // Close existing connection if any
        if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) {
          wsRef.current.close();
        }
        
        addMessage('Attempting to connect...');
        const ws = new WebSocket(url);
        
        ws.onopen = () => {
          setConnected(true);
          addMessage('Connected to server');
        };
        
        ws.onclose = (event) => {
          setConnected(false);
          addMessage(`Disconnected from server (code: ${event.code})`);
          
          // Clear any existing reconnect timeout
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
          }
          
          // Try to reconnect after 5 seconds
          reconnectTimeoutRef.current = setTimeout(connectWebSocket, 5000);
        };
        
        ws.onerror = (error) => {
          addMessage(`Connection error`);
          console.error('WebSocket error:', error);
          // Don't attempt to reconnect here, let onclose handle it
        };
        
        ws.onmessage = (event) => {
          try {
            const receivedData = JSON.parse(event.data);
            addMessage('Received update from server');
            
            // Save data to localStorage for persistence
            localStorage.setItem(LOCAL_STORAGE_KEY, event.data);
            
            setData(receivedData);
          } catch (error) {
            addMessage(`Error parsing data: ${error.message}`);
            console.error('Error parsing WebSocket message:', error);
          }
        };
        
        wsRef.current = ws;
      } catch (error) {
        console.error('Error creating WebSocket connection:', error);
        setConnected(false);
        
        // Try to reconnect after 5 seconds
        reconnectTimeoutRef.current = setTimeout(connectWebSocket, 5000);
      }
    };
    
    connectWebSocket();
    
    // Clean up on unmount
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [url]);

  return { data, connected, messages };
};

export default useWebSocket;