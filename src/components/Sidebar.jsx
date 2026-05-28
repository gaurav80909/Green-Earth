import React, { useState } from 'react';
import {
  Globe2, Home, LayoutDashboard, BarChart2, Map,
  TrendingUp, Bell, FileText, Settings, Info,
  ChevronDown, ChevronUp, User, Leaf, Activity,
  Trophy, Sliders, BrainCircuit, Cpu, LineChart,
  Brain, CalendarRange, Briefcase, Layers, BookOpen
} from 'lucide-react';

const NAV = [
  { icon: Home,          label: 'Home',        view: 'home' },
  { icon: LayoutDashboard, label: 'Dashboard',  view: 'live' },
  { icon: BarChart2,     label: 'Analytics',   view: 'ai_lstm' },
  { icon: Map,           label: 'Map View',    view: 'globalmap' },
  { icon: TrendingUp,    label: 'Forecast',    view: 'ai_linear' },
  { icon: Bell,          label: 'Alerts',      view: 'stories' },
  { icon: BookOpen,      label: 'Climate Stories', view: 'climate_stories' },
  { icon: FileText,      label: 'Reports',     view: 'climate_report' },
];

const Sidebar = ({
  metadata, timeIndex, onTimeIndexChange,
  region, onRegionChange, variable, onVariableChange,
  subRegion, onSubRegionChange, city, onCityChange,
  startYear, onStartYearChange, endYear, onEndYearChange,
  onAnalyze, currentView, onViewChange, localTemp, onGenerateReport,
  theme, onToggleTheme
}) => {
  const [toolsOpen, setToolsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const dateOptions = [];
  if (metadata?.time_values) {
    metadata.time_values.forEach((t, i) => {
      const d = new Date(t);
      const label = isNaN(d) ? `Index ${i}` : d.toLocaleDateString('en', { day:'numeric', month:'short', year:'numeric' });
      dateOptions.push({ value: i, label });
    });
  } else dateOptions.push({ value: 0, label: 'Loading…' });

  const yearOpts = [];
  for (let y = 1980; y <= 2100; y++) yearOpts.push({ value: y, label: String(y) });

  const tempColor = localTemp > 35 ? '#ef4444' : localTemp < 5 ? '#3b82f6' : '#00ff88';

  return (
    <aside className="ds">
      {/* Logo */}
      <div className="ds-logo">
        <div className="ds-logo-icon"><Globe2 size={20} /></div>
        <div>
          <div className="ds-logo-name">GREEN EARTH</div>
          <div className="ds-logo-sub">Climate Intelligence</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="ds-nav">
        {/* Home */}
        <button
          className={`ds-nav-item ${currentView === 'home' ? 'ds-active' : ''}`}
          onClick={() => onViewChange('home')}
        >
          <Home size={16} />
          <span>Home</span>
          {currentView === 'home' && <span className="ds-active-bar" />}
        </button>

        {/* Analysis Collapsible */}
        <div className="ds-tools-section" style={{ margin: '0.2rem 0' }}>
          <button className="ds-tools-toggle" onClick={() => setToolsOpen(o => !o)}>
            <BarChart2 size={16} style={{ marginLeft: '0.1rem', marginRight: '0.6rem', color: 'var(--text-muted)' }} />
            <span style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-main)', flex: 1, textAlign: 'left' }}>Analysis</span>
            {toolsOpen ? <ChevronUp size={14} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />}
          </button>
          
          {toolsOpen && (
            <div className="ds-tools-body">
              <div className="ds-field">
                <label>Variable</label>
                <select value={variable} onChange={e => onVariableChange(e.target.value)} className="ds-select">
                  <option value="temperature">Temperature (°C)</option>
                  <option value="precipitation">Precipitation</option>
                </select>
              </div>
              <div className="ds-field">
                <label>Region</label>
                <select value={region} onChange={e => onRegionChange(e.target.value)} className="ds-select">
                  <option value="global">Global</option>
                  <option value="india">India</option>
                  <option value="america">America</option>
                  <option value="europe">Europe</option>
                </select>
              </div>
              <div className="ds-field">
                <label>Date</label>
                <select value={timeIndex} onChange={e => onTimeIndexChange(Number(e.target.value))} className="ds-select">
                  {dateOptions.map((o, i) => <option key={i} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <button className="ds-action-btn" onClick={onAnalyze}>
                <Map size={13} /> Show Map
              </button>
              <div className="ds-divider" />
              <div className="ds-year-row">
                <div className="ds-field">
                  <label>From</label>
                  <select value={startYear} onChange={e => onStartYearChange(e.target.value)} className="ds-select">
                    {yearOpts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div className="ds-field">
                  <label>To</label>
                  <select value={endYear} onChange={e => onEndYearChange(e.target.value)} className="ds-select">
                    {yearOpts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>
              <button className="ds-action-btn ds-action-purple" onClick={() => onGenerateReport(startYear, endYear)}>
                <BrainCircuit size={13} /> Generate Report
              </button>
              <div className="ds-divider" />
              <div className="ds-sub-label">AI Models</div>
              <button className={`ds-nav-item ${currentView==='ai_isolation'?'ds-active':''}`} onClick={() => onViewChange('ai_isolation')}><Cpu size={14}/><span>Isolation Forecast</span></button>
              <button className={`ds-nav-item ${currentView==='ai_linear'?'ds-active':''}`} onClick={() => onViewChange('ai_linear')}><LineChart size={14}/><span>Linear Regression</span></button>
              <button className={`ds-nav-item ${currentView==='ai_lstm'?'ds-active':''}`} onClick={() => onViewChange('ai_lstm')}><Brain size={14}/><span>LSTM Deep Learning</span></button>
            </div>
          )}
        </div>

        {/* Other Regular Nav Items */}
        {NAV.filter(n => n.view !== 'home' && n.view !== 'ai_lstm' && n.view !== 'ai_linear').map(({ icon: Icon, label, view }) => (
          <button
            key={view}
            className={`ds-nav-item ${currentView === view ? 'ds-active' : ''}`}
            onClick={() => onViewChange(view)}
          >
            <Icon size={16} />
            <span>{label}</span>
            {currentView === view && <span className="ds-active-bar" />}
          </button>
        ))}

        <div className="ds-divider" style={{ margin: '1rem 0' }} />
        <div className="sidebar-sub-section-title">System</div>

        {/* Structure & Services at the bottom */}
        <button className={`ds-nav-item ${currentView === 'structure' ? 'ds-active' : ''}`} onClick={() => onViewChange('structure')}>
          <Layers size={16} /><span>Structure</span>
          {currentView === 'structure' && <span className="ds-active-bar" />}
        </button>
        <button className={`ds-nav-item ${currentView === 'services' ? 'ds-active' : ''}`} onClick={() => onViewChange('services')}>
          <Briefcase size={16} /><span>Services</span>
          {currentView === 'services' && <span className="ds-active-bar" />}
        </button>
        <button className={`ds-nav-item ${currentView === 'leaderboard' ? 'ds-active' : ''}`} onClick={() => onViewChange('leaderboard')}>
          <Trophy size={16} /><span>Leaderboard</span>
          {currentView === 'leaderboard' && <span className="ds-active-bar" />}
        </button>
        <button className={`ds-nav-item ${currentView === 'about' ? 'ds-active' : ''}`} onClick={() => onViewChange('about')}>
          <Settings size={16} /><span>About</span>
          {currentView === 'about' && <span className="ds-active-bar" />}
        </button>
      </nav>

      {/* Air Quality card */}
      <div className="ds-aq-card">
        <div className="ds-aq-top">
          <div>
            <div className="ds-aq-label">Air Quality</div>
            <div className="ds-aq-status" style={{ color: tempColor }}>
              {localTemp > 35 ? 'Danger' : localTemp < 5 ? 'Cold Alert' : 'Good'}
            </div>
          </div>
          <Leaf size={16} color="#00ff88" />
        </div>
        <div className="ds-aq-val">
          {localTemp !== undefined ? `${localTemp}` : '—'}
          <span>°C</span>
        </div>
        <svg viewBox="0 0 120 36" width="100%" height="36" style={{ marginTop: '0.5rem' }}>
          <defs>
            <linearGradient id="aqG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00ff88" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#00ff88" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0,32 L15,24 L30,26 L45,16 L60,20 L75,10 L90,14 L105,6 L120,9"
            fill="none" stroke="#00ff88" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M0,32 L15,24 L30,26 L45,16 L60,20 L75,10 L90,14 L105,6 L120,9 L120,36 L0,36 Z"
            fill="url(#aqG)" />
        </svg>
      </div>

      <div style={{ flex: 1 }} />

      {/* Theme toggle */}
      <div className="ds-theme-row">
        <span>Switch Mode</span>
        <button className={`ds-toggle ${theme === 'light' ? 'ds-toggle-light' : ''}`} onClick={onToggleTheme}>
          <span className="ds-toggle-knob" />
        </button>
      </div>

      {/* Profile */}
      <button className="ds-profile" onClick={() => setProfileOpen(o => !o)}>
        <div className="ds-avatar">GK</div>
        <div className="ds-profile-info">
          <div className="ds-profile-name">Gaurav Kumar</div>
          <div className="ds-profile-role">Admin</div>
        </div>
        <ChevronDown size={13} style={{ color: 'var(--text-muted)', marginLeft: 'auto' }} />
      </button>
    </aside>
  );
};

export default Sidebar;
