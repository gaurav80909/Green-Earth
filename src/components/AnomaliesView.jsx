import React from 'react';
import { ShieldAlert, AlertTriangle, TrendingUp } from 'lucide-react';

const AnomaliesView = ({ tsData }) => {
  if (!tsData || !tsData.y || tsData.y.length === 0) {
    return (
      <div className="card">
         <div className="card-header">
            <h2 className="card-title">
              <ShieldAlert size={24} color="#ef4444" />
              Climate Anomalies
            </h2>
          </div>
          <div className="card-content">
            <div className="loading-spinner"></div>
          </div>
      </div>
    );
  }

  // Basic anomaly detection: values > mean + stddev or < mean - stddev
  const mean = tsData.y.reduce((a, b) => a + b, 0) / tsData.y.length;
  const variance = tsData.y.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / tsData.y.length;
  const stddev = Math.sqrt(variance);

  const anomalies = [];
  tsData.y.forEach((val, i) => {
    if (Math.abs(val - mean) > stddev) {
      anomalies.push({
        date: new Date(tsData.x[i]).toLocaleDateString('default', { month: 'long', year: 'numeric' }),
        value: val.toFixed(2),
        type: val > mean ? 'High' : 'Low',
        diff: (val - mean).toFixed(2)
      });
    }
  });

  return (
    <div className="grid-layout">
      <div className="card" style={{ gridColumn: '1 / -1' }}>
        <div className="card-header">
          <h2 className="card-title">
            <ShieldAlert size={24} color="#ef4444" />
            Detected Climate Anomalies (&gt; 1 StdDev)
          </h2>
        </div>
        <div style={{ padding: '1rem', color: 'var(--text-main)' }}>
          {anomalies.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem' }}>Date</th>
                  <th style={{ padding: '0.75rem' }}>Mean Temp (°C)</th>
                  <th style={{ padding: '0.75rem' }}>Anomaly Type</th>
                  <th style={{ padding: '0.75rem' }}>Deviation (°C)</th>
                </tr>
              </thead>
              <tbody>
                {anomalies.map((a, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.75rem' }}>{a.date}</td>
                    <td style={{ padding: '0.75rem' }}>{a.value}</td>
                    <td style={{ padding: '0.75rem', color: a.type === 'High' ? '#ef4444' : '#3b82f6', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      {a.type === 'High' ? <TrendingUp size={16} /> : <TrendingUp size={16} style={{transform: 'rotate(180deg)'}} />}
                      {a.type}
                    </td>
                    <td style={{ padding: '0.75rem' }}>{a.diff > 0 ? '+' : ''}{a.diff}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
             <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#10b981' }}>
                <AlertTriangle size={20} />
                No significant anomalies detected in this time range.
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnomaliesView;
