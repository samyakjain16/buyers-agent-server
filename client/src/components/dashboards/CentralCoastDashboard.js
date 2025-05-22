import React, { useState, useEffect } from 'react';
import useWebSocket from '../../hooks/useWebSocket';
import AgentCapacity from '../AgentCapacity';
import ClientStagesChart from '../ClientStagesChart';
import TeamOverview from '../TeamOverview';
import HeatmapTable from '../HeatmapTable';

// Central Coast-specific client stages
const CENTRAL_COAST_STAGES = [
  "Lead Generation",
  "Client Onboarding",
  "Market Research",
  "Property Hunting",
  "Due Diligence",
  "Negotiation",
  "Contract Management",
  "Completion"
];

const CentralCoastDashboard = ({ onBack }) => {
  const WS_URL = 'wss://buyers-agent-centralcoast-dashboard.onrender.com';
  const { data, connected } = useWebSocket(WS_URL, null, 'central-coast');
  const [selectedAgent, setSelectedAgent] = useState(null);
  
  useEffect(() => {
    if (data && data.agentData && data.agentData.length > 0) {
      if (!selectedAgent || !data.agentData.find(agent => agent.name === selectedAgent)) {
        setSelectedAgent(data.agentData[0].name);
      }
    }
  }, [data, selectedAgent]);
  
  const selectedAgentData = data && data.agentData && selectedAgent ? 
    data.agentData.find(agent => agent.name === selectedAgent) : null;
  
  const hasData = data && data.agentData && data.agentData.length > 0;
  
  if (!hasData && !connected) {
    return (
      <div className="dashboard-container bg-gray-50">
        <div className="dashboard-header flex justify-between items-center">
          <div className="flex items-center">
            <button 
              onClick={onBack}
              className="mr-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            >
              ← Back to Locations
            </button>
            <h1 className="text-2xl font-bold">🌊 CENTRAL COAST BUYERS AGENT DASHBOARD</h1>
          </div>
          <div className="flex items-center">
            <span className="status-indicator status-red"></span>
            <span>Disconnected</span>
          </div>
        </div>
        <div className="card flex items-center justify-center" style={{ height: "300px" }}>
          <p className="text-xl text-gray-500">Connecting to Central Coast server...</p>
        </div>
      </div>
    );
  }
  
  if (!hasData && connected) {
    return (
      <div className="dashboard-container bg-gray-50">
        <div className="dashboard-header flex justify-between items-center">
          <div className="flex items-center">
            <button 
              onClick={onBack}
              className="mr-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            >
              ← Back to Locations
            </button>
            <h1 className="text-2xl font-bold">🌊 CENTRAL COAST BUYERS AGENT DASHBOARD</h1>
          </div>
          <div className="flex items-center">
            <span className="status-indicator status-green"></span>
            <span>Connected</span>
          </div>
        </div>
        <div className="card flex items-center justify-center" style={{ height: "300px" }}>
          <p className="text-xl text-gray-500">No Central Coast agent data available</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="dashboard-container bg-gray-50">
      <div className="dashboard-header flex justify-between items-center">
        <div className="flex items-center">
          <button 
            onClick={onBack}
            className="mr-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
          >
            ← Back to Locations
          </button>
          <h1 className="text-2xl font-bold">🌊 CENTRAL COAST BUYERS AGENT DASHBOARD</h1>
        </div>
        <div className="flex items-center">
          <span className={`status-indicator ${connected ? 'status-green' : 'status-red'}`}></span>
          <span>{connected ? 'Connected' : 'Disconnected'}</span>
        </div>
      </div>
      
      {/* Central Coast-specific content */}
      <div className="mb-4 bg-purple-50 border-l-4 border-purple-400 p-4 rounded">
        <p className="text-purple-800">
          <strong>Central Coast Office:</strong> Specialized workflow for {data.agentData.length} agents in coastal property markets
        </p>
      </div>
      
      <div className="mb-6">
        <AgentCapacity 
          agents={data.agentData} 
          selectedAgent={selectedAgent} 
          onSelectAgent={setSelectedAgent} 
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {selectedAgentData && (
          <div className="card">
            <ClientStagesChart agentData={selectedAgentData} />
          </div>

          )}
        
        <div className="card">
          <TeamOverview agents={data.agentData} allStages={CENTRAL_COAST_STAGES} />
        </div>
        
        <div className="card col-span-1 lg:col-span-2">
          <HeatmapTable agents={data.agentData} allStages={CENTRAL_COAST_STAGES} />
        </div>
      </div>
      
      {/* Central Coast-specific legend */}
      <div className="card mt-6">
        <h3 className="text-lg font-semibold mb-4">Central Coast Process Stages</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {CENTRAL_COAST_STAGES.map((stage, index) => (
            <div key={stage} className="flex items-center">
              <div className="w-3 h-3 rounded mr-2" style={{ backgroundColor: `hsl(${280 + index * 20}, 70%, 60%)` }}></div>
              <span className="text-sm">{stage}</span>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center space-x-6 pt-4 border-t">
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
    </div>
  );
};

export default CentralCoastDashboard;