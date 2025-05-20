
import React, { useState, useEffect } from 'react';
import useWebSocket from './hooks/useWebSocket';
import AgentCapacity from './components/AgentCapacity';
import ClientStagesChart from './components/ClientStagesChart';
import TeamOverview from './components/TeamOverview';
import HeatmapTable from './components/HeatmapTable';

// Sample initial data
const initialData = {
  agentData: [
    {
      name: "Sam Black",
      activeClients: 18,
      capacity: 60.00,
      clientStages: [
        { name: "New Clients", clients: 4 },
        { name: "Set & Forget", clients: 5 },
        { name: "Dual Occ site", clients: 2 },
        { name: "Offer Acceptance", clients: 1 },
        { name: "Unconditional", clients: 2 },
        { name: "Pre-Settlement", clients: 4 }
      ]
    },
    {
      name: "Jess Lee",
      activeClients: 23,
      capacity: 95.00,
      clientStages: [
        { name: "New Clients", clients: 8 },
        { name: "Set & Forget", clients: 6 },
        { name: "Dual Occ site", clients: 4 },
        { name: "Offer Acceptance", clients: 3 },
        { name: "Unconditional", clients: 1 },
        { name: "Pre-Settlement", clients: 2 }
      ]
    },
    {
      name: "Alex Morgan",
      activeClients: 13,
      capacity: 40.00,
      clientStages: [
        { name: "New Clients", clients: 2 },
        { name: "Set & Forget", clients: 2 },
        { name: "Dual Occ site", clients: 2 },
        { name: "Offer Acceptance", clients: 2 },
        { name: "Unconditional", clients: 2 },
        { name: "Pre-Settlement", clients: 1 }
      ]
    }
  ]
};

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
const WS_URL = 'wss://buyers-agent-server.onrender.com';
  
  // Use WebSocket hook
  const { data, connected} = useWebSocket(WS_URL, initialData);
  
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
          agents={data && data.agentData ? data.agentData : []} 
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
          <TeamOverview agents={data && data.agentData ? data.agentData : []} allStages={ALL_STAGES} />
        </div>
        
        {/* Heatmap Table */}
        <div className="card col-span-1 lg:col-span-2">
          <HeatmapTable agents={data && data.agentData ? data.agentData : []} allStages={ALL_STAGES} />
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
