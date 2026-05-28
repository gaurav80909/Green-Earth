import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Globe, Leaf, Zap, Droplets, TreePine, BatteryCharging, Factory, Building, 
  ChevronRight, Cpu, Play, FileText, Download, Activity, Target, ShieldCheck, BarChart, CheckCircle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import jsPDF from 'jspdf';

const graphData = Array.from({ length: 15 }, (_, i) => {
  const isFuture = i > 7;
  const base = 20 + i * 5;
  const noise = (Math.random() - 0.5) * 8;
  return {
    year: 2020 + i,
    historical: !isFuture ? base + noise : null,
    predicted: isFuture ? base + noise + 10 : null,
    boundaryMax: isFuture ? base + noise + 20 : null,
    boundaryMin: isFuture ? base + noise - 5 : null,
  };
});
graphData[7].predicted = graphData[7].historical;

const miniGraphData = Array.from({ length: 7 }, (_, i) => ({ val: 20 + i * 10 + Math.random() * 20 }));

const SustainabilityConsultingView = ({ onClose }) => {
  const [typedText, setTypedText] = useState('');
  const fullText = "Renewable energy adoption accelerating across Asia.\nUrban sustainability initiatives improving air quality.\nAI predicts reduced carbon intensity by 2035.";

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
      doc.setFillColor(5, 12, 10);
      doc.rect(0, 0, 210, 297, 'F');

      doc.setTextColor(16, 185, 129);
      doc.setFontSize(22);
      doc.text("Green Earth AI", 105, 30, null, null, "center");
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.text("ESG Intelligence Framework", 105, 42, null, null, "center");

      doc.setDrawColor(16, 185, 129);
      doc.line(20, 50, 190, 50);

      let y = 65;
      const addSection = (title, content) => {
        if (y > 270) { doc.addPage(); doc.setFillColor(5, 12, 10); doc.rect(0, 0, 210, 297, 'F'); y = 20; }
        doc.setTextColor(56, 189, 248);
        doc.setFontSize(14);
        doc.text(title, 20, y);
        y += 8;
        doc.setTextColor(200, 200, 200);
        doc.setFontSize(10);
        const splitText = doc.splitTextToSize(content, 170);
        doc.text(splitText, 20, y);
        y += splitText.length * 5 + 10;
      };

      addSection("1. ESG Compliance Standards", "Comprehensive analysis of international sustainability standards and integration protocols.");
      addSection("2. Sustainability Strategies", "Actionable recommendations for transitioning to circular economy models and minimizing resource waste.");
      addSection("3. Carbon Neutrality Roadmap", "Detailed timelines and operational adjustments required to achieve net-zero operations by 2050.");
      addSection("4. Environmental Optimization", "Leveraging IoT and AI to monitor real-time resource consumption and atmospheric impact.");
      addSection("5. Renewable Infrastructure", "Guidelines for integrating solar microgrids, wind energy procurement, and smart grid connectivity.");

      doc.save("Green_Earth_AI_ESG_Guidelines.pdf");
      
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
        position: 'relative', width: '100%', minHeight: '100%', background: 'rgba(5, 12, 10, 0.98)', 
        backdropFilter: 'blur(25px)', overflowY: 'auto', overflowX: 'hidden', color: '#fff',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      {/* Dynamic Background */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: -1, overflow: 'hidden' }}>
        <motion.div animate={{ rotate: 360, scale: (simState === 'running' || simState === 'complete') ? 1.5 : 1 }} transition={{ duration: (simState === 'running' || simState === 'complete') ? 50 : 250, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', top: '-20%', right: '-20%', width: '120%', height: '120%', background: 'radial-gradient(circle, rgba(16,185,129,0.03) 0%, transparent 60%)', borderRadius: '50%' }} />
        <motion.div animate={{ rotate: -360, scale: (simState === 'running' || simState === 'complete') ? 1.5 : 1 }} transition={{ duration: (simState === 'running' || simState === 'complete') ? 40 : 200, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '100%', height: '100%', background: 'radial-gradient(circle, rgba(14,165,233,0.03) 0%, transparent 60%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(16,185,129,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.03) 1px, transparent 1px)', backgroundSize: '50px 50px', maskImage: 'radial-gradient(circle at center, black, transparent 80%)' }} />
        
        {/* Floating Leaves & Particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div key={i}
            animate={{ 
              y: [0, -100, 0], 
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0, Math.random() * 0.5 + 0.2, 0],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: 5 + Math.random() * 10, repeat: Infinity, delay: Math.random() * 5 }}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              color: 'rgba(16,185,129,0.4)',
              filter: 'blur(1px)'
            }}
          >
            {i % 3 === 0 ? <Leaf size={Math.random() * 15 + 10} /> : <div style={{ width: Math.random() * 6 + 2, height: Math.random() * 6 + 2, borderRadius: '50%', background: '#10b981' }} />}
          </motion.div>
        ))}
      </div>

      <style>{`
        .glass-card-sus {
          background: rgba(10, 20, 18, 0.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(16, 185, 129, 0.15);
          border-radius: 16px;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .glass-card-sus:hover {
          border-color: rgba(16, 185, 129, 0.4);
          box-shadow: 0 10px 40px rgba(16, 185, 129, 0.15), inset 0 0 20px rgba(16, 185, 129, 0.05);
          transform: translateY(-5px);
        }
        .neon-btn-sus {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.5);
          color: #10b981;
          padding: 0.75rem 1.5rem;
          border-radius: 30px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .neon-btn-sus:hover:not(:disabled) {
          background: #10b981;
          color: #050a08;
          box-shadow: 0 0 25px rgba(16, 185, 129, 0.6);
          transform: scale(1.05);
        }
        .neon-btn-sus:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        @keyframes scanGreen {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
        @keyframes pulseRingSus {
          0% { transform: scale(0.9); opacity: 0.8; }
          100% { transform: scale(1.5); opacity: 0; }
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem' }}>
              <Leaf size={18} /> Enterprise Environmental Intelligence
            </div>
            <h1 style={{ fontSize: '4.5rem', fontWeight: '900', lineHeight: '1.1', margin: '0 0 1.5rem', background: 'linear-gradient(to right, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-2px' }}>
              AI Sustainability <br/><span style={{ color: '#10b981', WebkitTextFillColor: '#10b981', textShadow: '0 0 40px rgba(16,185,129,0.4)' }}>Intelligence Platform</span>
            </h1>
            <p style={{ fontSize: '1.15rem', color: '#94a3b8', lineHeight: '1.8', maxWidth: '600px', marginBottom: '2.5rem' }}>
              Helping governments, industries, and global organizations achieve long-term environmental sustainability and Net-Zero goals using ultra-advanced AI-driven analytics and geospatial intelligence.
            </p>
            
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '3rem' }}>
              <button className="neon-btn-sus" onClick={runSimulation} disabled={simState !== 'idle'}>
                <Play size={18} /> {simState === 'idle' ? 'Initialize Assessment' : 'Simulation Active...'}
              </button>
              <button className="neon-btn-sus" onClick={generatePDF} disabled={downloadState !== 'idle'} style={{ background: 'transparent', borderColor: '#0ea5e9', color: '#38bdf8', boxShadow: downloadState === 'generating' ? '0 0 20px rgba(14,165,233,0.6)' : 'none' }}>
                {downloadState === 'idle' && <><FileText size={18} /> View ESG Guidelines</>}
                {downloadState === 'generating' && <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Activity size={18} /></motion.div> Exporting Framework...</>}
                {downloadState === 'complete' && <><CheckCircle size={18} color="#0ea5e9" /> Export Complete</>}
              </button>
            </div>
          </motion.div>

          {/* Right Side: Rotating Earth & Scanning Rings & Floating Metrics */}
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 1 }} style={{ position: 'relative', height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', width: '380px', height: '380px', borderRadius: '50%', border: '2px solid rgba(16,185,129,0.5)', animation: 'pulseRingSus 4s infinite cubic-bezier(0.1, 0.7, 0.3, 1)' }} />
            <div style={{ position: 'absolute', width: '380px', height: '380px', borderRadius: '50%', border: '2px solid rgba(14,165,233,0.5)', animation: 'pulseRingSus 4s infinite cubic-bezier(0.1, 0.7, 0.3, 1) 2s' }} />

            <motion.div animate={{ rotate: (simState === 'running' || simState === 'complete') ? 720 : -360 }} transition={{ duration: (simState === 'running' || simState === 'complete') ? 20 : 150, repeat: Infinity, ease: 'linear' }} style={{ width: '450px', height: '450px', borderRadius: '50%', border: '1px solid rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', boxShadow: 'inset 0 0 100px rgba(5,12,10,1), 0 0 60px rgba(16,185,129,0.1)', overflow: 'hidden' }}>
              <img src="/sustainability-globe.jpg" alt="Sustainability AI" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.95, mixBlendMode: 'screen', WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 70%)', maskImage: 'radial-gradient(circle at center, black 40%, transparent 70%)' }} />
            </motion.div>
            
            {/* AI Scan Line */}
            <div style={{ position: 'absolute', top: '10%', bottom: '10%', left: '10%', right: '10%', borderRadius: '50%', overflow: 'hidden' }}>
              <div style={{ width: '100%', height: '5px', background: 'linear-gradient(90deg, transparent, #10b981, transparent)', boxShadow: '0 0 20px #10b981', position: 'absolute', animation: 'scanGreen 5s linear infinite', opacity: 0.8 }} />
            </div>

            {/* LIVE SUSTAINABILITY METRICS (Floating) */}
            {[
              { label: 'Carbon Footprint Reduction', val: '−31% Global Emission Reduction', top: '10%', left: '-15%', col: '#10b981', delay: 0, icon: Factory },
              { label: 'Renewable Energy Growth', val: '+42% Clean Energy Adoption', top: '30%', right: '-15%', col: '#0ea5e9', delay: 1.5, icon: BatteryCharging },
              { label: 'Net-Zero Readiness', val: 'Global ESG Compliance: 78%', bottom: '25%', left: '-10%', col: '#3b82f6', delay: 0.5, icon: Target },
              { label: 'Environmental Recovery', val: 'Climate Recovery Index: 82%', bottom: '10%', right: '-5%', col: '#f59e0b', delay: 2, icon: Globe }
            ].map((c, i) => (
              <motion.div key={i} animate={{ y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity, delay: c.delay, ease: 'easeInOut' }}
                className="glass-card-sus" style={{ position: 'absolute', top: c.top, left: c.left, right: c.right, bottom: c.bottom, padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderColor: `rgba(${c.col === '#0ea5e9' ? '14,165,233' : c.col === '#10b981' ? '16,185,129' : c.col === '#3b82f6' ? '59,130,246' : '245,158,11'}, 0.4)`, background: 'rgba(5, 12, 10, 0.85)', zIndex: 10 }}
              >
                <div style={{ color: c.col, filter: `drop-shadow(0 0 8px ${c.col})` }}>
                  <c.icon size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '800' }}>{c.label}</div>
                  <div style={{ fontSize: '0.95rem', color: '#fff', fontWeight: '900', textShadow: `0 0 10px ${c.col}80` }}>{c.val}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ESG ANALYTICS DASHBOARD */}
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Target color="#10b981" size={32} /> ESG Analytics Dashboard
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
            {[
              { title: 'Environmental Score', icon: Leaf, val: '88/100', percent: 88, col: '#10b981' },
              { title: 'Social Responsibility', icon: ShieldCheck, val: '92/100', percent: 92, col: '#0ea5e9' },
              { title: 'Governance Stability', icon: Building, val: '85/100', percent: 85, col: '#f59e0b' },
              { title: 'Sustainability Compliance', icon: FileText, val: '96%', percent: 96, col: '#8b5cf6' }
            ].map((metric, i) => (
              <div key={i} className="glass-card-sus" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
                <div style={{ position: 'relative', width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <svg width="100" height="100" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                    <motion.circle cx="50" cy="50" r="45" fill="none" stroke={metric.col} strokeWidth="8" strokeDasharray="283" strokeDashoffset="283" animate={{ strokeDashoffset: 283 - (283 * (metric.percent / 100)) }} transition={{ duration: 2, ease: "easeOut", delay: i * 0.2 }} strokeLinecap="round" transform="rotate(-90 50 50)" style={{ filter: `drop-shadow(0 0 8px ${metric.col})` }} />
                  </svg>
                  <div style={{ position: 'absolute', color: metric.col }}>
                    <metric.icon size={28} />
                  </div>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '900', color: '#fff', textShadow: `0 0 15px ${metric.col}60` }}>{metric.val}</div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '700', marginTop: '0.5rem', textTransform: 'uppercase' }}>{metric.title}</div>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: `linear-gradient(90deg, transparent, ${metric.col}, transparent)` }} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* SUSTAINABILITY VISUALIZATION */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="glass-card-sus" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#fff' }}>
              <BarChart color="#10b981" /> Net-Zero Projection Chart
            </h3>
            <div style={{ height: '400px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={graphData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="histGradGreen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="predGradGreen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="year" stroke="#94a3b8" tick={{fill: '#94a3b8'}} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" tick={{fill: '#94a3b8'}} tickLine={false} axisLine={false} />
                  <RechartsTooltip contentStyle={{ background: 'rgba(5,12,10,0.9)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', color: '#fff' }} />
                  <ReferenceLine x={2027} stroke="#0ea5e9" strokeDasharray="3 3" label={{ position: 'top', value: 'AI TARGET HORIZON', fill: '#0ea5e9', fontSize: 12, fontWeight: 'bold' }} />
                  
                  <Area type="monotone" dataKey="historical" name="Global Carbon Emissions" stroke="#10b981" strokeWidth={3} fill="url(#histGradGreen)" activeDot={{r: 6, fill: '#10b981', stroke: '#fff'}} />
                  <Area type="monotone" dataKey="predicted" name="Renewable Energy Growth" stroke="#0ea5e9" strokeWidth={3} strokeDasharray="5 5" fill="url(#predGradGreen)" activeDot={{r: 6, fill: '#0ea5e9', stroke: '#fff'}} />
                  <Area type="monotone" dataKey="boundaryMax" stroke="none" fill="#0ea5e9" fillOpacity={0.1} />
                  <Area type="monotone" dataKey="boundaryMin" stroke="none" fill="#0ea5e9" fillOpacity={0.1} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* AI Insights Panel */}
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="glass-card-sus" style={{ padding: '2rem', flex: 1, background: 'linear-gradient(145deg, rgba(5,12,10,0.8), rgba(16,185,129,0.05))' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '900', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#10b981' }}>
                <Cpu size={20} /> AI Sustainability Insights
              </h3>
              <div style={{ fontFamily: "'Fira Code', monospace", fontSize: '0.9rem', color: '#94a3b8', lineHeight: '1.8', minHeight: '150px' }}>
                <span style={{ color: '#10b981' }}>$ system_log &gt; </span>
                {typedText.split('\n').map((line, i) => (
                  <div key={i} style={{ marginBottom: '0.8rem' }}>{line}</div>
                ))}
                <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} style={{ display: 'inline-block', width: '8px', height: '15px', background: '#10b981', verticalAlign: 'middle' }} />
              </div>
            </motion.div>

            {/* Recommendations Section */}
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="glass-card-sus" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <h3 style={{ fontSize: '1.1rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                 <Building size={18} color="#0ea5e9" /> AI Recommendations
               </h3>
               {[
                 { text: 'Deploy solar microgrids in urban districts.', col: '#10b981' },
                 { text: 'Enforce stringent carbon capping on tier 1 logistics.', col: '#ef4444' },
                 { text: 'Upgrade smart city infrastructure for water conservation.', col: '#3b82f6' },
               ].map((item, i) => (
                 <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.8rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                   <ChevronRight size={16} color={item.col} style={{ filter: `drop-shadow(0 0 5px ${item.col})` }} />
                   <div style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: '500' }}>{item.text}</div>
                 </div>
               ))}
            </motion.div>
          </div>
        </div>

        {/* GLOBAL SUSTAINABILITY MAP SECTION */}
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="glass-card-sus" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', overflow: 'hidden' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#fff', zIndex: 10 }}>
            <Globe color="#0ea5e9" /> Global Sustainability Map
          </h3>
          <div style={{ display: 'flex', gap: '1.5rem', zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#94a3b8' }}><span style={{ display: 'block', width: 12, height: 12, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></span> High Sustainability</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#94a3b8' }}><span style={{ display: 'block', width: 12, height: 12, borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 10px #f59e0b' }}></span> Moderate Environmental Stress</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#94a3b8' }}><span style={{ display: 'block', width: 12, height: 12, borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 10px #ef4444' }}></span> Critical Climate Risk</div>
          </div>
          
          <div style={{ height: '500px', width: '100%', position: 'relative', background: 'radial-gradient(circle at center, rgba(16,185,129,0.1) 0%, transparent 70%)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div animate={{ rotate: [0, 5, 0, -5, 0] }} transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }} style={{ width: '80%', height: '80%', opacity: 0.6, backgroundImage: 'url(/sustainability-globe.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', mixBlendMode: 'screen', filter: 'hue-rotate(90deg)' }} />
            
            {/* Map Markers */}
            {[
              { top: '35%', left: '30%', col: '#f59e0b' },
              { top: '45%', left: '50%', col: '#10b981' },
              { top: '20%', left: '60%', col: '#10b981' },
              { top: '60%', left: '80%', col: '#ef4444' },
              { top: '70%', left: '40%', col: '#10b981' },
            ].map((m, i) => (
              <motion.div key={i} animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2 + i * 0.5, repeat: Infinity }} style={{ position: 'absolute', top: m.top, left: m.left, width: 16, height: 16, borderRadius: '50%', background: m.col, boxShadow: `0 0 20px ${m.col}` }} />
            ))}

            {/* Network Connections */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
              <motion.path d="M 30% 35% Q 40% 25% 50% 45%" stroke="#0ea5e9" strokeWidth="2" fill="none" strokeDasharray="5,5" animate={{ strokeDashoffset: [20, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} />
              <motion.path d="M 50% 45% Q 55% 35% 60% 20%" stroke="#0ea5e9" strokeWidth="2" fill="none" strokeDasharray="5,5" animate={{ strokeDashoffset: [20, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} />
            </svg>
          </div>
        </motion.div>

        {/* FOOTER CTA */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="glass-card-sus" style={{ padding: '4rem 2rem', textAlign: 'center', background: 'linear-gradient(180deg, rgba(5,12,10,0.5), rgba(16,185,129,0.05))', marginTop: '2rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1rem', color: '#fff' }}>Deploy AI Sustainability Strategy</h2>
          <p style={{ fontSize: '1.1rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
            Leverage NASA-grade intelligence and enterprise modeling to build a carbon-neutral infrastructure that meets global ESG standards.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
            <button className="neon-btn-sus" onClick={runSimulation} style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}><Cpu size={20} /> Initialize Assessment</button>
            <button className="neon-btn-sus" onClick={generatePDF} style={{ background: 'transparent', borderColor: '#0ea5e9', color: '#0ea5e9', fontSize: '1.1rem', padding: '1rem 2rem' }}><FileText size={20} /> Download ESG Guidelines</button>
          </div>
        </motion.div>

      </div>

      {/* RUN SIMULATION OVERLAY MODAL */}
      <AnimatePresence>
        {(simState === 'running' || simState === 'complete') && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(5, 12, 10, 0.95)',
              backdropFilter: 'blur(30px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Inter', sans-serif"
            }}
          >
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 20, ease: 'linear' }} style={{ position: 'absolute', width: '900px', height: '900px', border: '1px dashed rgba(16,185,129,0.15)', borderRadius: '50%', zIndex: 0 }} />
            <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 25, ease: 'linear' }} style={{ position: 'absolute', width: '700px', height: '700px', border: '2px solid rgba(14,165,233,0.1)', borderRadius: '50%', zIndex: 0 }} />

            <div className="glass-card-sus" style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '900px', minHeight: '600px', padding: '3rem', border: '1px solid rgba(16,185,129,0.3)', boxShadow: '0 0 50px rgba(16,185,129,0.15)', overflow: 'hidden' }}>
              
              <motion.button 
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={closeSimulation}
                style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={24} />
              </motion.button>

              {simState === 'running' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', paddingTop: '2rem' }}>
                  
                  <motion.div animate={{ scale: [1, 1.2, 1], rotate: 180 }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} style={{ width: '120px', height: '120px', border: '4px solid #10b981', borderTopColor: 'transparent', borderRadius: '50%', marginBottom: '2rem', boxShadow: '0 0 30px rgba(16,185,129,0.4)' }} />
                  
                  <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#10b981', marginBottom: '2rem', textShadow: '0 0 20px rgba(16,185,129,0.5)', fontFamily: "'Fira Code', monospace", textAlign: 'center' }}>
                    {simStep === 0 && 'Initializing AI Sustainability Scan...'}
                    {simStep === 1 && 'Running ESG Compliance Simulation...'}
                    {simStep >= 2 && 'Analyzing Global Environmental Optimization...'}
                  </h2>

                  <div style={{ width: '100%', maxWidth: '600px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', height: '8px', overflow: 'hidden', marginBottom: '3rem' }}>
                    <motion.div 
                      initial={{ width: '0%' }}
                      animate={{ width: simStep === 0 ? '25%' : simStep === 1 ? '50%' : simStep === 2 ? '75%' : '100%' }}
                      transition={{ duration: 2.5 }}
                      style={{ height: '100%', background: 'linear-gradient(90deg, #0ea5e9, #10b981)', boxShadow: '0 0 15px #10b981' }}
                    />
                  </div>

                  <AnimatePresence mode="wait">
                    {simStep >= 3 && (
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem', fontFamily: "'Fira Code', monospace", color: '#94a3b8', background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0 }}>&gt; Performing advanced carbon footprint analysis...</motion.div>
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>&gt; Projecting renewable transition models...</motion.div>
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.6 }}>&gt; Scoring overall ESG readiness and compliance.</motion.div>
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.4 }}>&gt; Aggregating sustainability scores...</motion.div>
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
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff', letterSpacing: '-1px' }}>AI Sustainability Assessment Complete</h2>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div className="glass-card-sus" style={{ padding: '1.5rem', borderLeft: '4px solid #10b981' }}>
                        <div style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Projected Carbon Reduction</div>
                        <div style={{ fontSize: '3rem', fontWeight: '900', color: '#10b981', textShadow: '0 0 20px rgba(16,185,129,0.5)' }}>38<span style={{ fontSize: '1.5rem', color: '#94a3b8' }}>%</span></div>
                      </div>
                      
                      <div className="glass-card-sus" style={{ padding: '1.5rem', borderLeft: '4px solid #0ea5e9' }}>
                        <div style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Renewable Transition Forecast</div>
                        <div style={{ fontSize: '3rem', fontWeight: '900', color: '#0ea5e9', textShadow: '0 0 20px rgba(14,165,233,0.5)' }}>+45<span style={{ fontSize: '1.5rem', color: '#94a3b8' }}>%</span></div>
                      </div>
                    </div>

                    <div className="glass-card-sus" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1rem', color: '#94a3b8', textTransform: 'uppercase' }}>Environmental Optimization Score</h3>
                      <div style={{ position: 'relative', width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="200" height="200" viewBox="0 0 200 200">
                          <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="15" />
                          <motion.circle cx="100" cy="100" r="90" fill="none" stroke="#10b981" strokeWidth="15" strokeDasharray="565" strokeDashoffset="565" animate={{ strokeDashoffset: 565 - (565 * 0.94) }} transition={{ duration: 2, ease: "easeOut" }} strokeLinecap="round" transform="rotate(-90 100 100)" style={{ filter: 'drop-shadow(0 0 10px #10b981)' }} />
                        </svg>
                        <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff' }}>94/100</span>
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>ESG Readiness: High</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
                    <button className="neon-btn-sus" onClick={closeSimulation} style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>Acknowledge Results</button>
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

export default SustainabilityConsultingView;
