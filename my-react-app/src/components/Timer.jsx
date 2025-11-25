import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Timer.css';

const Timer = () => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  
  const [totalTime, setTotalTime] = useState(300);
  const [remainingTime, setRemainingTime] = useState(300);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  
  const intervalRef = useRef(null);

  // Calculate total seconds from input
  const calculateTotalSeconds = useCallback(() => {
    return hours * 3600 + minutes * 60 + seconds;
  }, [hours, minutes, seconds]);

  // Start timer
  const start = useCallback(() => {
    if (isEditing) {
      const total = calculateTotalSeconds();
      if (total <= 0) return;
      
      setTotalTime(total);
      setRemainingTime(total);
      setIsEditing(false);
    }
    
    if (remainingTime > 0) {
      setIsRunning(true);
      setIsFinished(false);
    }
  }, [isEditing, calculateTotalSeconds, remainingTime]);

  // Pause timer
  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  // Reset timer
  const reset = useCallback(() => {
    setIsRunning(false);
    setIsFinished(false);
    setIsEditing(true);
    setRemainingTime(totalTime);
  }, [totalTime]);

  // Full reset
  const fullReset = useCallback(() => {
    setIsRunning(false);
    setIsFinished(false);
    setIsEditing(true);
    setHours(0);
    setMinutes(5);
    setSeconds(0);
    setTotalTime(300);
    setRemainingTime(300);
  }, []);

  // Timer countdown effect with cleanup
  useEffect(() => {
    if (isRunning && remainingTime > 0) {
      console.log('Starting countdown interval...');
      
      intervalRef.current = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        console.log('Cleaning up countdown interval...');
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning]);

  // Format remaining time
  const formatDisplayTime = useCallback((timeInSeconds) => {
    const h = Math.floor(timeInSeconds / 3600);
    const m = Math.floor((timeInSeconds % 3600) / 60);
    const s = timeInSeconds % 60;

    return {
      hours: h.toString().padStart(2, '0'),
      minutes: m.toString().padStart(2, '0'),
      seconds: s.toString().padStart(2, '0'),
    };
  }, []);

  // Calculate progress
  const progressPercentage = totalTime > 0 
    ? ((totalTime - remainingTime) / totalTime) * 100 
    : 0;

  const displayTime = formatDisplayTime(remainingTime);

  // Quick presets
  const presets = [
    { label: '1 min', seconds: 60 },
    { label: '5 min', seconds: 300 },
    { label: '10 min', seconds: 600 },
    { label: '15 min', seconds: 900 },
    { label: '30 min', seconds: 1800 },
    { label: '1 hour', seconds: 3600 },
  ];

  const applyPreset = useCallback((presetSeconds) => {
    const h = Math.floor(presetSeconds / 3600);
    const m = Math.floor((presetSeconds % 3600) / 60);
    const s = presetSeconds % 60;
    
    setHours(h);
    setMinutes(m);
    setSeconds(s);
  }, []);

  return (
    <div className={`timer-container ${isFinished ? 'finished' : ''}`}>
      <h1 className="timer-title">Countdown Timer</h1>

      {/* Progress Ring */}
      <div className="progress-ring-container">
        <svg className="progress-ring" viewBox="0 0 120 120">
          <circle
            className="progress-ring-background"
            cx="60"
            cy="60"
            r="54"
          />
          <circle
            className="progress-ring-progress"
            cx="60"
            cy="60"
            r="54"
            style={{
              strokeDasharray: `${2 * Math.PI * 54}`,
              strokeDashoffset: `${2 * Math.PI * 54 * (1 - progressPercentage / 100)}`,
            }}
          />
        </svg>
        
        {/* Timer Display */}
        <div className="timer-display">
          {isEditing ? (
            <div className="time-inputs">
              <div className="input-group">
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={hours}
                  onChange={(e) => setHours(Math.min(23, Math.max(0, parseInt(e.target.value) || 0)))}
                  className="time-input"
                />
                <label>H</label>
              </div>
              <span className="input-separator">:</span>
              <div className="input-group">
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={minutes}
                  onChange={(e) => setMinutes(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                  className="time-input"
                />
                <label>M</label>
              </div>
              <span className="input-separator">:</span>
              <div className="input-group">
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={seconds}
                  onChange={(e) => setSeconds(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                  className="time-input"
                />
                <label>S</label>
              </div>
            </div>
          ) : (
            <div className="countdown-display">
              <span>{displayTime.hours}</span>
              <span className="separator">:</span>
              <span>{displayTime.minutes}</span>
              <span className="separator">:</span>
              <span>{displayTime.seconds}</span>
            </div>
          )}
        </div>
      </div>

      {/* Finished Message */}
      {isFinished && (
        <div className="finished-message">
          Time is Up!
        </div>
      )}

      {/* Quick Presets */}
      {isEditing && (
        <div className="presets-container">
          <p>Quick Presets:</p>
          <div className="presets-grid">
            {presets.map((preset) => (
              <button
                key={preset.label}
                className="preset-btn"
                onClick={() => applyPreset(preset.seconds)}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className="timer-buttons">
        {!isRunning && !isFinished && (
          <button 
            className="timer-btn start-btn" 
            onClick={start}
            disabled={isEditing && calculateTotalSeconds() <= 0}
          >
            {isEditing ? 'Start' : 'Resume'}
          </button>
        )}
        
        {isRunning && (
          <button className="timer-btn pause-btn" onClick={pause}>
            Pause
          </button>
        )}
        
        {!isEditing && (
          <button className="timer-btn reset-btn" onClick={reset}>
            Reset
          </button>
        )}
        
        {isFinished && (
          <button className="timer-btn dismiss-btn" onClick={fullReset}>
            Dismiss
          </button>
        )}
        
        {isEditing && (
          <button className="timer-btn clear-btn" onClick={fullReset}>
            Clear
          </button>
        )}
      </div>

      {/* Status */}
      <div className={`timer-status ${isRunning ? 'running' : isFinished ? 'finished' : 'paused'}`}>
        {isRunning ? 'Running...' : isFinished ? 'Finished!' : isEditing ? 'Set Time' : 'Paused'}
      </div>
    </div>
  );
};

export default Timer;