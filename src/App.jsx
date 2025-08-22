import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import AtomicStructureModule from './components/AtomicStructureModule';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('landing');

  return (
    <div className="App">
      {currentView === 'landing' ? (
        <LandingPage onStartLearning={() => setCurrentView('module')} />
      ) : (
        <AtomicStructureModule onBackToHome={() => setCurrentView('landing')} />
      )}
    </div>
  );
}

export default App;
