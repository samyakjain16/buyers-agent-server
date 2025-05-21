const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(cors());

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Store latest data received from n8n
let latestData = {};

// Track connected clients
let connectedClients = 0;

// Handle WebSocket connections
wss.on('connection', (ws) => {
  connectedClients++;
  console.log(`Client connected. Total connections: ${connectedClients}`);
  
  // Removed initial data send: ws.send(JSON.stringify(latestData));
  
  // Handle disconnection
  ws.on('close', () => {
    connectedClients--;
    console.log(`Client disconnected. Total connections: ${connectedClients}`);
  });
});

// HTTP POST endpoint for n8n
app.post('/update', (req, res) => {
  try {
    const data = req.body;
    console.log('Received update:', JSON.stringify(data).substring(0, 100) + '...');
    
    // Add timestamp if not present
    if (!data.timestamp) {
      data.timestamp = new Date().toISOString();
    }
    
    latestData = data;
    
    // Broadcast to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
    
    res.status(200).json({ 
      success: true, 
      message: `Update broadcast to ${wss.clients.size} clients`,
      receivedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error processing update:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Status endpoint
app.get('/status', (req, res) => {
  res.json({
    status: 'online',
    clients: connectedClients,
    lastUpdate: latestData.timestamp || 'No updates yet'
  });
});

// Simple home route
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Buyers Agent Server</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
          h1 { color: #333; }
          .container { max-width: 800px; margin: 0 auto; }
          .info { background: #f4f4f4; padding: 20px; border-radius: 5px; }
          .endpoint { margin: 10px 0; padding: 10px; background: #e9e9e9; border-radius: 3px; }
          .success { color: green; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Buyers Agent Dashboard Server</h1>
          <div class="info">
            <p><span class="success">✓</span> Server is running!</p>
            <p>Connected clients: ${connectedClients}</p>
            <p>Last update: ${latestData.timestamp || 'No updates yet'}</p>
          </div>
          <h2>Available Endpoints:</h2>
          <div class="endpoint">
            <strong>GET /status</strong> - Check server status
          </div>
          <div class="endpoint">
            <strong>POST /update</strong> - Send updates from n8n
          </div>
          <div class="endpoint">
            <strong>WebSocket ws://[server-url]/</strong> - Connect for real-time updates
          </div>
        </div>
      </body>
    </html>
  `);
});

// Start server
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Server accessible at http://localhost:${PORT}`);
  console.log(`WebSocket server ready at ws://localhost:${PORT}`);
  console.log(`HTTP endpoint available at http://localhost:${PORT}/update`);
});