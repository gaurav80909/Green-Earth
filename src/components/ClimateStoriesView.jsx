import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ThermometerSun, Wind, Droplets, Radar, Activity, Globe, Terminal } from 'lucide-react';
import './ClimateStoriesView.css';

const ClimateStoriesView = ({ customReports = [], onStartYearChange, onEndYearChange, onGenerateReport }) => {
  const [terminalLines, setTerminalLines] = useState([]);
  const fullTerminalText = [
    "> AI CLIMATE ENGINE ACTIVE",
    "> Satellite streams synchronized...",
    "> Predictive anomaly detection running...",
    "> Environmental threat analysis complete."
  ];

  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < fullTerminalText.length) {
        setTerminalLines(prev => [...prev, fullTerminalText[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const alerts = [
    {
      id: 1, severity: 'critical', title: 'Extreme Heatwave — South Asia', 
      region: 'South Asia', risk: '96%', metric: '+2.1°C', metricLabel: 'Temp Anomaly', 
      time: 'LIVE', icon: ThermometerSun, color: '#ff003c', width: '90%'
    },
    {
      id: 2, severity: 'high', title: 'Wildfire Expansion — Canada', 
      region: 'North America', risk: '84%', metric: '↑ Velocity', metricLabel: 'Spread Rate', 
      time: '-12 MINS', icon: AlertTriangle, color: '#ff7b00', width: '70%'
    },
    {
      id: 3, severity: 'moderate', title: 'Arctic Ice Decline', 
      region: 'Arctic Circle', risk: '62%', metric: 'Accel.', metricLabel: 'Loss Rate', 
      time: '-45 MINS', icon: Droplets, color: '#00d8ff', width: '50%'
    },
    {
      id: 4, severity: 'stable', title: 'Oceanic Pressure Conditions', 
      region: 'Pacific', risk: '12%', metric: 'Stable', metricLabel: 'Environmental State', 
      time: '-2 HRS', icon: Wind, color: '#39ff14', width: '20%'
    }
  ];

  return (
    <div className="live-climate-dashboard">
      <div className="dashboard-background">
        <div className="holographic-grid"></div>
        <div className="scan-line"></div>
      </div>

      <div className="dashboard-header">
        <div className="live-indicator-container">
          <div className="live-dot"></div>
          <span className="live-text">LIVE • SYSTEM ACTIVE</span>
          <span className="system-status">• LAST UPDATE: {new Date().toLocaleTimeString('en-US', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit' })} UTC</span>
        </div>
        <h2 className="dashboard-title">LIVE GLOBAL CLIMATE INTELLIGENCE FEED</h2>
        <div className="glowing-divider"></div>
        <p className="dashboard-subtitle">Real-time environmental threat monitoring powered by AI forecasting and planetary climate analytics.</p>
      </div>

      <div className="ticker-container">
        <div className="ticker-text">
          ⚠️ HEATWAVE RISK RISING • ⚠️ ARCTIC ICE DECLINE ACCELERATING • ⚠️ AQI CRITICAL IN URBAN REGIONS • ⚠️ OCEAN TEMPERATURES AT RECORD HIGH • 
        </div>
      </div>

      <div className="dashboard-layout">
        <div className="left-panel">
          <div className="panel-title"><Activity size={18} /> Live Climate Alert Feed</div>
          
          <AnimatePresence>
            {alerts.map((alert, i) => (
              <motion.div 
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
                className={`alert-card severity-${alert.severity}`}
              >
                <div className="alert-header">
                  <span className="alert-badge">{alert.severity}</span>
                  <span className="alert-timestamp">{alert.time}</span>
                </div>
                <h3 className="alert-title">{alert.title}</h3>
                
                <div className="alert-details">
                  <div className="alert-metric">
                    <span className="metric-value">{alert.metric}</span>
                    <span className="metric-label">{alert.metricLabel}</span>
                  </div>
                  
                  <div className="risk-score">
                    <span className="metric-label">AI Risk Score: {alert.risk}</span>
                    <div className="mini-graph">
                      <div className="mini-graph-fill" style={{ width: alert.width, background: alert.color }}></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="right-panel">
          <div className="threat-map-container">
            <div className="panel-title"><Globe size={18} /> Global Threat Density</div>
            <div className="map-placeholder">
              <img src="/globe.png" alt="Threat Density Map" className="threat-map-image" />
              <div className="radar-sweep"></div>
              {/* Optional hotspots overlay if needed */}
              <div className="hotspot" style={{ top: '30%', left: '40%', zIndex: 3 }}></div>
              <div className="hotspot" style={{ top: '60%', left: '70%', background: '#ff7b00', boxShadow: '0 0 10px #ff7b00', zIndex: 3 }}></div>
              <div className="hotspot" style={{ top: '20%', left: '80%', background: '#00d8ff', boxShadow: '0 0 10px #00d8ff', zIndex: 3 }}></div>
            </div>
          </div>

          <div className="ai-terminal">
            <div className="panel-title" style={{ marginBottom: '0.5rem', fontSize: '0.8rem' }}><Terminal size={14} /> AI CLIMATE ENGINE LOGS</div>
            {terminalLines.map((line, i) => (
              <div key={i} className="terminal-line">{line}</div>
            ))}
            <span style={{ animation: 'pulse-red 1s infinite' }}>_</span>
          </div>

          <div className="metrics-grid">
            {[
              { label: 'Global Temp', val: '+1.45°C' },
              { label: 'Sea Ice Loss', val: '-12.2%' },
              { label: 'AQI Alerts', val: '38 Active' },
              { label: 'Wildfire Risk', val: 'HIGH' },
              { label: 'Ocean Heat', val: 'CRITICAL' },
              { label: 'System Load', val: '14%' }
            ].map((m, i) => (
              <motion.div 
                whileHover={{ scale: 1.05 }}
                key={i} 
                className="floating-metric"
              >
                <div className="fm-label">{m.label}</div>
                <div className="fm-value" style={m.val === 'CRITICAL' ? { color: '#ff003c' } : m.val === 'HIGH' ? { color: '#ff7b00' } : {}}>{m.val}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClimateStoriesView;
