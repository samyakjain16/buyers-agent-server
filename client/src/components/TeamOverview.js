import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CHART_COLORS } from '../utils/colorUtils';

const TeamOverview = ({ agents, allStages }) => {
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
    
    return {
      totalClients,
      stageTotals,
      stageData: Object.keys(stageTotals)
        .map(stage => ({
          name: stage,
          value: stageTotals[stage]
        }))
        .filter(item => item.value > 0) // Only include stages with clients
    };
  };

  const teamTotals = calculateTeamTotals();

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">TEAM OVERVIEW</h2>
      {teamTotals.stageData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={teamTotals.stageData}
              cx="50%"
              cy="50%"
              labelLine={true}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {teamTotals.stageData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} clients`, 'Count']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex justify-center items-center h-64 text-gray-500">
          No active clients in any stage
        </div>
      )}
    </div>
  );
};

export default TeamOverview;