import React from 'react';
import { BarChart3, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import TimeSeriesPlot from './TimeSeriesPlot';

const InsightsView = ({ tsData, tsLoading, tsError }) => {
  if (!tsData || !tsData.y || tsData.y.length === 0) {
    return (
      <div className="card">
        <div className="card-header">
           <h2 className="card-title">
             <BarChart3 size={24} color="#f59e0b" />
             Insights & Trends
           </h2>
         </div>
         <div className="card-content">
           <div className="loading-spinner"></div>
         </div>
     </div>
    );
  }

  const currentTemp = tsData.y[tsData.y.length - 1];
  const previousTemp = tsData.y[0];
  const change = currentTemp - previousTemp;
  const isUp = change > 0;

  const maxTemp = Math.max(...tsData.y);
  const minTemp = Math.min(...tsData.y);
  const avgTemp = tsData.y.reduce((a, b) => a + b, 0) / tsData.y.length;

  return (
    <div>
      <div className="grid-layout" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="card" style={{ padding: '1rem', minHeight: 'auto' }}>
           <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Overall Trend</p>
           <h3 style={{ fontSize: '1.5rem', color: isUp ? '#ef4444' : '#3b82f6', display: 'flex', alignItems: 'center', gap: '10px' }}>
              {isUp ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
              {change > 0 ? '+' : ''}{change.toFixed(2)} °C
           </h3>
        </div>
        <div className="card" style={{ padding: '1rem', minHeight: 'auto' }}>
           <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Max Temperature</p>
           <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>{maxTemp.toFixed(2)} °C</h3>
        </div>
        <div className="card" style={{ padding: '1rem', minHeight: 'auto' }}>
           <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Min Temperature</p>
           <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>{minTemp.toFixed(2)} °C</h3>
        </div>
         <div className="card" style={{ padding: '1rem', minHeight: 'auto' }}>
           <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Average Temp</p>
           <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>{avgTemp.toFixed(2)} °C</h3>
        </div>
      </div>

      <div className="grid-layout">
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <div className="card-header">
            <h2 className="card-title">
              <Activity size={24} color="#f59e0b" />
              Detailed Temperature Analysis
            </h2>
          </div>
          <TimeSeriesPlot 
            data={tsData} 
            loading={tsLoading} 
            error={tsError} 
          />
        </div>
      </div>
    </div>
  );
};

export default InsightsView;
