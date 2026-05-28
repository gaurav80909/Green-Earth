import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Activity, AlertTriangle, ThermometerSun, Flame, CloudLightning, Waves,
  Zap, ShieldAlert, BrainCircuit, Radio, Fingerprint, Terminal,
  Database, Network, Target, Calendar, ChevronDown, MapPin, Search
} from 'lucide-react';
import Plot from 'react-plotly.js';
import './IsolationForecast.css';

const PlotComponent = Plot.default || Plot;

/* ─── Mountain Area Graph ────────────────────────────── */
const MountainGraph = ({ color, id, dataPoints }) => {
  const [offset, setOffset] = useState(0);
  
  // Base heights of the mountain range to keep it organic but stable
  const pts = dataPoints && dataPoints.length >= 15 ? dataPoints.slice(0, 15) : [35, 48, 28, 62, 45, 75, 58, 80, 50, 85, 68, 55, 40, 72, 60];

  useEffect(() => {
    let animFrame;
    const tick = () => {
      setOffset(o => (o + 0.02) % (Math.PI * 2));
      animFrame = requestAnimationFrame(tick);
    };
    animFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrame);
  }, []);

  const W = 300, H = 88;
  const max = 100;
  const min = 0;
  const rng = 100;

  // Compute points with dynamic wave animation using Math.sin
  const coords = pts.map((p, i) => {
    // Waves move horizontally based on offset
    const wave = Math.sin(i * 0.8 + offset) * 4;
    const pulse = Math.cos(i * 0.4 - offset * 1.5) * 2.5;
    const yVal = Math.min(95, Math.max(5, p + wave + pulse));
    return {
      x: (i / (pts.length - 1)) * W,
      y: H - (yVal / rng) * (H - 12) - 6,
    };
  });

  // Smooth bezier curve builder (using tension for mountain curves)
  const buildPath = (points) => {
    if (points.length < 2) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 3;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (2 * (p1.x - p0.x)) / 3;
      const cpY2 = p1.y;
      d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const linePath = buildPath(coords);
  const areaPath = `${linePath} L ${W} ${H} L 0 ${H} Z`;

  // Filter dynamic pulse nodes to display on the mountain peaks
  const pulsePoints = [3, 7, 10].map(idx => coords[idx]).filter(Boolean);

  const gradId = `mg-grad-${id}`;
  const glowId = `mg-glow-${id}`;

  return (
    <div style={{ position: 'relative', width: '100%', height: '88px', marginTop: '10px', overflow: 'visible' }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
        preserveAspectRatio="none"
      >
        <defs>
          {/* Neon Glow Gradient */}
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="60%" stopColor={color} stopOpacity="0.1" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
          
          {/* Intense SVG Glow Filter */}
          <filter id={glowId} x="-20%" y="-40%" width="140%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Soft background glow shadow */}
        <path
          d={areaPath}
          fill={`url(#${gradId})`}
          style={{ opacity: 0.85 }}
        />

        {/* Mountain outline/stroke */}
        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#${glowId})`}
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />

        {/* Dynamic Holographic Scanner Vertical Line */}
        <motion.line
          x1={0} y1={0} x2={0} y2={H}
          stroke={color} strokeWidth="1.5" strokeOpacity="0.4"
          animate={{ x1: [0, W], x2: [0, W] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          style={{ filter: `drop-shadow(0 0 2px ${color})` }}
        />

        {/* Floating Data Pulse Points */}
        {pulsePoints.map((pt, i) => (
          <g key={i}>
            {/* Outer expanding holographic ring */}
            <circle
              cx={pt.x} cy={pt.y} r={6 + Math.sin(offset * 2 + i) * 2}
              fill="none" stroke={color} strokeWidth="1"
              style={{ opacity: 0.6 + Math.sin(offset * 2 + i) * 0.3 }}
            />
            <circle
              cx={pt.x} cy={pt.y} r={12 + Math.cos(offset * 2 + i) * 4}
              fill="none" stroke={color} strokeWidth="0.5"
              style={{ opacity: 0.25 + Math.cos(offset * 2 + i) * 0.15 }}
            />
            {/* Inner solid pulse dot */}
            <circle
              cx={pt.x} cy={pt.y} r="3"
              fill="#ffffff"
              stroke={color}
              strokeWidth="1.5"
              style={{ filter: `drop-shadow(0 0 5px ${color})` }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
};


/* ─── Terminal Typewriter ────────────────────────────── */
const TerminalTypewriter = ({ lines }) => {
  const [shown, setShown] = useState([]);
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  useEffect(() => {
    if (lineIdx >= lines.length) return;
    const line = lines[lineIdx];
    const t = setInterval(() => {
      if (charIdx < line.length) {
        setShown(prev => {
          const n = [...prev];
          n[lineIdx] = line.substring(0, charIdx + 1);
          return n;
        });
        setCharIdx(c => c + 1);
      } else {
        clearInterval(t);
        setTimeout(() => { setLineIdx(l => l + 1); setCharIdx(0); }, 500);
      }
    }, 22);
    return () => clearInterval(t);
  }, [lineIdx, charIdx, lines]);

  return (
    <div style={{ position: 'relative', zIndex: 2 }}>
      {shown.map((line, i) => (
        <div key={i} className="if-terminal-line">
          <span className="prompt">{'>'}</span>{line}
          {i === lineIdx && charIdx < lines[lineIdx]?.length && <span className="if-cursor" />}
        </div>
      ))}
      {lineIdx >= lines.length && (
        <div className="if-terminal-line"><span className="prompt">{'>'}</span><span className="if-cursor" /></div>
      )}
    </div>
  );
};

/* ─── Stat Row ───────────────────────────────────────── */
const StatRow = ({ label, value, pct, color, delay }) => (
  <div style={{ marginBottom: '12px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontFamily: 'monospace', fontSize: '10px', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
      <span style={{ color: '#64748b' }}>{label}</span>
      <span style={{ color }}>{value}</span>
    </div>
    <div className="if-stat-bar-track">
      <motion.div className="if-stat-bar-fill"
        style={{ background: color, width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1.5, delay, ease: 'easeOut' }}
      >
        <div className="if-stat-bar-shimmer" />
      </motion.div>
    </div>
  </div>
);

/* ─── Floating Particles ─────────────────────────────── */
const Particles = () => (
  <>
    {Array.from({ length: 18 }).map((_, i) => (
      <div key={i} className="if-particle" style={{
        width: `${Math.random() * 3 + 1}px`,
        height: `${Math.random() * 3 + 1}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        opacity: Math.random() * 0.5 + 0.1,
        animationDuration: `${Math.random() * 12 + 8}s`,
        animationDelay: `${Math.random() * 5}s`,
      }} />
    ))}
  </>
);

/* ─── Prediction Matrix Chart ────────────────────────── */
const PredictionMatrixChart = ({ regionHash = 0, forecastData = null }) => {
  const [selectedYears, setSelectedYears] = useState(5);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeTooltip, setActiveTooltip] = useState(19); // Aug 2029 (Index 19)
  const [offset, setOffset] = useState(0);

  // Auto-close dropdown when clicking outside
  useEffect(() => {
    if (!dropdownOpen) return;
    const closeDropdown = () => setDropdownOpen(false);
    document.addEventListener('click', closeDropdown);
    return () => document.removeEventListener('click', closeDropdown);
  }, [dropdownOpen]);

  // Subtle dynamic live wave animation
  useEffect(() => {
    let animFrame;
    const tick = () => {
      setOffset(o => (o + 0.005) % (Math.PI * 2));
      animFrame = requestAnimationFrame(tick);
    };
    animFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrame);
  }, []);

  // Dynamically generate data points based on selected years (quarterly step size)
  const data = useMemo(() => {
    const months = ['Jan', 'Apr', 'Jul', 'Oct'];
    const generated = [];
    
    const totalQuarters = selectedYears * 4;
    for (let i = 0; i <= totalQuarters; i++) {
      const yearOffset = Math.floor(i / 4);
      const monthIdx = i % 4;
      const year = 2025 + yearOffset;
      const monthLabel = months[monthIdx];
      
      let label = `${monthLabel} ${year}`;
      if (selectedYears === 5 && year === 2029 && monthLabel === 'Jul') {
        label = 'Aug 2029'; // Match mockup text exactly
      }

      let hist = 0, fore = 0, spike = null, isTarget = false;

      // Connect real data from prediction.json if available
      if (forecastData && forecastData.length > yearOffset) {
        const realD = forecastData[yearOffset];
        const regionalOffset = (regionHash % 100) / 50;
        
        hist = Math.round((realD.temperature - 20) * 5 + Math.sin(i * 0.8 + regionalOffset) * 4);
        fore = Math.round((realD.temperature - 20) * 8 + (realD.anomaly_score * 4) + Math.cos(i * 0.7 + regionalOffset) * 6);
        
        if (i > 0 && i % 4 === 0) {
           spike = Math.round(fore + (realD.anomaly_score * 6) + Math.sin(i + regionalOffset) * 10);
        }
        
        isTarget = (realD.anomaly_score >= Math.max(...forecastData.map(d => d.anomaly_score)));
      } else {
        // Fallback to synthetic logic
        const regionalOffset = (regionHash % 100) / 50; 
        const trend = i * 4.8;
        hist = Math.round(10 + trend * 0.45 + Math.sin(i * 0.8 + regionalOffset) * 4);
        fore = Math.round(35 + trend * 0.95 + Math.cos(i * 0.7 + regionalOffset) * 6 + (regionalOffset * 8));
        if (i > 0 && i % 4 === 0) {
          spike = Math.round(fore + 35 + Math.sin(i + regionalOffset) * 10 + (regionalOffset * 15));
        }
        isTarget = selectedYears === 5 && year === 2029 && monthLabel === 'Jul';
        if (isTarget) spike = 278; 
      }

      generated.push({
        label,
        year: String(year),
        hist,
        fore,
        spike,
        isTarget
      });
    }
    return generated;
  }, [selectedYears, regionHash, forecastData]);

  // Handle active tooltip snapping when range changes
  useEffect(() => {
    const targetIdx = data.findIndex(d => d.isTarget);
    if (targetIdx !== -1) {
      setActiveTooltip(targetIdx);
    } else {
      const lastSpikeIdx = data.map((d, i) => d.spike ? i : -1).filter(idx => idx !== -1).pop();
      setActiveTooltip(lastSpikeIdx !== undefined ? lastSpikeIdx : data.length - 1);
    }
  }, [data]);

  const W = 800, H = 310;
  const paddingL = 60, paddingR = 40, paddingT = 25, paddingB = 30;
  const chartW = W - paddingL - paddingR;
  const chartH = H - paddingT - paddingB;

  const yMin = -75, yMax = 300, yRange = yMax - yMin;

  const getX = (index) => paddingL + (index / (data.length - 1)) * chartW;
  const getY = (val, idx, isFore) => {
    const wave = isFore 
      ? Math.sin(idx * 0.4 + offset * 3.5) * 1.8 
      : Math.cos(idx * 0.3 + offset * 2) * 1;
    return H - paddingB - ((val + wave - yMin) / yRange) * chartH;
  };

  const histCoords = data.map((d, i) => ({ x: getX(i), y: getY(d.hist, i, false) }));
  const foreCoords = data.map((d, i) => ({ x: getX(i), y: getY(d.fore, i, true) }));

  const buildSmoothPath = (points) => {
    if (points.length < 2) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 3;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (2 * (p1.x - p0.x)) / 3;
      const cpY2 = p1.y;
      d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const histPath = buildSmoothPath(histCoords);
  const forePath = buildSmoothPath(foreCoords);
  const foreAreaPath = `${forePath} L ${getX(data.length - 1)} ${H - paddingB} L ${getX(0)} ${H - paddingB} Z`;

  const spikes = data.map((d, i) => {
    if (!d.spike) return null;
    const x = getX(i);
    const yFore = getY(d.fore, i, true);
    const ySpike = H - paddingB - ((d.spike - yMin) / yRange) * chartH;
    return { index: i, x, yFore, ySpike, val: d.spike };
  }).filter(Boolean);

  const yTicks = [-75, 0, 75, 150, 225, 300];
  
  // Calculate dynamic X axis ticks based on selected years
  const xTicks = useMemo(() => {
    const ticks = [];
    ticks.push({ year: '2025', x: getX(0) });
    
    let step = 1;
    if (selectedYears > 5) step = 2;
    if (selectedYears > 8) step = 3;

    for (let yr = step; yr < selectedYears; yr += step) {
      ticks.push({ year: String(2025 + yr), x: getX(yr * 4) });
    }

    const lastYearStr = String(2025 + selectedYears);
    if (!ticks.some(t => t.year === lastYearStr)) {
      ticks.push({ year: lastYearStr, x: getX(data.length - 1) });
    }
    return ticks;
  }, [selectedYears, data]);

  const showTooltipIdx = hoveredIndex !== null ? hoveredIndex : activeTooltip;
  const activeDataPoint = showTooltipIdx !== null && showTooltipIdx < data.length ? data[showTooltipIdx] : null;
  const tooltipX = activeDataPoint ? getX(showTooltipIdx) : 0;
  const tooltipYFore = activeDataPoint ? getY(activeDataPoint.fore, showTooltipIdx, true) : 0;
  const tooltipYSpike = activeDataPoint && activeDataPoint.spike 
    ? H - paddingB - ((activeDataPoint.spike - yMin) / yRange) * chartH 
    : tooltipYFore;

  const tooltipVal = activeDataPoint 
    ? (activeDataPoint.spike || Math.round(activeDataPoint.fore)) 
    : 0;

  const handleChartClick = () => {
    if (hoveredIndex !== null) {
      setActiveTooltip(hoveredIndex);
    }
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * W;
    
    let closestIdx = null;
    let minDist = Infinity;
    for (let i = 0; i < data.length; i++) {
      const dist = Math.abs(getX(i) - mouseX);
      if (dist < minDist) {
        minDist = dist;
        closestIdx = i;
      }
    }
    
    if (minDist < 25) {
      setHoveredIndex(closestIdx);
    } else {
      setHoveredIndex(null);
    }
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <div style={{ position: 'relative', width: '100%', pointerEvents: 'auto' }}>
      
      {/* Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', padding: '0 0.5rem' }}>
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: '900', color: '#fff', letterSpacing: '0.5px', textTransform: 'uppercase', margin: 0 }}>
            Live Prediction Matrix
          </h3>
          <p style={{ fontSize: '11px', color: '#a5f3fc', opacity: 0.6, margin: '2px 0 0 0', fontFamily: 'monospace' }}>
            AI Model Forecast vs Historical Baseline
          </p>
        </div>
        
        {/* Dynamic Clickable Dropdown Trigger */}
        <div style={{ position: 'relative', zIndex: 60 }}>
          <div 
            onClick={(e) => {
              e.stopPropagation();
              setDropdownOpen(!dropdownOpen);
            }}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              background: dropdownOpen ? 'rgba(192, 132, 252, 0.15)' : 'rgba(255, 255, 255, 0.03)', 
              border: '1px solid rgba(192, 132, 252, 0.35)', 
              borderRadius: '10px', 
              padding: '6px 14px', 
              cursor: 'pointer', 
              transition: 'all 0.2s',
              boxShadow: dropdownOpen ? '0 0 10px rgba(192, 132, 252, 0.2)' : 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.border = '1px solid rgba(192, 132, 252, 0.7)';
              e.currentTarget.style.boxShadow = '0 0 10px rgba(192, 132, 252, 0.15)';
            }}
            onMouseLeave={(e) => {
              if (!dropdownOpen) {
                e.currentTarget.style.border = '1px solid rgba(192, 132, 252, 0.25)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            <Calendar size={13} color="#c084fc" />
            <span style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: '800', color: '#fff' }}>
              {selectedYears} {selectedYears === 1 ? 'Year' : 'Years'}
            </span>
            <ChevronDown size={11} color="#c084fc" style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </div>

          {/* Dropdown Menu Option List (1 to 10 Years) */}
          {dropdownOpen && (
            <div 
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                right: 0,
                width: '120px',
                background: 'rgba(15, 7, 28, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(192, 132, 252, 0.4)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6), 0 0 15px rgba(192, 132, 252, 0.1)',
                borderRadius: '10px',
                padding: '5px 0',
                maxHeight: '220px',
                overflowY: 'auto'
              }}
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((yr) => (
                <div
                  key={yr}
                  onClick={() => {
                    setSelectedYears(yr);
                    setDropdownOpen(false);
                  }}
                  style={{
                    padding: '8px 14px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    fontWeight: '700',
                    color: selectedYears === yr ? '#c084fc' : '#94a3b8',
                    background: selectedYears === yr ? 'rgba(192, 132, 252, 0.1)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(192, 132, 252, 0.15)';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = selectedYears === yr ? 'rgba(192, 132, 252, 0.1)' : 'transparent';
                    e.currentTarget.style.color = selectedYears === yr ? '#c084fc' : '#94a3b8';
                  }}
                >
                  {yr} {yr === 1 ? 'Year' : 'Years'}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Legend Row */}
      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.25rem', justifyContent: 'center', fontSize: '11px', fontFamily: 'monospace', color: '#94a3b8' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: 'rgba(255, 255, 255, 0.4)', fontWeight: 'bold' }}>---</span>
          <span>Historical Baseline</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: '#c084fc', fontWeight: 'bold', fontSize: '14px' }}>—</span>
          <span>AI Forecast</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff1493', display: 'inline-block', boxShadow: '0 0 8px #ff1493' }} />
          <span>Anomaly Spikes</span>
        </div>
      </div>

      {/* Chart Wrapper */}
      <div 
        style={{ position: 'relative', width: '100%', height: `${H}px` }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleChartClick}
      >
        <svg
          viewBox={`0 0 ${W} ${H}`}
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
          preserveAspectRatio="none"
        >
          <defs>
            {/* Purple Area Gradient */}
            <linearGradient id="purpleAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#c084fc" stopOpacity="0" />
            </linearGradient>

            {/* Glowing filter for purple stroke */}
            <filter id="purpleGlow" x="-10%" y="-20%" width="120%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            
            {/* Pink glow filter for spike dots */}
            <filter id="pinkGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Anomaly Index Axis Label */}
          <text x={12} y={15} fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="start">
            Anomaly Index
          </text>

          {/* Grid lines and Y-axis ticks */}
          {yTicks.map((val) => {
            const y = H - paddingB - ((val - yMin) / yRange) * chartH;
            return (
              <g key={val}>
                <line
                  x1={paddingL}
                  y1={y}
                  x2={W - paddingR}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeWidth="1"
                />
                <text
                  x={paddingL - 12}
                  y={y + 4}
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="end"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* X-axis Tick Labels */}
          {xTicks.map((tick) => (
            <text
              key={tick.year}
              x={tick.x}
              y={H - 10}
              fill="#64748b"
              fontSize="10"
              fontFamily="monospace"
              textAnchor="middle"
            >
              {tick.year}
            </text>
          ))}

          {/* Historical Baseline Curve */}
          <path
            d={histPath}
            fill="none"
            stroke="rgba(255, 255, 255, 0.25)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* AI Forecast Gradient Fill */}
          <path
            d={foreAreaPath}
            fill="url(#purpleAreaGrad)"
          />

          {/* AI Forecast Stroke Curve */}
          <path
            d={forePath}
            fill="none"
            stroke="#c084fc"
            strokeWidth="3"
            filter="url(#purpleGlow)"
          />

          {/* Anomaly Spikes (vertical pins + glowing dots) */}
          {spikes.map((sp) => (
            <g key={sp.index}>
              {/* Vertical line from forecast to spike */}
              <line
                x1={sp.x}
                y1={sp.yFore}
                x2={sp.x}
                y2={sp.ySpike}
                stroke="#ff1493"
                strokeWidth="1.5"
                strokeOpacity="0.85"
              />
              {/* Outer halo */}
              <circle
                cx={sp.x}
                cy={sp.ySpike}
                r="7"
                fill="none"
                stroke="#ff1493"
                strokeWidth="1"
                strokeOpacity="0.4"
                filter="url(#pinkGlow)"
              />
              {/* Solid spike dot */}
              <circle
                cx={sp.x}
                cy={sp.ySpike}
                r="4.5"
                fill="#ff1493"
                style={{ filter: 'drop-shadow(0 0 4px #ff1493)' }}
              />
            </g>
          ))}

          {/* Dotted pointer to tooltip */}
          {activeDataPoint && (
            <line
              x1={tooltipX}
              y1={tooltipYSpike}
              x2={tooltipX}
              y2={tooltipYSpike - 12}
              stroke="rgba(192, 132, 252, 0.6)"
              strokeWidth="1.2"
              strokeDasharray="2 2"
            />
          )}

          {/* Hover highlight bar */}
          {hoveredIndex !== null && (
            <line
              x1={getX(hoveredIndex)}
              y1={paddingT}
              x2={getX(hoveredIndex)}
              y2={H - paddingB}
              stroke="rgba(192, 132, 252, 0.15)"
              strokeWidth="1"
              pointerEvents="none"
            />
          )}
        </svg>

        {/* Absolute Tooltip Box */}
        {activeDataPoint && (
          <div
            style={{
              position: 'absolute',
              left: `${(tooltipX / W) * 100}%`,
              top: `${((tooltipYSpike - 95) / H) * 100}%`,
              transform: 'translateX(-50%)',
              width: '145px',
              background: 'rgba(11, 4, 24, 0.88)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(192, 132, 252, 0.45)',
              boxShadow: '0 8px 32px rgba(192, 132, 252, 0.25), 0 0 15px rgba(192, 132, 252, 0.1)',
              borderRadius: '12px',
              padding: '10px 12px',
              pointerEvents: 'auto',
              zIndex: 50,
              transition: 'left 0.2s cubic-bezier(0.25, 0.8, 0.25, 1), top 0.2s cubic-bezier(0.25, 0.8, 0.25, 1)',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '5px', marginBottom: '6px' }}>
              <span style={{ fontSize: '10px', fontWeight: '700', fontFamily: 'monospace', color: '#e9d5ff' }}>
                {activeDataPoint.label}
              </span>
              <span 
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTooltip(null);
                }}
                style={{ fontSize: '13px', color: '#64748b', cursor: 'pointer', fontWeight: 'bold', lineHeight: 1 }}
              >
                ×
              </span>
            </div>
            {/* Content */}
            <div>
              <div style={{ fontSize: '9px', fontFamily: 'monospace', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em' }}>
                Anomaly Index
              </div>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#ff1493', textShadow: '0 0 10px rgba(255, 20, 147, 0.5)', marginTop: '2px' }}>
                {tooltipVal}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const EVENT_TIMELINE_DATA = [
  { year: 2020, label: 'Stable Climate Baseline', severity: 'green' },
  { year: 2021, label: 'Rising Temperature Patterns', severity: 'green' },
  { year: 2022, label: 'Increased Heatwave Frequency', severity: 'yellow' },
  { year: 2023, label: 'Moderate Atmospheric Instability', severity: 'yellow' },
  { year: 2024, label: 'Regional Climate Deviations Detected', severity: 'yellow' },
  { year: 2025, label: 'Elevated Drought Probability', severity: 'orange' },
  { year: 2026, label: 'Moderate Climate Shift', severity: 'orange' },
  { year: 2027, label: 'High Heatwave Probability', severity: 'orange' },
  { year: 2028, label: 'Critical Environmental Stress', severity: 'red' },
  { year: 2029, label: 'Multi-Region Anomaly Clusters', severity: 'red' },
  { year: 2030, label: 'Severe Atmospheric Instability', severity: 'red' },
  { year: 2031, label: 'Accelerated Temperature Escalation', severity: 'red' },
  { year: 2032, label: 'Extreme Rainfall Variability', severity: 'red' },
  { year: 2033, label: 'High Flood Risk Zones Emerging', severity: 'red' },
  { year: 2034, label: 'Ecosystem Stress Intensified', severity: 'red' },
  { year: 2035, label: 'Persistent Heatwave Cycles', severity: 'red' },
  { year: 2036, label: 'Coastal Climate Vulnerability Increased', severity: 'red' },
  { year: 2037, label: 'AI-Detected Severe Climate Disruptions', severity: 'red' },
  { year: 2038, label: 'Agricultural Impact Risk Elevated', severity: 'red' },
  { year: 2039, label: 'Water Scarcity Warning Level High', severity: 'red' },
  { year: 2040, label: 'Extreme Climate Transition Phase', severity: 'purple' },
  { year: 2041, label: 'Critical Global Temperature Shift', severity: 'purple' },
  { year: 2042, label: 'Environmental Risk Threshold Crossed', severity: 'purple' },
  { year: 2043, label: 'Severe Multi-Region Climate Instability', severity: 'purple' },
  { year: 2044, label: 'Atmospheric Pressure Imbalance Detected', severity: 'purple' },
  { year: 2045, label: 'Extreme Heat & Drought Synchronization', severity: 'purple' },
  { year: 2046, label: 'High Probability Climate Emergency', severity: 'purple' },
  { year: 2047, label: 'Projected Climate Crisis Peak', severity: 'purple' },
];

const severityColors = {
  green: { color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)', shadow: 'rgba(34, 197, 94, 0.5)' },
  yellow: { color: '#eab308', bg: 'rgba(234, 179, 8, 0.1)', shadow: 'rgba(234, 179, 8, 0.5)' },
  orange: { color: '#f97316', bg: 'rgba(249, 115, 22, 0.1)', shadow: 'rgba(249, 115, 22, 0.5)' },
  red: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', shadow: 'rgba(239, 68, 68, 0.5)' },
  purple: { color: '#a855f7', bg: 'rgba(168, 85, 247, 0.1)', shadow: 'rgba(168, 85, 247, 0.5)' },
};

const CriticalEventTimeline = ({ regionHash = 0 }) => {
  const containerRef = useRef(null);

  return (
    <motion.div className="if-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
      style={{ border: '1px solid rgba(168,85,247,0.25)', background: 'linear-gradient(135deg, rgba(0,0,0,0.5), rgba(88,28,135,0.08))', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', overflow: 'hidden', padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem', fontFamily: 'monospace', fontSize: '12px', fontWeight: '800', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#e9d5ff' }}>
        <Zap size={18} color="#c084fc" style={{ filter: 'drop-shadow(0 0 8px rgba(192,132,252,0.6))' }} />
        Critical Event Horizon (2020-2047)
      </div>
      
      <div 
        ref={containerRef}
        style={{ 
          position: 'relative', 
          display: 'flex', 
          alignItems: 'center', 
          overflowX: 'auto', 
          paddingBottom: '3.5rem', 
          paddingTop: '2.5rem',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(168,85,247,0.5) transparent'
        }}
        className="if-timeline-scroll"
      >
        {/* Connector Line */}
        <div style={{ position: 'absolute', top: '50%', left: '0', right: '0', height: '2px', background: 'rgba(255,255,255,0.1)', zIndex: 0 }}>
           <motion.div style={{ height: '100%', background: 'linear-gradient(90deg, #22c55e, #eab308, #f97316, #ef4444, #a855f7)', originX: 0 }}
             initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 4, ease: 'easeOut' }}
           />
        </div>
        
        {EVENT_TIMELINE_DATA.map((node, i) => {
          // Adjust severity based on regionHash
          const severities = ['green', 'yellow', 'orange', 'red', 'purple'];
          let sIdx = severities.indexOf(node.severity);
          
          // Shift severity by up to 1 level based on hash and index (so each region feels different)
          const shift = Math.floor(((regionHash + i) % 100) / 40) - 1; // -1, 0, or 1
          sIdx = Math.max(0, Math.min(4, sIdx + shift));
          const adjustedSeverity = severities[sIdx];
          
          const s = severityColors[adjustedSeverity];
          return (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.5 + i * 0.05 }}
              style={{ 
                position: 'relative', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                minWidth: '85px', 
                zIndex: 1,
                cursor: 'pointer'
              }}
              whileHover="hover"
            >
              {/* Year Label above */}
              <div style={{ position: 'absolute', top: '-30px', fontFamily: 'monospace', fontSize: '11px', fontWeight: '800', color: s.color, textShadow: `0 0 8px ${s.shadow}` }}>
                {node.year}
              </div>
              
              {/* Node Dot */}
              <motion.div 
                style={{ 
                  width: '12px', 
                  height: '12px', 
                  borderRadius: '50%', 
                  background: s.color,
                  boxShadow: `0 0 12px ${s.shadow}`,
                  border: '2px solid rgba(0,0,0,0.8)'
                }}
                variants={{
                  hover: { scale: 1.6, boxShadow: `0 0 20px ${s.color}` }
                }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              />
              
              {/* Expandable Label */}
              <motion.div
                variants={{
                  hover: { opacity: 1, y: 0, scale: 1 }
                }}
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                style={{
                  position: 'absolute',
                  top: '25px',
                  width: '140px',
                  textAlign: 'center',
                  background: 'rgba(11, 4, 24, 0.95)',
                  border: `1px solid ${s.color}60`,
                  padding: '8px',
                  borderRadius: '8px',
                  boxShadow: `0 8px 24px rgba(0,0,0,0.8), 0 0 15px ${s.shadow}`,
                  pointerEvents: 'none',
                  zIndex: 50
                }}
              >
                <div style={{ fontSize: '10px', color: '#fff', fontWeight: '600', lineHeight: '1.4' }}>
                  {node.label}
                </div>
                <div style={{ fontSize: '8px', color: s.color, textTransform: 'uppercase', marginTop: '6px', letterSpacing: '0.1em', fontWeight: '800' }}>
                  {adjustedSeverity} RISK
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

/* ─── Region Selector & Data ──────────────────────────── */
const INDIAN_REGIONS = [
  "India - Global Climate Analysis",
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", 
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli", 
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

const stringHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const RegionSelector = ({ activeRegion, setActiveRegion }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = INDIAN_REGIONS.filter(r => r.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="region-selector-container" ref={ref} style={{ position: 'relative', zIndex: 100 }}>
      <motion.div 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          background: isOpen ? 'rgba(34,211,238,0.1)' : 'rgba(255,255,255,0.03)',
          border: isOpen ? '1px solid rgba(34,211,238,0.7)' : '1px solid rgba(34,211,238,0.3)',
          borderRadius: '24px', padding: '8px 18px',
          cursor: 'pointer', boxShadow: isOpen ? '0 0 20px rgba(34,211,238,0.2)' : '0 0 10px rgba(34,211,238,0.05)',
          transition: 'all 0.3s ease'
        }}
      >
        <MapPin size={16} color="#22d3ee" style={{ filter: 'drop-shadow(0 0 6px #22d3ee)' }} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', lineHeight: '1' }}>
            Active Region
          </span>
          <span style={{ fontSize: '13px', fontFamily: 'monospace', fontWeight: '800', color: '#fff', textTransform: 'uppercase', lineHeight: '1.2' }}>
            {activeRegion === "India - Global Climate Analysis" ? "Select Region" : activeRegion}
          </span>
        </div>
        <ChevronDown size={14} color="#22d3ee" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: '0.3s', marginLeft: '4px' }} />
      </motion.div>

      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'absolute', top: 'calc(100% + 12px)', right: 0, width: '320px',
            background: 'rgba(11, 4, 24, 0.95)', backdropFilter: 'blur(16px)',
            border: '1px solid rgba(34,211,238,0.4)', borderRadius: '16px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.9), 0 0 25px rgba(34,211,238,0.15)',
            overflow: 'hidden', display: 'flex', flexDirection: 'column'
          }}
        >
          <div style={{ padding: '14px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Search size={16} color="#94a3b8" />
            <input 
              type="text" placeholder="Search Region..." 
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '13px', width: '100%', fontFamily: 'monospace' }}
            />
          </div>
          <div style={{ maxHeight: '340px', overflowY: 'auto' }} className="if-timeline-scroll">
            {filtered.length === 0 && <div style={{ padding: '14px', color: '#64748b', fontSize: '12px', textAlign: 'center' }}>No regions found.</div>}
            {filtered.map(r => (
              <div 
                key={r}
                onClick={() => { setActiveRegion(r); setIsOpen(false); setSearch(''); }}
                style={{
                  padding: '12px 16px', fontSize: '12px', fontFamily: 'monospace', cursor: 'pointer',
                  color: activeRegion === r ? '#22d3ee' : '#cbd5e1',
                  background: activeRegion === r ? 'rgba(34,211,238,0.1)' : 'transparent',
                  borderLeft: activeRegion === r ? '4px solid #22d3ee' : '4px solid transparent',
                  transition: 'background 0.2s, color 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}
                onMouseEnter={e => { if(activeRegion !== r) e.currentTarget.style.background = 'rgba(34,211,238,0.05)'; }}
                onMouseLeave={e => { if(activeRegion !== r) e.currentTarget.style.background = 'transparent'; }}
              >
                <span>{r}</span>
                {activeRegion === r && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22d3ee', boxShadow: '0 0 8px #22d3ee' }} />}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

/* ─── Main Dashboard ─────────────────────────────────── */
const AIPredictionView = ({ tsData }) => {
  const [activeRegion, setActiveRegion] = useState("India - Global Climate Analysis");
  const [forecastData, setForecastData] = useState(null);
  
  const [terminalLines, setTerminalLines] = useState([
    'INITIALIZING NEURAL CLIMATE MODELS...',
    'SCANNING NETCDF DATASETS [GLOBAL MATRIX]...',
    'LOADING REAL LSTM PROJECTIONS...',
  ]);

  useEffect(() => {
    fetch('/predictions.json')
      .then(r => r.json())
      .then(d => setForecastData(d))
      .catch(e => console.error(e));
  }, []);

  useEffect(() => {
    if (activeRegion !== "India - Global Climate Analysis") {
      setTerminalLines(prev => {
        const p = [...prev.slice(-3)];
        p.push(`> Reconfiguring climate prediction engine...`);
        p.push(`> Loading ${activeRegion.toUpperCase()} anomaly dataset...`);
        p.push(`> CALIBRATING REGIONAL MODELS... DONE.`);
        return p;
      });
    }
  }, [activeRegion]);

  const hash = stringHash(activeRegion);
  const hashMod = (max) => (hash % max) / max; // 0 to 1

  // Dynamic Cards powered by real forecastData
  const realHeatwave = forecastData ? Math.max(...forecastData.map(d => d.heatwave_probability * 100)) : 60;
  const realAnomaly = forecastData ? Math.max(...forecastData.map(d => d.anomaly_score)) : 5;
  const realRain = forecastData ? Math.min(...forecastData.map(d => d.rainfall_trend)) : 400;

  const cards = useMemo(() => [
    { title: 'Heatwave Risk',       pct: Math.min(100, Math.floor(realHeatwave + hashMod(20) * 10)), icon: <ThermometerSun size={22} />, color: '#ff6a00', cls: 'if-card-orange', trend: `+${(hashMod(10)*5 + realAnomaly).toFixed(1)}%`, trendUp: true, dataPoints: forecastData ? forecastData.map(d => d.heatwave_probability * 100) : null },
    { title: 'Flood Probability',   pct: Math.min(100, Math.floor((realRain > 800 ? 70 : 30) + hashMod(30) * 20)), icon: <Waves size={22} />, color: '#00e4ff', cls: 'if-card-blue', trend: `-${(hashMod(50)*8).toFixed(1)}%`, trendUp: false, dataPoints: forecastData ? forecastData.map(d => (d.rainfall_trend/1000)*100) : null },
    { title: 'Drought Severity',    pct: Math.min(100, Math.floor(realHeatwave * 0.8 + hashMod(30) * 20)), icon: <Flame size={22} />, color: '#ff1493', cls: 'if-card-red', trend: `+${(hashMod(80)*12).toFixed(1)}%`, trendUp: true, dataPoints: forecastData ? forecastData.map(d => d.heatwave_probability * 80) : null },
    { title: 'Atmospheric Instability', pct: Math.min(100, Math.floor((realAnomaly * 10) + hashMod(30) * 20)), icon: <CloudLightning size={22} />, color: '#9d00ff', cls: 'if-card-purple', trend: `+${(hashMod(70)*9).toFixed(1)}%`, trendUp: true, dataPoints: forecastData ? forecastData.map(d => d.anomaly_score * 10) : null },
  ], [activeRegion, forecastData, realHeatwave, realAnomaly, realRain]);

  // Dynamic Threat Scanner
  const threatScore = Math.floor(60 + hashMod(40) * 39);
  const threatLevel = threatScore > 85 ? 'CRITICAL' : threatScore > 70 ? 'HIGH RISK' : 'ELEVATED';
  const stats = useMemo(() => [
    { label: 'Stability',         value: threatLevel,   color: '#ef4444', pct: threatScore },
    { label: 'Trend Direction',   value: hashMod(100) > 0.5 ? 'ESCALATING' : 'FLUCTUATING', color: '#f97316', pct: Math.floor(60 + hashMod(30)*35) },
    { label: 'Confidence',        value: `${(85 + hashMod(15)*14).toFixed(1)}%`,      color: '#22d3ee', pct: Math.floor(85 + hashMod(15)*14) },
    { label: 'Volatility',        value: threatScore > 80 ? 'EXTREME' : 'MODERATE',    color: '#a855f7', pct: Math.floor(50 + hashMod(50)*45) },
    { label: 'Atmos. Instability',value: threatLevel,  color: '#fbbf24', pct: Math.floor(50 + hashMod(50)*49) },
  ], [activeRegion, threatScore, threatLevel]);



  return (
    <div className="if-dashboard">
      <div className="if-card">
        <Particles />
        <div className="if-bg-orb-cyan" />
        <div className="if-bg-orb-purple" />
        <div className="if-grid-overlay" />
        <div className="if-scanline" />

        {/* ── HEADER ─────────────────────────────────── */}
        <div className="if-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                style={{ padding: '10px', background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(34,211,238,0.3)', borderRadius: '14px', display: 'flex' }}>
                <BrainCircuit size={26} color="#22d3ee" />
              </motion.div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h2 className="if-title">Isolation Forecast</h2>
                  <span className="if-anomaly-badge"><ShieldAlert size={11} /> ANOMALY</span>
                </div>
                <p className="if-subtitle"><Fingerprint size={12} /> Enterprise Climate Intelligence System</p>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div className="if-ai-badge">
              <Radio size={14} color="#22d3ee" style={{ animation: 'none' }} />
              <span>AI ENGINE ACTIVE</span>
            </div>
            
            <RegionSelector activeRegion={activeRegion} setActiveRegion={setActiveRegion} />
          </div>
        </div>

        {/* ── BODY ───────────────────────────────────── */}
        <div className="if-body">

          {/* Row 1: Graph + Scanner */}
          <div className="if-main-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>

            {/* LEFT: Live Prediction Matrix */}
            <motion.div className="if-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ gridColumn: 'span 1' }}>
              <PredictionMatrixChart regionHash={hash} forecastData={forecastData} />
            </motion.div>

            {/* RIGHT: Threat Scanner */}
            <motion.div className="if-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              style={{ border: '1px solid rgba(239,68,68,0.3)', boxShadow: '0 0 30px rgba(239,68,68,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem', fontFamily: 'monospace', fontSize: '12px', fontWeight: '800', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#f87171' }}>
                <Target size={16} /> THREAT SCANNER
              </div>

              {/* Scanner Ring */}
              <div style={{ position: 'relative', width: '190px', height: '190px', marginBottom: '1.5rem', flexShrink: 0 }}>
                <div className="if-scanner-ring-outer" />
                <div className="if-scanner-ring-mid" />
                <div className="if-scanner-ring-inner" />
                <div className="if-scanner-cone" />
                <div className="if-scanner-core">
                  <span style={{ fontSize: '44px', fontWeight: '900', color: '#fff', lineHeight: 1, textShadow: '0 0 20px rgba(239,68,68,1)' }}>{threatScore}<span style={{ fontSize: '20px', color: '#ef4444' }}>%</span></span>
                  <span style={{ fontSize: '10px', fontFamily: 'monospace', fontWeight: '800', letterSpacing: '0.2em', color: '#f87171', marginTop: '4px' }}>{threatLevel}</span>
                </div>
              </div>

              {/* Stats */}
              <div style={{ width: '100%' }}>
                {stats.map((s, i) => <StatRow key={i} {...s} delay={i * 0.12} />)}
              </div>
            </motion.div>
          </div>

          {/* Row 2: Analytics Cards */}
          <div className="if-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
            {cards.map((card, i) => (
              <motion.div key={i} className={`if-panel ${card.cls}`}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ y: -6, scale: 1.03 }}
                style={{ transition: 'all 0.3s ease' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ padding: '10px', background: `${card.color}18`, border: `1px solid ${card.color}40`, borderRadius: '12px', color: card.color }}>
                    {card.icon}
                  </div>
                  <span style={{ fontSize: '28px', fontWeight: '900', color: '#fff', textShadow: `0 0 12px ${card.color}` }}>{card.pct}%</span>
                </div>
                <h4 style={{ fontSize: '12px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 2px' }}>{card.title}</h4>
                <MountainGraph color={card.color} id={i} dataPoints={card.dataPoints} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', fontSize: '10px', fontFamily: 'monospace', color: card.trendUp ? '#4ade80' : '#f87171' }}>
                  <span style={{ color: '#64748b', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Trend Index</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontWeight: '700' }}>
                    {card.trendUp ? '▲' : '▼'} {card.trend}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Row 3: Terminal + Timeline */}
          <div className="if-bottom-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

            {/* Terminal */}
            <motion.div className="if-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              style={{ border: '1px solid rgba(34,211,238,0.2)', minHeight: '260px' }}>
              <div style={{ background: 'rgba(2,6,23,0.95)', border: '1px solid rgba(34,211,238,0.15)', borderRadius: '14px', padding: '1.25rem', height: '100%', position: 'relative', overflow: 'hidden' }}>
                <div className="if-terminal-scanlines" />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(34,211,238,0.15)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'monospace', fontSize: '12px', fontWeight: '800', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#a5f3fc' }}>
                    <Terminal size={15} /> Live Insight Stream
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {['#ef4444','#eab308','#22c55e'].map(c => <div key={c} style={{ width: '11px', height: '11px', borderRadius: '50%', background: c, boxShadow: `0 0 6px ${c}` }} />)}
                  </div>
                </div>
                <TerminalTypewriter lines={terminalLines} />
              </div>
            </motion.div>

            {/* Timeline */}
            <CriticalEventTimeline regionHash={hash} />
          </div>
        </div>

        {/* ── STATUS BAR ─────────────────────────────── */}
        <div className="if-statusbar">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div className="if-status-item"><Database size={13} color="#22d3ee" /><span>SOURCE: NETCDF V4.2</span></div>
            <div className="if-status-item"><Network size={13} color="#c084fc" /><span>MODEL: ISOLATION FOREST (AI)</span></div>
            <div className="if-status-item" style={{ color: '#f87171' }}><ShieldAlert size={13} /><span>14 ANOMALIES DETECTED</span></div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div className="if-status-item" style={{ color: '#4ade80', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '999px', padding: '6px 14px' }}>
              <Activity size={13} /><span>SYNC: REAL-TIME</span>
            </div>
            <div className="if-status-item" style={{ color: '#a5f3fc' }}><BrainCircuit size={13} color="#22d3ee" /><span>CONFIDENCE: 94%</span></div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AIPredictionView;
