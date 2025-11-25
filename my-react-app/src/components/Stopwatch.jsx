import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Stopwatch.css';

const Stopwatch = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  
  const intervalRef = useRef(null);
  const startTimeRef = useRef(0);

  // Start the stopwatch
  const start = useCallback(() => {
    if (!isRunning) {
      setIsRunning(true);
      startTimeRef.current = Date.now() - time;
    }
  }, [isRunning, time]);

  // Stop the stopwatch
  const stop = useCallback(() => {
    if (isRunning) {
      setIsRunning(false);
    }
  }, [isRunning]);

  // Reset the stopwatch
  const reset = useCallback(() => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
    startTimeRef.current = 0;
  }, []);

  // Record a lap time
  const recordLap = useCallback(() => {
    if (isRunning && time > 0) {
      setLaps(prevLaps => [...prevLaps, time]);
    }
  }, [isRunning, time]);

  // Clear all laps
  const clearLaps = useCallback(() => {
    setLaps([]);
  }, []);

  // useEffect with cleanup for the interval
  useEffect(() => {
    if (isRunning) {
      console.log('Setting up interval...');
      
      intervalRef.current = setInterval(() => {
        setTime(Date.now() - startTimeRef.current);
      }, 10);
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        console.log('Cleaning up interval...');
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning]);

  // Keyboard event handling with cleanup
  useEffect(() => {
    const handleKeyPress = (event) => {
      switch (event.key.toLowerCase()) {
        case ' ':
          event.preventDefault();
          if (isRunning) {
            stop();
          } else {
            start();
          }
          break;
        case 'r':
          reset();
          break;
        case 'l':
          recordLap();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    console.log('Keyboard event listener added');

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      console.log('Keyboard event listener removed');
    };
  }, [isRunning, start, stop, reset, recordLap]);

  // Format time for display
  const formatTime = (timeInMs) => {
    const totalSeconds = Math.floor(timeInMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((timeInMs % 1000) / 10);

    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
      milliseconds: milliseconds.toString().padStart(2, '0'),
    };
  };

  const formattedTime = formatTime(time);

  return (
    <div className="stopwatch-container">
      <h1 className="stopwatch-title">Stopwatch</h1>
      
      {/* Time Display */}
      <div className="time-display">
        <span className="time-segment">{formattedTime.hours}</span>
        <span className="time-separator">:</span>
        <span className="time-segment">{formattedTime.minutes}</span>
        <span className="time-separator">:</span>
        <span className="time-segment">{formattedTime.seconds}</span>
        <span className="time-separator">.</span>
        <span className="time-segment milliseconds">{formattedTime.milliseconds}</span>
      </div>

      {/* Status Indicator */}
      <div className={`status-indicator ${isRunning ? 'running' : 'stopped'}`}>
        {isRunning ? 'Running' : 'Stopped'}
      </div>

      {/* Control Buttons */}
      <div className="button-container">
        {!isRunning ? (
          <button 
            className="control-btn start-btn" 
            onClick={start}
          >
            Start
          </button>
        ) : (
          <button 
            className="control-btn stop-btn" 
            onClick={stop}
          >
            Stop
          </button>
        )}
        
        <button 
          className="control-btn reset-btn" 
          onClick={reset}
        >
          Reset
        </button>
        
        <button 
          className="control-btn lap-btn" 
          onClick={recordLap}
          disabled={!isRunning || time === 0}
        >
          Lap
        </button>
      </div>

      {/* Keyboard Shortcuts Info */}
      <div className="shortcuts-info">
        <p>Keyboard Shortcuts:</p>
        <span><kbd>Space</kbd> Start/Stop</span>
        <span><kbd>R</kbd> Reset</span>
        <span><kbd>L</kbd> Lap</span>
      </div>

      {/* Laps Display */}
      {laps.length > 0 && (
        <div className="laps-container">
          <div className="laps-header">
            <h3>Lap Times</h3>
            <button className="clear-laps-btn" onClick={clearLaps}>
              Clear All
            </button>
          </div>
          <ul className="laps-list">
            {laps.map((lapTime, index) => {
              const lapFormatted = formatTime(lapTime);
              const prevLapTime = index > 0 ? laps[index - 1] : 0;
              const lapDiff = lapTime - prevLapTime;
              const diffFormatted = formatTime(lapDiff);
              
              return (
                <li key={index} className="lap-item">
                  <span className="lap-number">Lap {index + 1}</span>
                  <span className="lap-time">
                    {lapFormatted.hours}:{lapFormatted.minutes}:
                    {lapFormatted.seconds}.{lapFormatted.milliseconds}
                  </span>
                  <span className="lap-diff">
                    (+{diffFormatted.minutes}:{diffFormatted.seconds}.{diffFormatted.milliseconds})
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Stopwatch;