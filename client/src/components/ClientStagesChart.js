import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ClientStagesChart = ({ agentData }) => {
  if (!agentData) return null;
  
  const stagesWithClients = agentData.clientStages.filter(stage => stage.clients > 0);
  
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">CLIENT STAGES: {agentData.name}</h2>
      {stagesWithClients.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stagesWithClients}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="clients" fill="#60a5fa" name="Clients" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex justify-center items-center h-64 text-gray-500">
          No active clients in any stage
        </div>
      )}
    </div>
  );
};

export default ClientStagesChart;