import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { TrendingUp, Activity, Info } from 'lucide-react';

const PlotComponent = Plot.default || Plot;

const ForecastView = ({ tsData }) => {
  const [forecastData, setForecastData] = useState(null);
  
  // Simulate generating a simple linear forecast based on existing data
  useEffect(() => {
    if (tsData && tsData.y && tsData.y.length > 0) {
      const x = tsData.x;
      const y = tsData.y;
      const n = y.length;
      
      // Calculate simple linear regression
      const x_indices = Array.from({length: n}, (_, i) => i);
      const sum_x = x_indices.reduce((a, b) => a + b, 0);
      const sum_y = y.reduce((a, b) => a + b, 0);
      const sum_xy = x_indices.reduce((a, b, i) => a + (b * y[i]), 0);
      const sum_xx = x_indices.reduce((a, b) => a + (b * b), 0);
      
      const slope = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x);
      const intercept = (sum_y - slope * sum_x) / n;
      
      // Generate next 6 months forecast
      const lastDate = new Date(x[x.length - 1]);
      const futureDates = [];
      const forecastValues = [];
      
      for (let i = 1; i <= 6; i++) {
        const nextDate = new Date(lastDate);
        nextDate.setMonth(nextDate.getMonth() + i);
        futureDates.push(nextDate.toISOString());
        
        // Add a bit of random noise to the linear forecast
        const noise = (Math.random() - 0.5) * 0.5;
        forecastValues.push(intercept + slope * (n - 1 + i) + noise);
      }
      
      setForecastData({
        x: futureDates,
        y: forecastValues,
        slope: slope
      });
    }
  }, [tsData]);

  if (!tsData || !tsData.y || tsData.y.length === 0) {
    return (
      <div className="card">
         <div className="card-header">
            <h2 className="card-title">
              <TrendingUp size={24} color="#3b82f6" />
              Forecast Trends
            </h2>
          </div>
          <div className="card-content">
            <div className="loading-spinner"></div>
          </div>
      </div>
    );
  }

  return (
    <div className="grid-layout">
      <div className="card" style={{ gridColumn: '1 / -1' }}>
        <div className="card-header">
          <h2 className="card-title">
            <TrendingUp size={24} color="#3b82f6" />
            6-Month Climate Forecast (Statistical Projection)
          </h2>
        </div>
        
        <div style={{ padding: '0 1rem 1rem 1rem', display: 'flex', gap: '0.5rem', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          <Info size={16} />
          <span>This forecast uses simple linear regression on historical data. {forecastData?.slope > 0 ? "The trend is currently increasing." : "The trend is currently decreasing."}</span>
        </div>

        <div className="card-content" style={{ minHeight: '400px' }}>
          {forecastData ? (
             <PlotComponent
              data={[
                {
                  x: tsData.x,
                  y: tsData.y,
                  type: 'scatter',
                  mode: 'lines',
                  name: 'Historical Data',
                  line: { shape: 'spline', width: 2, color: '#0f172a' },
                },
                {
                  x: forecastData.x,
                  y: forecastData.y,
                  type: 'scatter',
                  mode: 'lines+markers',
                  name: 'Forecast',
                  line: { shape: 'spline', width: 3, dash: 'dot', color: '#ef4444' },
                  marker: { size: 6 }
                }
              ]}
              layout={{
                paper_bgcolor: 'rgba(0,0,0,0)',
                plot_bgcolor: 'rgba(0,0,0,0)',
                font: { color: '#0f172a' },
                xaxis: { title: 'Date', gridcolor: '#e2e8f0' },
                yaxis: { title: 'Mean Temp (°C)', gridcolor: '#e2e8f0' },
                margin: { t: 20, r: 20, l: 50, b: 40 },
                autosize: true,
                legend: { orientation: 'h', y: 1.1 }
              }}
              useResizeHandler={true}
              style={{ width: '100%', height: '100%' }}
              config={{ displayModeBar: false, responsive: true }}
            />
          ) : (
            <div className="loading-spinner"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForecastView;
