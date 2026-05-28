import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Globe, Cpu, Play, FileText, Download, Activity, Zap, Droplets, Thermometer, Wind, Target, Layers, Sliders, ChevronRight, AlertTriangle, Network, ShieldAlert, BarChart3, CheckCircle, BrainCircuit
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const graphData = Array.from({ length: 15 }, (_, i) => {
  const isFuture = i > 7;
  const base = 25 + i * 3;
  const noise = (Math.random() - 0.5) * 12;
  return {
    year: 2020 + i,
    historical: !isFuture ? base + noise : null,
    predicted: isFuture ? base + noise + 15 : null,
    boundaryMax: isFuture ? base + noise + 30 : null,
    boundaryMin: isFuture ? base + noise - 10 : null,
  };
});
graphData[7].predicted = graphData[7].historical;

const miniGraphData = Array.from({ length: 6 }, () => ({ val: Math.random() * 100 }));

const CustomForecastingView = ({ onClose }) => {
  const [typedText, setTypedText] = useState('');
  const fullText = "AI predicts rising heatwave intensity across South Asia.\nRainfall instability projected in coastal regions.\nAQI fluctuation patterns detected in urban environments.";

  const [simState, setSimState] = useState('idle'); // idle, running, complete
  const [simStep, setSimStep] = useState(0); 

  const [topologyOpen, setTopologyOpen] = useState(false);

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
    
    setTimeout(() => setSimStep(1), 3000); 
    setTimeout(() => setSimStep(2), 6000); 
    setTimeout(() => setSimStep(3), 9000); 
    setTimeout(() => setSimStep(4), 14000); 
    setTimeout(() => setSimState('complete'), 14000); 
  };

  const closeSimulation = () => {
    setSimState('idle');
    setSimStep(0);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'relative', width: '100%', minHeight: '100%', background: 'rgba(5, 7, 18, 0.98)', 
        backdropFilter: 'blur(30px)', overflowY: 'auto', overflowX: 'hidden', color: '#fff',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      {/* Dynamic Background Effects */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: -1, overflow: 'hidden' }}>
        <motion.div animate={{ rotate: 360, scale: (simState === 'running' || simState === 'complete') ? 1.5 : 1 }} transition={{ duration: (simState === 'running' || simState === 'complete') ? 50 : 300, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', top: '-25%', right: '-25%', width: '130%', height: '130%', background: 'radial-gradient(circle, rgba(14,165,233,0.03) 0%, transparent 60%)', borderRadius: '50%' }} />
        <motion.div animate={{ rotate: -360, scale: (simState === 'running' || simState === 'complete') ? 1.5 : 1 }} transition={{ duration: (simState === 'running' || simState === 'complete') ? 40 : 250, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', bottom: '-25%', left: '-15%', width: '110%', height: '110%', background: 'radial-gradient(circle, rgba(139,92,246,0.03) 0%, transparent 60%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(14,165,233,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.04) 1px, transparent 1px)', backgroundSize: '40px 40px', maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)' }} />
        
        {/* Forecast Particles / Energy Lines */}
        {[...Array(20)].map((_, i) => (
          <motion.div key={i}
            animate={{ 
              y: ['110vh', '-10vh'], 
              x: [0, Math.random() * 100 - 50],
              opacity: [0, Math.random() * 0.8 + 0.2, 0]
            }}
            transition={{ duration: 5 + Math.random() * 15, repeat: Infinity, delay: Math.random() * 5 }}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              bottom: 0,
              width: Math.random() * 3 + 1,
              height: Math.random() * 40 + 20,
              background: `linear-gradient(to top, transparent, ${i % 2 === 0 ? '#0ea5e9' : '#8b5cf6'})`,
              filter: 'blur(1px)'
            }}
          />
        ))}
      </div>

      <style>{`
        .glass-card-fc {
          background: rgba(10, 14, 30, 0.6);
          backdrop-filter: blur(25px);
          border: 1px solid rgba(14, 165, 233, 0.15);
          border-radius: 16px;
          box-shadow: 0 4px 40px rgba(0, 0, 0, 0.6);
          transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .glass-card-fc:hover {
          border-color: rgba(139, 92, 246, 0.5);
          box-shadow: 0 10px 50px rgba(139, 92, 246, 0.2), inset 0 0 25px rgba(139, 92, 246, 0.05);
          transform: translateY(-5px);
        }
        .neon-btn-fc {
          background: rgba(14, 165, 233, 0.1);
          border: 1px solid rgba(14, 165, 233, 0.5);
          color: #38bdf8;
          padding: 0.75rem 1.5rem;
          border-radius: 30px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .neon-btn-fc:hover:not(:disabled) {
          background: linear-gradient(90deg, #0ea5e9, #8b5cf6);
          color: #fff;
          border-color: transparent;
          box-shadow: 0 0 25px rgba(139, 92, 246, 0.6);
          transform: scale(1.05);
        }
        .neon-btn-fc:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        @keyframes scanWave {
          0% { transform: scale(0.9); opacity: 0.8; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes atmosphericScan {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 0.8; }
          100% { transform: translateY(200%); opacity: 0; }
        }
        .custom-select {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          font-family: inherit;
          font-size: 0.9rem;
          outline: none;
          width: 100%;
        }
        .custom-select:focus {
          border-color: #8b5cf6;
          box-shadow: 0 0 10px rgba(139,92,246,0.3);
        }
        .custom-select option {
          background: #0a0e1e;
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
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '3rem', alignItems: 'center', minHeight: '70vh' }}>
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem' }}>
              <Cpu size={18} /> Deep Learning Prediction Core
            </div>
            <h1 style={{ fontSize: '4.5rem', fontWeight: '900', lineHeight: '1.1', margin: '0 0 1.5rem', background: 'linear-gradient(to right, #ffffff, #c4b5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-2px' }}>
              AI Predictive <br/><span style={{ background: 'linear-gradient(to right, #0ea5e9, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: '0 0 40px rgba(139,92,246,0.4)' }}>Climate Forecast Engine</span>
            </h1>
            <p style={{ fontSize: '1.15rem', color: '#94a3b8', lineHeight: '1.8', maxWidth: '650px', marginBottom: '2.5rem' }}>
              Advanced machine learning models generating hyper-accurate future climate projections and environmental simulations. Real-time atmospheric analysis engineered for enterprise laboratory environments.
            </p>
            
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '3rem' }}>
              <button className="neon-btn-fc" onClick={runSimulation} disabled={simState !== 'idle'}>
                <Play size={18} /> {simState === 'idle' ? 'Initiate Forecast Matrix' : 'Simulation Active...'}
              </button>
              <button className="neon-btn-fc" onClick={() => setTopologyOpen(true)} style={{ background: 'transparent', borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}>
                <Layers size={18} /> View Data Topology
              </button>
            </div>
          </motion.div>

          {/* Right Side: Rotating Earth & Scanning Rings & Floating Metrics */}
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 1 }} style={{ position: 'relative', height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Pulsing AI waves */}
            <div style={{ position: 'absolute', width: '380px', height: '380px', borderRadius: '50%', border: '2px solid rgba(139,92,246,0.5)', animation: 'scanWave 4s infinite cubic-bezier(0.1, 0.7, 0.3, 1)' }} />
            <div style={{ position: 'absolute', width: '380px', height: '380px', borderRadius: '50%', border: '2px solid rgba(14,165,233,0.5)', animation: 'scanWave 4s infinite cubic-bezier(0.1, 0.7, 0.3, 1) 2s' }} />

            <motion.div animate={{ rotate: (simState === 'running' || simState === 'complete') ? 720 : 360 }} transition={{ duration: (simState === 'running' || simState === 'complete') ? 20 : 150, repeat: Infinity, ease: 'linear' }} style={{ width: '480px', height: '480px', borderRadius: '50%', border: '1px solid rgba(14,165,233,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', boxShadow: 'inset 0 0 100px rgba(5,7,18,1), 0 0 80px rgba(14,165,233,0.1)', overflow: 'hidden' }}>
              <img src="/custom-forecast-globe.jpg" alt="Forecast Hologram" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.95, mixBlendMode: 'screen', WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 70%)', maskImage: 'radial-gradient(circle at center, black 40%, transparent 70%)' }} />
            </motion.div>

            {/* AI Scan Line */}
            <div style={{ position: 'absolute', top: '10%', bottom: '10%', left: '10%', right: '10%', borderRadius: '50%', overflow: 'hidden' }}>
              <div style={{ width: '100%', height: '5px', background: 'linear-gradient(90deg, transparent, #8b5cf6, transparent)', boxShadow: '0 0 20px #8b5cf6', position: 'absolute', animation: 'atmosphericScan 5s linear infinite' }} />
            </div>
            
            {/* LIVE FORECAST METRICS (Floating) */}
            {[
              { label: 'Forecast Accuracy', val: 'Prediction Confidence: 94%', top: '5%', left: '-15%', col: '#0ea5e9', delay: 0, icon: Target },
              { label: 'Climate Stability Index', val: 'Atmospheric Stability: 72%', top: '15%', right: '-15%', col: '#8b5cf6', delay: 1.5, icon: ShieldAlert },
              { label: 'Heatwave Projection', val: '+3.8°C by 2040', bottom: '15%', left: '-10%', col: '#f59e0b', delay: 0.5, icon: Thermometer },
              { label: 'Rainfall Variability', val: 'Extreme Variance: +18%', bottom: '5%', right: '-10%', col: '#38bdf8', delay: 2, icon: Droplets }
            ].map((c, i) => (
              <motion.div key={i} animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, delay: c.delay, ease: 'easeInOut' }}
                className="glass-card-fc" style={{ position: 'absolute', top: c.top, left: c.left, right: c.right, bottom: c.bottom, padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderColor: `rgba(${c.col === '#0ea5e9' ? '14,165,233' : c.col === '#8b5cf6' ? '139,92,246' : c.col === '#38bdf8' ? '56,189,248' : '245,158,11'}, 0.4)`, zIndex: 10, background: 'rgba(5, 7, 18, 0.85)' }}
              >
                <div style={{ color: c.col, filter: `drop-shadow(0 0 8px ${c.col})` }}>
                  <c.icon size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '800' }}>{c.label}</div>
                  <div style={{ fontSize: '0.95rem', color: '#fff', fontWeight: '900', textShadow: `0 0 10px ${c.col}80` }}>{c.val}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* CUSTOM FORECAST PANEL (Configuration) */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="glass-card-fc" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#fff' }}>
             <Sliders size={24} color="#0ea5e9" />
             <h2 style={{ fontSize: '1.5rem', fontWeight: '900', margin: 0 }}>Prediction Matrix Configuration</h2>
           </div>
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                 <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#8ba3b8', textTransform: 'uppercase' }}>Target Region</label>
                 <select className="custom-select">
                    <option>Global Aggregation</option>
                    <option>Delhi (Heatwave Focus)</option>
                    <option>Kerala (Flood Focus)</option>
                    <option>North America (Storms)</option>
                 </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                 <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#8ba3b8', textTransform: 'uppercase' }}>Projection Timeline</label>
                 <select className="custom-select">
                    <option>Near-Term (2025 - 2030)</option>
                    <option>Mid-Term (2030 - 2045)</option>
                    <option>Deep Future (2050 - 2100)</option>
                 </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                 <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#8ba3b8', textTransform: 'uppercase' }}>Primary Variable</label>
                 <select className="custom-select">
                    <option>Composite Risk Score</option>
                    <option>Surface Temperature Anomalies</option>
                    <option>Precipitation / Flood Potential</option>
                    <option>Air Quality Index (AQI)</option>
                 </select>
              </div>
           </div>
        </motion.div>

        {/* ADVANCED AI MODULES */}
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Network color="#8b5cf6" size={32} /> Sub-System Projections
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {[
              { title: 'Temperature Forecast', icon: Thermometer, val: '+1.8°C', conf: '94%', col: '#ef4444' },
              { title: 'Rainfall Projection', icon: Droplets, val: '+22%', conf: '88%', col: '#0ea5e9' },
              { title: 'Heatwave Prediction', icon: Zap, val: 'Extreme', conf: '91%', col: '#f59e0b' },
              { title: 'AQI Forecast', icon: Wind, val: 'Unstable', conf: '85%', col: '#8b5cf6' },
              { title: 'Sea-Level Projection', icon: Layers, val: '+45mm', conf: '97%', col: '#00ff88' }
            ].map((metric, i) => (
              <div key={i} className="glass-card-fc" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ padding: '0.5rem', background: `${metric.col}15`, borderRadius: '10px', color: metric.col, border: `1px solid ${metric.col}40` }}>
                      <metric.icon size={20} />
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: '700' }}>{metric.title}</div>
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#fff', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    CONF: {metric.conf}
                  </span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#fff', textShadow: `0 0 15px ${metric.col}60` }}>{metric.val}</div>
                  
                  {/* Mini animated area chart */}
                  <div style={{ width: '80px', height: '40px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={miniGraphData}>
                        <defs>
                          <linearGradient id={`grad${i}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={metric.col} stopOpacity={0.5}/>
                            <stop offset="95%" stopColor={metric.col} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="val" stroke={metric.col} strokeWidth={2} fill={`url(#grad${i})`} isAnimationActive={true} animationDuration={2000} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${metric.col}, transparent)`, opacity: 0.5 }} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* AI FORECAST VISUALIZATION */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="glass-card-fc" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#fff' }}>
              <Target color="#0ea5e9" /> Future Climate Projection Timeline
            </h3>
            <div style={{ height: '450px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={graphData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="histGradBlue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="predGradPurple" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="year" stroke="#8ba3b8" tick={{fill: '#8ba3b8'}} tickLine={false} axisLine={false} />
                  <YAxis stroke="#8ba3b8" tick={{fill: '#8ba3b8'}} tickLine={false} axisLine={false} />
                  <RechartsTooltip contentStyle={{ background: 'rgba(5,7,18,0.9)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '8px', color: '#fff' }} />
                  <ReferenceLine x={2028} stroke="#8b5cf6" strokeDasharray="3 3" label={{ position: 'top', value: 'FORECAST INITIATION', fill: '#8b5cf6', fontSize: 12, fontWeight: 'bold' }} />
                  
                  <Area type="monotone" dataKey="historical" stroke="#0ea5e9" strokeWidth={3} fill="url(#histGradBlue)" activeDot={{r: 6, fill: '#0ea5e9', stroke: '#fff'}} />
                  <Area type="monotone" dataKey="predicted" stroke="#8b5cf6" strokeWidth={4} strokeDasharray="5 5" fill="url(#predGradPurple)" activeDot={{r: 6, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2}} />
                  <Area type="monotone" dataKey="boundaryMax" stroke="none" fill="#8b5cf6" fillOpacity={0.1} />
                  <Area type="monotone" dataKey="boundaryMin" stroke="none" fill="#8b5cf6" fillOpacity={0.1} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* AI Insights Panel */}
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="glass-card-fc" style={{ padding: '2rem', flex: 1, background: 'linear-gradient(145deg, rgba(5,7,18,0.8), rgba(139,92,246,0.1))' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '900', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#c4b5fd' }}>
                <Cpu size={20} color="#8b5cf6" /> Live AI Prediction Feed
              </h3>
              <div style={{ fontFamily: "'Fira Code', monospace", fontSize: '0.9rem', color: '#8ba3b8', lineHeight: '1.8', minHeight: '150px' }}>
                <span style={{ color: '#8b5cf6' }}>$ predict_sim --live &gt; </span>
                {typedText.split('\n').map((line, i) => (
                  <div key={i} style={{ marginBottom: '0.8rem' }}>{line}</div>
                ))}
                <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} style={{ display: 'inline-block', width: '8px', height: '15px', background: '#8b5cf6', verticalAlign: 'middle' }} />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="glass-card-fc" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <h3 style={{ fontSize: '1.1rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#fff' }}>
                 <AlertTriangle size={18} color="#f59e0b" /> Environmental Anomaly Detection
               </h3>
               {[
                 { text: 'Flash flood protocols triggered for Coastal Asia.', col: '#0ea5e9' },
                 { text: 'Thermal inversion projected in major metropolises.', col: '#ef4444' },
               ].map((item, i) => (
                 <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.8rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                   <ChevronRight size={16} color={item.col} style={{ filter: `drop-shadow(0 0 5px ${item.col})` }} />
                   <div style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: '500' }}>{item.text}</div>
                 </div>
               ))}
            </motion.div>
          </div>
        </div>

        {/* GLOBAL FORECAST MAP SECTION */}
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="glass-card-fc" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', overflow: 'hidden' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#fff', zIndex: 10 }}>
            <Globe color="#0ea5e9" /> Global AI Forecast Map
          </h3>
          <div style={{ display: 'flex', gap: '1.5rem', zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#94a3b8' }}><span style={{ display: 'block', width: 12, height: 12, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></span> Stable Climate Regions</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#94a3b8' }}><span style={{ display: 'block', width: 12, height: 12, borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 10px #f59e0b' }}></span> Moderate Atmospheric Stress</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#94a3b8' }}><span style={{ display: 'block', width: 12, height: 12, borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 10px #ef4444' }}></span> High Future Climate Risk</div>
          </div>
          
          <div style={{ height: '500px', width: '100%', position: 'relative', background: 'radial-gradient(circle at center, rgba(14,165,233,0.1) 0%, transparent 70%)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div animate={{ rotate: [0, 5, 0, -5, 0] }} transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }} style={{ width: '80%', height: '80%', opacity: 0.6, backgroundImage: 'url(/custom-forecast-globe.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', mixBlendMode: 'screen', filter: 'hue-rotate(-45deg)' }} />
            
            {/* Map Markers */}
            {[
              { top: '35%', left: '30%', col: '#f59e0b' },
              { top: '45%', left: '50%', col: '#ef4444' },
              { top: '20%', left: '60%', col: '#10b981' },
              { top: '60%', left: '80%', col: '#ef4444' },
              { top: '70%', left: '40%', col: '#f59e0b' },
            ].map((m, i) => (
              <motion.div key={i} animate={{ scale: [1, 1.8, 1], opacity: [0.3, 1, 0.3] }} transition={{ duration: 2 + i * 0.5, repeat: Infinity }} style={{ position: 'absolute', top: m.top, left: m.left, width: 16, height: 16, borderRadius: '50%', background: m.col, boxShadow: `0 0 25px ${m.col}` }} />
            ))}

            {/* AI Prediction Connections */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
              <motion.path d="M 30% 35% Q 40% 25% 50% 45%" stroke="#8b5cf6" strokeWidth="2" fill="none" strokeDasharray="5,5" animate={{ strokeDashoffset: [20, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} style={{ filter: 'drop-shadow(0 0 5px #8b5cf6)' }} />
              <motion.path d="M 50% 45% Q 65% 55% 80% 60%" stroke="#8b5cf6" strokeWidth="2" fill="none" strokeDasharray="5,5" animate={{ strokeDashoffset: [20, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} style={{ filter: 'drop-shadow(0 0 5px #8b5cf6)' }} />
            </svg>
          </div>
        </motion.div>

        {/* FOOTER CTA */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="glass-card-fc" style={{ padding: '4rem 2rem', textAlign: 'center', background: 'linear-gradient(180deg, rgba(5,7,18,0.5), rgba(139,92,246,0.1))', marginTop: '2rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1rem', color: '#fff' }}>Generate Full Forecast Report</h2>
          <p style={{ fontSize: '1.1rem', color: '#8ba3b8', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
            Compile comprehensive long-range environmental predictions, anomaly detections, and localized risk scoring using our proprietary deep learning models.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
            <button className="neon-btn-fc" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}><Cpu size={20} /> Export Forecast Data</button>
            <button className="neon-btn-fc" style={{ background: 'transparent', borderColor: '#8b5cf6', color: '#8b5cf6', fontSize: '1.1rem', padding: '1rem 2rem' }}><Download size={20} /> Download Executive Summary</button>
          </div>
        </motion.div>

      </div>

      {/* FORECAST SIMULATION OVERLAY MODAL */}
      <AnimatePresence>
        {(simState === 'running' || simState === 'complete') && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(5, 7, 18, 0.95)',
              backdropFilter: 'blur(30px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Inter', sans-serif"
            }}
          >
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 15, ease: 'linear' }} style={{ position: 'absolute', width: '900px', height: '900px', border: '1px dashed rgba(139,92,246,0.2)', borderRadius: '50%', zIndex: 0 }} />
            <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 20, ease: 'linear' }} style={{ position: 'absolute', width: '700px', height: '700px', border: '2px solid rgba(14,165,233,0.15)', borderRadius: '50%', zIndex: 0 }} />

            <div className="glass-card-fc" style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '900px', minHeight: '600px', padding: '3rem', border: '1px solid rgba(14,165,233,0.3)', boxShadow: '0 0 50px rgba(14,165,233,0.15)', overflow: 'hidden' }}>
              
              <motion.button 
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={closeSimulation}
                style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={24} />
              </motion.button>

              {simState === 'running' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', paddingTop: '2rem' }}>
                  
                  <motion.div animate={{ scale: [1, 1.2, 1], rotate: 180 }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} style={{ width: '120px', height: '120px', border: '4px solid #0ea5e9', borderTopColor: 'transparent', borderRadius: '50%', marginBottom: '2rem', boxShadow: '0 0 30px rgba(14,165,233,0.4)' }} />
                  
                  <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#38bdf8', marginBottom: '2rem', textShadow: '0 0 20px rgba(14,165,233,0.5)', fontFamily: "'Fira Code', monospace", textAlign: 'center' }}>
                    {simStep === 0 && 'Initializing AI Prediction Matrix...'}
                    {simStep === 1 && 'Running Environmental Simulation...'}
                    {simStep >= 2 && 'Analyzing Atmospheric Anomalies...'}
                  </h2>

                  <div style={{ width: '100%', maxWidth: '600px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', height: '8px', overflow: 'hidden', marginBottom: '3rem' }}>
                    <motion.div 
                      initial={{ width: '0%' }}
                      animate={{ width: simStep === 0 ? '25%' : simStep === 1 ? '50%' : simStep === 2 ? '75%' : '100%' }}
                      transition={{ duration: 2.5 }}
                      style={{ height: '100%', background: 'linear-gradient(90deg, #8b5cf6, #0ea5e9)', boxShadow: '0 0 15px #0ea5e9' }}
                    />
                  </div>

                  <AnimatePresence mode="wait">
                    {simStep >= 3 && (
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem', fontFamily: "'Fira Code', monospace", color: '#94a3b8', background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0 }}>&gt; Predictive atmospheric analysis processing...</motion.div>
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>&gt; Projecting global heatwave severity...</motion.div>
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.6 }}>&gt; Cross-referencing AI confidence metrics...</motion.div>
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.4 }}>&gt; Isolating future climate anomalies...</motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {simState === 'complete' && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                  <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 2 }} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', background: 'rgba(14,165,233,0.1)', borderRadius: '50%', marginBottom: '1rem', border: '2px solid #0ea5e9', boxShadow: '0 0 30px rgba(14,165,233,0.3)' }}>
                      <CheckCircle size={40} color="#0ea5e9" />
                    </motion.div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff', letterSpacing: '-1px' }}>AI Forecast Simulation Complete</h2>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div className="glass-card-fc" style={{ padding: '1.5rem', borderLeft: '4px solid #ef4444' }}>
                        <div style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Projected Heatwave Severity</div>
                        <div style={{ fontSize: '3rem', fontWeight: '900', color: '#ef4444', textShadow: '0 0 20px rgba(239,68,68,0.5)' }}>+28<span style={{ fontSize: '1.5rem', color: '#94a3b8' }}>%</span></div>
                      </div>
                      
                      <div className="glass-card-fc" style={{ padding: '1.5rem', borderLeft: '4px solid #8b5cf6' }}>
                        <div style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Future AQI Instability</div>
                        <div style={{ fontSize: '3rem', fontWeight: '900', color: '#8b5cf6', textShadow: '0 0 20px rgba(139,92,246,0.5)' }}>High<span style={{ fontSize: '1.5rem', color: '#94a3b8' }}> Risk</span></div>
                      </div>
                    </div>

                    <div className="glass-card-fc" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1rem', color: '#94a3b8', textTransform: 'uppercase' }}>AI Prediction Confidence</h3>
                      <div style={{ position: 'relative', width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="200" height="200" viewBox="0 0 200 200">
                          <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="15" />
                          <motion.circle cx="100" cy="100" r="90" fill="none" stroke="#0ea5e9" strokeWidth="15" strokeDasharray="565" strokeDashoffset="565" animate={{ strokeDashoffset: 565 - (565 * 0.96) }} transition={{ duration: 2, ease: "easeOut" }} strokeLinecap="round" transform="rotate(-90 100 100)" style={{ filter: 'drop-shadow(0 0 10px #0ea5e9)' }} />
                        </svg>
                        <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff' }}>96%</span>
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Accuracy Modeled</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
                    <button className="neon-btn-fc" onClick={closeSimulation} style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>Acknowledge Projection</button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DATA TOPOLOGY OVERLAY MODAL */}
      <AnimatePresence>
        {topologyOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(5, 7, 18, 0.95)',
              backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Inter', sans-serif"
            }}
          >
            <div className="glass-card-fc" style={{ position: 'relative', width: '100%', maxWidth: '1000px', minHeight: '650px', padding: '3rem', border: '1px solid rgba(139,92,246,0.3)', boxShadow: '0 0 50px rgba(139,92,246,0.15)', overflow: 'hidden' }}>
              <motion.button 
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setTopologyOpen(false)}
                style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={24} />
              </motion.button>
              
              <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#fff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <BrainCircuit color="#8b5cf6" size={32} /> Environmental Intelligence Topology
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', height: '450px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                   {[
                     { title: 'LSTM Neural Network', desc: 'Recurrent architecture processing sequential climate data.', icon: Activity },
                     { title: 'Data Preprocessing', desc: 'Anomaly filtration and geospatial normalization pipeline.', icon: Sliders },
                     { title: 'AI Training Architecture', desc: 'Distributed cluster training on 40-year historical metrics.', icon: Cpu },
                     { title: 'Variable Mapping', desc: 'Multi-dimensional tensor mapping of atmospheric pressure.', icon: Layers }
                   ].map((item, i) => (
                     <div key={i} style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '12px' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                         <item.icon size={18} color="#0ea5e9" />
                         <h4 style={{ margin: 0, fontSize: '1rem', color: '#c4b5fd', fontWeight: '700' }}>{item.title}</h4>
                       </div>
                       <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>{item.desc}</p>
                     </div>
                   ))}
                </div>
                
                <div style={{ background: 'rgba(5,7,18,0.5)', borderRadius: '16px', border: '1px solid rgba(14,165,233,0.2)', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* Holographic Network Grid Simulation */}
                  <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(139,92,246,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.1) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                  
                  <div style={{ position: 'relative', width: '80%', height: '80%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     {/* Input Nodes */}
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                       {[1, 2, 3].map(i => (
                         <motion.div key={i} animate={{ boxShadow: ['0 0 10px #0ea5e9', '0 0 25px #0ea5e9', '0 0 10px #0ea5e9'] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }} style={{ width: 40, height: 40, borderRadius: '50%', background: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Network size={20} color="#fff" /></motion.div>
                       ))}
                     </div>
                     {/* Hidden Layers */}
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                       {[1, 2, 3, 4, 5].map(i => (
                         <motion.div key={i} animate={{ scale: [1, 1.2, 1], backgroundColor: ['#8b5cf6', '#a855f7', '#8b5cf6'] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }} style={{ width: 20, height: 20, borderRadius: '50%', background: '#8b5cf6' }} />
                       ))}
                     </div>
                     {/* Output Node */}
                     <div>
                       <motion.div animate={{ boxShadow: ['0 0 15px #10b981', '0 0 35px #10b981', '0 0 15px #10b981'] }} transition={{ duration: 2, repeat: Infinity }} style={{ width: 60, height: 60, borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Target size={30} color="#fff" /></motion.div>
                     </div>
                     
                     {/* Connecting SVG Lines */}
                     <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: -1 }}>
                       <path d="M 40 20% C 100 20%, 150 50%, 220 50%" stroke="rgba(14,165,233,0.3)" strokeWidth="2" fill="none" />
                       <path d="M 40 50% C 100 50%, 150 50%, 220 50%" stroke="rgba(14,165,233,0.3)" strokeWidth="2" fill="none" />
                       <path d="M 40 80% C 100 80%, 150 50%, 220 50%" stroke="rgba(14,165,233,0.3)" strokeWidth="2" fill="none" />
                     </svg>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CustomForecastingView;
