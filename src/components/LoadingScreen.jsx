import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import './LoadingScreen.css';

const LoadingScreen = ({ isExiting }) => {
  const [progress, setProgress] = useState(0);
  const [bootLines, setBootLines] = useState([]);
  const [metricIndex, setMetricIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const bootSequence = [
    "Initializing Climate Intelligence Core...",
    "Connecting Satellite Systems...",
    "Synchronizing Atmospheric Grid...",
    "Loading Environmental Datasets...",
    "Activating AI Forecast Engine...",
    "Monitoring 195 Countries...",
    "Neural Nets Online."
  ];

  const metrics = [
    "AQI STREAM CONNECTED",
    "SATELLITE NETWORK ACTIVE",
    "GLOBAL TEMPERATURE MATRIX READY",
    "CLIMATE AI ONLINE",
    "EARTH CORE SYNCHRONIZED"
  ];

  useEffect(() => {
    // Boot text animation
    let lineIndex = 0;
    const bootTimer = setInterval(() => {
      if (lineIndex < bootSequence.length) {
        setBootLines(prev => [...prev, bootSequence[lineIndex]]);
        lineIndex++;
      } else {
        clearInterval(bootTimer);
      }
    }, 600);

    // Metrics animation
    const metricTimer = setInterval(() => {
      setMetricIndex(prev => Math.min(prev + 1, metrics.length));
    }, 1000);

    // Progress animation
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          setIsComplete(true);
          return 100;
        }
        return prev + Math.floor(Math.random() * 3) + 1;
      });
    }, 80);

    return () => {
      clearInterval(bootTimer);
      clearInterval(metricTimer);
      clearInterval(progressTimer);
    };
  }, []);

  // Generate stars
  const stars = Array.from({ length: 150 }).map((_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: `${Math.random() * 3 + 1}px`,
    duration: `${Math.random() * 3 + 2}s`
  }));

  return (
    <div className={`loading-screen ${isExiting || isComplete ? 'exit' : ''}`}>
      <div className="nebula-gradient-1"></div>
      <div className="nebula-gradient-2"></div>
      <div className="holo-grid-bg"></div>
      <div className="scanlines"></div>

      {/* Stars Background */}
      {stars.map(star => (
        <div key={star.id} className="star" style={{ top: star.top, left: star.left, width: star.size, height: star.size, '--duration': star.duration }}></div>
      ))}

      {/* Centerpiece */}
      <div className={`centerpiece-container ${isComplete ? 'complete' : ''}`}>
        
        {/* Orbital Rings */}
        <div className="orbit-ring ring-outer">
          <div className="satellite-node"></div>
          <div className="satellite-node" style={{ left: '50%', top: 'auto', bottom: '-6px' }}></div>
        </div>
        <div className="orbit-ring ring-middle">
          <div className="radar-sweep"></div>
        </div>
        <div className="orbit-ring ring-inner">
          <div className="satellite-node" style={{ right: '-6px', left: 'auto', top: '50%' }}></div>
        </div>

        {/* The Earth */}
        <div className="main-earth"></div>

        {/* Floating Glassmorphism Panel */}
        {!isComplete && (
          <div className="glass-loading-panel">
            {/* Enhanced AI Core Logo inside panel */}
            <div className="ai-core-logo-container">
              <img src="/favicon.png" alt="Green Earth AI" className="ai-core-logo" />
              <div className="logo-scanner"></div>
            </div>
            
            <div className="glp-pct">{progress}%</div>
            <div className="glp-title">Global System Boot</div>
          </div>
        )}
      </div>

      {/* AI Boot Terminal */}
      {!isComplete && (
        <div className="boot-terminal">
          {bootLines.map((line, i) => (
            <div key={i} className="boot-line">{"> " + line}</div>
          ))}
          <span className="cursor"></span>
        </div>
      )}

      {/* Live Metrics */}
      {!isComplete && (
        <div className="metrics-panel">
          {metrics.slice(0, metricIndex).map((metric, i) => (
            <div key={i} className="metric-item" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="metric-icon"><Check size={14} strokeWidth={3} /></div>
              {metric}
            </div>
          ))}
        </div>
      )}

      {/* Final Activation */}
      <AnimatePresence>
        {isComplete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="final-activation"
          >
            <div className="environmental-pulse"></div>
            <h1 className="final-title">GREEN EARTH ONLINE</h1>
            <h2 className="final-subtitle">AI Climate Intelligence Ready</h2>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoadingScreen;
