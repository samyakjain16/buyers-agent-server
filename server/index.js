const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

// Get location from environment variable (defaults to 'default')
const LOCATION = process.env.LOCATION || 'default';

// Location-specific configurations
const locationConfig = {
  newcastle: {
    name: 'Newcastle',
    color: '#3b82f6', // Blue
    emoji: '🏢'
  },
  brisbane: {
    name: 'Brisbane', 
    color: '#10b981', // Green
    emoji: '🌴'
  },
  'central-coast': {
    name: 'Central Coast',
    color: '#8b5cf6', // Purple  
    emoji: '🌊'
  },
  default: {
    name: 'Unknown Location',
    color: '#6b7280', // Gray
    emoji: '❓'
  }
};

const config = locationConfig[LOCATION] || locationConfig.default;

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
  console.log(`${config.name} client connected. Total connections: ${connectedClients}`);
  
  // Send the latest data to newly connected client
  if (Object.keys(latestData).length > 0) {
    ws.send(JSON.stringify(latestData));
  }
  
  // Handle disconnection
  ws.on('close', () => {
    connectedClients--;
    console.log(`${config.name} client disconnected. Total connections: ${connectedClients}`);
  });
});

// HTTP POST endpoint for n8n
app.post('/update', (req, res) => {
  try {
    let data = req.body;
    console.log(`Received ${config.name} update:`, JSON.stringify(data).substring(0, 100) + '...');
    
    // Handle array format from n8n - unwrap if it's an array
    if (Array.isArray(data)) {
      data = data[0];
    }
    
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
      location: config.name,
      message: `${config.name} update broadcast to ${wss.clients.size} clients`,
      receivedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error(`Error processing ${config.name} update:`, error);
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
    location: config.name,
    locationId: LOCATION,
    clients: connectedClients,
    lastUpdate: latestData.timestamp || `No ${config.name} updates yet`
  });
});

// Simple home route
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>${config.name} Buyers Agent Server</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
          h1 { color: ${config.color}; }
          .container { max-width: 800px; margin: 0 auto; }
          .info { background: ${config.color}15; padding: 20px; border-radius: 5px; border-left: 4px solid ${config.color}; }
          .endpoint { margin: 10px 0; padding: 10px; background: #e9e9e9; border-radius: 3px; }
          .success { color: ${config.color}; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>${config.emoji} ${config.name} Buyers Agent Dashboard Server</h1>
          <div class="info">
            <p><span class="success">✓</span> ${config.name} server is running!</p>
            <p>Connected ${config.name} clients: ${connectedClients}</p>
            <p>Last ${config.name} update: ${latestData.timestamp || 'No updates yet'}</p>
            <p>Location ID: <code>${LOCATION}</code></p>
          </div>
          <h2>Available Endpoints:</h2>
          <div class="endpoint">
            <strong>GET /status</strong> - Check ${config.name} server status
          </div>
          <div class="endpoint">
            <strong>POST /update</strong> - Send ${config.name} updates from n8n
          </div>
          <div class="endpoint">
            <strong>WebSocket ws://[server-url]/</strong> - Connect for real-time ${config.name} updates
          </div>
        </div>
      </body>
    </html>
  `);
});

// Start server
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`${config.emoji} ${config.name} Buyers Agent server running on port ${PORT}`);
  console.log(`${config.name} server accessible at http://localhost:${PORT}`);
  console.log(`${config.name} WebSocket server ready at ws://localhost:${PORT}`);
  console.log(`${config.name} HTTP endpoint available at http://localhost:${PORT}/update`);
  console.log(`Environment: LOCATION=${LOCATION}`);
});