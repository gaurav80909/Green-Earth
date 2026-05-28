import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { TrendingUp, AlertCircle, Globe, CheckCircle2 } from 'lucide-react';

const PlotComponent = Plot.default || Plot;

const AIPredictionDashboard = ({ startYear, endYear }) => {
  const [trendData, setTrendData] = useState({ x: [], y: [] });
  const [barData, setBarData] = useState({ x: [], y: [], trend: [] });
  
  // Generate dummy data based on range
  useEffect(() => {
     const start = parseInt(startYear) || 2000;
     const end = parseInt(endYear) || 2055;
     
     const xVals = [];
     const yVals = [];
     
     // Base temperature around 14.0C, rising slowly
     let currentTemp = 14.0;
     for(let year = start; year <= end; year++) {
        xVals.push(year);
        // Add some noise, plus an upward trend
        const noise = (Math.random() - 0.5) * 0.4;
        const trend = (year - 2000) * 0.03; 
        
        // Emulate an anomaly around 2016
        if (year === 2016) {
           yVals.push(15.2); // Spike
        } else {
           yVals.push(currentTemp + trend + noise);
        }
     }
     
     setTrendData({ x: xVals, y: yVals });
     
     // Generate bar chart data (e.g. 2000 to 2030 strictly for AI prediction bar chart)
     const bx = [];
     const by = [];
     const bt = [];
     let btemp = 14.5;
     for(let year = 2001; year <= 2030; year++) {
         bx.push(year);
         const val = btemp + (year - 2000) * 0.05 + (Math.random() - 0.5)*0.2;
         by.push(val);
         bt.push(14.5 + (year - 2000) * 0.045); // Smooth trendline
     }
     setBarData({ x: bx, y: by, trend: bt });
     
  }, [startYear, endYear]);

  return (
    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '2rem' }}>
       {/* Climate Trend Analysis Card */}
       <div className="card" style={{ flex: '1 1 500px' }}>
          <div className="card-header" style={{ paddingBottom: '0.5rem', border: 'none' }}>
             <h2 className="card-title" style={{ fontSize: '1.4rem' }}>Climate Trend Analysis</h2>
          </div>
          
          <div className="card-content" style={{ position: 'relative' }}>
             {/* Anomaly Badge Overlay */}
             <div style={{
                position: 'absolute', top: '20px', left: '50px', zIndex: 10,
                background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)',
                padding: '0.75rem 1.5rem', borderRadius: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                display: 'flex', alignItems: 'center', gap: '0.5rem'
             }}>
                <AlertCircle size={20} color="#f59e0b" />
                <span style={{ color: '#ef4444', fontWeight: 'bold' }}>Anomaly detected:</span>
                <span style={{ color: '#3b82f6' }}>Significant temperature since 2016</span>
             </div>
             
             <PlotComponent
                data={[
                   {
                      x: trendData.x,
                      y: trendData.y,
                      type: 'scatter',
                      mode: 'lines',
                      fill: 'tozeroy',
                      line: { color: '#ef4444', width: 3, shape: 'spline' },
                      fillcolor: 'rgba(239, 68, 68, 0.1)',
                      name: 'Temperature'
                   },
                   {
                      x: [2016],
                      y: [15.2],
                      type: 'scatter',
                      mode: 'markers',
                      marker: { color: '#ef4444', size: 12, line: {color: '#fff', width: 2} },
                      name: 'Anomaly'
                   },
                   {
                      x: [trendData.x[0], trendData.x[trendData.x.length-1]],
                      y: [trendData.y[0] + 0.2, trendData.y[trendData.y.length-1] + 1.0],
                      type: 'scatter',
                      mode: 'lines',
                      line: { color: '#84cc16', width: 2, dash: 'dot' }, // dashed green line
                      name: 'Projection'
                   }
                ]}
                layout={{
                   autosize: true, height: 320, margin: { l: 40, r: 20, t: 70, b: 40 },
                   paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)',
                   showlegend: false,
                   xaxis: { showgrid: true, gridcolor: '#f1f5f9', title: 'Year' },
                   yaxis: { showgrid: true, gridcolor: '#f1f5f9' }
                }}
                useResizeHandler={true}
                style={{ width: '100%' }}
                config={{ displayModeBar: false }}
             />
             
             {/* Bottom selector box */}
             <div style={{ marginTop: '1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Globe size={20} color="#3b82f6" />
                    <span style={{ color: 'var(--text-muted)' }}>Avg Global Average ({(startYear || 2000)} - {Math.min(endYear||2020, 2020)}) &rarr; </span>
                    <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)' }}>20.0°C</span>
                </div>
             </div>
          </div>
       </div>

       {/* AI Insights & Predictions Card */}
       <div className="card" style={{ flex: '1 1 400px', background: '#f8fafc' }}>
          <div className="card-header" style={{ paddingBottom: '0.5rem', border: 'none' }}>
             <h2 className="card-title" style={{ fontSize: '1.4rem' }}>AI Insights & Predictions</h2>
          </div>
          
          <div className="card-content" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: '#fff', borderRadius: '16px', padding: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                 <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: 'var(--text-main)', fontWeight: 'bold' }}>Anomaly Detection</h3>
                 <PlotComponent
                    data={[
                       {
                          x: barData.x,
                          y: barData.y,
                          type: 'bar',
                          marker: { color: '#38bdf8' },
                          name: 'Recorded Temp'
                       },
                       {
                          x: barData.x,
                          y: barData.trend,
                          type: 'scatter',
                          mode: 'lines',
                          line: { color: '#f59e0b', width: 2, dash: 'dot' },
                          name: 'Trend Line'
                       }
                    ]}
                    layout={{
                       autosize: true, height: 180, margin: { l: 30, r: 10, t: 10, b: 30 },
                       paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)',
                       showlegend: false,
                       xaxis: { showgrid: false, dtick: 5 },
                       yaxis: { showgrid: false, range: [13, 17] },
                       barmode: 'group'
                    }}
                    useResizeHandler={true}
                    style={{ width: '100%' }}
                    config={{ displayModeBar: false }}
                 />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                 <div style={{ flex: 1, background: '#fff', borderRadius: '16px', padding: '1rem', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Globe size={32} color="#94a3b8" />
                    <div>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Avg Global Temp (2000-2020)</p>
                        <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>18.5°C</p>
                    </div>
                 </div>
                 <div style={{ flex: 1, background: '#fff', borderRadius: '16px', padding: '1rem', border: '1px solid #e2e8f0' }}>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Projected Avg Temp</p>
                    <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#84cc16', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <TrendingUp size={20} /> 16.7°C
                    </p>
                 </div>
              </div>

              <div style={{ background: '#fff', borderRadius: '16px', padding: '1.25rem', border: '1px solid #e2e8f0', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                 <CheckCircle2 size={20} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                 <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                    High probability of extreme heat events in the coming decade.
                 </p>
              </div>
          </div>
       </div>
    </div>
  );
};

export default AIPredictionDashboard;
