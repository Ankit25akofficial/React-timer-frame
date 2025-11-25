import React, { useState, useEffect } from 'react';
import Stopwatch from './components/Stopwatch.jsx';
import Timer from './components/Timer.jsx';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('stopwatch');
  const [mounted, setMounted] = useState(true);

  const toggleMount = () => {
    setMounted(prev => !prev);
  };

  useEffect(() => {
    console.log('App mounted');
    return () => {
      console.log('App unmounted');
    };
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Timer & Stopwatch App</h1>
        <p>Built with React useEffect Cleanup</p>
      </header>

      {/* Tab Navigation */}
      <nav className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === 'stopwatch' ? 'active' : ''}`}
          onClick={() => setActiveTab('stopwatch')}
        >
          Stopwatch
        </button>
        <button
          className={`tab-btn ${activeTab === 'timer' ? 'active' : ''}`}
          onClick={() => setActiveTab('timer')}
        >
          Timer
        </button>
      </nav>

      {/* Mount Toggle for Testing Cleanup */}
      <div className="mount-toggle">
        <button onClick={toggleMount} className="mount-btn">
          {mounted ? 'Unmount Component' : 'Mount Component'}
        </button>
        <p className="mount-info">
          Check console to see cleanup messages when unmounting
        </p>
      </div>

      {/* Content */}
      <main className="app-content">
        {mounted && (
          <>
            {activeTab === 'stopwatch' && <Stopwatch />}
            {activeTab === 'timer' && <Timer />}
          </>
        )}
        
        {!mounted && (
          <div className="unmounted-message">
            <p>Component is unmounted</p>
            <p>Check the console to see the cleanup logs!</p>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>React useEffect Cleanup Demo</p>
      </footer>
    </div>
  );
}

export default App;