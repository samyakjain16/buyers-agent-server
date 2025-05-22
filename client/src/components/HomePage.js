// src/components/HomePage.js
import React from 'react';

const HomePage = ({ onSelectLocation }) => {
  const locations = [
    {
      id: 'newcastle',
      name: 'Newcastle',
      description: 'Traditional property buying process',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      features: ['6 Stage Process', 'Settlement Focus', 'Dual Occupancy Tracking']
    },
    {
      id: 'brisbane', 
      name: 'Brisbane',
      description: 'Enhanced client journey tracking',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      features: ['8 Stage Journey', 'Finance Integration', 'Inspection Management']
    },
    {
      id: 'central-coast',
      name: 'Central Coast', 
      description: 'Coastal market specialization',
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      features: ['Market Research Focus', 'Due Diligence', 'Coastal Properties']
    }
  ];

  return (
    <div className="dashboard-container bg-gray-50 min-h-screen">
      <div className="dashboard-header flex justify-center items-center mb-12">
        <h1 className="text-4xl font-bold">BUYERS AGENT DASHBOARD</h1>
      </div>
      
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold text-center mb-4 text-gray-700">
          Select Your Location
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {locations.map((location) => (
            <div
              key={location.id}
              onClick={() => onSelectLocation(location.id)}
              className={`
                ${location.color} ${location.hoverColor}
                text-white rounded-xl p-8 cursor-pointer 
                transform transition-all duration-200 hover:scale-105 hover:shadow-lg
                flex flex-col justify-between min-h-[280px]
                shadow-md
              `}
            >
              <div>
                <h3 className="text-2xl font-bold mb-4">{location.name}</h3>
                
                <div className="space-y-2">
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <div className="bg-white bg-opacity-20 rounded-lg py-2 px-4 inline-block">
                  <span className="text-sm font-medium">Click to view dashboard</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;