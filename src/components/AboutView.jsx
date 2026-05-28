import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Info, Activity, Database, Server, Cpu, Globe, Zap, Network, Shield, Radar } from 'lucide-react';
import './AboutView.css';

const AboutView = () => {
  const [terminalText, setTerminalText] = useState("");
  const fullText = "AI STATUS: ACTIVE\n> Satellite streams connected...\n> Forecast engine operational...\n> Climate intelligence synchronized.";

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
    }, 50);
    
    return () => clearInterval(typingInterval);
  }, []);

  return (
    <div className="about-container">
      {/* Background Effects */}
      <div className="holographic-grid"></div>
      <div className="atmospheric-glow"></div>
      <div className="floating-particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 10}s`
          }}></div>
        ))}
      </div>
      <div className="scan-line"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="about-content"
      >
        <div className="about-hero">
          <div className="about-text">
            <div className="title-section">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="title-header"
              >
                <Radar size={32} className="title-icon" />
                <h2 className="main-title">Next-Generation Climate Intelligence Platform</h2>
              </motion.div>
              <div className="glowing-divider">
                <div className="divider-pulse"></div>
              </div>
              <p className="subtitle">
                AI-powered environmental intelligence system delivering real-time climate forecasting, sustainability analytics, and global risk assessment.
              </p>
            </div>

            <div className="live-metrics-grid">
              <motion.div whileHover={{ y: -5 }} className="metric-card">
                <Globe className="metric-icon" />
                <div className="metric-info">
                  <h4>Active Regions</h4>
                  <p>128+ Regions Monitored</p>
                </div>
              </motion.div>
              <motion.div whileHover={{ y: -5 }} className="metric-card">
                <Activity className="metric-icon" />
                <div className="metric-info">
                  <h4>Live Climate Streams</h4>
                  <p>24/7 Environmental Data</p>
                </div>
              </motion.div>
              <motion.div whileHover={{ y: -5 }} className="metric-card">
                <Brain className="metric-icon" />
                <div className="metric-info">
                  <h4>AI Forecast Accuracy</h4>
                  <p>94% Prediction Confidence</p>
                </div>
              </motion.div>
              <motion.div whileHover={{ y: -5 }} className="metric-card">
                <Zap className="metric-icon" />
                <div className="metric-info">
                  <h4>Sustainability Insights</h4>
                  <p>250K+ Climate Analytics Generated</p>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="earth-container">
              <div className="earth-sphere"></div>
              <div className="atmospheric-rings"></div>
              <div className="earth-glow"></div>
              <div className="network-lines"></div>
            </div>
          </div>
        </div>

        <div className="system-flow-section">
          <h3 className="section-title">AI Architecture Flow</h3>
          <div className="architecture-pipeline">
            <div className="pipeline-node"><Database /><span>Satellite Data</span></div>
            <div className="pipeline-connector"><div className="data-particle"></div></div>
            <div className="pipeline-node"><Cpu /><span>AI Processing</span></div>
            <div className="pipeline-connector"><div className="data-particle"></div></div>
            <div className="pipeline-node"><Server /><span>Forecast Engine</span></div>
            <div className="pipeline-connector"><div className="data-particle"></div></div>
            <div className="pipeline-node highlight"><Network /><span>Climate Intelligence</span></div>
          </div>
        </div>

        <div className="vision-tech-grid">
          <motion.div whileHover={{ scale: 1.02 }} className="vision-card">
            <div className="card-glow"></div>
            <Shield className="card-icon" />
            <h4>Our Vision</h4>
            <p>A world where AI-driven environmental intelligence empowers sustainable global action.</p>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.02 }} className="tech-card">
            <div className="card-glow"></div>
            <Cpu className="card-icon" />
            <h4>Our Tech</h4>
            <p>Built with React, FastAPI, Python, LSTM forecasting, Open-Meteo APIs, and enterprise-grade climate analytics.</p>
          </motion.div>
        </div>

        <div className="tech-stack-section">
          <h3 className="section-title">Core Technologies</h3>
          <div className="tech-tags">
            {['React', 'FastAPI', 'Python', 'LSTM', 'Open-Meteo', 'Climate AI', 'Geospatial Analytics', 'Forecast Engine'].map((tag, i) => {
              const techColors = {
                'React': '#00d8ff',
                'FastAPI': '#00a67d',
                'Python': '#ffde57',
                'LSTM': '#b142ff',
                'Open-Meteo': '#ff7b00',
                'Climate AI': '#00ffd5',
                'Geospatial Analytics': '#39ff14',
                'Forecast Engine': '#ff003c'
              };
              const color = techColors[tag] || '#ffffff';
              return (
                <motion.div 
                  key={tag}
                  whileHover={{ scale: 1.1, y: -2, boxShadow: `0 0 15px ${color}80` }}
                  className="tech-tag"
                  style={{
                    color: color,
                    borderColor: `${color}40`,
                    background: `${color}10`
                  }}
                >
                  {tag}
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="ai-terminal">
          <div className="terminal-header">
            <span className="dot red"></span>
            <span className="dot yellow"></span>
            <span className="dot green"></span>
            <span className="terminal-title">system@green-earth:~</span>
          </div>
          <div className="terminal-body">
            {terminalText.split('\n').map((line, i) => (
              <div key={i} className={`terminal-line ${i === 0 ? 'active-status' : ''}`}>
                {line}
              </div>
            ))}
            <span className="cursor">_</span>
          </div>
        </div>

      </motion.div>
    </div>
  );
};

const Brain = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
    <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/>
    <path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/>
    <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/>
    <path d="M3.477 10.896a4 4 0 0 1 .585-.396"/>
    <path d="M19.938 10.5a4 4 0 0 1 .585.396"/>
    <path d="M6 18a4 4 0 0 1-1.967-.516"/>
    <path d="M19.967 17.484A4 4 0 0 1 18 18"/>
  </svg>
);

export default AboutView;
