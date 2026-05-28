import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Globe, Shield, Activity, Droplets, Thermometer, Wind, AlertTriangle,
  Map, BarChart2, Cpu, ChevronRight, FileText, Download, Play, Zap, Flame, MapPin, CheckCircle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import jsPDF from 'jspdf';

const graphData = Array.from({ length: 15 }, (_, i) => {
  const isFuture = i > 7;
  const base = 40 + i * 2;
  const noise = (Math.random() - 0.5) * 15;
  return {
    year: 2020 + i,
    historical: !isFuture ? base + noise : null,
    predicted: isFuture ? base + noise + 10 : null,
    boundaryMax: isFuture ? base + noise + 25 : null,
    boundaryMin: isFuture ? base + noise - 5 : null,
  };
});
graphData[7].predicted = graphData[7].historical;

const radarData = [
  { subject: 'Heatwave', A: 82, fullMark: 100 },
  { subject: 'Flood', A: 64, fullMark: 100 },
  { subject: 'AQI', A: 78, fullMark: 100 },
  { subject: 'Drought', A: 45, fullMark: 100 },
  { subject: 'Wind', A: 55, fullMark: 100 },
];

const RiskAssessmentView = ({ onClose }) => {
  const [typedText, setTypedText] = useState('');
  const fullText = "AI detected increasing heatwave probability in South Asia.\nFlood risk increasing in coastal regions.\nAtmospheric instability projected to rise by 2035.";

  const [simState, setSimState] = useState('idle'); // idle, running, complete
  const [simStep, setSimStep] = useState(0); 
  const [downloadState, setDownloadState] = useState('idle'); // idle, generating, complete

  useEffect(() => {
    let currentText = '';
    let i = 0;
    const interval = setInterval(() => {
      if (i < fullText.length) {
        currentText += fullText[i];
        setTypedText(currentText);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 40);
    return () => clearInterval(interval);
  }, []);

  const runSimulation = () => {
    setSimState('running');
    setSimStep(0);
    
    // Step sequences
    setTimeout(() => setSimStep(1), 3000); // Initializing -> Deep Learning
    setTimeout(() => setSimStep(2), 6000); // Deep Learning -> Analyzing
    setTimeout(() => setSimStep(3), 9000); // Analyzing -> Live Analysis outputs
    setTimeout(() => setSimStep(4), 14000); // Live Analysis -> Complete
    setTimeout(() => setSimState('complete'), 14000); 
  };

  const closeSimulation = () => {
    setSimState('idle');
    setSimStep(0);
  };

  const generatePDF = () => {
    setDownloadState('generating');
    
    setTimeout(() => {
      const doc = new jsPDF();
      doc.setFillColor(13, 21, 38);
      doc.rect(0, 0, 210, 297, 'F');

      doc.setTextColor(0, 255, 136);
      doc.setFontSize(22);
      doc.text("Green Earth AI", 105, 30, null, null, "center");
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.text("Climate Intelligence Methodology", 105, 42, null, null, "center");

      doc.setDrawColor(0, 255, 136);
      doc.line(20, 50, 190, 50);

      let y = 65;
      const addSection = (title, content) => {
        if (y > 270) { doc.addPage(); doc.setFillColor(13, 21, 38); doc.rect(0, 0, 210, 297, 'F'); y = 20; }
        doc.setTextColor(139, 92, 246);
        doc.setFontSize(14);
        doc.text(title, 20, y);
        y += 8;
        doc.setTextColor(200, 200, 200);
        doc.setFontSize(10);
        const splitText = doc.splitTextToSize(content, 170);
        doc.text(splitText, 20, y);
        y += splitText.length * 5 + 10;
      };

      addSection("1. Introduction", "Overview of Green Earth platform's futuristic climate intelligence engine, designed to forecast and mitigate global environmental risks.");
      addSection("2. Data Sources", "- Open-Meteo API\n- NetCDF climate datasets\n- High-resolution Environmental variables");
      addSection("3. AI Models Used", "- LSTM Neural Networks for time-series forecasting\n- Linear Regression for baseline comparisons\n- Isolation Forest for environmental anomaly detection");
      addSection("4. Forecast Pipeline", "Data Collection -> Preprocessing -> AI Training -> Prediction Generation -> Visualization");
      addSection("5. Climate Variables", "Temperature, Rainfall, Humidity, AQI, Wind Speed, Atmospheric Pressure.");
      addSection("6. Risk Assessment Logic", "Environmental anomaly detection, Heatwave forecasting, Flood vulnerability analysis, Climate stress scoring.");
      addSection("7. AI Simulation Workflow", "Predictive modeling, geospatial analytics, temporal climate analysis to produce high-confidence long-term projections.");
      addSection("8. Future Scope", "Satellite integration, advanced climate intelligence networks, smart environmental governance integration.");

      doc.save("Green_Earth_AI_Climate_Intelligence_Methodology.pdf");
      
      setDownloadState('complete');
      setTimeout(() => setDownloadState('idle'), 3000);
    }, 2500); // simulate some delay for loading animation
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'relative', width: '100%', minHeight: '100%', background: 'rgba(5, 8, 15, 0.98)', 
        backdropFilter: 'blur(25px)', overflowY: 'auto', overflowX: 'hidden', color: '#fff',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      {/* Dynamic Background */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: -1, overflow: 'hidden' }}>
        <motion.div animate={{ rotate: 360, scale: (simState === 'running' || simState === 'complete') ? 1.5 : 1 }} transition={{ duration: (simState === 'running' || simState === 'complete') ? 50 : 200, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', top: '-30%', right: '-20%', width: '120%', height: '120%', background: 'radial-gradient(circle, rgba(0,255,136,0.04) 0%, transparent 60%)', borderRadius: '50%' }} />
        <motion.div animate={{ rotate: -360, scale: (simState === 'running' || simState === 'complete') ? 1.5 : 1 }} transition={{ duration: (simState === 'running' || simState === 'complete') ? 40 : 150, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '100%', height: '100%', background: 'radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 60%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px)', backgroundSize: '50px 50px', maskImage: 'radial-gradient(circle at center, black, transparent 80%)' }} />
      </div>

      <style>{`
        .glass-card {
          background: rgba(13, 21, 38, 0.5);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(0, 255, 136, 0.1);
          border-radius: 16px;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .glass-card:hover {
          border-color: rgba(0, 255, 136, 0.4);
          box-shadow: 0 10px 40px rgba(0, 255, 136, 0.15), inset 0 0 20px rgba(0, 255, 136, 0.05);
          transform: translateY(-5px);
        }
        .neon-btn {
          background: rgba(0, 255, 136, 0.1);
          border: 1px solid rgba(0, 255, 136, 0.5);
          color: #00ff88;
          padding: 0.75rem 1.5rem;
          border-radius: 30px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .neon-btn:hover:not(:disabled) {
          background: #00ff88;
          color: #050810;
          box-shadow: 0 0 25px rgba(0, 255, 136, 0.6);
          transform: scale(1.05);
        }
        .neon-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
        @keyframes pulseGlow {
          0% { box-shadow: 0 0 10px rgba(0,255,136,0.2); }
          50% { box-shadow: 0 0 40px rgba(0,255,136,0.6); }
          100% { box-shadow: 0 0 10px rgba(0,255,136,0.2); }
        }
        @keyframes rotateScan {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Close Button */}
      <motion.button 
        whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={onClose}
        style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 50, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer', backdropFilter: 'blur(10px)' }}
      >
        <X size={24} />
      </motion.button>

      <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '4rem 2rem', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
        
        {/* HERO SECTION */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3rem', alignItems: 'center', minHeight: '70vh' }}>
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#00ff88', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem' }}>
              <Shield size={18} /> Enterprise Climate Intelligence
            </div>
            <h1 style={{ fontSize: '4.5rem', fontWeight: '900', lineHeight: '1.1', margin: '0 0 1.5rem', background: 'linear-gradient(to right, #ffffff, #8ba3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-2px' }}>
              AI-Powered <br/><span style={{ color: '#00ff88', WebkitTextFillColor: '#00ff88', textShadow: '0 0 40px rgba(0,255,136,0.4)' }}>Climate Risk</span> Intelligence
            </h1>
            <p style={{ fontSize: '1.15rem', color: '#8ba3b8', lineHeight: '1.8', maxWidth: '600px', marginBottom: '2.5rem' }}>
              Predicting environmental threats using deep learning, geospatial analytics, and ultra-high-resolution climate forecasting models. Transition from reactive management to proactive resilience.
            </p>
            
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '3rem' }}>
              <button className="neon-btn" onClick={runSimulation} disabled={simState !== 'idle'}>
                <Play size={18} /> {simState === 'idle' ? 'Run AI Simulation' : 'Simulation Active...'}
              </button>
              <button className="neon-btn" onClick={generatePDF} disabled={downloadState !== 'idle'} style={{ background: 'transparent', borderColor: '#8b5cf6', color: '#a78bfa', boxShadow: downloadState === 'generating' ? '0 0 20px rgba(139,92,246,0.6)' : 'none' }}>
                {downloadState === 'idle' && <><FileText size={18} /> Download Methodology</>}
                {downloadState === 'generating' && <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Activity size={18} /></motion.div> Generating AI Report...</>}
                {downloadState === 'complete' && <><CheckCircle size={18} /> Export Complete</>}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #00ff88' }}>
                <div style={{ fontSize: '0.75rem', color: '#8ba3b8', textTransform: 'uppercase', fontWeight: '700' }}>Active Simulations</div>
                <div style={{ fontSize: '2rem', fontWeight: '900', color: '#fff' }}>14,289</div>
              </div>
              <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #0ea5e9' }}>
                <div style={{ fontSize: '0.75rem', color: '#8ba3b8', textTransform: 'uppercase', fontWeight: '700' }}>Prediction Accuracy</div>
                <div style={{ fontSize: '2rem', fontWeight: '900', color: '#fff' }}>98.4%</div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 1 }} style={{ position: 'relative', height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div animate={{ rotate: (simState === 'running' || simState === 'complete') ? 720 : 360 }} transition={{ duration: (simState === 'running' || simState === 'complete') ? 20 : 150, repeat: Infinity, ease: 'linear' }} style={{ width: '450px', height: '450px', borderRadius: '50%', border: '1px solid rgba(0,255,136,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', boxShadow: (simState === 'running' || simState === 'complete') ? 'inset 0 0 100px rgba(0,255,136,0.2), 0 0 100px rgba(0,255,136,0.3)' : 'inset 0 0 100px rgba(5,8,15,1), 0 0 50px rgba(0,255,136,0.1)', overflow: 'hidden', transition: 'all 2s' }}>
              <img src="/risk-globe.jpg" alt="Risk Assessment AI" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.95, mixBlendMode: 'screen', WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 70%)', maskImage: 'radial-gradient(circle at center, black 40%, transparent 70%)' }} />
            </motion.div>
            
            {/* AI Scan Line */}
            <div style={{ position: 'absolute', top: '10%', bottom: '10%', left: '10%', right: '10%', borderRadius: '50%', overflow: 'hidden' }}>
              <div style={{ width: '100%', height: '5px', background: 'linear-gradient(90deg, transparent, #00ff88, transparent)', boxShadow: '0 0 20px #00ff88', position: 'absolute', animation: (simState === 'running' || simState === 'complete') ? 'scan 2s linear infinite' : 'scan 4s linear infinite', opacity: (simState === 'running' || simState === 'complete') ? 1 : 0.7 }} />
            </div>

            {/* Floating Mini Cards */}
            {[
              { label: 'Flood Risk', val: 'High', top: '15%', left: '0%', col: '#0ea5e9', delay: 0 },
              { label: 'Heatwave Index', val: 'Extreme', top: '25%', right: '0%', col: '#ef4444', delay: 1 },
              { label: 'AQI Instability', val: 'Elevated', bottom: '25%', left: '5%', col: '#8b5cf6', delay: 2 },
              { label: 'Stress Score', val: '8.4/10', bottom: '15%', right: '10%', col: '#f59e0b', delay: 3 }
            ].map((c, i) => (
              <motion.div key={i} animate={{ y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity, delay: c.delay, ease: 'easeInOut' }}
                className="glass-card" style={{ position: 'absolute', top: c.top, left: c.left, right: c.right, bottom: c.bottom, padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderColor: `rgba(${c.col === '#0ea5e9' ? '14,165,233' : c.col === '#ef4444' ? '239,68,68' : c.col === '#8b5cf6' ? '139,92,246' : '245,158,11'}, 0.4)` }}
              >
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.col, boxShadow: `0 0 10px ${c.col}` }} />
                <div>
                  <div style={{ fontSize: '0.65rem', color: '#8ba3b8', textTransform: 'uppercase', fontWeight: '800' }}>{c.label}</div>
                  <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: '800' }}>{c.val}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* LIVE RISK OVERVIEW */}
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Activity color="#0ea5e9" size={32} /> Live Risk Overview
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
            {[
              { title: 'Flood Probability', icon: Droplets, val: '64%', trend: '+12%', col: '#0ea5e9' },
              { title: 'Heatwave Risk', icon: Flame, val: '89%', trend: '+24%', col: '#ef4444' },
              { title: 'Drought Severity', icon: Thermometer, val: 'Severe', trend: 'Stable', col: '#f59e0b' },
              { title: 'AQI Instability', icon: Wind, val: 'High', trend: '+18%', col: '#8b5cf6' },
              { title: 'Atmos. Pressure', icon: Zap, val: 'Critical', trend: '-4%', col: '#00ff88' }
            ].map((metric, i) => (
              <div key={i} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ padding: '0.5rem', background: `${metric.col}20`, borderRadius: '10px', color: metric.col }}>
                    <metric.icon size={24} />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: '800', color: metric.trend.startsWith('+') ? '#ef4444' : '#00ff88', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    {metric.trend}
                  </span>
                </div>
                <div>
                  <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#fff', textShadow: `0 0 15px ${metric.col}60` }}>{metric.val}</div>
                  <div style={{ fontSize: '0.8rem', color: '#8ba3b8', fontWeight: '700', marginTop: '0.2rem' }}>{metric.title}</div>
                </div>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, transparent, ${metric.col}, transparent)` }} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* LIVE CLIMATE VISUALIZATION */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <BarChart2 color="#00ff88" /> Environmental Anomaly Projection
            </h3>
            <div style={{ height: '400px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={graphData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="histGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="year" stroke="#8ba3b8" tick={{fill: '#8ba3b8'}} tickLine={false} axisLine={false} />
                  <YAxis stroke="#8ba3b8" tick={{fill: '#8ba3b8'}} tickLine={false} axisLine={false} />
                  <RechartsTooltip contentStyle={{ background: 'rgba(10,15,30,0.9)', border: '1px solid rgba(0,255,136,0.3)', borderRadius: '8px', color: '#fff' }} />
                  <ReferenceLine x={2027} stroke="#00ff88" strokeDasharray="3 3" label={{ position: 'top', value: 'AI PREDICTION ZONE', fill: '#00ff88', fontSize: 12, fontWeight: 'bold' }} />
                  
                  <Area type="monotone" dataKey="historical" stroke="#0ea5e9" strokeWidth={3} fill="url(#histGrad)" activeDot={{r: 6, fill: '#0ea5e9', stroke: '#fff'}} />
                  <Area type="monotone" dataKey="predicted" stroke="#ef4444" strokeWidth={3} strokeDasharray="5 5" fill="url(#predGrad)" activeDot={{r: 6, fill: '#ef4444', stroke: '#fff'}} />
                  <Area type="monotone" dataKey="boundaryMax" stroke="none" fill="#ef4444" fillOpacity={0.1} />
                  <Area type="monotone" dataKey="boundaryMin" stroke="none" fill="#ef4444" fillOpacity={0.1} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* AI Insights Panel */}
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="glass-card" style={{ padding: '2rem', flex: 1, background: 'linear-gradient(145deg, rgba(13,21,38,0.8), rgba(0,255,136,0.05))' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '900', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#00ff88' }}>
                <Cpu size={20} /> Live AI Insights
              </h3>
              <div style={{ fontFamily: "'Fira Code', monospace", fontSize: '0.9rem', color: '#8ba3b8', lineHeight: '1.8', minHeight: '150px' }}>
                <span style={{ color: '#00ff88' }}>&gt; </span>
                {typedText.split('\n').map((line, i) => (
                  <div key={i} style={{ marginBottom: '0.8rem' }}>{line}</div>
                ))}
                <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} style={{ display: 'inline-block', width: '8px', height: '15px', background: '#00ff88', verticalAlign: 'middle' }} />
              </div>
            </motion.div>

            {/* Regional Analysis */}
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <h3 style={{ fontSize: '1.1rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                 <MapPin size={18} color="#8b5cf6" /> Regional Anomalies
               </h3>
               {[
                 { r: 'India', risk: 'Heatwave', col: '#ef4444' },
                 { r: 'Kerala', risk: 'Flood', col: '#0ea5e9' },
                 { r: 'Delhi', risk: 'AQI', col: '#8b5cf6' },
                 { r: 'Rajasthan', risk: 'Desertification', col: '#f59e0b' }
               ].map((item, i) => (
                 <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                   <div style={{ fontWeight: '700' }}>{item.r}</div>
                   <div style={{ fontSize: '0.8rem', fontWeight: '800', color: item.col, padding: '0.2rem 0.6rem', background: `${item.col}20`, borderRadius: '4px' }}>
                     {item.risk} Risk
                   </div>
                 </div>
               ))}
            </motion.div>
          </div>
        </div>

        {/* KEY FEATURES SECTION */}
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '2rem', textAlign: 'center' }}>
            Enterprise Capabilities
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
            {[
              { title: 'Flood Risk Mapping', desc: 'Predictive modeling for urban and rural coastal areas using topological AI scans.', icon: Map, col: '#0ea5e9' },
              { title: 'Heatwave Projection', desc: 'Advanced thermal analysis for Urban Heat Islands and agricultural zones.', icon: Flame, col: '#ef4444' },
              { title: 'Vulnerability Audits', desc: 'Structural and operational vulnerability detection across global supply chains.', icon: Shield, col: '#00ff88' },
              { title: 'Scenario Planning', desc: 'Simulating multi-variable impacts under 1.5°C to 4.0°C global warming scenarios.', icon: GitBranchIcon, col: '#8b5cf6' }
            ].map((f, i) => (
              <div key={i} className="glass-card" style={{ padding: '2rem 1.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ width: 60, height: 60, borderRadius: '16px', background: `${f.col}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: f.col, border: `1px solid ${f.col}40`, boxShadow: `0 0 20px ${f.col}20` }}>
                  <f.icon size={28} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.75rem', color: '#fff' }}>{f.title}</h3>
                <p style={{ fontSize: '0.9rem', color: '#8ba3b8', lineHeight: '1.6' }}>{f.desc}</p>
                
                {/* Floating particle effect */}
                <motion.div animate={{ y: [-10, 10, -10], opacity: [0, 1, 0] }} transition={{ duration: 3 + i, repeat: Infinity }} style={{ position: 'absolute', top: '10%', right: '10%', width: 4, height: 4, borderRadius: '50%', background: f.col, boxShadow: `0 0 10px ${f.col}` }} />
                <motion.div animate={{ y: [10, -10, 10], opacity: [0, 1, 0] }} transition={{ duration: 4 + i, repeat: Infinity }} style={{ position: 'absolute', bottom: '10%', left: '10%', width: 6, height: 6, borderRadius: '50%', background: f.col, boxShadow: `0 0 10px ${f.col}` }} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* FOOTER CTA */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center', background: 'linear-gradient(180deg, rgba(13,21,38,0.5), rgba(0,255,136,0.05))', marginTop: '2rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1rem', color: '#fff' }}>Generate Full Climate Risk Report</h2>
          <p style={{ fontSize: '1.1rem', color: '#8ba3b8', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
            Compile a comprehensive, AI-driven risk assessment for your specific assets, complete with financial projections and mitigation strategies.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
            <button className="neon-btn" onClick={runSimulation} style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}><Cpu size={20} /> Run AI Analysis</button>
            <button className="neon-btn" onClick={generatePDF} style={{ background: 'transparent', borderColor: '#0ea5e9', color: '#0ea5e9', fontSize: '1.1rem', padding: '1rem 2rem' }}><Download size={20} /> Export PDF Report</button>
          </div>
        </motion.div>

      </div>

      {/* AI SIMULATION OVERLAY MODAL */}
      <AnimatePresence>
        {(simState === 'running' || simState === 'complete') && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(5, 8, 15, 0.95)',
              backdropFilter: 'blur(30px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Inter', sans-serif"
            }}
          >
            {/* Ambient scanning ring behind modal */}
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 10, ease: 'linear' }} style={{ position: 'absolute', width: '800px', height: '800px', border: '2px dashed rgba(0,255,136,0.1)', borderRadius: '50%', zIndex: 0 }} />
            <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 15, ease: 'linear' }} style={{ position: 'absolute', width: '600px', height: '600px', border: '1px solid rgba(139,92,246,0.1)', borderRadius: '50%', zIndex: 0 }} />

            <div className="glass-card" style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '900px', minHeight: '600px', padding: '3rem', border: '1px solid rgba(0,255,136,0.3)', boxShadow: '0 0 50px rgba(0,255,136,0.15)', overflow: 'hidden' }}>
              
              <motion.button 
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={closeSimulation}
                style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: '#8ba3b8', cursor: 'pointer' }}
              >
                <X size={24} />
              </motion.button>

              {simState === 'running' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', paddingTop: '2rem' }}>
                  
                  <motion.div animate={{ scale: [1, 1.1, 1], rotate: 180 }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} style={{ width: '120px', height: '120px', border: '4px solid #00ff88', borderTopColor: 'transparent', borderRadius: '50%', marginBottom: '2rem', boxShadow: '0 0 30px rgba(0,255,136,0.4)' }} />
                  
                  <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#00ff88', marginBottom: '2rem', textShadow: '0 0 20px rgba(0,255,136,0.5)', fontFamily: "'Fira Code', monospace" }}>
                    {simStep === 0 && 'Initializing Climate Intelligence Engine...'}
                    {simStep === 1 && 'Running Deep Learning Simulation...'}
                    {simStep >= 2 && 'Analyzing Global Environmental Risk...'}
                  </h2>

                  <div style={{ width: '100%', maxWidth: '600px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', height: '8px', overflow: 'hidden', marginBottom: '3rem' }}>
                    <motion.div 
                      initial={{ width: '0%' }}
                      animate={{ width: simStep === 0 ? '25%' : simStep === 1 ? '50%' : simStep === 2 ? '75%' : '100%' }}
                      transition={{ duration: 2.5 }}
                      style={{ height: '100%', background: 'linear-gradient(90deg, #0ea5e9, #00ff88)', boxShadow: '0 0 15px #00ff88' }}
                    />
                  </div>

                  <AnimatePresence mode="wait">
                    {simStep >= 3 && (
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem', fontFamily: "'Fira Code', monospace", color: '#8ba3b8', background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0 }}>&gt; Projected Heatwave Risk: <span style={{ color: '#ef4444' }}>82%</span></motion.div>
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>&gt; Flood vulnerability increasing in coastal zones.</motion.div>
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.6 }}>&gt; AQI instability detected across urban regions.</motion.div>
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.4 }}>&gt; Aggregating multi-variable atmospheric stress indices...</motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {simState === 'complete' && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                  <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 2 }} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', background: 'rgba(0,255,136,0.1)', borderRadius: '50%', marginBottom: '1rem', border: '2px solid #00ff88', boxShadow: '0 0 30px rgba(0,255,136,0.3)' }}>
                      <CheckCircle size={40} color="#00ff88" />
                    </motion.div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff', letterSpacing: '-1px' }}>AI Climate Simulation Complete</h2>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #ef4444' }}>
                        <div style={{ fontSize: '0.85rem', color: '#8ba3b8', textTransform: 'uppercase', fontWeight: '700' }}>Overall Risk Score</div>
                        <div style={{ fontSize: '3rem', fontWeight: '900', color: '#ef4444', textShadow: '0 0 20px rgba(239,68,68,0.5)' }}>8.4<span style={{ fontSize: '1.5rem', color: '#8ba3b8' }}>/10</span></div>
                      </div>
                      
                      <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #00ff88' }}>
                        <div style={{ fontSize: '0.85rem', color: '#8ba3b8', textTransform: 'uppercase', fontWeight: '700' }}>Forecast Confidence</div>
                        <div style={{ fontSize: '3rem', fontWeight: '900', color: '#00ff88', textShadow: '0 0 20px rgba(0,255,136,0.5)' }}>94.2<span style={{ fontSize: '1.5rem', color: '#8ba3b8' }}>%</span></div>
                      </div>
                      
                      <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #8b5cf6' }}>
                        <div style={{ fontSize: '0.85rem', color: '#8ba3b8', textTransform: 'uppercase', fontWeight: '700' }}>Environmental Stress</div>
                        <div style={{ fontSize: '2rem', fontWeight: '900', color: '#8b5cf6', marginTop: '0.5rem' }}>Critical Zone</div>
                      </div>
                    </div>

                    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1rem', color: '#8ba3b8', textTransform: 'uppercase' }}>Vulnerability Breakdown</h3>
                      <div style={{ width: '100%', height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                            <PolarGrid stroke="rgba(255,255,255,0.1)" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#00ff88', fontSize: 12, fontWeight: 700 }} />
                            <Radar name="Risk" dataKey="A" stroke="#00ff88" strokeWidth={2} fill="#00ff88" fillOpacity={0.4} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
                    <button className="neon-btn" onClick={closeSimulation} style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>Acknowledge Results</button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

// Simple GitBranch mock icon since it's not imported above
const GitBranchIcon = ({ size, color }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="6" y1="3" x2="6" y2="15"></line>
    <circle cx="18" cy="6" r="3"></circle>
    <circle cx="6" cy="18" r="3"></circle>
    <path d="M18 9a9 9 0 0 1-9 9"></path>
  </svg>
);

export default RiskAssessmentView;
