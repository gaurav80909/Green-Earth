import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Activity, Globe, Zap, AlertTriangle, Eye } from 'lucide-react';
import FullAnalysisModal from './FullAnalysisModal';
import ForecastMapModal from './ForecastMapModal';
import './ClimateNarrativeView.css';

const ClimateNarrativeView = ({ customReports = [], onStartYearChange, onEndYearChange, onGenerateReport }) => {
  const [terminalText, setTerminalText] = useState("");
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  
  const fullText = "Environmental intelligence systems indicate rising global heat accumulation, accelerating cryosphere decline, and elevated wildfire activity. Predictive models suggest increased atmospheric instability in coastal and tropical regions.";

  useEffect(() => {
    let currentText = "";
    let currentIndex = 0;
    
    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        currentText += fullText[currentIndex];
        setTerminalText(currentText);
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 40);
    
    return () => clearInterval(typingInterval);
  }, []);

  const miniStories = [
    {
      id: 1, category: 'Cryosphere', title: 'Arctic Ice Decline Accelerates',
      summary: 'Satellite monitoring systems detect faster-than-expected seasonal ice reduction in Arctic zones.',
      status: 'Moderate Risk', statusClass: 'status-moderate'
    },
    {
      id: 2, category: 'Oceans', title: 'Ocean Heat Content Hits Record Levels',
      summary: 'Global marine temperatures continue rising, increasing hurricane intensity and sea-level pressure.',
      status: 'High Alert', statusClass: 'status-high'
    },
    {
      id: 3, category: 'Sustainability', title: 'Amazon Regeneration Zones Detected',
      summary: 'AI geospatial analysis identifies multiple rainforest recovery clusters across protected regions.',
      status: 'Positive Trend', statusClass: 'status-positive'
    },
    {
      id: 4, category: 'Wildfires', title: 'Wildfire Spread Intensifies in Canada',
      summary: 'Real-time satellite streams show accelerated wildfire expansion due to prolonged dry conditions.',
      status: 'Critical', statusClass: 'status-critical'
    }
  ];

  return (
    <div className="narrative-dashboard">
      <div className="narrative-bg"></div>
      
      <div className="narrative-header">
        <h2 className="narrative-title">CLIMATE STORIES & GLOBAL INSIGHTS</h2>
        <div className="glowing-divider"></div>
        <p className="narrative-subtitle">Real-time environmental intelligence and cinematic planetary monitoring.</p>
      </div>

      <div className="narrative-ticker">
        <div className="narrative-ticker-text">
          LIVE • ⚠️ HEATWAVE ALERTS RISING • ⚠️ ARCTIC ICE LOSS INCREASING • ⚠️ AQI CRITICAL IN URBAN REGIONS • ⚠️ FLOOD RISK ELEVATED •
        </div>
      </div>

      <div className="narrative-layout">
        <div className="main-column">
          {/* Featured Story */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="featured-story"
          >
            <div className="featured-image-container">
              <img src="/heatwave_crisis.png" alt="Heatwave Crisis" className="featured-image" />
              <div className="featured-image-overlay"></div>
            </div>
            <div className="featured-content">
              <h3 className="featured-headline">Extreme Heatwave Crisis Expands Across South Asia</h3>
              <p className="featured-desc">AI climate forecasting models predict prolonged extreme temperatures across densely populated regions, increasing environmental and public health risks.</p>
              
              <div className="featured-metrics">
                <div className="metric-item">
                  <span className="metric-label">AI Confidence</span>
                  <span className="metric-val" style={{ color: '#00ffd5' }}>96%</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Risk Level</span>
                  <span className="metric-val" style={{ color: '#ff003c' }}>CRITICAL</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Updated</span>
                  <span className="metric-val">12 MINS AGO</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Regions Affected</span>
                  <span className="metric-val">14</span>
                </div>
              </div>

              <div className="featured-buttons">
                <button className="btn-primary" onClick={() => setIsAnalysisOpen(true)}>
                  <Activity size={16} style={{ display: 'inline', marginRight: '8px' }} />
                  Read Full Analysis
                </button>
                <button className="btn-secondary" onClick={() => setIsMapOpen(true)}>
                  <Globe size={16} style={{ display: 'inline', marginRight: '8px' }} />
                  View Forecast Map
                </button>
              </div>
            </div>
          </motion.div>

          {/* Mini Stories */}
          <div className="mini-stories-grid">
            {miniStories.map((story, i) => (
              <motion.div 
                key={story.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`mini-story-card ${story.statusClass}`}
              >
                <span className="story-category">{story.category}</span>
                <h4 className="story-title">{story.title}</h4>
                <p className="story-summary">{story.summary}</p>
                <span className="story-status">{story.status}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="side-column">
          {/* AI Terminal */}
          <div className="ai-terminal-panel">
            <h4 className="ai-terminal-title">
              <Terminal size={16} /> AI Climate Summary
            </h4>
            <div className="terminal-content">
              {terminalText}
              <span className="terminal-cursor"></span>
            </div>
          </div>

          {/* Visual Scanners */}
          <div className="right-visuals">
            <h4 className="visual-title"><Eye size={14} style={{ display: 'inline', marginRight: '5px' }} /> AI Monitoring Scanner</h4>
            <div className="scanner-box">
              <img src="/user-hologram-earth.jpg" alt="Holographic Earth" className="hologram-earth-img" />
              <div className="scanner-line"></div>
            </div>
          </div>
          
          <div className="right-visuals">
             <h4 className="visual-title"><AlertTriangle size={14} style={{ display: 'inline', marginRight: '5px' }} /> Climate Severity Radar</h4>
             <div className="scanner-box" style={{ background: 'radial-gradient(circle, rgba(255, 0, 60, 0.1) 0%, transparent 70%)', borderColor: 'rgba(255, 0, 60, 0.2)' }}>
               <img src="/severity-radar.jpg" alt="Severity Radar" className="hologram-earth-img" style={{ filter: 'drop-shadow(0 0 10px rgba(255, 0, 60, 0.5))' }} />
               <div className="scanner-line" style={{ background: '#ff003c', boxShadow: '0 0 10px #ff003c', animationDuration: '2s' }}></div>
             </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isAnalysisOpen && <FullAnalysisModal isOpen={isAnalysisOpen} onClose={() => setIsAnalysisOpen(false)} />}
        {isMapOpen && <ForecastMapModal isOpen={isMapOpen} onClose={() => setIsMapOpen(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default ClimateNarrativeView;
