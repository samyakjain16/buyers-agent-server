import React, { useState, useEffect } from 'react';
import useWebSocket from './hooks/useWebSocket';
import AgentCapacity from './components/AgentCapacity';
import ClientStagesChart from './components/ClientStagesChart';
import TeamOverview from './components/TeamOverview';
import HeatmapTable from './components/HeatmapTable';

// Define all stages
const ALL_STAGES = [
  "New Clients",
  "Set & Forget",
  "Dual Occ site",
  "Offer Acceptance",
  "Unconditional",
  "Pre-Settlement"
];

function App() {
  // WebSocket server URL - adjust as needed
  const WS_URL = 'wss://buyers-agent-dashboard.onrender.com';
  
  // Use WebSocket hook with no initial data
  const { data, connected } = useWebSocket(WS_URL, null);
  
  // State to track which agent is selected
  const [selectedAgent, setSelectedAgent] = useState(null);
  
  // Select the first agent by default when data changes
  useEffect(() => {
    if (data && data.agentData && data.agentData.length > 0) {
      if (!selectedAgent || !data.agentData.find(agent => agent.name === selectedAgent)) {
        setSelectedAgent(data.agentData[0].name);
      }
    }
  }, [data, selectedAgent]);
  
  // Get the selected agent's data
  const selectedAgentData = data && data.agentData && selectedAgent ? 
    data.agentData.find(agent => agent.name === selectedAgent) : null;
  
  // Helper function to check if we have valid data
  const hasData = data && data.agentData && data.agentData.length > 0;
  
  // If no data is available, show a message
  if (!hasData && !connected) {
    return (
      <div className="dashboard-container bg-gray-50">
        <div className="dashboard-header flex justify-between items-center">
          <h1 className="text-2xl font-bold">BUYERS AGENT DASHBOARD</h1>
          <div className="flex items-center">
            <span className="status-indicator status-red"></span>
            <span>Disconnected</span>
          </div>
        </div>
        <div className="card flex items-center justify-center" style={{ height: "300px" }}>
          <p className="text-xl text-gray-500">Connecting to server...</p>
        </div>
      </div>
    );
  }
  
  // If connected but no data available, show a message
  if (!hasData && connected) {
    return (
      <div className="dashboard-container bg-gray-50">
        <div className="dashboard-header flex justify-between items-center">
          <h1 className="text-2xl font-bold">BUYERS AGENT DASHBOARD</h1>
          <div className="flex items-center">
            <span className="status-indicator status-green"></span>
            <span>Connected</span>
          </div>
        </div>
        <div className="card flex items-center justify-center" style={{ height: "300px" }}>
          <p className="text-xl text-gray-500">No data available</p>
        </div>
      </div>
    );
  }
  
  // Regular rendering with data
  return (
    <div className="dashboard-container bg-gray-50">
      <div className="dashboard-header flex justify-between items-center">
        <h1 className="text-2xl font-bold">BUYERS AGENT DASHBOARD</h1>
        <div className="flex items-center">
          <span className={`status-indicator ${connected ? 'status-green' : 'status-red'}`}></span>
          <span>{connected ? 'Connected' : 'Disconnected'}</span>
        </div>
      </div>
      
      {/* Agent Capacity Section */}
      <div className="mb-6">
        <AgentCapacity 
          agents={data.agentData} 
          selectedAgent={selectedAgent} 
          onSelectAgent={setSelectedAgent} 
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Client Stages Chart */}
        {selectedAgentData && (
          <div className="card">
            <ClientStagesChart agentData={selectedAgentData} />
          </div>
        )}
        
        {/* Team Overview */}
        <div className="card">
          <TeamOverview agents={data.agentData} allStages={ALL_STAGES} />
        </div>
        
        {/* Heatmap Table */}
        <div className="card col-span-1 lg:col-span-2">
          <HeatmapTable agents={data.agentData} allStages={ALL_STAGES} />
        </div>
      </div>
      
      {/* Status Legend */}
      <div className="card mt-6 flex justify-center space-x-6">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded mr-2 bg-green-100"></div>
          <span>Green (0-60%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded mr-2 bg-yellow-100"></div>
          <span>Yellow (61-85%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded mr-2 bg-orange-100"></div>
          <span>Orange (86-100%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded mr-2 bg-red-100"></div>
          <span>Red (&gt;100%)</span>
        </div>
      </div>
    </div>
  );
}

export default App;