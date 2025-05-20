import {getBorderColor } from '../utils/colorUtils';

const AgentCapacity = ({ agents, selectedAgent, onSelectAgent }) => {
  // Calculate summary statistics
  const totalClients = agents.reduce((sum, agent) => sum + agent.activeClients, 0);
  const avgClientsPerAgent = agents.length > 0 ? (totalClients / agents.length).toFixed(1) : 0;
  const avgCapacity = agents.length > 0 
    ? Math.round(agents.reduce((sum, agent) => sum + agent.capacity, 0) / agents.length) 
    : 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-6">ACTIVE CLIENTS</h2>
      
      {/* Agent circles - adjusted spacing */}
      <div className="flex justify-evenly items-center mb-8">
        {agents.map(agent => (
          <div 
            key={agent.name}
            onClick={() => onSelectAgent(agent.name)}
            className={`cursor-pointer transition-all duration-200 flex flex-col items-center
              ${selectedAgent === agent.name ? 'scale-110' : 'hover:scale-105'}`}
          >
            {/* Circular progress indicator */}
            <div className="relative w-32 h-32 mb-3">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  fill="none" 
                  stroke="#e2e8f0" 
                  strokeWidth="10" 
                />
                {/* Progress circle */}
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  fill="none" 
                  stroke={getBorderColor(agent.capacity)} 
                  strokeWidth="10" 
                  strokeDasharray="282.7"
                  strokeDashoffset={282.7 - (282.7 * agent.capacity / 100)} 
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
                {/* Text in the middle */}
                <text 
                  x="50" 
                  y="45" 
                  textAnchor="middle" 
                  fontSize="24" 
                  fontWeight="bold"
                >
                  {agent.activeClients}
                </text>
                <text 
                  x="50" 
                  y="65" 
                  textAnchor="middle" 
                  fontSize="12"
                >
                  clients
                </text>
              </svg>
            </div>
            
            {/* Agent name and capacity */}
            <div className="text-center">
              <div className="text-lg font-bold">{agent.name.split(' ')[0]}</div>
              <div className="text-sm text-gray-600">{agent.capacity}% capacity</div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Summary statistics */}
      <div className="bg-gray-100 rounded-lg p-4 grid grid-cols-3 gap-4 text-center">
        <div className="flex flex-col">
          <span className="text-3xl font-bold">{totalClients}</span>
          <span className="text-sm text-gray-600">Total Active Clients</span>
        </div>
        <div className="flex flex-col">
          <span className="text-3xl font-bold">{avgClientsPerAgent}</span>
          <span className="text-sm text-gray-600">Avg Clients per Agent</span>
        </div>
        <div className="flex flex-col">
          <span className="text-3xl font-bold">{avgCapacity}%</span>
          <span className="text-sm text-gray-600">Avg Capacity</span>
        </div>
      </div>
    </div>
  );
};

export default AgentCapacity;
