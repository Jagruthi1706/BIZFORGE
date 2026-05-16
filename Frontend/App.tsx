import React, { useState } from 'react';
import { LandingPage } from './views/LandingPage';
import { Dashboard } from './views/Dashboard';
import { AppView } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('landing');

  return (
    <>
      {currentView === 'landing' && <LandingPage onNavigate={setCurrentView} />}
      {currentView === 'dashboard' && <Dashboard onNavigate={setCurrentView} />}
    </>
  );
};

export default App;