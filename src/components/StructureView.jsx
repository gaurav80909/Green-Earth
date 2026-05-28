import React from 'react';
import { motion } from 'framer-motion';
import { 
  Database, Satellite, Cpu, CloudRain, ShieldAlert, BarChart2, Globe, FileText,
  Activity, Layers, Network, Server, Zap, Wifi, Eye, Layout, CheckCircle, ChevronDown, ArrowDown, BrainCircuit
} from 'lucide-react';

const NodeCard = ({ title, desc, icon: Icon, delay, col }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ scale: 1.05, y: -10 }}
    style={{
      background: 'rgba(5,10,20,0.6)', backdropFilter: 'blur(15px)',
      border: `1px solid ${col}40`, borderRadius: '12px', padding: '1.2rem',
      display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
      boxShadow: `0 4px 20px rgba(0,0,0,0.4), inset 0 0 15px ${col}10`,
      cursor: 'default', position: 'relative', overflow: 'hidden'
    }}
  >
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${col}, transparent)` }} />
    <motion.div animate={{ boxShadow: [`0 0 10px ${col}40`, `0 0 25px ${col}80`, `0 0 10px ${col}40`] }} transition={{ duration: 2, repeat: Infinity, delay }} style={{ background: `${col}15`, padding: '0.75rem', borderRadius: '50%', color: col, marginBottom: '1rem' }}>
      <Icon size={24} />
    </motion.div>
    <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.95rem', color: '#fff', fontWeight: '800' }}>{title}</h4>
    <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', lineHeight: '1.4' }}>{desc}</p>
  </motion.div>
);

const FlowConnector = ({ delay, color }) => (
  <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0', position: 'relative', height: '40px' }}>
    <div style={{ width: '2px', height: '100%', background: `rgba(255,255,255,0.05)`, position: 'absolute' }} />
    <motion.div 
      animate={{ y: [0, 40], opacity: [0, 1, 0] }} 
      transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay }}
      style={{ width: '6px', height: '12px', background: color, borderRadius: '4px', position: 'absolute', boxShadow: `0 0 15px ${color}` }} 
    />
  </div>
);

const StructureView = () => {
  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100%', background: '#050712', overflowY: 'auto', overflowX: 'hidden', padding: '4rem 2rem', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Background Effects */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 300, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', top: '-30%', right: '-30%', width: '150%', height: '150%', background: 'radial-gradient(circle, rgba(14,165,233,0.02) 0%, transparent 60%)', borderRadius: '50%' }} />
        <motion.div animate={{ rotate: -360 }} transition={{ duration: 250, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', bottom: '-20%', left: '-20%', width: '120%', height: '120%', background: 'radial-gradient(circle, rgba(16,185,129,0.02) 0%, transparent 60%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(14,165,233,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px', maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)' }} />
        
        {/* Holographic Earth */}
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 200, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', height: '800px', opacity: 0.05, border: '1px solid #10b981', borderRadius: '50%', borderStyle: 'dashed' }} />
        <motion.div animate={{ rotate: -360 }} transition={{ duration: 150, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', opacity: 0.08, border: '1px solid #0ea5e9', borderRadius: '50%', borderStyle: 'dotted' }} />
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '30px', color: '#10b981', fontSize: '0.8rem', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
            <Network size={16} /> Neural Architecture Topology
          </div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '900', margin: '0 0 1rem', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-1px' }}>
            Green Earth <span style={{ background: 'linear-gradient(to right, #0ea5e9, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: '0 0 30px rgba(16,185,129,0.3)' }}>AI System Architecture</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#94a3b8', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
            Multi-layer environmental intelligence pipeline powered by deep learning, geospatial analytics, and real-time climate forecasting. Designed for enterprise-grade performance.
          </p>
        </motion.div>

        {/* LAYER 1: DATA INGESTION */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, transparent, rgba(14,165,233,0.3))' }} />
            <h2 style={{ fontSize: '1.2rem', color: '#38bdf8', margin: 0, fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase' }}>Layer 1 — Data Ingestion</h2>
            <div style={{ height: '1px', flex: 1, background: 'linear-gradient(-90deg, transparent, rgba(14,165,233,0.3))' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
            <NodeCard title="Open-Meteo API" desc="Real-time climate weather data" icon={CloudRain} col="#0ea5e9" delay={0.1} />
            <NodeCard title="Satellite Intel" desc="Global atmospheric monitoring" icon={Satellite} col="#0ea5e9" delay={0.2} />
            <NodeCard title="IoT Sensors" desc="Environmental sensor streams" icon={Wifi} col="#0ea5e9" delay={0.3} />
            <NodeCard title="NetCDF Files" desc="Scientific climate datasets" icon={Database} col="#0ea5e9" delay={0.4} />
            <NodeCard title="Geospatial Map" desc="State & city coordinate system" icon={Globe} col="#0ea5e9" delay={0.5} />
          </div>
        </div>

        <FlowConnector color="#0ea5e9" delay={0} />
        <FlowConnector color="#0ea5e9" delay={0.5} />

        {/* LAYER 2: AI PROCESSING ENGINE */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.3))' }} />
            <h2 style={{ fontSize: '1.2rem', color: '#c4b5fd', margin: 0, fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase' }}>Layer 2 — AI Processing Engine</h2>
            <div style={{ height: '1px', flex: 1, background: 'linear-gradient(-90deg, transparent, rgba(139,92,246,0.3))' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
            <NodeCard title="LSTM Engine" desc="Deep learning forecasting" icon={BrainCircuit} col="#8b5cf6" delay={0.1} />
            <NodeCard title="Linear Analytics" desc="Trend & projection analytics" icon={BarChart2} col="#8b5cf6" delay={0.2} />
            <NodeCard title="Climate Sim" desc="Future environmental modeling" icon={Cpu} col="#8b5cf6" delay={0.3} />
            <NodeCard title="Anomaly Detect" desc="Extreme event detection" icon={ShieldAlert} col="#8b5cf6" delay={0.4} />
            <NodeCard title="Geo-Intelligence" desc="Location-aware analysis" icon={Network} col="#8b5cf6" delay={0.5} />
          </div>
        </div>

        <FlowConnector color="#8b5cf6" delay={0} />
        <FlowConnector color="#8b5cf6" delay={0.5} />

        {/* LAYER 3: PREDICTION ENGINE */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.3))' }} />
            <h2 style={{ fontSize: '1.2rem', color: '#fcd34d', margin: 0, fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase' }}>Layer 3 — Prediction Engine</h2>
            <div style={{ height: '1px', flex: 1, background: 'linear-gradient(-90deg, transparent, rgba(245,158,11,0.3))' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1rem' }}>
            <NodeCard title="Heatwave" desc="Intensity projection" icon={Zap} col="#f59e0b" delay={0.1} />
            <NodeCard title="AQI Forecast" desc="Air quality index" icon={Activity} col="#f59e0b" delay={0.2} />
            <NodeCard title="Rainfall" desc="Precipitation variance" icon={CloudRain} col="#f59e0b" delay={0.3} />
            <NodeCard title="Flood Risk" desc="Vulnerability analysis" icon={ShieldAlert} col="#f59e0b" delay={0.4} />
            <NodeCard title="Sea-Level" desc="Rise estimation models" icon={Layers} col="#f59e0b" delay={0.5} />
            <NodeCard title="Atmospheric" desc="Pressure simulation" icon={Eye} col="#f59e0b" delay={0.6} />
          </div>
        </div>

        <FlowConnector color="#f59e0b" delay={0} />
        <FlowConnector color="#f59e0b" delay={0.5} />

        {/* LAYER 4: VISUALIZATION SYSTEM */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, transparent, rgba(236,72,153,0.3))' }} />
            <h2 style={{ fontSize: '1.2rem', color: '#f9a8d4', margin: 0, fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase' }}>Layer 4 — Visualization System</h2>
            <div style={{ height: '1px', flex: 1, background: 'linear-gradient(-90deg, transparent, rgba(236,72,153,0.3))' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1rem' }}>
            <NodeCard title="Dashboard" desc="Interactive UI panels" icon={Layout} col="#ec4899" delay={0.1} />
            <NodeCard title="3D Earth" desc="Rotating geospatial globe" icon={Globe} col="#ec4899" delay={0.2} />
            <NodeCard title="Live Graphs" desc="Time-series analytics" icon={BarChart2} col="#ec4899" delay={0.3} />
            <NodeCard title="Heatmaps" desc="Environmental contours" icon={Server} col="#ec4899" delay={0.4} />
            <NodeCard title="AI Reports" desc="Temporal report UI" icon={FileText} col="#ec4899" delay={0.5} />
            <NodeCard title="Weather UI" desc="Real-time analytics" icon={Activity} col="#ec4899" delay={0.6} />
          </div>
        </div>

        <FlowConnector color="#ec4899" delay={0} />
        <FlowConnector color="#ec4899" delay={0.5} />

        {/* LAYER 5: INTELLIGENCE OUTPUT */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.3))' }} />
            <h2 style={{ fontSize: '1.2rem', color: '#6ee7b7', margin: 0, fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase' }}>Layer 5 — Intelligence Output</h2>
            <div style={{ height: '1px', flex: 1, background: 'linear-gradient(-90deg, transparent, rgba(16,185,129,0.3))' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1rem' }}>
            <NodeCard title="Risk Intel" desc="Climate risk assessment" icon={ShieldAlert} col="#10b981" delay={0.1} />
            <NodeCard title="ESG Scoring" desc="Sustainability index" icon={CheckCircle} col="#10b981" delay={0.2} />
            <NodeCard title="Policy Impact" desc="Governance analysis" icon={Layers} col="#10b981" delay={0.3} />
            <NodeCard title="Forecast PDF" desc="AI forecast reports" icon={FileText} col="#10b981" delay={0.4} />
            <NodeCard title="Eco Strategy" desc="Environmental actions" icon={Network} col="#10b981" delay={0.5} />
            <NodeCard title="Enterprise AI" desc="Corporate insights" icon={Server} col="#10b981" delay={0.6} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default StructureView;
