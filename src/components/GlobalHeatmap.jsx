import React from 'react';
import Plot from 'react-plotly.js';

const PlotComponent = Plot.default || Plot;
import { Loader2 } from 'lucide-react';

const GlobalHeatmap = ({ data, time, loading, error, variable = 'temperature' }) => {
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
          <span>Failed to load heatmap: {error}</span>
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
            z: data.z,
            x: data.x,
            y: data.y,
            type: 'heatmap',
            colorscale: 'Jet',
            colorbar: {
              title: variable === 'temperature' ? 'Temp (°C)' : 'Precip',
              thickness: 15,
              len: 0.8
            }
          }
        ]}
        layout={{
          title: `Global ${variable === 'precipitation' ? 'Precipitation' : 'Temperature (°C)'} on ${new Date(time).toLocaleDateString()}`,
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(0,0,0,0)',
          font: { color: '#0f172a' },
          xaxis: { title: 'Longitude' },
          yaxis: { title: 'Latitude' },
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

export default GlobalHeatmap;
