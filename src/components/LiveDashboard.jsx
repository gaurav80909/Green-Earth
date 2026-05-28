import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';
import { MapPin, Globe2, Thermometer, Droplets, Wind, AlertTriangle, Calendar, Search } from 'lucide-react';
import AIPredictionDashboard from './AIPredictionDashboard';

const PlotComponent = Plot.default || Plot;

const COUNTRIES = [
  { name: 'India (New Delhi)', lat: 28.6139, lon: 77.2090 },
  { name: 'USA (New York)', lat: 40.7128, lon: -74.0060 },
  { name: 'UK (London)', lat: 51.5074, lon: -0.1278 },
  { name: 'Japan (Tokyo)', lat: 35.6762, lon: 139.6503 },
  { name: 'Australia (Sydney)', lat: -33.8688, lon: 151.2093 },
  { name: 'Brazil (Brasilia)', lat: -15.8267, lon: -47.9218 },
  { name: 'South Africa (Cape Town)', lat: -33.9249, lon: 18.4241 },
  { name: 'China (Beijing)', lat: 39.9042, lon: 116.4074 },
  { name: 'Russia (Moscow)', lat: 55.7558, lon: 37.6173 },
  { name: 'Canada (Toronto)', lat: 43.6532, lon: -79.3832 }
];

const LiveDashboard = ({ currentLocation, setCurrentLocation, customLocation, startYear, endYear }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [localWeather, setLocalWeather] = useState(null);
  const [insightData, setInsightData] = useState(null);
  const [globalWeather, setGlobalWeather] = useState([]);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const displayLocation = customLocation || currentLocation;

  // Fetch current location once on mount
  useEffect(() => {
    const reverseGeocode = async (lat, lon) => {
      try {
        const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
        const address = res.data.address;
        
        // Prioritize broader regional names to avoid micro-locations like hostels or specific buildings
        const city = address.city || address.state_district || address.town || address.county || "Unknown City";
        const state = address.state || address.country || "";
        
        return state ? `${city}, ${state}` : city;
      } catch (err) {
        return "Your Location";
      }
    };

    if ("geolocation" in navigator && !currentLocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const cityName = await reverseGeocode(lat, lon);
          setCurrentLocation({ lat, lon, name: cityName });
        },
        (error) => {
          console.warn("Geolocation blocked or failed. Defaulting to London.", error);
          setCurrentLocation({ name: 'London (Default)', lat: 51.5074, lon: -0.1278 });
        }
      );
    } else if (!currentLocation) {
        setCurrentLocation({ name: 'London (Default)', lat: 51.5074, lon: -0.1278 });
    }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
       const res = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
       if (res.data && res.data.length > 0) {
           const result = res.data[0];
           const newCustom = {
               lat: parseFloat(result.lat),
               lon: parseFloat(result.lon),
               name: result.display_name.split(',')[0]
           };
           // In App.jsx, customLocation is managed, but since we are modifying here ad-hoc for manual search,
           // we'll update currentLocation to simulate moving the device, or trigger a search that overrides the view.
           setCurrentLocation(newCustom); // Updating app-wide location 
       } else {
           alert("City not found.");
       }
    } catch(err) {
       console.error("Geocoding failed", err);
       alert("Error finding city.");
    } finally {
       setIsSearching(false);
       setSearchQuery('');
    }
  };

  const fetchWeatherData = async (targetDate) => {
    if (!displayLocation) return;
    setLoading(true);
    
    try {
      // Is date today or in the past?
      const isToday = targetDate === new Date().toISOString().split('T')[0];
      const timeParamStr = isToday ? "current=temperature_2m,relative_humidity_2m,wind_speed_10m" : `daily=temperature_2m_max,wind_speed_10m_max&start_date=${targetDate}&end_date=${targetDate}`;

      // 1. Fetch Local Weather, Yesterday, and Tomorrow
      let localRes;
      if(isToday) {
         localRes = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${displayLocation.lat}&longitude=${displayLocation.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min&past_days=1&forecast_days=2&timezone=auto`);
         setLocalWeather({
            temp: localRes.data.current.temperature_2m,
            humidity: localRes.data.current.relative_humidity_2m,
            wind: localRes.data.current.wind_speed_10m
         });
         
         const daily = localRes.data.daily;
         if (daily && daily.temperature_2m_max) {
             const yesterdayTemp = daily.temperature_2m_max[0];
             const todayTemp = daily.temperature_2m_max[1];
             const tomorrowTemp = daily.temperature_2m_max[2];
             
             const diff = (todayTemp - yesterdayTemp).toFixed(1);
             const trend = diff > 0 ? `+${diff}°C warmer` : `${diff}°C cooler`;
             
             setInsightData({
                 yesterday: yesterdayTemp,
                 today: todayTemp,
                 tomorrow: tomorrowTemp,
                 trend: trend,
                 drop: diff < 0,
                 suggestion: tomorrowTemp > 35 ? "Heatwave likely tomorrow. Keep ACs serviced." : tomorrowTemp < 10 ? "Cold day ahead. Check heating systems." : "Normal operations expected."
             });
         }

         if (localRes.data.hourly) {
            const times = localRes.data.hourly.time;
            const temps = localRes.data.hourly.temperature_2m;
            // Filter future times for next 24 hours
            const nowTime = new Date().getTime();
            const upcoming = [];
            for (let i = 0; i < times.length; i++) {
               const timeObj = new Date(times[i]);
               // Show strictly upcoming hours (from current hour onwards)
               // Only show times strictly in the future (or exact present)
               if (timeObj.getTime() >= nowTime) {
                   // format time like "12 PM"
                   let hr = parseInt(times[i].split('T')[1].split(':')[0], 10);
                   const ampm = hr >= 12 ? 'PM' : 'AM';
                   hr = hr % 12;
                   hr = hr ? hr : 12;
                   upcoming.push({
                       timeStr: `${hr} ${ampm}`,
                       timeVal: timeObj,
                       temp: temps[i]
                   });
                   if (upcoming.length >= 24) break; // Next 24 hours
               }
            }
            setHourlyForecast(upcoming);
         } else {
            setHourlyForecast([]);
         }
      } else {
         // Historical archive API
         localRes = await axios.get(`https://archive-api.open-meteo.com/v1/archive?latitude=${displayLocation.lat}&longitude=${displayLocation.lon}&daily=temperature_2m_max,wind_speed_10m_max&start_date=${targetDate}&end_date=${targetDate}`);
         if(localRes.data.daily.temperature_2m_max.length > 0) {
            setLocalWeather({
                temp: localRes.data.daily.temperature_2m_max[0],
                humidity: "--", // historical API might not have humidity in daily summary easily
                wind: localRes.data.daily.wind_speed_10m_max[0]
            });
         } else {
             setLocalWeather({temp: 'N/A', humidity: 'N/A', wind: 'N/A'});
         }
         setInsightData(null); // No insight for specific past dates
         setHourlyForecast([]);
      }

      // 2. Fetch Global 10 Countries Weather
      const promises = COUNTRIES.map(async (country) => {
          try {
             if(isToday) {
                 const res = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${country.lat}&longitude=${country.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`);
                 return {...country, temp: res.data.current.temperature_2m, wind: res.data.current.wind_speed_10m};
             } else {
                 const res = await axios.get(`https://archive-api.open-meteo.com/v1/archive?latitude=${country.lat}&longitude=${country.lon}&daily=temperature_2m_max,wind_speed_10m_max&start_date=${targetDate}&end_date=${targetDate}`);
                 return {...country, temp: res.data.daily.temperature_2m_max[0] ?? 'N/A', wind: res.data.daily.wind_speed_10m_max[0] ?? 'N/A'};
             }
          } catch(e) {
              return {...country, temp: 'Error', wind: 'Error'};
          }
      });

      const globalData = await Promise.all(promises);
      setGlobalWeather(globalData);

    } catch (err) {
      console.error("Failed to fetch live data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData(date);

    // Auto-refresh every 60 seconds if looking at today's data
    let intervalId;
    if (date === new Date().toISOString().split('T')[0]) {
      intervalId = setInterval(() => {
        fetchWeatherData(date);
      }, 60000); // 60 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [displayLocation, date]);

  // Find High/Low for the table
  let maxTempIdx = -1;
  let minTempIdx = -1;
  if (globalWeather.length > 0) {
      const validTemps = globalWeather.filter(gw => typeof gw.temp === 'number');
      if (validTemps.length > 0) {
          const maxTemp = Math.max(...validTemps.map(gw => gw.temp));
          const minTemp = Math.min(...validTemps.map(gw => gw.temp));
          maxTempIdx = globalWeather.findIndex(gw => gw.temp === maxTemp);
          minTempIdx = globalWeather.findIndex(gw => gw.temp === minTemp);
      }
  }

  return (
    <div className="grid-layout">
       <div className="card" style={{ gridColumn: '1 / -1', borderLeft: '4px solid #3b82f6' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 className="card-title">
            <MapPin size={24} color="#3b82f6" />
            Displaying Data For: {displayLocation?.name || 'Locating...'}
          </h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
             
             {/* Manual Search */}
             <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', background: 'var(--surface-hover)', borderRadius: '8px', padding: '0 0.5rem', border: '1px solid var(--border)' }}>
                <input 
                   type="text" 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   placeholder="Search City..."
                   style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', padding: '0.6rem', outline: 'none' }}
                />
                <button type="submit" style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                   {isSearching ? <div className="loading-spinner" style={{width: '16px', height: '16px', borderWidth: '2px'}}></div> : <Search size={16} />}
                </button>
             </form>

             <div style={{ background: 'var(--surface-hover)', padding: '0.5rem 1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--border)' }}>
                <Calendar size={18} color="var(--text-muted)" />
                <input 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none' }}
                  max={new Date().toISOString().split('T')[0]} // Max date is today
                />
             </div>
             <button className="button" onClick={() => fetchWeatherData(date)}>
                <Search size={16} /> Analyze Date
             </button>
          </div>
        </div>
        
        <div className="card-content">
           {loading || !localWeather ? (
              <div className="loading-spinner"></div>
           ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                   <div style={{ flex: '1 1 0', minWidth: '200px', background: 'linear-gradient(145deg, rgba(239, 68, 68, 0.05), rgba(239, 68, 68, 0.01))', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '2rem', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 15px rgba(239, 68, 68, 0.05)' }}>
                      <Thermometer size={40} color="#ef4444" style={{ margin: '0 auto 1rem auto' }} />
                      <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Temperature</h3>
                      <p style={{ margin: '0.5rem 0 0 0', fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-main)' }}>{localWeather.temp} °C</p>
                   </div>
                   <div style={{ flex: '1 1 0', minWidth: '200px', background: 'linear-gradient(145deg, rgba(59, 130, 246, 0.05), rgba(59, 130, 246, 0.01))', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '2rem', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.05)' }}>
                      <Droplets size={40} color="#3b82f6" style={{ margin: '0 auto 1rem auto' }} />
                      <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Humidity</h3>
                      <p style={{ margin: '0.5rem 0 0 0', fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-main)' }}>{localWeather.humidity} {localWeather.humidity !== '--' && localWeather.humidity !== 'N/A' ? '%' : ''}</p>
                   </div>
                   <div style={{ flex: '1 1 0', minWidth: '200px', background: 'linear-gradient(145deg, rgba(16, 185, 129, 0.05), rgba(16, 185, 129, 0.01))', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '2rem', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.05)' }}>
                      <Wind size={40} color="#10b981" style={{ margin: '0 auto 1rem auto' }} />
                      <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Wind Speed</h3>
                      <p style={{ margin: '0.5rem 0 0 0', fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-main)' }}>{localWeather.wind} <span style={{fontSize: '1rem', fontWeight: 'normal'}}>km/h</span></p>
                   </div>
                </div>

                {/* Hourly Forecast Plotly Chart */}
                {hourlyForecast.length > 0 && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                       <Thermometer size={18} color="var(--primary)" />
                       <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.1rem' }}>Today's Upcoming Forecast</h3>
                    </div>
                    <div style={{ 
                        background: 'var(--surface)', 
                        border: '1px solid var(--border)', 
                        borderRadius: '16px', 
                        padding: '1rem',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                        width: '100%',
                        height: '250px'
                    }}>
                        <PlotComponent
                          data={[
                            {
                              x: hourlyForecast.map(h => h.timeVal),
                              y: hourlyForecast.map(h => h.temp),
                              type: 'scatter',
                              mode: 'lines+markers',
                              fill: 'tozeroy', // Create an area chart effect
                              marker: { color: '#10b981', size: 6 },
                              line: { color: '#10b981', width: 3, shape: 'spline' },
                              fillcolor: 'rgba(16, 185, 129, 0.1)',
                              text: hourlyForecast.map(h => `${h.timeStr}<br>${h.temp}°C`),
                              hoverinfo: 'text'
                            }
                          ]}
                          layout={{
                            autosize: true,
                            margin: { t: 10, r: 20, l: 40, b: 30 },
                            paper_bgcolor: 'rgba(0,0,0,0)',
                            plot_bgcolor: 'rgba(0,0,0,0)',
                            xaxis: {
                                showgrid: false,
                                tickformat: "%I %p", // display as 12 PM
                                dtick: 3600000 * 2, // Tick every 2 hours
                                showline: true,
                                linecolor: '#e2e8f0',
                                tickfont: { color: '#64748b' }
                            },
                            yaxis: {
                                showgrid: true,
                                gridcolor: 'rgba(226, 232, 240, 0.5)',
                                showline: false,
                                tickfont: { color: '#64748b' }
                            },
                            hovermode: 'closest'
                          }}
                          useResizeHandler={true}
                          style={{ width: '100%', height: '100%' }}
                          config={{ displayModeBar: false }}
                        />
                    </div>
                  </div>
                )}

                {/* AI Insights Section */}
                {insightData && (
                   <div style={{ background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.2)', padding: '1.5rem', borderRadius: '16px', marginTop: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                         <AlertTriangle size={20} color="#8b5cf6" />
                         <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.2rem' }}>AI Climate Insights & Forecast</h3>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                         <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '1rem', borderRadius: '12px', flex: '1 1 200px' }}>
                            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Yesterday's Max</p>
                            <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-main)', fontSize: '1.5rem', fontWeight: 'bold' }}>{insightData.yesterday} °C</p>
                         </div>
                         <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '12px', flex: '1 1 200px', border: `1px solid ${insightData.drop ? '#3b82f6' : '#ef4444'}` }}>
                            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Today's Change</p>
                            <p style={{ margin: '0.25rem 0 0 0', color: insightData.drop ? '#3b82f6' : '#ef4444', fontSize: '1.5rem', fontWeight: 'bold' }}>
                               {insightData.trend} than yesterday
                            </p>
                         </div>
                         <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '1rem', borderRadius: '12px', flex: '1 1 200px' }}>
                            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Tomorrow's Forecast</p>
                            <p style={{ margin: '0.25rem 0 0 0', color: '#f59e0b', fontSize: '1.5rem', fontWeight: 'bold' }}>{insightData.tomorrow} °C</p>
                         </div>
                      </div>

                      <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderLeft: '4px solid #10b981', borderRadius: '4px' }}>
                         <strong style={{ color: '#059669' }}>System Recommendation: </strong> 
                         <span style={{ color: 'var(--text-main)' }}>{insightData.suggestion}</span>
                      </div>
                   </div>
                )}
              </div>
           )}
        </div>
      </div>

      <div className="card" style={{ gridColumn: '1 / -1', marginTop: '1rem', borderTop: '4px solid #f59e0b' }}>
         <div className="card-header">
            <h2 className="card-title">
              <Globe2 size={24} color="#f59e0b" />
              Global Top 10 Industry Tracker (Live Updates)
            </h2>
          </div>
          <div className="card-content">
             {loading ? <div className="loading-spinner"></div> : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '1rem' }}>Region</th>
                      <th style={{ padding: '1rem' }}>Temperature (°C)</th>
                      <th style={{ padding: '1rem' }}>Wind Speed (km/h)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {globalWeather.map((gw, idx) => {
                      const isHigh = idx === maxTempIdx;
                      const isLow = idx === minTempIdx;
                      return (
                      <tr key={idx} style={{ 
                          borderBottom: '1px solid var(--border)',
                          background: isHigh ? 'rgba(239, 68, 68, 0.05)' : isLow ? 'rgba(59, 130, 246, 0.05)' : 'transparent'
                      }}>
                        <td style={{ padding: '1rem', color: 'var(--text-main)', fontWeight: '500' }}>
                           {gw.name}
                           {isHigh && <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', background: '#ef4444', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>HIGHEST</span>}
                           {isLow && <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', background: '#3b82f6', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>LOWEST</span>}
                        </td>
                        <td style={{ padding: '1rem', color: gw.temp > 30 ? '#ef4444' : gw.temp < 10 ? '#3b82f6' : '#10b981', fontWeight: 'bold' }}>{typeof gw.temp === 'number' ? gw.temp.toFixed(1) : gw.temp}</td>
                        <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{typeof gw.wind === 'number' ? gw.wind.toFixed(1) : gw.wind}</td>
                      </tr>
                    )})}
                  </tbody>
                </table>
             )}
          </div>
      </div>
      
      <div style={{ gridColumn: '1 / -1' }}>
         <AIPredictionDashboard startYear={startYear} endYear={endYear} />
      </div>
    </div>
  );
};

export default LiveDashboard;
