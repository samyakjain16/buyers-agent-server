import React from 'react';

const ConnectionStatus = ({ connected, messages }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">CONNECTION STATUS</h2>
      {messages.length > 0 ? (
        <div className="space-y-2">
          {messages.map((msg, index) => (
            <div key={index} className="p-2 bg-gray-50 rounded text-sm">
              <span className="text-gray-500 mr-2">[{msg.timestamp}]</span>
              {msg.message}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 text-center text-gray-500">No connection events yet</div>
      )}
    </div>
  );
};

export default ConnectionStatus;