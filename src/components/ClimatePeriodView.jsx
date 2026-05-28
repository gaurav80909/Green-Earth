import React from 'react';
import { CalendarRange, Clock, ArrowRight } from 'lucide-react';

const ClimatePeriodView = ({ onStartYearChange, onEndYearChange, onGenerateReport }) => {
  const periods = [
    { name: "Pre-Industrial", years: "1850 - 1900", start: 1850, end: 1900, desc: "Baseline period used by IPCC for global warming targets.", color: "#3b82f6" },
    { name: "Mid-20th Century", years: "1950 - 1980", start: 1950, end: 1980, desc: "Period of rapid industrialization and aerosol cooling effect.", color: "#8b5cf6" },
    { name: "Modern Warming", years: "1990 - Present", start: 1990, end: 2024, desc: "Accelerated warming trend dominated by greenhouse gases.", color: "#ef4444" },
    { name: "Projected 2050", years: "2024 - 2055 Forecast", start: 2024, end: 2055, desc: "Estimated conditions based on SSP-245 mitigation scenarios.", color: "#f59e0b", isFuture: true }
  ];

  const handlePeriodClick = (period) => {
    onStartYearChange(period.start);
    onEndYearChange(period.end);
    onGenerateReport(period.start, period.end);
  };

  return (
    <div className="grid-layout">
      <div className="card" style={{ gridColumn: '1 / -1' }}>
        <div className="card-header">
          <h2 className="card-title">
            <CalendarRange size={24} color="#10b981" />
            Historical & Future Climate Phases
          </h2>
        </div>
        
        <div style={{ padding: '2rem', color: 'var(--text-main)' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.05rem' }}>
            Comparing current data against historical baselines or future projections. 
            <strong> Click any phase below to generate a detailed temporal AI report.</strong>
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {periods.map((period, idx) => (
              <div 
                key={idx} 
                className="card" 
                style={{ 
                  padding: '1.5rem', 
                  minHeight: 'auto', 
                  border: '1px solid var(--border)',
                  borderLeft: `4px solid ${period.color}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: 'var(--surface)'
                }}
                onClick={() => handlePeriodClick(period)}
                onMouseOver={(e) => {
                   e.currentTarget.style.background = 'var(--surface-hover)';
                   e.currentTarget.style.transform = 'translateX(5px)';
                }}
                onMouseOut={(e) => {
                   e.currentTarget.style.background = 'var(--surface)';
                   e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)' }}>{period.name}</h3>
                    {period.isFuture && (
                      <span style={{ fontSize: '0.75rem', background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', padding: '0.15rem 0.5rem', borderRadius: '10px' }}>
                        PROJECTION
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    <Clock size={14} />
                    <span>{period.years}</span>
                  </div>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>{period.desc}</p>
                </div>
                
                <div style={{ padding: '0.5rem', borderRadius: '50%', background: 'var(--surface-hover)', color: period.color }}>
                  <ArrowRight size={20} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClimatePeriodView;
