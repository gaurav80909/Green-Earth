import React from 'react';
import Plot from 'react-plotly.js';

const PlotComponent = Plot.default || Plot;

const TimeSeriesPlot = ({ data, loading, error, variable = 'temperature' }) => {
  if (loading) {
    return (
      <div className="card-content">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-content">
        <div className="error-message">
          <span>Failed to load timeseries: {error}</span>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="card-content">
      <PlotComponent
        data={[
          {
            x: data.x,
            y: data.y,
            type: 'scatter',
            mode: 'lines+markers',
            marker: { color: '#f59e0b', size: 6 },
            line: { shape: 'spline', width: 3, color: '#f59e0b' },
            fill: 'tozeroy',
            fillcolor: 'rgba(245, 158, 11, 0.1)',
          }
        ]}
        layout={{
          title: `Global Average ${variable === 'precipitation' ? 'Precipitation' : 'Temperature'} Over Time`,
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(0,0,0,0)',
          font: { color: '#0f172a' },
          xaxis: { title: 'Time', gridcolor: '#e2e8f0' },
          yaxis: { title: variable === 'precipitation' ? 'Mean Precip' : 'Mean Temp (°C)', gridcolor: '#e2e8f0' },
          margin: { t: 40, r: 20, l: 50, b: 40 },
          autosize: true
        }}
        useResizeHandler={true}
        style={{ width: '100%', height: '100%' }}
        config={{ displayModeBar: true, responsive: true }}
      />
    </div>
  );
};

export default TimeSeriesPlot;
