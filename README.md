# Buyers Agent Dashboard Server

This is a real-time server for the Buyers Agent Dashboard application. It receives data via HTTP POST and broadcasts updates to connected clients via WebSockets.

## Features

- HTTP API for receiving updates
- WebSocket server for real-time client updates
- Status endpoint for monitoring

## Local Development

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the server:
   ```
   npm start
   ```
   
The server will be available at:
- HTTP: http://localhost:3001
- WebSocket: ws://localhost:3001

## API Endpoints

### GET /status
Returns the current server status, number of connected clients, and timestamp of the last update.

### POST /update
Receives data updates (typically from n8n) and broadcasts them to all connected WebSocket clients.

Example request body:
```json
{
  "agentData": [
    {
      "name": "Agent Name",
      "activeClients": 10,
      "capacity": 75.00,
      "clientStages": [
        { "name": "New Clients", "clients": 3 },
        { "name": "Set & Forget", "clients": 2 },
        { "name": "Dual Occ site", "clients": 1 },
        { "name": "Offer Acceptance", "clients": 2 },
        { "name": "Unconditional", "clients": 1 },
        { "name": "Pre-Settlement", "clients": 1 }
      ]
    }
  ]
}
```

## WebSocket Connection

Connect to the WebSocket server at `ws://your-server-url/` to receive real-time updates. The server will immediately send the latest data upon connection.

## Environment Variables

- `PORT`: Port number for the server (default: 3001)