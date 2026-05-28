import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Globe, Cpu, Play, FileText, Download, Activity, Zap, Droplets, Thermometer, Wind, Target, Layers, Sliders, ChevronRight, BarChart, ShieldCheck, Map, CheckCircle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import jsPDF from 'jspdf';

const graphData = Array.from({ length: 15 }, (_, i) => {
  const isFuture = i > 7;
  const base = 100 - i * 2;
  const noise = (Math.random() - 0.5) * 5;
  return {
    year: 2015 + i,
    historical: !isFuture ? base + noise : null,
    currentPolicy: isFuture ? base - i * 1.5 + noise : null,
    aiOptimized: isFuture ? base - i * 3.5 + noise : null,
  };
});
graphData[7].currentPolicy = graphData[7].historical;
graphData[7].aiOptimized = graphData[7].historical;

const miniGraphData = Array.from({ length: 7 }, (_, i) => ({ val: 20 + i * 10 + Math.random() * 20 }));

const PolicyImpactView = ({ onClose }) => {
  const [typedText, setTypedText] = useState('');
  const fullText = "European emission policies reducing AQI instability.\nIndia renewable transition improving climate resilience.\nCoastal mitigation policies lowering flood vulnerability.";

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

  const generatePDF = () => {
    setDownloadState('generating');
    
    setTimeout(() => {
      const doc = new jsPDF();
      doc.setFillColor(5, 10, 20);
      doc.rect(0, 0, 210, 297, 'F');

      doc.setTextColor(139, 92, 246);
      doc.setFontSize(22);
      doc.text("Green Earth AI", 105, 30, null, null, "center");
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.text("Environmental Intelligence Report", 105, 42, null, null, "center");

      doc.setDrawColor(139, 92, 246);
      doc.line(20, 50, 190, 50);

      let y = 65;
      const addSection = (title, content) => {
        if (y > 270) { doc.addPage(); doc.setFillColor(5, 10, 20); doc.rect(0, 0, 210, 297, 'F'); y = 20; }
        doc.setTextColor(16, 185, 129);
        doc.setFontSize(14);
        doc.text(title, 20, y);
        y += 8;
        doc.setTextColor(200, 200, 200);
        doc.setFontSize(10);
        const splitText = doc.splitTextToSize(content, 170);
        doc.text(splitText, 20, y);
        y += splitText.length * 5 + 10;
      };

      addSection("1. Policy Analysis", "Comprehensive overview of current global sustainability policies and their projected long-term environmental impacts.");
      addSection("2. Sustainability Projections", "AI models predict a 24% reduction in emissions under current policies, with a potential 38% increase in clean energy growth by 2035.");
      addSection("3. Emission Reduction Analytics", "Detailed breakdown of sector-specific emission reductions, focusing on industrial and urban transition metrics.");
      addSection("4. Environmental Intelligence", "High-fidelity mapping of regional vulnerabilities and policy-driven mitigation strategies.");
      addSection("5. AI Recommendations", "Strategic implementation of enhanced carbon taxation and targeted subsidies for renewable infrastructure development.");
      addSection("6. Future Climate Impact Analysis", "Simulation of global temperature trajectories under varying policy stringency levels.");

      doc.save("Green_Earth_AI_Policy_Intel_Report.pdf");
      
      setDownloadState('complete');
      setTimeout(() => setDownloadState('idle'), 3000);
    }, 2500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'relative', width: '100%', minHeight: '100%', background: 'rgba(5, 7, 12, 0.98)', 
        backdropFilter: 'blur(30px)', overflowY: 'auto', overflowX: 'hidden', color: '#fff',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      {/* Dynamic Background Effects */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: -1, overflow: 'hidden' }}>
        <motion.div animate={{ rotate: 360, scale: (simState === 'running' || simState === 'complete') ? 1.5 : 1 }} transition={{ duration: (simState === 'running' || simState === 'complete') ? 50 : 400, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', top: '-30%', right: '-30%', width: '150%', height: '150%', background: 'radial-gradient(circle, rgba(14,165,233,0.02) 0%, transparent 60%)', borderRadius: '50%' }} />
        <motion.div animate={{ rotate: -360, scale: (simState === 'running' || simState === 'complete') ? 1.5 : 1 }} transition={{ duration: (simState === 'running' || simState === 'complete') ? 40 : 350, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', bottom: '-20%', left: '-20%', width: '120%', height: '120%', background: 'radial-gradient(circle, rgba(139,92,246,0.03) 0%, transparent 60%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(139,92,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px', maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)' }} />
        
        {/* Network Lines */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.1 }}>
          <pattern id="network" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M0,0 L100,100 M100,0 L0,100" stroke="#0ea5e9" strokeWidth="1" />
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#network)" />
        </svg>

        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div key={i}
            animate={{ 
              y: [0, -50, 0], 
              x: [0, Math.random() * 40 - 20, 0],
              opacity: [0, Math.random() * 0.8 + 0.2, 0]
            }}
            transition={{ duration: 4 + Math.random() * 8, repeat: Infinity, delay: Math.random() * 5 }}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              borderRadius: '50%',
              background: i % 2 === 0 ? '#10b981' : '#8b5cf6',
              boxShadow: `0 0 10px ${i % 2 === 0 ? '#10b981' : '#8b5cf6'}`
            }}
          />
        ))}
      </div>

      <style>{`
        .glass-card-pol {
          background: rgba(10, 15, 30, 0.65);
          backdrop-filter: blur(25px);
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 16px;
          box-shadow: 0 4px 40px rgba(0, 0, 0, 0.6);
          transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .glass-card-pol:hover {
          border-color: rgba(14, 165, 233, 0.5);
          box-shadow: 0 10px 50px rgba(14, 165, 233, 0.2), inset 0 0 25px rgba(139, 92, 246, 0.1);
          transform: translateY(-5px);
        }
        .neon-btn-pol {
          background: rgba(139, 92, 246, 0.15);
          border: 1px solid rgba(139, 92, 246, 0.5);
          color: #c4b5fd;
          padding: 0.75rem 1.5rem;
          border-radius: 30px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .neon-btn-pol:hover:not(:disabled) {
          background: linear-gradient(90deg, #8b5cf6, #10b981);
          color: #fff;
          border-color: transparent;
          box-shadow: 0 0 25px rgba(139, 92, 246, 0.6);
          transform: scale(1.05);
        }
        .neon-btn-pol:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .custom-select-pol {
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
        .custom-select-pol:focus {
          border-color: #10b981;
          box-shadow: 0 0 10px rgba(16,185,129,0.3);
        }
        .custom-select-pol option { background: #0a0e1e; }
        @keyframes ringPulse {
          0% { transform: scale(0.9); opacity: 0.8; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes scanOverlay {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a855f7', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem' }}>
              <ShieldCheck size={18} /> Government AI Intelligence Dashboard
            </div>
            <h1 style={{ fontSize: '4.5rem', fontWeight: '900', lineHeight: '1.1', margin: '0 0 1.5rem', background: 'linear-gradient(to right, #ffffff, #c4b5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-2px' }}>
              AI Climate Policy <br/><span style={{ background: 'linear-gradient(to right, #8b5cf6, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: '0 0 40px rgba(139,92,246,0.4)' }}>Impact Intelligence</span>
            </h1>
            <p style={{ fontSize: '1.15rem', color: '#94a3b8', lineHeight: '1.8', maxWidth: '650px', marginBottom: '2.5rem' }}>
              Analyzing the long-term environmental impact of sustainability policies using AI-driven forecasting and advanced geospatial analytics. Delivering enterprise-grade clarity for global decision-makers.
            </p>
            
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '3rem' }}>
              <button className="neon-btn-pol" onClick={runSimulation} disabled={simState !== 'idle'}>
                <Play size={18} /> {simState === 'idle' ? 'Run Policy Simulation' : 'Simulation Active...'}
              </button>
              <button className="neon-btn-pol" onClick={generatePDF} disabled={downloadState !== 'idle'} style={{ background: 'transparent', borderColor: 'rgba(255,255,255,0.2)', color: '#fff', boxShadow: downloadState === 'generating' ? '0 0 20px rgba(16,185,129,0.6)' : 'none' }}>
                {downloadState === 'idle' && <><FileText size={18} /> Export Intel Report</>}
                {downloadState === 'generating' && <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Activity size={18} /></motion.div> Compiling Report...</>}
                {downloadState === 'complete' && <><CheckCircle size={18} color="#10b981" /> Export Complete</>}
              </button>
            </div>
          </motion.div>

          {/* Right Side: Rotating Earth & Scanning Rings & Floating Metrics */}
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 1 }} style={{ position: 'relative', height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Policy Impact Waves */}
            <div style={{ position: 'absolute', width: '350px', height: '350px', borderRadius: '50%', border: '2px solid rgba(139,92,246,0.5)', animation: 'ringPulse 4s infinite cubic-bezier(0.1, 0.7, 0.3, 1)' }} />
            <div style={{ position: 'absolute', width: '350px', height: '350px', borderRadius: '50%', border: '2px solid rgba(16,185,129,0.5)', animation: 'ringPulse 4s infinite cubic-bezier(0.1, 0.7, 0.3, 1) 2s' }} />

            <motion.div animate={{ rotate: (simState === 'running' || simState === 'complete') ? 720 : 360 }} transition={{ duration: (simState === 'running' || simState === 'complete') ? 20 : 150, repeat: Infinity, ease: 'linear' }} style={{ width: '480px', height: '480px', borderRadius: '50%', border: '1px solid rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', boxShadow: 'inset 0 0 100px rgba(5,7,12,1), 0 0 80px rgba(16,185,129,0.1)', overflow: 'hidden' }}>
              <img src="/policy-globe.jpg" alt="Policy Hologram" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.95, mixBlendMode: 'screen', WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 70%)', maskImage: 'radial-gradient(circle at center, black 40%, transparent 70%)' }} />
            </motion.div>
            
            <div style={{ position: 'absolute', top: '10%', bottom: '10%', left: '10%', right: '10%', borderRadius: '50%', overflow: 'hidden' }}>
              <div style={{ width: '100%', height: '5px', background: 'linear-gradient(90deg, transparent, #8b5cf6, transparent)', boxShadow: '0 0 20px #8b5cf6', position: 'absolute', animation: 'scanOverlay 4s linear infinite', opacity: 0.7 }} />
            </div>

            {/* LIVE POLICY METRICS (Floating) */}
            {[
              { label: 'Carbon Reduction Impact', val: '−24% Emission Projection', top: '5%', left: '-15%', col: '#10b981', delay: 0 },
              { label: 'Renewable Energy Adoption', val: '+38% Clean Energy Growth', top: '15%', right: '-15%', col: '#0ea5e9', delay: 1 },
              { label: 'Climate Recovery Index', val: 'Global Recovery Score: 74%', bottom: '15%', left: '-10%', col: '#8b5cf6', delay: 2 },
              { label: 'Urban Sustainability', val: 'Smart City Readiness: 81%', bottom: '5%', right: '-10%', col: '#f59e0b', delay: 3 }
            ].map((c, i) => (
              <motion.div key={i} animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, delay: c.delay, ease: 'easeInOut' }}
                className="glass-card-pol" style={{ position: 'absolute', top: c.top, left: c.left, right: c.right, bottom: c.bottom, padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderColor: `rgba(${c.col === '#0ea5e9' ? '14,165,233' : c.col === '#10b981' ? '16,185,129' : c.col === '#8b5cf6' ? '139,92,246' : '245,158,11'}, 0.4)`, zIndex: 10 }}
              >
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: c.col, boxShadow: `0 0 15px ${c.col}` }} />
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '800' }}>{c.label}</div>
                  <div style={{ fontSize: '0.95rem', color: '#fff', fontWeight: '900', textShadow: `0 0 10px ${c.col}80` }}>{c.val}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* SCENARIO SIMULATION */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="glass-card-pol" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#fff' }}>
             <Sliders size={24} color="#8b5cf6" />
             <h2 style={{ fontSize: '1.5rem', fontWeight: '900', margin: 0 }}>Scenario Simulator</h2>
           </div>
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                 <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#8ba3b8', textTransform: 'uppercase' }}>Simulation Horizon</label>
                 <select className="custom-select-pol">
                    <option>1-Year Policy Impact</option>
                    <option>10-Year Climate Effect</option>
                    <option>2050 Net-Zero Target</option>
                 </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                 <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#8ba3b8', textTransform: 'uppercase' }}>Core Metric</label>
                 <select className="custom-select-pol">
                    <option>Emission Reduction Analysis</option>
                    <option>Sustainability Forecasting</option>
                    <option>Economic Transition Costs</option>
                 </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                 <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#8ba3b8', textTransform: 'uppercase' }}>Regulatory Framework</label>
                 <select className="custom-select-pol">
                    <option>Paris Agreement Standard</option>
                    <option>Strict Carbon Taxation</option>
                    <option>Corporate ESG Mandates</option>
                 </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                 <button className="neon-btn-pol" onClick={runSimulation} style={{ width: '100%', justifyContent: 'center' }}><Activity size={18} /> Execute Simulation</button>
              </div>
           </div>
        </motion.div>

        {/* POLICY ANALYSIS VISUALIZATION & AI INSIGHTS */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="glass-card-pol" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#fff' }}>
              <Layers color="#10b981" /> Global Policy Effectiveness Analysis
            </h3>
            <div style={{ height: '450px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={graphData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="histPolGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="curPolGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="aiOptGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="year" stroke="#8ba3b8" tick={{fill: '#8ba3b8'}} tickLine={false} axisLine={false} />
                  <YAxis stroke="#8ba3b8" tick={{fill: '#8ba3b8'}} tickLine={false} axisLine={false} />
                  <RechartsTooltip contentStyle={{ background: 'rgba(5,10,20,0.9)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '8px', color: '#fff' }} />
                  <ReferenceLine x={2022} stroke="#8b5cf6" strokeDasharray="3 3" label={{ position: 'top', value: 'POLICY ENACTED', fill: '#8b5cf6', fontSize: 10, fontWeight: 'bold' }} />
                  
                  <Area type="monotone" dataKey="historical" name="Historical Emissions" stroke="#94a3b8" strokeWidth={3} fill="url(#histPolGrad)" />
                  <Area type="monotone" dataKey="currentPolicy" name="Current Policy Path" stroke="#f59e0b" strokeWidth={3} strokeDasharray="5 5" fill="url(#curPolGrad)" />
                  <Area type="monotone" dataKey="aiOptimized" name="AI Optimized Path" stroke="#10b981" strokeWidth={4} fill="url(#aiOptGrad)" activeDot={{r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2}} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* AI Insights Panel */}
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="glass-card-pol" style={{ padding: '2rem', flex: 1, background: 'linear-gradient(145deg, rgba(5,10,20,0.8), rgba(16,185,129,0.05))' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '900', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#10b981' }}>
                <Cpu size={20} color="#10b981" /> Live AI Policy Insights
              </h3>
              <div style={{ fontFamily: "'Fira Code', monospace", fontSize: '0.9rem', color: '#8ba3b8', lineHeight: '1.8', minHeight: '150px' }}>
                <span style={{ color: '#10b981' }}>$ analyze_policy --realtime &gt; </span>
                {typedText.split('\n').map((line, i) => (
                  <div key={i} style={{ marginBottom: '0.8rem' }}>{line}</div>
                ))}
                <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} style={{ display: 'inline-block', width: '8px', height: '15px', background: '#10b981', verticalAlign: 'middle' }} />
              </div>
            </motion.div>

            {/* Regional Policy Analysis */}
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="glass-card-pol" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <h3 style={{ fontSize: '1.1rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#fff' }}>
                 <Map size={18} color="#0ea5e9" /> Regional Policy Impact Table
               </h3>
               
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' }}>
                 <div>Region</div>
                 <div>Policy Impact</div>
                 <div>Risk Reduction</div>
               </div>

               {[
                 { region: 'India', impact: 'High', reduction: '32%', col: '#10b981' },
                 { region: 'Europe', impact: 'Very High', reduction: '41%', col: '#0ea5e9' },
                 { region: 'USA', impact: 'Moderate', reduction: '22%', col: '#f59e0b' },
               ].map((item, i) => (
                 <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', alignItems: 'center', padding: '0.8rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.3s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = item.col; e.currentTarget.style.boxShadow = `0 0 15px ${item.col}40`; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.boxShadow = 'none'; }}
                 >
                   <div style={{ fontWeight: '700', color: '#fff' }}>{item.region}</div>
                   <div style={{ fontSize: '0.75rem', color: item.col, padding: '0.2rem 0.5rem', background: `${item.col}20`, borderRadius: '4px', border: `1px solid ${item.col}40`, display: 'inline-block', width: 'fit-content' }}>
                     {item.impact}
                   </div>
                   <div style={{ fontWeight: '800', color: '#fff' }}>{item.reduction}</div>
                 </div>
               ))}
            </motion.div>
          </div>
        </div>

        {/* GLOBAL POLICY MAP SECTION */}
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="glass-card-pol" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', overflow: 'hidden' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#fff', zIndex: 10 }}>
            <Globe color="#8b5cf6" /> Global Policy Map
          </h3>
          <div style={{ display: 'flex', gap: '1.5rem', zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#94a3b8' }}><span style={{ display: 'block', width: 12, height: 12, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></span> Sustainable Regions</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#94a3b8' }}><span style={{ display: 'block', width: 12, height: 12, borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 10px #f59e0b' }}></span> Moderate Climate Stress</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#94a3b8' }}><span style={{ display: 'block', width: 12, height: 12, borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 10px #ef4444' }}></span> High Environmental Risk</div>
          </div>
          
          <div style={{ height: '500px', width: '100%', position: 'relative', background: 'radial-gradient(circle at center, rgba(139,92,246,0.1) 0%, transparent 70%)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div animate={{ rotate: [0, 5, 0, -5, 0] }} transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }} style={{ width: '80%', height: '80%', opacity: 0.6, backgroundImage: 'url(/policy-globe.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', mixBlendMode: 'screen', filter: 'hue-rotate(180deg)' }} />
            
            {/* Map Markers */}
            {[
              { top: '30%', left: '25%', col: '#f59e0b' },
              { top: '40%', left: '45%', col: '#10b981' },
              { top: '25%', left: '55%', col: '#10b981' },
              { top: '55%', left: '75%', col: '#ef4444' },
              { top: '65%', left: '35%', col: '#10b981' },
            ].map((m, i) => (
              <motion.div key={i} animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2 + i * 0.5, repeat: Infinity }} style={{ position: 'absolute', top: m.top, left: m.left, width: 16, height: 16, borderRadius: '50%', background: m.col, boxShadow: `0 0 20px ${m.col}` }} />
            ))}

            {/* Network Connections */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
              <motion.path d="M 25% 30% Q 35% 20% 45% 40%" stroke="#10b981" strokeWidth="2" fill="none" strokeDasharray="5,5" animate={{ strokeDashoffset: [20, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} />
              <motion.path d="M 45% 40% Q 50% 30% 55% 25%" stroke="#10b981" strokeWidth="2" fill="none" strokeDasharray="5,5" animate={{ strokeDashoffset: [20, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} />
            </svg>
          </div>
        </motion.div>

        {/* FOOTER CTA */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="glass-card-pol" style={{ padding: '4rem 2rem', textAlign: 'center', background: 'linear-gradient(180deg, rgba(5,10,20,0.5), rgba(139,92,246,0.1))', marginTop: '2rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1rem', color: '#fff' }}>Generate Full Policy Impact Report</h2>
          <p style={{ fontSize: '1.1rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
            Compile comprehensive long-term environmental assessments, economic transition models, and AI-optimized policy recommendations.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
            <button className="neon-btn-pol" onClick={generatePDF} style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}><FileText size={20} /> Export Executive Dossier</button>
            <button className="neon-btn-pol" style={{ background: 'transparent', borderColor: '#10b981', color: '#10b981', fontSize: '1.1rem', padding: '1rem 2rem' }}><Download size={20} /> Download Raw Model Data</button>
          </div>
        </motion.div>

      </div>

      {/* RUN POLICY SIMULATION OVERLAY MODAL */}
      <AnimatePresence>
        {(simState === 'running' || simState === 'complete') && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(5, 7, 12, 0.95)',
              backdropFilter: 'blur(30px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Inter', sans-serif"
            }}
          >
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 20, ease: 'linear' }} style={{ position: 'absolute', width: '900px', height: '900px', border: '1px dashed rgba(16,185,129,0.15)', borderRadius: '50%', zIndex: 0 }} />
            <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 25, ease: 'linear' }} style={{ position: 'absolute', width: '700px', height: '700px', border: '2px solid rgba(139,92,246,0.1)', borderRadius: '50%', zIndex: 0 }} />

            <div className="glass-card-pol" style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '900px', minHeight: '600px', padding: '3rem', border: '1px solid rgba(139,92,246,0.3)', boxShadow: '0 0 50px rgba(139,92,246,0.15)', overflow: 'hidden' }}>
              
              <motion.button 
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={closeSimulation}
                style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={24} />
              </motion.button>

              {simState === 'running' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', paddingTop: '2rem' }}>
                  
                  <motion.div animate={{ scale: [1, 1.2, 1], rotate: 180 }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} style={{ width: '120px', height: '120px', border: '4px solid #8b5cf6', borderTopColor: 'transparent', borderRadius: '50%', marginBottom: '2rem', boxShadow: '0 0 30px rgba(139,92,246,0.4)' }} />
                  
                  <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#c4b5fd', marginBottom: '2rem', textShadow: '0 0 20px rgba(139,92,246,0.5)', fontFamily: "'Fira Code', monospace" }}>
                    {simStep === 0 && 'Initializing Policy Framework Engine...'}
                    {simStep === 1 && 'Running Global Impact Simulation...'}
                    {simStep >= 2 && 'Analyzing Future Sustainability Forecasts...'}
                  </h2>

                  <div style={{ width: '100%', maxWidth: '600px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', height: '8px', overflow: 'hidden', marginBottom: '3rem' }}>
                    <motion.div 
                      initial={{ width: '0%' }}
                      animate={{ width: simStep === 0 ? '25%' : simStep === 1 ? '50%' : simStep === 2 ? '75%' : '100%' }}
                      transition={{ duration: 2.5 }}
                      style={{ height: '100%', background: 'linear-gradient(90deg, #10b981, #8b5cf6)', boxShadow: '0 0 15px #8b5cf6' }}
                    />
                  </div>

                  <AnimatePresence mode="wait">
                    {simStep >= 3 && (
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem', fontFamily: "'Fira Code', monospace", color: '#94a3b8', background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0 }}>&gt; Projected 2050 Carbon Reduction: <span style={{ color: '#10b981' }}>37%</span></motion.div>
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>&gt; Future sustainability forecast optimal in EU sector.</motion.div>
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.6 }}>&gt; Environmental recovery progressing in coastal areas.</motion.div>
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.4 }}>&gt; AQI stabilization confirmed across major urban centers...</motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {simState === 'complete' && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                  <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 2 }} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', background: 'rgba(16,185,129,0.1)', borderRadius: '50%', marginBottom: '1rem', border: '2px solid #10b981', boxShadow: '0 0 30px rgba(16,185,129,0.3)' }}>
                      <CheckCircle size={40} color="#10b981" />
                    </motion.div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff', letterSpacing: '-1px' }}>Policy Simulation Complete</h2>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div className="glass-card-pol" style={{ padding: '1.5rem', borderLeft: '4px solid #10b981' }}>
                        <div style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Projected Carbon Reduction</div>
                        <div style={{ fontSize: '3rem', fontWeight: '900', color: '#10b981', textShadow: '0 0 20px rgba(16,185,129,0.5)' }}>37<span style={{ fontSize: '1.5rem', color: '#94a3b8' }}>%</span></div>
                      </div>
                      
                      <div className="glass-card-pol" style={{ padding: '1.5rem', borderLeft: '4px solid #0ea5e9' }}>
                        <div style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Future Sustainability Score</div>
                        <div style={{ fontSize: '3rem', fontWeight: '900', color: '#0ea5e9', textShadow: '0 0 20px rgba(14,165,233,0.5)' }}>84<span style={{ fontSize: '1.5rem', color: '#94a3b8' }}>/100</span></div>
                      </div>
                    </div>

                    <div className="glass-card-pol" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1rem', color: '#94a3b8', textTransform: 'uppercase' }}>AQI Stabilization Forecast</h3>
                      <div style={{ position: 'relative', width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="200" height="200" viewBox="0 0 200 200">
                          <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="15" />
                          <motion.circle cx="100" cy="100" r="90" fill="none" stroke="#8b5cf6" strokeWidth="15" strokeDasharray="565" strokeDashoffset="565" animate={{ strokeDashoffset: 565 - (565 * 0.72) }} transition={{ duration: 2, ease: "easeOut" }} strokeLinecap="round" transform="rotate(-90 100 100)" style={{ filter: 'drop-shadow(0 0 10px #8b5cf6)' }} />
                        </svg>
                        <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span style={{ fontSize: '2.5rem', fontWeight: '900', color: '#c4b5fd' }}>72%</span>
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Improvement</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
                    <button className="neon-btn-pol" onClick={closeSimulation} style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>Finalize Output</button>
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

export default PolicyImpactView;
