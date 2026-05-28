import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GlobalHeatmap from './components/GlobalHeatmap';
import TimeSeriesPlot from './components/TimeSeriesPlot';
import Sidebar from './components/Sidebar';
import AnomaliesView from './components/AnomaliesView';
import ForecastView from './components/ForecastView';
import AIPredictionView from './components/AIPredictionView';
import ClimatePeriodView from './components/ClimatePeriodView';
import GlobalMapView from './components/GlobalMapView';
import ClimateStoriesView from './components/ClimateStoriesView';
import ClimateNarrativeView from './components/ClimateNarrativeView';
import ClimateReportView from './components/ClimateReportView';
import LiveDashboard from './components/LiveDashboard';
import StateLeaderboard from './components/StateLeaderboard';
import HomeView from './components/HomeView';
import ClimateServicesView from './components/ClimateServicesView';
import LstmForecastView from './components/LstmForecastView';
import FutureTrendDashboard from './components/FutureTrendDashboard';
import LoadingScreen from './components/LoadingScreen';
import StructureView from './components/StructureView';
import AboutView from './components/AboutView';
import { Globe, RefreshCw, BarChart2, Activity, FileText, Layers, Briefcase, Info } from 'lucide-react';
import config from './config';
import './index.css';

const API_BASE_URL = config.API_BASE_URL;

const stateCoordinates = {
  "Andhra Pradesh": { lat: 16.5062, lon: 80.6480 },
  "Gujarat": { lat: 22.2587, lon: 71.1924 },
  "Delhi": { lat: 28.7041, lon: 77.1025 },
  "Maharashtra": { lat: 19.7515, lon: 75.7139 },
  "Karnataka": { lat: 15.3173, lon: 75.7139 }
};

function App() {
  const [appLoading, setAppLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [heatmapData, setHeatmapData] = useState(null);
  const [heatmapLoading, setHeatmapLoading] = useState(true);
  const [heatmapError, setHeatmapError] = useState(null);
  const [heatmapTimeIndex, setHeatmapTimeIndex] = useState(0);
  const [region, setRegion] = useState('global');
  const [variable, setVariable] = useState('temperature');
  const [subRegion, setSubRegion] = useState(''); // e.g., State in India
  const [city, setCity] = useState('');           // e.g., City in India
  
  const [currentView, setCurrentView] = useState('home'); // Default to home view
  const [currentLocation, setCurrentLocation] = useState(null); // Used by LiveDashboard and AI Alarm
  const [customLocation, setCustomLocation] = useState(null);
  const [localTemp, setLocalTemp] = useState(undefined);

  const [tsData, setTsData] = useState(null);
  const [tsLoading, setTsLoading] = useState(true);
  const [tsError, setTsError] = useState(null);
  
  const [metadata, setMetadata] = useState(null);
  const [reports, setReports] = useState([]);
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (newTheme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  const generateReport = (start, end) => {
    const newReport = {
      id: Date.now(),
      title: `Analysis Report: ${start} - ${end}`,
      category: "AI Analysis",
      icon: Activity,
      color: "#8b5cf6",
      date: new Date().toLocaleDateString(),
      content: `A comprehensive AI-driven analysis for the period ${start} to ${end}. Global temperature data suggests a significant trend of ${end > start ? 'warming' : 'shift'}. This period saw major climatic shifts with an average variance of 1.2°C compared to pre-industrial baselines. Predicted outcomes for continuing this trend include increased extreme weather events and rising sea levels.`,
      stat: `${((end - start) * 0.03).toFixed(1)}°C`,
      statLabel: "Projected Rise"
    };
    setReports(prev => [newReport, ...prev]);
    setCurrentView('climate_report');
  };

  const [startYear, setStartYear] = useState(2000);
  const [endYear, setEndYear] = useState(2055);

  const fetchHeatmapData = async (index, currentRegion, currentVar) => {
    setHeatmapLoading(true);
    setHeatmapError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/heatmap`, {
        params: { time_index: index, region: currentRegion, variable: currentVar }
      });
      setHeatmapData(response.data);
    } catch (err) {
      console.warn("Backend heatmap API failed, falling back to simulated data", err);
      // Fallback heatmap data (Step 9)
      const mockZ = [];
      const mockX = Array.from({length: 90}, (_, i) => -180 + i * 4);
      const mockY = Array.from({length: 45}, (_, i) => -90 + i * 4);
      for (let lat of mockY) {
        const row = [];
        for (let lon of mockX) {
          const base = 25 - Math.abs(lat) * 0.3 + (Math.sin(lon / 10) * 2);
          row.push(Number((base + index * 0.1).toFixed(1)));
        }
        mockZ.push(row);
      }
      setHeatmapData({
        z: mockZ,
        x: mockX,
        y: mockY,
        time: new Date(2020, 0, 1 + index * 30).toISOString().split('T')[0]
      });
    } finally {
      setHeatmapLoading(false);
    }
  };

  const fetchTimeSeriesData = async (currentRegion, currentVar) => {
    setTsLoading(true);
    setTsError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/timeseries`, {
        params: { region: currentRegion, variable: currentVar }
      });
      setTsData(response.data);
    } catch (err) {
      console.warn("Backend timeseries API failed, falling back to simulated data", err);
      // Fallback timeseries data (Step 9)
      const mockX = [];
      const mockY = [];
      const mockRecords = [];
      const start = new Date(2020, 0, 1);
      for (let i = 0; i < 365; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];
        const baseVal = currentVar === 'precipitation' ? 2.0 : currentVar === 'humidity' ? 60 : 25;
        const val = Number((baseVal + Math.sin(i / 10) * 5 + Math.random() * 2).toFixed(1));
        mockX.push(dateStr);
        mockY.push(val);
        mockRecords.push({
          date: dateStr,
          temperature: currentVar === 'temperature' ? val : 25,
          humidity: currentVar === 'humidity' ? val : 60,
          rainfall: currentVar === 'precipitation' ? val : 2.0
        });
      }
      setTsData({
        x: mockX,
        y: mockY,
        records: mockRecords,
        region: currentRegion
      });
    } finally {
      setTsLoading(false);
    }
  };

  useEffect(() => {
    // Cinematic Transition Sequence
    const loadingTimer = setTimeout(() => {
      setIsExiting(true); // Start Earth glow and fade out
      
      const exitTimer = setTimeout(() => {
        setAppLoading(false); // Remove loader and show dashboard
      }, 1000); // Wait for exit animation to complete

      return () => clearTimeout(exitTimer);
    }, 4500); // Original loading duration

    return () => clearTimeout(loadingTimer);
  }, []);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/metadata`);
        setMetadata(res.data);
      } catch (err) {
        console.error("Error fetching metadata", err);
      }
    };
    fetchMetadata();
  }, []);

  useEffect(() => {
    fetchHeatmapData(heatmapTimeIndex, region, variable);
  }, [heatmapTimeIndex, region, variable]);

  useEffect(() => {
    fetchTimeSeriesData(region, variable);
  }, [region, variable]);

  useEffect(() => {
    // Keep localTemp updated for the Sidebar AI Alarm whenever currentLocation changes
    const fetchLocalTempForAlarm = async () => {
       if (currentLocation && currentLocation.name !== 'Locating...') {
          try {
             const res = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${currentLocation.lat}&longitude=${currentLocation.lon}&current=temperature_2m`);
             setLocalTemp(res.data.current.temperature_2m);
          } catch(e) {
             console.error('Failed to get temp for alarm');
          }
       }
    };
    fetchLocalTempForAlarm();
  }, [currentLocation]);

  const handleNextTime = () => {
    // Assuming 12 timesteps based on demo data.
    setHeatmapTimeIndex(prev => (prev + 1) % 12);
  };

  if (appLoading) {
    return <LoadingScreen isExiting={isExiting} />;
  }

  return (
    <div className="app-layout">
      <Sidebar 
        metadata={metadata}
        timeIndex={heatmapTimeIndex} 
        onTimeIndexChange={setHeatmapTimeIndex}
        region={region}
        onRegionChange={(newRegion) => {
           setRegion(newRegion);
           setSubRegion('');
           setCity('');
        }}
        variable={variable}
        onVariableChange={setVariable}
        subRegion={subRegion}
        onSubRegionChange={async (newSub) => {
           setSubRegion(newSub);
           setCity('');
           if (newSub && newSub !== '') {
               const stateName = Object.keys(stateCoordinates).find(
                   key => key.toLowerCase() === newSub.toLowerCase()
               ) || newSub;
               const coords = stateCoordinates[stateName] || { lat: 20.59, lon: 78.96 };
               
               setCustomLocation({
                   lat: coords.lat,
                   lon: coords.lon,
                   name: `${stateName}, India`
               });
               
               setTsLoading(true);
               setTsError(null);
               try {
                   const res = await axios.get(`${API_BASE_URL}/climate`, {
                       params: { lat: coords.lat, lon: coords.lon }
                   });
                   const records = res.data.timeseries || [];
                   const formattedTs = {
                       x: records.map(r => r.date),
                       y: records.map(r => {
                           if (variable === 'precipitation') return r.rainfall;
                           if (variable === 'humidity') return r.humidity;
                           return r.temperature;
                       }),
                       records: records,
                       region: stateName
                   };
                   setTsData(formattedTs);
               } catch (err) {
                   console.error("Error fetching climate data for subregion:", err);
                   const mockX = [];
                   const mockY = [];
                   const mockRecords = [];
                   const start = new Date(2020, 0, 1);
                   for (let i = 0; i < 365; i++) {
                       const d = new Date(start);
                       d.setDate(start.getDate() + i);
                       const dateStr = d.toISOString().split('T')[0];
                       const baseVal = variable === 'precipitation' ? 2.0 : variable === 'humidity' ? 60 : 25;
                       const val = Number((baseVal + Math.sin(i / 10) * 5 + Math.random() * 2).toFixed(1));
                       mockX.push(dateStr);
                       mockY.push(val);
                       mockRecords.push({
                           date: dateStr,
                           temperature: variable === 'temperature' ? val : 25,
                           humidity: variable === 'humidity' ? val : 60,
                           rainfall: variable === 'precipitation' ? val : 2.0
                       });
                   }
                   setTsData({
                       x: mockX,
                       y: mockY,
                       records: mockRecords,
                       region: stateName
                   });
               } finally {
                   setTsLoading(false);
               }
           }
        }}
        city={city}
        onCityChange={(newCity) => {
           setCity(newCity);
           if (region === 'india' && newCity && newCity !== '') {
               // When city is selected, we fetch its coords (Mock geocode mapping)
               // For demo purposes, we will mock these:
               const mockCoords = {
                   'mumbai': {lat: 19.0760, lon: 72.8777, name: 'Mumbai, India'},
                   'pune': {lat: 18.5204, lon: 73.8567, name: 'Pune, India'},
                   'new_delhi': {lat: 28.6139, lon: 77.2090, name: 'New Delhi, India'},
                   'bengaluru': {lat: 12.9716, lon: 77.5946, name: 'Bengaluru, India'},
                   'mysuru': {lat: 12.2958, lon: 76.6394, name: 'Mysuru, India'}
               };
               if (mockCoords[newCity]) {
                   setCustomLocation(mockCoords[newCity]);
                   setCurrentView('live'); // auto switch to live view to see the changed custom location
               } else {
                   setCustomLocation(null);
               }
           } else {
               setCustomLocation(null);
           }
        }}
        startYear={startYear}
        onStartYearChange={setStartYear}
        endYear={endYear}
        onEndYearChange={setEndYear}
        currentView={currentView}
        onViewChange={setCurrentView}
        onAnalyze={() => {
          fetchHeatmapData(heatmapTimeIndex, region, variable);
          fetchTimeSeriesData(region, variable);
          setCurrentView('globalmap');
        }}
        localTemp={localTemp}
        onGenerateReport={generateReport}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <div className="dashboard-container main-content">
        {currentView !== 'home' && (
          <header className="header">
            <div>
              <h1 className="header-title">
                <Globe size={32} color="#3b82f6" />
                Green Earth Dashboard
              </h1>
              <p className="header-subtitle">Real-time Climate Data Visualization & Analysis</p>
            </div>
            <button 
              className="button"
              onClick={() => {
                fetchHeatmapData(heatmapTimeIndex, region, variable);
                fetchTimeSeriesData(region, variable);
              }}
            >
              <RefreshCw size={18} />
              Refresh Data
            </button>
          </header>
        )}

      {currentView === 'home' && (
        <HomeView onExplore={() => setCurrentView('live')} theme={theme} onToggleTheme={toggleTheme} />
      )}

      {currentView === 'live' && (
        <LiveDashboard currentLocation={currentLocation} setCurrentLocation={setCurrentLocation} customLocation={customLocation} startYear={startYear} endYear={endYear} />
      )}

      {currentView === 'structure' && (
        <StructureView />
      )}

      {currentView === 'services' && (
        <ClimateServicesView />
      )}

      {currentView === 'leaderboard' && (
        <StateLeaderboard />
      )}

      {currentView === 'dashboard' && (
        <div className="grid-layout">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                <Activity size={24} color="#10b981" />
                Global Temperature Distribution
              </h2>
            </div>
            <GlobalHeatmap 
              data={heatmapData} 
              loading={heatmapLoading} 
              error={heatmapError} 
              time={heatmapData?.time}
              variable={variable}
            />
          </div>
          
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                <BarChart2 size={24} color="#f59e0b" />
                Global Mean Temperature Trend
              </h2>
            </div>
            <TimeSeriesPlot 
              data={tsData} 
              loading={tsLoading} 
              error={tsError} 
              variable={variable}
            />
          </div>
        </div>
      )}

      {currentView === 'insights' && (
        <InsightsView tsData={tsData} tsLoading={tsLoading} tsError={tsError} />
      )}

      {currentView === 'anomalies' && (
        <AnomaliesView tsData={tsData} />
      )}

      {currentView === 'forecast' && (
        <ForecastView tsData={tsData} />
      )}

      {currentView === 'ai_isolation' && (
        <AIPredictionView modelType="isolation" tsData={tsData} />
      )}
      {currentView === 'ai_lstm' && (
        <LstmForecastView tsData={tsData} />
      )}
      {currentView === 'ai_linear' && (
        <FutureTrendDashboard />
      )}

      {currentView === 'periods' && (
        <ClimatePeriodView 
          onStartYearChange={setStartYear}
          onEndYearChange={setEndYear}
          onGenerateReport={generateReport}
        />
      )}

      {currentView === 'globalmap' && (
        <GlobalMapView 
          data={heatmapData} 
          loading={heatmapLoading} 
          error={heatmapError} 
          time={heatmapData?.time}
          region={region}
          variable={variable}
        />
      )}

      {currentView === 'stories' && (
        <ClimateStoriesView 
          customReports={reports} 
          onStartYearChange={setStartYear}
          onEndYearChange={setEndYear}
          onGenerateReport={generateReport}
        />
      )}

      {currentView === 'climate_stories' && (
        <ClimateNarrativeView 
          customReports={reports} 
          onStartYearChange={setStartYear}
          onEndYearChange={setEndYear}
          onGenerateReport={generateReport}
        />
      )}

      {currentView === 'climate_report' && (
        <ClimateReportView startYear={startYear} endYear={endYear} />
      )}

      {currentView === 'about' && (
        <AboutView />
      )}
      
      </div>
    </div>
  );
}

export default App;
