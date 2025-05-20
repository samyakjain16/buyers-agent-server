import React from 'react';
import { getCapacityColor } from '../utils/colorUtils';

const HeatmapTable = ({ agents, allStages }) => {
  // Calculate team totals
  const calculateTeamTotals = () => {
    const stageTotals = {};
    let totalClients = 0;
    
    allStages.forEach(stage => {
      stageTotals[stage] = 0;
    });
    
    agents.forEach(agent => {
      totalClients += agent.activeClients;
      
      agent.clientStages.forEach(stage => {
        stageTotals[stage.name] += stage.clients;
      });
    });
    
    return { totalClients, stageTotals };
  };

  const teamTotals = calculateTeamTotals();

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">AGENT CAPACITY HEATMAP</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="p-2 border bg-gray-100">Agent</th>
              {allStages.map(stage => (
                <th key={stage} className="p-2 border bg-gray-100 text-xs">
                  {stage}
                </th>
              ))}
              <th className="p-2 border bg-gray-100">Total</th>
            </tr>
          </thead>
          <tbody>
            {agents.map(agent => (
              <tr key={agent.name}>
                <td className="p-2 border font-medium">{agent.name}</td>
                {allStages.map(stageName => {
                  const stage = agent.clientStages.find(s => s.name === stageName);
                  const clients = stage ? stage.clients : 0;
                  return (
                    <td 
                      key={`${agent.name}-${stageName}`} 
                      className="p-2 border text-center font-bold"
                      style={{ backgroundColor: clients > 0 ? getCapacityColor(agent.capacity) : '' }}
                    >
                      {clients}
                    </td>
                  );
                })}
                <td 
                  className="p-2 border text-center font-bold"
                  style={{ backgroundColor: getCapacityColor(agent.capacity) }}
                >
                  {agent.activeClients}
                  <div className="text-xs font-normal">{agent.capacity}%</div>
                </td>
              </tr>
            ))}
            <tr className="bg-gray-50">
              <td className="p-2 border font-medium">Team Total</td>
              {allStages.map(stageName => (
                <td 
                  key={`total-${stageName}`} 
                  className="p-2 border text-center font-bold"
                >
                  {teamTotals.stageTotals[stageName]}
                </td>
              ))}
              <td className="p-2 border text-center font-bold">
                {teamTotals.totalClients}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HeatmapTable;