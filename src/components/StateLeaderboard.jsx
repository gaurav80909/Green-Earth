import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trophy, ArrowUp, ArrowDown, Map, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const INDIAN_STATES = [
  { name: 'Andhra Pradesh (Amaravati)', lat: 16.5062, lon: 80.6480 },
  { name: 'Arunachal Pradesh (Itanagar)', lat: 27.0844, lon: 93.6053 },
  { name: 'Assam (Dispur)', lat: 26.1433, lon: 91.7898 },
  { name: 'Bihar (Patna)', lat: 25.5941, lon: 85.1376 },
  { name: 'Chhattisgarh (Raipur)', lat: 21.2514, lon: 81.6296 },
  { name: 'Goa (Panaji)', lat: 15.4909, lon: 73.8278 },
  { name: 'Gujarat (Gandhinagar)', lat: 23.2156, lon: 72.6369 },
  { name: 'Haryana (Chandigarh)', lat: 30.7333, lon: 76.7794 },
  { name: 'Himachal Pradesh (Shimla)', lat: 31.1048, lon: 77.1734 },
  { name: 'Jharkhand (Ranchi)', lat: 23.3441, lon: 85.3096 },
  { name: 'Karnataka (Bengaluru)', lat: 12.9716, lon: 77.5946 },
  { name: 'Kerala (Thiruvananthapuram)', lat: 8.5241, lon: 76.9366 },
  { name: 'Madhya Pradesh (Bhopal)', lat: 23.2599, lon: 77.4126 },
  { name: 'Maharashtra (Mumbai)', lat: 19.0760, lon: 72.8777 },
  { name: 'Manipur (Imphal)', lat: 24.8170, lon: 93.9368 },
  { name: 'Meghalaya (Shillong)', lat: 25.5788, lon: 91.8933 },
  { name: 'Mizoram (Aizawl)', lat: 23.7271, lon: 92.7176 },
  { name: 'Nagaland (Kohima)', lat: 25.6751, lon: 94.1086 },
  { name: 'Odisha (Bhubaneswar)', lat: 20.2961, lon: 85.8245 },
  { name: 'Punjab (Chandigarh)', lat: 30.7333, lon: 76.7794 },
  { name: 'Rajasthan (Jaipur)', lat: 26.9124, lon: 75.7873 },
  { name: 'Sikkim (Gangtok)', lat: 27.3389, lon: 88.6065 },
  { name: 'Tamil Nadu (Chennai)', lat: 13.0827, lon: 80.2707 },
  { name: 'Telangana (Hyderabad)', lat: 17.3850, lon: 78.4867 },
  { name: 'Tripura (Agartala)', lat: 23.8315, lon: 91.2868 },
  { name: 'Uttar Pradesh (Lucknow)', lat: 26.8467, lon: 80.9462 },
  { name: 'Uttarakhand (Dehradun)', lat: 30.3165, lon: 78.0322 },
  { name: 'West Bengal (Kolkata)', lat: 22.5726, lon: 88.3639 }
];

const StateLeaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' for highest first, 'asc' for lowest first

  const fetchStatesWeather = async () => {
       setLoading(true);
       try {
           const promises = INDIAN_STATES.map(async (state) => {
               try {
                  // Fetch current weather + hourly weather from past day to today to get the 6 hour trend
                  const res = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${state.lat}&longitude=${state.lon}&current=temperature_2m,relative_humidity_2m&hourly=temperature_2m&past_days=1`);
                  
                  const currentTemp = res.data.current.temperature_2m;
                  const currentHumidity = res.data.current.relative_humidity_2m;
                  const currentTime = res.data.current.time; // e.g. "2023-11-05T15:00"

                  // Find index of current hour in hourly array
                  const hourlyTimes = res.data.hourly.time;
                  const hourlyTemps = res.data.hourly.temperature_2m;
                  
                  // Open-Meteo current.time is exactly aligned with an hourly.time entry usually
                  // If not, find the closest hour. But usually it matches exact.
                  const currentHourPrefix = currentTime.substring(0, 13); // format: "YYYY-MM-DDTHH"
                  const currentIndex = hourlyTimes.findIndex(t => t.startsWith(currentHourPrefix));
                  
                  let trend = 0;
                  let trendText = "N/A";
                  if (currentIndex >= 6) {
                      const temp6HoursAgo = hourlyTemps[currentIndex - 6];
                      trend = Number((currentTemp - temp6HoursAgo).toFixed(1));
                      trendText = trend > 0 ? `+${trend}` : `${trend}`;
                  }

                  return {
                      ...state,
                      temp: currentTemp,
                      humidity: currentHumidity,
                      trend: trend,
                      trendText: trendText
                  };
               } catch(e) {
                  return { ...state, temp: -999, humidity: 0, trend: 0, trendText: "Error" }; // Error fallback
               }
           });

           let results = await Promise.all(promises);
           // Filter out errors
           results = results.filter(r => r.temp !== -999);
           
           // Ensure sort array based on existing state
           setLeaderboardData((prev) => {
               const sorted = [...results].sort((a, b) => {
                   // Keep the current global sortOrder context using functional update if needed,
                   // but simpler to just re-sort below. We'll use the external sortOrder variable.
                   return 0; // Handled after return
               });
               return sorted; // Temporary
           });
           
           results.sort((a, b) => sortOrder === 'desc' ? b.temp - a.temp : a.temp - b.temp);
           setLeaderboardData([...results]);
       } catch (err) {
           console.error("Error fetching leaderboard data", err);
       } finally {
           setLoading(false);
       }
  };

  useEffect(() => {
    fetchStatesWeather();

    // Auto Refresh every 5 minutes (300,000 ms)
    const interval = setInterval(() => {
        fetchStatesWeather();
    }, 300000);

    return () => clearInterval(interval);
  }, [sortOrder]); // re-fetch and sort properly if sort changes realistically

  const handleSort = () => {
      const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
      setSortOrder(newOrder);
      const sorted = [...leaderboardData].sort((a, b) => {
          return newOrder === 'desc' ? b.temp - a.temp : a.temp - b.temp;
      });
      setLeaderboardData(sorted);
  };

  return (
    <div className="card" style={{ maxWidth: '1000px', margin: '0 auto', borderTop: '4px solid #8b5cf6' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="card-title">
               <Trophy size={28} color="#f59e0b" />
               India States Temperature Leaderboard
            </h2>
            <button 
                onClick={handleSort}
                style={{ 
                    background: 'var(--surface)', 
                    border: '1px solid var(--border)', 
                    padding: '0.5rem 1rem', 
                    borderRadius: '8px', 
                    color: 'var(--text-main)', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}
            >
                {sortOrder === 'desc' ? <ArrowDown size={16} /> : <ArrowUp size={16} />}
                {sortOrder === 'desc' ? 'Highest First' : 'Lowest First'}
            </button>
        </div>
        <div className="card-content">
            {loading ? (
                <div className="loading-spinner" style={{ margin: '3rem auto' }}></div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {leaderboardData.map((state, index) => {
                        let bgColor = 'var(--surface)';
                        let borderColor = 'var(--border)';
                        if (sortOrder === 'desc') {
                            if (index === 0) { bgColor = 'rgba(239, 68, 68, 0.05)'; borderColor = '#ef4444'; } // Hottest
                            else if (index === leaderboardData.length - 1) { bgColor = 'rgba(59, 130, 246, 0.05)'; borderColor = '#3b82f6'; } // Coldest
                        } else {
                            if (index === 0) { bgColor = 'rgba(59, 130, 246, 0.05)'; borderColor = '#3b82f6'; } // Coldest
                            else if (index === leaderboardData.length - 1) { bgColor = 'rgba(239, 68, 68, 0.05)'; borderColor = '#ef4444'; } // Hottest
                        }

                        return (
                            <div 
                                key={state.name} 
                                style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    background: bgColor,
                                    border: `1px solid ${borderColor}`,
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-muted)', width: '30px' }}>
                                        #{index + 1}
                                    </span>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                       <span style={{ color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: '500' }}>{state.name}</span>
                                       <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                          <Map size={12} /> {state.lat.toFixed(2)}, {state.lon.toFixed(2)}
                                       </span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                                    
                                    {/* 6 Hour Trend Indicator */}
                                    <div style={{ textAlign: 'center', minWidth: '80px', background: 'var(--surface-hover)', padding: '0.5rem 1rem', borderRadius: '8px' }}>
                                       <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>6h Trend</span>
                                       <div style={{ 
                                          display: 'flex', 
                                          alignItems: 'center', 
                                          justifyContent: 'center', 
                                          gap: '0.25rem',
                                          color: state.trend > 0 ? '#ef4444' : state.trend < 0 ? '#3b82f6' : 'var(--text-muted)',
                                          fontWeight: '600'
                                       }}>
                                          {state.trend > 0 ? <TrendingUp size={16} /> : state.trend < 0 ? <TrendingDown size={16} /> : <Minus size={16} />}
                                          <span>{state.trendText}°C</span>
                                       </div>
                                    </div>

                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Humidity</span>
                                        <span style={{ color: 'var(--text-main)', fontWeight: '500' }}>{state.humidity}%</span>
                                    </div>
                                    <div style={{ textAlign: 'right', minWidth: '80px' }}>
                                        <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Temp</span>
                                        <span style={{ 
                                            color: state.temp >= 35 ? '#ef4444' : state.temp <= 15 ? '#3b82f6' : '#10b981', 
                                            fontSize: '1.3rem', 
                                            fontWeight: 'bold' 
                                        }}>
                                            {state.temp}°C
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    </div>
  );
};

export default StateLeaderboard;
