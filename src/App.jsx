import React, { useState } from 'react';
import { DataProvider } from './contexts/DataContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ClientManagement from './components/ClientManagement';
import CampaignPlanning from './components/CampaignPlanning';
import ContentCalendar from './components/ContentCalendar';
import Reports from './components/Reports';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'clients':
        return <ClientManagement />;
      case 'campaigns':
        return <CampaignPlanning />;
      case 'calendar':
        return <ContentCalendar />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <DataProvider>
      <div className="app">
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />
        <main className="main-content">
          {renderView()}
        </main>
      </div>
    </DataProvider>
  );
}

export default App;
