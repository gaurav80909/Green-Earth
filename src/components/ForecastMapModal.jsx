import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Layers, Thermometer, Wind, Droplets, AlertTriangle, Play } from 'lucide-react';
import './ForecastMapModal.css';

const ForecastMapModal = ({ isOpen, onClose }) => {
  const [activeLayer, setActiveLayer] = useState('Heatwave');
  const [hoveredHotspot, setHoveredHotspot] = useState(null);
  const [yearProgress, setYearProgress] = useState(25); // 0 to 100

  if (!isOpen) return null;

  const layers = [
    { name: 'Temperature', icon: Thermometer },
    { name: 'Heatwave', icon: AlertTriangle },
    { name: 'Flood Risk', icon: Droplets },
    { name: 'Storm Activity', icon: Wind },
  ];

  const hotspots = [
    { id: 1, top: '30%', left: '40%', name: 'South Asia', temp: '42°C', risk: 'Critical', conf: '96%' },
    { id: 2, top: '60%', left: '70%', name: 'Australia', temp: '38°C', risk: 'High', conf: '88%' },
    { id: 3, top: '20%', left: '80%', name: 'North America', temp: '35°C', risk: 'Moderate', conf: '75%' },
  ];

  return (
    <div className="forecast-map-overlay">
      <motion.div 
        initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}
        className="fm-sidebar"
      >
        <button className="fm-close" onClick={onClose}><ChevronLeft size={20} /> Back to Dashboard</button>
        <h2 className="fm-title">Forecast Command</h2>
        
        <div className="fm-layers-title">Map Layers</div>
        {layers.map(layer => (
          <div 
            key={layer.name} 
            className={`fm-layer-btn ${activeLayer === layer.name ? 'active' : ''}`}
            onClick={() => setActiveLayer(layer.name)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <layer.icon size={18} /> {layer.name}
            </div>
            {activeLayer === layer.name && <div className="am-pulse"></div>}
          </div>
        ))}
      </motion.div>

      <div className="fm-main">
        <div className="fm-map-container">
          <div className="fm-earth">
            <Globe size={400} color="rgba(0, 255, 213, 0.1)" strokeWidth={0.5} style={{ position: 'absolute' }} />
            {hotspots.map(spot => (
              <div 
                key={spot.id} 
                className="fm-hotspot" 
                style={{ top: spot.top, left: spot.left }}
                onMouseEnter={(e) => setHoveredHotspot({ ...spot, x: e.clientX, y: e.clientY })}
                onMouseLeave={() => setHoveredHotspot(null)}
              ></div>
            ))}
          </div>

          <AnimatePresence>
            {hoveredHotspot && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="fm-tooltip"
                style={{ top: hoveredHotspot.y - 100, left: hoveredHotspot.x + 20 }}
              >
                <div style={{ color: '#fff', fontWeight: 'bold', marginBottom: '0.5rem' }}>{hoveredHotspot.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.2rem' }}>Temp: <span style={{ color: '#ff003c', fontWeight: 'bold' }}>{hoveredHotspot.temp}</span></div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.2rem' }}>Risk: <span style={{ color: '#ff7b00', fontWeight: 'bold' }}>{hoveredHotspot.risk}</span></div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>AI Confidence: <span style={{ color: '#00ffd5', fontWeight: 'bold' }}>{hoveredHotspot.conf}</span></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="fm-timeline">
          <button className="am-btn" style={{ padding: '0.5rem 1rem' }}><Play size={16} /> Simulate</button>
          <div style={{ flex: 1, position: 'relative', marginTop: '15px' }}>
            <div className="fm-slider-track">
              <div className="fm-slider-fill" style={{ width: `${yearProgress}%` }}></div>
              <div className="fm-slider-thumb" style={{ left: `${yearProgress}%` }}></div>
            </div>
            <div className="fm-year-markers">
              <span className={yearProgress < 25 ? 'active' : ''}>2025</span>
              <span className={yearProgress >= 25 && yearProgress < 50 ? 'active' : ''}>2030</span>
              <span className={yearProgress >= 50 && yearProgress < 75 ? 'active' : ''}>2040</span>
              <span className={yearProgress >= 75 ? 'active' : ''}>2050</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple Globe fallback if lucide-react doesn't look right
const Globe = ({ size, color, strokeWidth, style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    <path d="M2 12h20"></path>
  </svg>
);

export default ForecastMapModal;
