import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Activity, Download, Share2, FileText, Zap, BarChart2, Map, Globe, ThermometerSun } from 'lucide-react';
import './FullAnalysisModal.css';

const FullAnalysisModal = ({ isOpen, onClose }) => {
  const [terminalText, setTerminalText] = useState("");
  const fullText = "> AI systems predict an 18% increase in extreme heat exposure within the next 12 days due to persistent atmospheric instability.\n> Calculating severity parameters...\n> Suggesting immediate regional policy interventions.";

  useEffect(() => {
    if (!isOpen) {
      setTerminalText("");
      return;
    }
    let currentText = "";
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < fullText.length) {
        currentText += fullText[currentIndex];
        setTerminalText(currentText);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const chartHeights = [40, 50, 60, 45, 70, 85, 95, 80, 100, 90, 85, 95];

  return (
    <div className="analysis-modal-overlay">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="analysis-modal-content"
      >
        <div className="am-header">
          <button className="am-close-btn" onClick={onClose}><X size={20} /></button>
          <div className="am-badges">
            <span className="am-badge live"><div className="am-pulse"></div> LIVE</span>
            <span className="am-badge verified"><Activity size={14} /> AI VERIFIED</span>
          </div>
          <h2 className="am-title">AI Climate Risk Intelligence Report</h2>
          <p className="am-subtitle">Deep-learning powered environmental threat analysis.</p>
        </div>

        <div className="am-body">
          {/* Section 1: Overview */}
          <div>
            <h3 className="am-section-title"><ThermometerSun size={18} /> Heatwave Overview</h3>
            <div className="am-overview-grid">
              <div className="am-stat-card">
                <div className="am-stat-val">+2.4°C</div>
                <div className="am-stat-label">Temp Anomaly</div>
              </div>
              <div className="am-stat-card" style={{ borderColor: 'rgba(255, 123, 0, 0.5)' }}>
                <div className="am-stat-val" style={{ color: '#ff7b00' }}>340M</div>
                <div className="am-stat-label">Affected Pop.</div>
              </div>
              <div className="am-stat-card" style={{ borderColor: 'rgba(255, 0, 60, 0.5)' }}>
                <div className="am-stat-val" style={{ color: '#ff003c' }}>9.8/10</div>
                <div className="am-stat-label">Severity Score</div>
              </div>
              <div className="am-stat-card" style={{ borderColor: 'rgba(0, 216, 255, 0.5)' }}>
                <div className="am-stat-val" style={{ color: '#00d8ff' }}>85%</div>
                <div className="am-stat-label">Humidity Impact</div>
              </div>
            </div>
          </div>

          {/* Section 2: Charts */}
          <div>
            <h3 className="am-section-title"><BarChart2 size={18} /> AI Prediction Timeline (Next 12 Days)</h3>
            <div className="am-charts-container">
              <div className="am-chart-grid"></div>
              {chartHeights.map((h, i) => (
                <div key={i} className="am-chart-bar" style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }}></div>
              ))}
            </div>
          </div>

          {/* Section 3: Affected Regions */}
          <div>
            <h3 className="am-section-title"><Map size={18} /> High-Risk Regional Intelligence</h3>
            <div className="am-regions-grid">
              {['India', 'Pakistan', 'Bangladesh', 'Sri Lanka'].map((region, i) => (
                <motion.div whileHover={{ y: -5, boxShadow: '0 0 20px rgba(255,123,0,0.2)' }} key={region} className="am-region-card">
                  <div className="am-region-header">
                    <span className="am-region-name">{region}</span>
                    <span className="am-region-risk">{i === 0 || i === 1 ? 'CRITICAL' : 'HIGH'}</span>
                  </div>
                  <div className="am-region-metrics">
                    <div className="am-rm-row"><span className="am-rm-label">Avg Temp</span><span className="am-rm-val">42°C</span></div>
                    <div className="am-rm-row"><span className="am-rm-label">AI Forecast</span><span className="am-rm-val" style={{ color: '#ff003c' }}>+1.5°C</span></div>
                    <div className="am-rm-row"><span className="am-rm-label">Health Alert</span><span className="am-rm-val">Level {4 - i}</span></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Section 4: AI Terminal */}
          <div>
            <h3 className="am-section-title"><Zap size={18} /> AI Insights Terminal</h3>
            <div className="am-terminal">
              <div className="terminal-content">
                {terminalText.split('\n').map((line, i) => (
                  <div key={i} style={{ marginBottom: '0.5rem' }}>{line}</div>
                ))}
                <span className="terminal-cursor"></span>
              </div>
            </div>
          </div>

          {/* Section 6: Actions */}
          <div className="am-actions">
            <button className="am-btn"><Download size={18} /> Download PDF Report</button>
            <button className="am-btn"><FileText size={18} /> Export Intelligence</button>
            <button className="am-btn"><Share2 size={18} /> Share Analysis</button>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default FullAnalysisModal;
