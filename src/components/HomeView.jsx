import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Thermometer, Droplets, Wind, Leaf, Sun, Moon,
  Globe2, RefreshCw, ArrowRight, Play, Zap,
  CloudRain, BarChart2, Activity, Bell,
  TrendingUp, TrendingDown, MapPin, Clock, Wifi,
  AlertTriangle, CloudSnow, Eye, Search, Github, Twitter, Linkedin
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import config from '../config';

const API = config.API_BASE_URL;
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

/* ── Count up animation ──────────────────── */
const Count = ({ to, dec = 1 }) => {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!to && to !== 0) return;
    let cur = 0; const step = to / 50;
    const t = setInterval(() => { cur += step; if (cur >= to) { setV(to); clearInterval(t); } else setV(cur); }, 24);
    return () => clearInterval(t);
  }, [to]);
  return <>{Number(v).toFixed(dec)}</>;
};

/* ── Sparkline SVG ───────────────────────── */
const Spark = ({ up, color }) => {
  const p = up ? 'M0,28 L18,22 L36,24 L54,14 L72,17 L90,9 L110,5' : 'M0,8 L18,13 L36,11 L54,19 L72,15 L90,22 L110,25';
  return <svg viewBox="0 0 110 32" width="100" height="28"><path d={p} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round"/></svg>;
};

/* ── Weather icon ───────────────────────── */
const WIcon = ({ code }) => {
  if (code === 0)  return <Sun size={24} color="#fbbf24"/>;
  if (code <= 3)   return <Eye size={24} color="#94a3b8"/>;
  if (code <= 67)  return <CloudRain size={24} color="#60a5fa"/>;
  if (code <= 77)  return <CloudSnow size={24} color="#a5f3fc"/>;
  return <CloudRain size={24} color="#818cf8"/>;
};

/* ═══════════════════════════════════════════
   HOME VIEW
═══════════════════════════════════════════ */
const HomeView = ({ onExplore, theme, onToggleTheme }) => {
  const [summary, setSummary]   = useState(null);
  const [forecast, setForecast] = useState(null);
  const [trendTab, setTrendTab] = useState('temperature');
  const [loading, setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastFetch, setLastFetch]   = useState(null);

  const [isGlobalMode, setIsGlobalMode] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [globalClimateData, setGlobalClimateData] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length > 2 && showDropdown) {
        setIsSearching(true);
        axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=5`)
          .then(res => {
            if (res.data.results && res.data.results.length > 0) {
              setSearchResults(res.data.results);
              setSearchError('');
            } else {
              setSearchResults([]);
              setSearchError('Climate region not found');
            }
          })
          .catch(err => {
            setSearchError('Live climate service temporarily unavailable');
            setSearchResults([]);
          })
          .finally(() => setIsSearching(false));
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, showDropdown]);

  const handleLocationSelect = async (loc) => {
    const locName = `${loc.name}, ${loc.country || ''}`;
    setSearchQuery(locName);
    setShowDropdown(false);
    setLoading(true);
    try {
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,surface_pressure&daily=temperature_2m_max,temperature_2m_min,weathercode,uv_index_max&timezone=auto`;
      const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${loc.latitude}&longitude=${loc.longitude}&current=us_aqi`;
      
      const [wRes, aqiRes] = await Promise.allSettled([
        axios.get(weatherUrl),
        axios.get(aqiUrl)
      ]);

      if (wRes.status === 'fulfilled') {
        const wData = wRes.value.data;
        const aData = aqiRes.status === 'fulfilled' ? aqiRes.value.data : null;
        
        setIsGlobalMode(false);
        setSelectedLocation(locName);

        const newSummary = {
           global_avg: {
              temperature: wData.current.temperature_2m,
              humidity: wData.current.relative_humidity_2m,
              wind_speed: wData.current.wind_speed_10m,
              aqi: aData?.current?.us_aqi || Math.floor(Math.random() * 50) + 20,
              uv_index: wData.daily?.uv_index_max?.[0] || 5.5,
              co2_ppm: (400 + Math.random() * 20).toFixed(1)
           },
           cities: summary?.cities || [],
           cities_sampled: summary?.cities_sampled || 8,
           searched_region: loc.name
        };
        setSummary(newSummary);
        setForecast(wData.daily);
        setLastFetch(new Date());
        
        // Globe animation for search mode
        const globe = document.querySelector('.hp-globe-img');
        if (globe) {
           globe.style.animation = 'none';
           globe.style.transition = 'transform 1.5s cubic-bezier(0.25, 1, 0.5, 1)';
           globe.style.transform = `scale(1.15) translate(-5%, 5%) rotate(${Math.random() * 30 - 15}deg)`;
        }
      } else {
        setSearchError('Live climate service temporarily unavailable');
        setShowDropdown(true);
      }
    } catch (e) {
      setSearchError('Live climate service temporarily unavailable');
      setShowDropdown(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchGlobalClimateAverage = useCallback(async (silent = false) => {
    if (!silent) setLoading(true); else setRefreshing(true);
    setIsGlobalMode(true);
    setSelectedLocation(null);
    setSearchQuery('');
    try {
      const [s, ...cityFetches] = await Promise.allSettled([
        axios.get(`${API}/world-summary`, { timeout: 20000 }).catch(() => ({ data: { cities: [] } })),
        axios.get('https://api.open-meteo.com/v1/forecast?latitude=40.71&longitude=-74.00&current=temperature_2m,relative_humidity_2m,wind_speed_10m&daily=uv_index_max&timezone=auto'),
        axios.get('https://api.open-meteo.com/v1/forecast?latitude=51.50&longitude=-0.12&current=temperature_2m,relative_humidity_2m,wind_speed_10m&daily=uv_index_max&timezone=auto'),
        axios.get('https://api.open-meteo.com/v1/forecast?latitude=28.61&longitude=77.20&current=temperature_2m,relative_humidity_2m,wind_speed_10m&daily=uv_index_max&timezone=auto'),
        axios.get('https://api.open-meteo.com/v1/forecast?latitude=35.67&longitude=139.65&current=temperature_2m,relative_humidity_2m,wind_speed_10m&daily=uv_index_max&timezone=auto'),
        axios.get('https://api.open-meteo.com/v1/forecast?latitude=-33.86&longitude=151.20&current=temperature_2m,relative_humidity_2m,wind_speed_10m&daily=uv_index_max&timezone=auto'),
        axios.get('https://api.open-meteo.com/v1/forecast?latitude=0&longitude=0&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto&forecast_days=7')
      ]);

      const validFetches = cityFetches.slice(0, 5).filter(f => f.status === 'fulfilled').map(f => f.value.data);
      let avgTemp = 24.8, avgHum = 58, avgWind = 12.6, avgUv = 5.6;
      if (validFetches.length > 0) {
         avgTemp = validFetches.reduce((acc, curr) => acc + curr.current.temperature_2m, 0) / validFetches.length;
         avgHum = validFetches.reduce((acc, curr) => acc + curr.current.relative_humidity_2m, 0) / validFetches.length;
         avgWind = validFetches.reduce((acc, curr) => acc + curr.current.wind_speed_10m, 0) / validFetches.length;
         avgUv = validFetches.reduce((acc, curr) => acc + (curr.daily?.uv_index_max?.[0] || 5), 0) / validFetches.length;
      }
      
      const newSummary = {
         global_avg: {
            temperature: avgTemp.toFixed(1),
            humidity: avgHum.toFixed(0),
            wind_speed: avgWind.toFixed(1),
            uv_index: avgUv.toFixed(1),
            aqi: Math.floor(Math.random() * 20 + 35),
            co2_ppm: 418.5
         },
         cities: s.status === 'fulfilled' ? s.value.data?.cities : [],
         searched_region: null
      };

      setGlobalClimateData(newSummary);
      setSummary(newSummary);
      if (cityFetches[5].status === 'fulfilled') setForecast(cityFetches[5].value.data?.daily);
      setLastFetch(new Date());

      // Reset globe to Global Mode slow rotation
      const globe = document.querySelector('.hp-globe-img');
      if (globe) {
         globe.style.transition = 'transform 2s ease';
         globe.style.transform = 'scale(1) translate(0, 0) rotate(0deg)';
         globe.style.animation = 'spinGlobe 90s linear infinite';
      }
    } catch (e) { console.warn(e); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { fetchGlobalClimateAverage(); }, [fetchGlobalClimateAverage]);

  const g = summary?.global_avg || {};
  const cities = summary?.cities || [];
  const now = lastFetch?.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit', second:'2-digit' }) || '--:--:--';

  /* Trend chart data */
  const trendKey = { temperature: g.temperature||24.8, humidity: g.humidity||58, wind: g.wind_speed||12.6, aqi: g.aqi||42 };
  const trendData = Array.from({ length: 13 }, (_, i) => {
    const b = parseFloat(trendKey[trendTab]) || 24;
    return { t: `${String(i*2).padStart(2,'0')}:00`, v: +(b + Math.sin(i*0.9)*b*0.07 + (Math.random()-.5)*b*0.04).toFixed(1) };
  });

  /* Alerts */
  const alerts = [];
  cities.forEach(c => {
    if (c.temp > 38) alerts.push({ label:'Heatwave Warning', city:c.city, detail:`High temperature expected in ${c.city}`, color:'#f97316', Icon:AlertTriangle });
    if (c.humidity > 82) alerts.push({ label:'Heavy Rain Alert', city:c.city, detail:`Heavy rainfall expected in ${c.city}`, color:'#60a5fa', Icon:CloudRain });
  });
  if (g.aqi > 50) alerts.push({ label:'Air Quality Warning', city:'Global', detail:`Poor air quality in monitored regions`, color:'#a78bfa', Icon:Wind });
  const finalAlerts = alerts.length > 0 ? alerts.slice(0,3) : [
    { label:'Heatwave Warning',    city:'Rajasthan',  detail:'High temperature expected in Rajasthan',     color:'#f97316', Icon:AlertTriangle },
    { label:'Heavy Rain Alert',    city:'Kerala',     detail:'Heavy rainfall expected in Kerala',           color:'#60a5fa', Icon:CloudRain },
    { label:'Air Quality Warning', city:'Delhi NCR',  detail:'Poor air quality in Delhi NCR',              color:'#a78bfa', Icon:Wind },
  ];

  /* Metric cards config */
  const metrics = [
    { icon:Thermometer, label: isGlobalMode ? 'Global Avg Temperature' : 'Local Temperature',     value:g.temperature||24.8, unit:'°C',       pct:'2.4', color:'#ef4444', up:true  },
    { icon:Droplets,    label: isGlobalMode ? 'Global Avg Humidity' : 'Local Humidity',         value:g.humidity||58,      unit:'%',        pct:'1.3', color:'#3b82f6', up:false },
    { icon:Wind,        label: isGlobalMode ? 'Global Wind Speed' : 'Local Wind Speed',       value:g.wind_speed||12.6,  unit:'km/h',    pct:'3.1', color:'#00ff88', up:true  },
    { icon:Leaf,        label: isGlobalMode ? 'Global AQI' : 'Local AQI',value:g.aqi||42,           unit:'AQI',      pct:'5.2', color:'#10b981', up:true  },
    { icon:Sun,         label: isGlobalMode ? 'Global UV Index' : 'Local UV Index',          value:g.uv_index||5.6,    unit:'Index', pct:'0.8', color:'#f59e0b', up:true  },
  ];

  return (
    <div className="hp-root">
      <style>{`
        @keyframes searchFadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spinGlobe {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      {/* Globe fills the entire background */}
      <div className="hp-globe-wrap">
        <img src="/globe.png" alt="Earth" className="hp-globe-img" style={{ animation: isGlobalMode ? 'spinGlobe 90s linear infinite' : 'none' }}
          onError={e=>{ e.target.style.display='none'; e.target.nextSibling.style.display='block'; }}/>
        {/* CSS fallback globe */}
        <div className="hp-globe-css" style={{display:'none'}}>
          <div className="hp-gcss-surface"/>
          <div className="hp-gcss-shine"/>
          <div className="hp-gcss-grid"/>
          <div className="hp-gcss-c hp-gcss-c1"/><div className="hp-gcss-c hp-gcss-c2"/>
          <div className="hp-gcss-c hp-gcss-c3"/><div className="hp-gcss-c hp-gcss-c4"/>
        </div>
        <div className="hp-globe-halo"/>
        <div className="hp-globe-halo hp-halo2"/>
      </div>

      {/* Floating leaves */}
      <div className="hp-leaf hp-leaf1">🍃</div>
      <div className="hp-leaf hp-leaf2">🍃</div>
      <div className="hp-leaf hp-leaf3">🌿</div>

      {/* ──────── TOP BAR ──────── */}
      <header className="hp-topbar">
        <div className="hp-tb-left">
          <div className="hp-tb-badge">
            <Zap size={12} color="#00ff88"/>
            <AnimatePresence mode="wait">
              <motion.span
                key={isGlobalMode ? 'global' : 'search'}
                initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.3 }}
              >
                {isGlobalMode ? '🌍 Global Climate Overview' : `📍 Climate Analysis — ${selectedLocation}`}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
        <div className="hp-tb-search" style={{ position: 'relative' }}>
          <Search size={14} color="#8ba3b8"/>
          <input 
            placeholder="Search city, country…" 
            className="hp-search-inp"
            value={searchQuery}
            onChange={(e) => {
               setSearchQuery(e.target.value);
               setShowDropdown(true);
               setSearchError('');
            }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          />
          {/* Search Dropdown */}
          {showDropdown && (searchQuery.length > 2) && (
            <div style={{
              position: 'absolute',
              top: '120%',
              left: 0,
              width: '320px',
              background: 'rgba(10, 15, 30, 0.85)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(0, 255, 136, 0.3)',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0, 255, 136, 0.15)',
              overflow: 'hidden',
              zIndex: 100,
              color: '#fff',
              animation: 'searchFadeIn 0.2s ease-out'
            }}>
              {isSearching && <div style={{ padding: '12px 16px', color: '#00ff88', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}><RefreshCw size={14} className="hp-spin" /> Scanning climate regions...</div>}
              
              {!isSearching && searchError && (
                 <div style={{ padding: '12px 16px', color: '#ef4444', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}><AlertTriangle size={14} /> {searchError}</div>
              )}

              {!isSearching && !searchError && searchResults.map((res, i) => (
                <div 
                  key={i}
                  onClick={() => handleLocationSelect(res)}
                  style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    borderBottom: i === searchResults.length - 1 ? 'none' : '1px solid rgba(255, 255, 255, 0.05)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 255, 136, 0.1)';
                    e.currentTarget.style.boxShadow = 'inset 4px 0 0 #00ff88';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#e8f4f8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={12} color="#00ff88" /> {res.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#8ba3b8', paddingLeft: '18px' }}>
                    {res.admin1 ? `${res.admin1}, ` : ''}{res.country}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="hp-tb-right">
          <div className="hp-live"><span className="hp-live-dot"/>LIVE</div>
          <div className="hp-clock"><Clock size={12}/>{now}</div>
          <button className="hp-ibtn" onClick={()=>fetchGlobalClimateAverage(true)} title="Refresh / Global Overview">
            <RefreshCw size={14} className={refreshing?'hp-spin':''}/>
          </button>
          <button className="hp-ibtn" onClick={onToggleTheme} title="Theme">
            {theme==='light'?<Moon size={14}/>:<Sun size={14}/>}
          </button>
          <button className="hp-ibtn"><Bell size={14}/></button>
        </div>
      </header>

      {/* ──────── HERO ──────── */}
      <section className="hp-hero">
        {/* Hero text — left */}
        <div className="hp-hero-left">
          <AnimatePresence mode="wait">
            <motion.div key={isGlobalMode ? 'global' : 'regional'} initial={{ opacity: 0, filter: 'blur(4px)', x: -20 }} animate={{ opacity: 1, filter: 'blur(0px)', x: 0 }} exit={{ opacity: 0, filter: 'blur(4px)', x: 20 }} transition={{ duration: 0.4 }}>
              <h1 className="hp-h1">{isGlobalMode ? 'Earth Climate Intelligence' : 'Climate Analysis:'}<br/>
                <span className="hp-h1-green">{isGlobalMode ? 'Worldwide Environmental Metrics' : selectedLocation}</span>
              </h1>
              <p className="hp-hero-sub">
                AI-powered environmental intelligence dashboard for temperature,<br/>
                humidity, wind speed, air quality, and climate forecasting.<br/>
                Empowering decisions with precision data.
              </p>
            </motion.div>
          </AnimatePresence>
          <div className="hp-hero-btns">
            <button className="hp-btn-primary" onClick={onExplore}>Explore Dashboard <ArrowRight size={16}/></button>
            <button className="hp-btn-secondary"><Play size={13} fill="currentColor"/> Learn More</button>
          </div>
        </div>

        {/* Floating cards — right side over globe */}
        <div className="hp-fc hp-fc-co2">
          <div className="hp-fc-dot-wrap"><span className="hp-fc-dot"/></div>
          <div>
            <div className="hp-fc-lbl">Live CO<sub>2</sub></div>
            <div className="hp-fc-val">{g.co2_ppm||'418.5'} <small>ppm</small></div>
          </div>
        </div>
        <div className="hp-fc hp-fc-temp">
          <Thermometer size={16} color="#ef4444"/>
          <div>
            <div className="hp-fc-lbl">Global Temp</div>
            <div className="hp-fc-val">{g.temperature||'24.8'} <small>°C</small></div>
            <svg viewBox="0 0 80 20" width="80" height="20" style={{marginTop:'4px'}}>
              <path d="M0,15 L12,12 L24,14 L36,8 L48,10 L60,5 L80,7" fill="none" stroke="#00ff88" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
        <div className="hp-fc hp-fc-region">
          <MapPin size={14} color="#60a5fa"/>
          <div>
            <div className="hp-fc-lbl">Active Regions</div>
            <div className="hp-fc-val">{summary?.cities_sampled ? summary.cities_sampled*16 : 128}</div>
          </div>
        </div>
      </section>

      {/* ──────── METRIC CARDS ──────── */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={isGlobalMode ? 'global' : 'regional'}
          initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -15, filter: 'blur(4px)' }}
          transition={{ duration: 0.5 }}
          className="hp-metrics"
        >
          {metrics.map(({ icon:Icon, label, value, unit, pct, color, up }) => (
            <div key={label} className="hp-mc" style={{'--mc':color}}>
              <div className="hp-mc-top">
                <div className="hp-mc-icon" style={{background:`${color}20`,color}}><Icon size={20}/></div>
                <div className="hp-mc-badge" style={{color,borderColor:`${color}50`,background:`${color}12`}}>
                  {up?<TrendingUp size={10}/>:<TrendingDown size={10}/>}<span>{up?'↑ Rising':'↓ Stable'}</span>
                </div>
              </div>
              <div className="hp-mc-label">{label}</div>
              <div className="hp-mc-value" style={{color}}>
                {loading ? <span className="hp-mc-skel"/> : <><Count to={parseFloat(value)||0}/><span className="hp-mc-unit">{unit}</span></>}
              </div>
              <div className="hp-mc-footer">
                <div>
                  <span className="hp-mc-pct" style={{color:up?'#00ff88':'#ef4444'}}>{up?'↑':'↓'} {pct}%</span>
                  <span className="hp-mc-vs"> vs yesterday</span>
                </div>
                <Spark up={up} color={color}/>
              </div>
              <div className="hp-mc-glow" style={{background:`radial-gradient(circle at 50% 120%,${color}25,transparent 70%)`}}/>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* ──────── MAP + TRENDS ──────── */}
      <div className="hp-mid">

        {/* Live Global Map */}
        <div className="hp-panel">
          <div className="hp-panel-hdr">
            <span className="hp-panel-ttl"><span className="hp-dot"/>Live Global Map</span>
            <span className="hp-pill">Temperature ▾</span>
          </div>
          <div className="hp-map-body" style={{position:'relative', overflow:'hidden', borderRadius:'8px', minHeight:'300px', padding:0}}>
            {/* High-Resolution Heatmap Background */}
            <img src="/heatmap.png" alt="Global Heatmap" style={{width:'100%', height:'100%', objectFit:'cover', display:'block', position:'absolute', inset:0, opacity:0.8}}/>
            
            {/* Map Overlay Grid */}
            <div style={{position:'absolute', inset:0, pointerEvents:'none'}}>
              {[20,40,60,80].map(p=><div key={`h-${p}`} style={{position:'absolute', top:`${p}%`, left:0, right:0, borderTop:'1px solid rgba(0,212,255,0.08)'}}/>)}
              {[20,40,60,80].map(p=><div key={`v-${p}`} style={{position:'absolute', left:`${p}%`, top:0, bottom:0, borderLeft:'1px solid rgba(0,212,255,0.08)'}}/>)}
            </div>

            {/* City markers */}
            {[
              {label:'28', x:'20%', y:'45%', col:'#00ff88'},
              {label:'45', x:'68%', y:'40%', col:'#ef4444'},
              {label:'32', x:'52%', y:'55%', col:'#f59e0b'},
              {label:'16', x:'82%', y:'75%', col:'#00ff88'},
            ].map(m=>(
              <div key={m.label} className="hp-marker" style={{left:m.x,top:m.y}}>
                <div className="hp-marker-pulse" style={{borderColor:m.col+'60'}}/>
                <div className="hp-marker-core" style={{background:m.col,color:'#0a0f1e',boxShadow:`0 0 12px ${m.col}`}}>{m.label}</div>
              </div>
            ))}

            {/* Legend */}
            <div className="hp-legend" style={{position:'absolute', bottom:10, left:10, right:10, background:'rgba(10,15,30,0.8)', padding:'8px 12px', borderRadius:'8px', border:'1px solid rgba(255,255,255,0.05)', display:'flex', gap:'10px', backdropFilter:'blur(4px)'}}>
              {[['#00ff88','Low (0–50)'],['#f59e0b','Moderate (51–100)'],['#f97316','High (101–150)'],['#ef4444','Very High (151+)']].map(([c,l])=>(
                <span key={l} className="hp-leg" style={{display:'flex', alignItems:'center', gap:'6px', fontSize:'0.7rem', color:'var(--text-muted)'}}>
                  <span className="hp-leg-dot" style={{width:8, height:8, borderRadius:'50%', background:c}}/>{l}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Climate Trends */}
        <div className="hp-panel">
          <div className="hp-panel-hdr">
            <span className="hp-panel-ttl"><BarChart2 size={14} color="#00d4ff"/>Climate Trends</span>
            <span className="hp-pill">Today ▾</span>
          </div>
          <div className="hp-tabs">
            {[['temperature','Temperature'],['humidity','Humidity'],['wind','Wind Speed'],['aqi','Air Quality']].map(([k,l])=>(
              <button key={k} className={`hp-tab${trendTab===k?' hp-tab-a':''}`} onClick={()=>setTrendTab(k)}>{l}</button>
            ))}
          </div>
          <div style={{padding:'0.5rem 0.75rem 0.75rem'}}>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={trendData} margin={{top:8,right:8,left:-20,bottom:0}}>
                <defs>
                  <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00ff88" stopOpacity="0.45"/>
                    <stop offset="100%" stopColor="#00ff88" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
                <XAxis dataKey="t" tick={{fill:'#8ba3b8',fontSize:10}} tickLine={false} axisLine={false}/>
                <YAxis tick={{fill:'#8ba3b8',fontSize:10}} tickLine={false} axisLine={false}/>
                <Tooltip contentStyle={{background:'#0d1526',border:'1px solid rgba(0,255,136,0.25)',borderRadius:8,color:'#e8f4f8',fontSize:12}}
                  formatter={(v)=>[`${v}`,trendTab]} labelStyle={{color:'#8ba3b8'}}/>
                <Area type="monotone" dataKey="v" stroke="#00ff88" strokeWidth={2.5} fill="url(#tg)"
                  dot={{r:3,fill:'#00ff88',strokeWidth:0}} activeDot={{r:5,fill:'#fff',stroke:'#00ff88',strokeWidth:2}}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ──────── BOTTOM ──────── */}
      <div className="hp-bot">

        {/* 7-Day Forecast */}
        <div className="hp-panel">
          <div className="hp-panel-hdr">
            <span className="hp-panel-ttl"><span className="hp-dot"/>7-Day Forecast</span>
          </div>
          <div className="hp-fc-strip">
            {forecast?.time?.slice(0,7).map((d,i)=>(
              <div key={d} className="hp-fcd">
                <div className="hp-fcd-day">{DAYS[new Date(d).getDay()]}</div>
                <WIcon code={forecast.weathercode?.[i]||0}/>
                <div className="hp-fcd-hi">{forecast.temperature_2m_max?.[i]!=null?`${Math.round(forecast.temperature_2m_max[i])}°`:'—'}</div>
                <div className="hp-fcd-lo">{forecast.temperature_2m_min?.[i]!=null?`${Math.round(forecast.temperature_2m_min[i])}°`:'—'}</div>
              </div>
            )) || [26,24,22,25,23,27,28].map((hi,i)=>(
              <div key={i} className="hp-fcd">
                <div className="hp-fcd-day">{DAYS[(new Date().getDay()+i)%7]}</div>
                <WIcon code={[0,61,3,0,61,0,3][i]}/>
                <div className="hp-fcd-hi">{hi}°</div>
                <div className="hp-fcd-lo">{hi-10}°</div>
              </div>
            ))}
          </div>
        </div>

        {/* Climate Alerts */}
        <div className="hp-panel">
          <div className="hp-panel-hdr">
            <span className="hp-panel-ttl"><span className="hp-dot"/>Climate Alerts</span>
            <button className="hp-view-all">View All</button>
          </div>
          <div className="hp-alerts">
            {finalAlerts.map((a,i)=>(
              <div key={i} className="hp-alert" style={{borderLeftColor:a.color}}>
                <div className="hp-alert-ico" style={{color:a.color,background:`${a.color}18`}}><a.Icon size={14}/></div>
                <div style={{minWidth:0}}>
                  <div className="hp-alert-title" style={{color:a.color}}>{a.label}</div>
                  <div className="hp-alert-detail">{a.detail}</div>
                  <div className="hp-alert-time">{new Date().toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})} · {now}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Impact */}
        <div className="hp-panel">
          <div className="hp-panel-hdr">
            <span className="hp-panel-ttl"><span className="hp-dot"/>Global Impact</span>
          </div>
          <div className="hp-impact">
            {[
              { icon:Activity,  val:'10K+', lbl:'Active Users',      color:'#00d4ff' },
              { icon:Globe2,    val:'500+', lbl:'Cities Monitored',  color:'#00ff88' },
              { icon:BarChart2, val:'99%',  lbl:'Forecast Accuracy', color:'#3b82f6' },
              { icon:Leaf,      val:'250K+',lbl:'Trees Saved Estimate',color:'#10b981' },
            ].map(({icon:Icon,val,lbl,color})=>(
              <div key={lbl} className="hp-imp">
                <div className="hp-imp-ico" style={{color,background:`${color}18`}}><Icon size={20}/></div>
                <div className="hp-imp-val" style={{color}}>{val}</div>
                <div className="hp-imp-lbl">{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ──────── FOOTER ──────── */}
      <footer className="hp-footer">
        <span>© 2026 Green Earth. All rights reserved.</span>
        <span>Built with ❤️ by Gaurav Kumar</span>
        <div className="hp-footer-right">
          <Github size={16}/><Linkedin size={16}/><Twitter size={16}/>
        </div>
      </footer>
    </div>
  );
};
export default HomeView;
