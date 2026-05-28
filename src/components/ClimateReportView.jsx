import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, AlertTriangle, ShieldCheck, 
  Zap, Droplets, Thermometer, Calendar, Wind, Activity, Globe, Cpu, ChevronRight
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';

const ClimateReportView = ({ startYear = 2000, endYear = 2055 }) => {
  const [data, setData] = useState({ chartData: [], events: [] });
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const chartData = [];
    for (let y = startYear; y <= endYear; y++) {
      const baseTemp = 14.2 + (y - 1980) * 0.025;
      const noise = (Math.random() - 0.5) * 0.3;
      const isFuture = y > currentYear;
      
      chartData.push({
        year: y,
        historical: !isFuture ? +(baseTemp + noise).toFixed(2) : null,
        prediction: isFuture ? +(baseTemp + (y - currentYear) * 0.025 + noise * 0.5).toFixed(2) : null,
        boundaryUpper: isFuture ? +(baseTemp + (y - currentYear) * 0.04).toFixed(2) : null,
        boundaryLower: isFuture ? +(baseTemp + (y - currentYear) * 0.01).toFixed(2) : null,
      });

      if (y === currentYear) {
         chartData[chartData.length - 1].prediction = chartData[chartData.length - 1].historical;
      }
    }

    const timelineYears = [2000, 2010, 2020, 2030, 2040, 2055];
    const timelineEvents = timelineYears.map(y => ({
       year: y,
       temp: y > currentYear ? `+${((y - currentYear) * 0.04).toFixed(1)}°C` : 'Historical',
       risk: y > 2030 ? 'Critical' : y > 2010 ? 'Elevated' : 'Stable'
    }));

    setData({ chartData, events: timelineEvents });
  }, [startYear, endYear, currentYear]);
  
  const RadialProgress = ({ label, percentage, color }) => {
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ position: 'relative', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="80" height="80" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="40" cy="40" r={radius} fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
            <motion.circle 
              cx="40" cy="40" r={radius} fill="transparent" 
              stroke={color} strokeWidth="6" 
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.8 }}
              style={{ strokeLinecap: 'round', filter: `drop-shadow(0 0 8px ${color})` }}
            />
          </svg>
          <div style={{ position: 'absolute', fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)' }}>{percentage}%</div>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textAlign: 'center' }}>{label}</div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', zIndex: 1, paddingBottom: '2rem' }}>
      {/* Background Effects */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: -1, overflow: 'hidden', borderRadius: '16px' }}>
         <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />
         <div style={{ position: 'absolute', bottom: '20%', left: '-5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(0,255,136,0.05) 0%, transparent 70%)', filter: 'blur(40px)' }} />
         <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '30px 30px', opacity: 0.5, maskImage: 'linear-gradient(to bottom, black, transparent)' }} />
      </div>

      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.6; filter: brightness(1); }
          50% { opacity: 1; filter: brightness(1.3); box-shadow: 0 0 15px currentColor; }
        }
        .ai-card-hover {
          transition: all 0.3s ease;
        }
        .ai-card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 30px rgba(0,255,136,0.1), inset 0 0 0 1px rgba(0,255,136,0.3);
          background: var(--surface-hover);
        }
        .glass-panel {
          background: var(--surface);
          backdrop-filter: blur(16px);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
        }
      `}</style>

      {/* HERO SECTION */}
      <div className="glass-panel" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', padding: '2rem', position: 'relative' }}>
        <div>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '900', margin: '0 0 0.5rem', background: 'linear-gradient(to right, #00ff88, #00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-1px' }}>
              AI Temporal Climate Intelligence Report
            </h1>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              Comprehensive Environmental Analysis • 2000 → 2055
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} style={{ background: 'var(--surface-hover)', borderLeft: '4px solid #8b5cf6', padding: '1.25rem', borderRadius: '0 12px 12px 0', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Cpu size={16} color="#8b5cf6" />
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#8b5cf6', letterSpacing: '1px' }}>AI SUMMARY</span>
            </div>
            <p style={{ margin: 0, color: 'var(--text-main)', lineHeight: '1.6', fontSize: '0.95rem' }}>
              “AI climate models detected increasing temperature anomalies, atmospheric instability, and rising environmental stress across multiple global regions between 2020 and 2055.”
            </p>
          </motion.div>

          <div style={{ display: 'flex', gap: '2rem' }}>
            {[{ v: '99.8%', l: 'Data Accuracy' }, { v: '4.2M', l: 'Simulations Run' }].map((st, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i*0.1 }}>
                <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#00ff88', textShadow: '0 0 10px rgba(0,255,136,0.4)' }}>{st.v}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{st.l}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, right: 0 }}>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
              style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.4)', color: '#a855f7', padding: '0.4rem 1rem', borderRadius: '30px', fontSize: '0.7rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 0 15px rgba(139,92,246,0.2)' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#a855f7', animation: 'pulseGlow 1.5s infinite' }} />
              AI GEN COMPLETED
            </motion.div>
          </div>
          
          <div style={{ position: 'relative', width: '220px', height: '220px', marginTop: '1rem' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} style={{ width: '100%', height: '100%', borderRadius: '50%', border: '1px dashed rgba(0,255,136,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle, rgba(0,255,136,0.05) 0%, transparent 70%)', boxShadow: 'inset 0 0 30px rgba(0,255,136,0.1), 0 0 30px rgba(0,255,136,0.05)' }}>
              <Globe size={120} color="rgba(0,255,136,0.3)" strokeWidth={1} />
            </motion.div>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden' }}>
              <div style={{ width: '100%', height: '2px', background: 'linear-gradient(90deg, transparent, #00ff88, transparent)', position: 'absolute', top: '50%', animation: 'scanline 3s linear infinite', boxShadow: '0 0 10px #00ff88', opacity: 0.6 }} />
            </div>
          </div>
        </div>
      </div>

      {/* AI INSIGHT CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        {[
          { title: 'Global Temp Rise', val: '+2.4°C', sub: 'Projected increase', icon: Thermometer, col: '#ef4444' },
          { title: 'Rainfall Variability', val: '38%', sub: 'Increase in extreme events', icon: Droplets, col: '#0ea5e9' },
          { title: 'Heatwave Risk', val: '82%', sub: 'Probability increase', icon: Zap, col: '#f59e0b' },
          { title: 'AQI Instability', val: 'Rising', sub: 'Fluctuations detected', icon: Wind, col: '#8b5cf6' }
        ].map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i*0.1 }} className="glass-panel ai-card-hover" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ background: `${c.col}15`, padding: '0.5rem', borderRadius: '10px', color: c.col, border: `1px solid ${c.col}40` }}>
                <c.icon size={20} />
              </div>
              <Activity size={16} color={c.col} style={{ opacity: 0.5 }} />
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>{c.title}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '0.2rem', textShadow: `0 0 10px ${c.col}40` }}>{c.val}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{c.sub}</div>
            </div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${c.col}, transparent)`, opacity: 0.3 }} />
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        {/* GLOBAL PROJECTION GRAPH */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <TrendingUp size={20} color="#00ff88" />
            <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)' }}>Global Temperature Projection Matrix</h2>
          </div>
          <div style={{ height: '320px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHist" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="year" stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)', fontSize: 12}} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)', fontSize: 12}} tickLine={false} axisLine={false} domain={['dataMin - 0.5', 'dataMax + 0.5']} />
                <Tooltip 
                  contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-main)' }}
                  itemStyle={{ fontSize: '13px', fontWeight: '600' }}
                  labelStyle={{ color: 'var(--text-muted)', marginBottom: '5px' }}
                />
                <ReferenceLine x={currentYear} stroke="#8b5cf6" strokeDasharray="3 3" label={{ position: 'top', value: 'AI FORECAST HORIZON', fill: '#8b5cf6', fontSize: 10, fontWeight: 'bold' }} />
                
                <Area type="monotone" dataKey="historical" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorHist)" activeDot={{r: 6, fill: '#0ea5e9', stroke: '#fff', strokeWidth: 2}} />
                <Area type="monotone" dataKey="prediction" stroke="#ef4444" strokeWidth={3} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorPred)" activeDot={{r: 6, fill: '#ef4444', stroke: '#fff', strokeWidth: 2}} />
                <Area type="monotone" dataKey="boundaryUpper" stroke="none" fill="#ef4444" fillOpacity={0.05} />
                <Area type="monotone" dataKey="boundaryLower" stroke="none" fill="#ef4444" fillOpacity={0.05} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1.5rem' }}>
        {/* AI TEMPORAL TIMELINE */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="glass-panel" style={{ padding: '1.5rem', gridColumn: '1 / -1' }}>
          <h2 style={{ margin: '0 0 2rem', fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Calendar size={20} color="#00ff88" /> AI Temporal Timeline
          </h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', overflowX: 'auto', paddingBottom: '1rem' }}>
            <div style={{ position: 'absolute', left: '20px', right: '20px', top: '20px', height: '2px', background: 'var(--border)', zIndex: 0 }} />
            <div style={{ position: 'absolute', left: '20px', right: '20px', top: '20px', height: '2px', background: 'linear-gradient(90deg, #00ff88, #0ea5e9, #8b5cf6, #ef4444)', zIndex: 1, width: '70%', maskImage: 'linear-gradient(90deg, black, transparent)', WebkitMaskImage: 'linear-gradient(90deg, black, transparent)' }} />
            
            {data.events.map((ev, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, gap: '0.75rem', minWidth: '80px' }}>
                <div style={{ 
                  width: '42px', height: '42px', borderRadius: '50%', background: 'var(--surface)', border: `2px solid ${ev.year > currentYear ? '#ef4444' : '#00ff88'}`, 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-main)',
                  boxShadow: `0 0 15px ${ev.year > currentYear ? 'rgba(239,68,68,0.2)' : 'rgba(0,255,136,0.2)'}`
                }}>
                  {ev.year}
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '800', color: ev.year > currentYear ? '#ef4444' : '#00ff88' }}>{ev.temp}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600', marginTop: '2px' }}>{ev.risk}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* GLOBAL RISK ANALYSIS */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <AlertTriangle size={20} color="#f59e0b" />
            <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)' }}>Global Risk Analysis</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', flex: 1, alignContent: 'center' }}>
            <RadialProgress label="Heatwave Risk" percentage={82} color="#ef4444" />
            <RadialProgress label="Flood Risk" percentage={65} color="#0ea5e9" />
            <RadialProgress label="AQI Instability" percentage={74} color="#8b5cf6" />
            <RadialProgress label="Env Stress" percentage={89} color="#f59e0b" />
          </div>
        </motion.div>

        {/* REGIONAL IMPACT TABLE */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }} className="glass-panel" style={{ padding: '1.5rem' }}>
          <h2 style={{ margin: '0 0 1rem', fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)' }}>Regional Impact Projection</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', padding: '0.5rem 1rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
              <div>Region</div><div>Temp Rise</div><div>Risk</div>
            </div>
            {[
              { r: 'India', t: '+2.8°C', risk: 'High', col: '#f97316' },
              { r: 'Europe', t: '+1.9°C', risk: 'Moderate', col: '#f59e0b' },
              { r: 'Africa', t: '+3.2°C', risk: 'Extreme', col: '#ef4444' },
              { r: 'North America', t: '+2.1°C', risk: 'High', col: '#f97316' },
            ].map((row, i) => (
              <div key={i} className="ai-card-hover" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', padding: '0.8rem 1rem', background: 'var(--surface-hover)', border: '1px solid var(--border)', borderRadius: '8px', alignItems: 'center', fontSize: '0.9rem', fontWeight: '600' }}>
                <div style={{ color: 'var(--text-main)' }}>{row.r}</div>
                <div style={{ color: 'var(--h1-color)' }}>{row.t}</div>
                <div>
                  <span style={{ padding: '0.2rem 0.6rem', borderRadius: '4px', background: `${row.col}20`, color: row.col, fontSize: '0.75rem', border: `1px solid ${row.col}40` }}>
                    {row.risk}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* AI GENERATED RECOMMENDATIONS */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.0 }} className="glass-panel" style={{ padding: '1.5rem', background: 'linear-gradient(145deg, var(--surface), var(--surface-hover))', gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-green)', paddingBottom: '0.75rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(0,255,136,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={18} color="#00ff88" />
            </div>
            <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: '#00ff88', textShadow: 'var(--h1-green-shadow)' }}>AI Recommendations</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', fontFamily: 'monospace' }}>
            {[
              'Increase renewable energy adoption across tier 1 grids.',
              'Improve flood preparedness in coastal sectors.',
              'Monitor AQI fluctuations and enforce strict emission limits.',
              'Expand urban cooling systems in high-risk thermal zones.'
            ].map((rec, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.4', background: 'var(--surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <ChevronRight size={14} color="#00d4ff" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{rec}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', color: '#8b5cf6', fontWeight: '800', letterSpacing: '1px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#8b5cf6', animation: 'pulseGlow 1.5s infinite' }} />
            SYSTEM ACTIVELY MONITORING
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default ClimateReportView;
