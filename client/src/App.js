import React, { useState } from 'react';
import HomePage from './components/HomePage';
import NewcastleDashboard from './components/dashboards/NewcastleDashboard';
import BrisbaneDashboard from './components/dashboards/BrisbaneDashboard';
import CentralCoastDashboard from './components/dashboards/CentralCoastDashboard';
import './styles.css';

function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  
  const handleSelectLocation = (location) => {
    setSelectedLocation(location);
  };
  
  const handleBackToHome = () => {
    setSelectedLocation(null);
  };
  
  const renderDashboard = () => {
    switch(selectedLocation) {
      case 'newcastle':
        return <NewcastleDashboard onBack={handleBackToHome} />;
      case 'brisbane':
        return <BrisbaneDashboard onBack={handleBackToHome} />;
      case 'central-coast':
        return <CentralCoastDashboard onBack={handleBackToHome} />;
      default:
        return <HomePage onSelectLocation={handleSelectLocation} />;
    }
  };
  
  return renderDashboard();
}

export default App;