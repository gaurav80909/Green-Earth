import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Globe2, MapPin, X, Wind, Droplets, Thermometer } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import LeafletHeatmap from './LeafletHeatmap';

// Fix for default Leaflet marker icon in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Child component to handle map clicks
const MapEvents = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

// Child component to update view based on region
const MapViewController = ({ region }) => {
  const map = useMap();
  useEffect(() => {
    if (region === 'india') {
      map.setView([20.5937, 78.9629], 5);
    } else if (region === 'america') {
      map.setView([38, -97], 4);
    } else if (region === 'europe') {
      map.setView([51, 15], 4);
    } else {
      map.setView([20, 0], 2);
    }
  }, [region, map]);
  return null;
};

const GlobalMapView = ({ data, loading, error, time, region, variable = 'temperature' }) => {
  const [mapStyle, setMapStyle] = useState('natural earth');
  const [mapMode, setMapMode] = useState('heatmap'); // 'heatmap' or 'cityClick'
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  const fetchRealWeather = async (lat, lon) => {
    setWeatherLoading(true);
    try {
      // Reverse geocoding for name
      const reverseRes = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      const locName = reverseRes.data.address?.city || reverseRes.data.address?.town || reverseRes.data.address?.village || reverseRes.data.address?.state || reverseRes.data.address?.country || "Unknown Location";

      // Open-Meteo API (Free, no key required)
      const res = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`);
      if (res.data && res.data.current) {
        setSelectedLocation({
          name: locName,
          lat: lat.toFixed(2),
          lon: lon.toFixed(2),
          temp: res.data.current.temperature_2m,
          humidity: res.data.current.relative_humidity_2m,
          wind: res.data.current.wind_speed_10m
        });
      }
    } catch (err) {
      console.error("Error fetching weather:", err);
    } finally {
      setWeatherLoading(false);
    }
  };

  const handleMapClick = (lat, lon) => {
    fetchRealWeather(lat, lon);
  };

  if (loading) {
    return (
      <div className="card">
        <div className="card-header">
          <h2 className="card-title"><Globe2 size={24} color="#3b82f6" /> Interactive Global Map</h2>
        </div>
        <div className="card-content"><div className="loading-spinner"></div></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="card">
        <div className="card-header">
          <h2 className="card-title"><Globe2 size={24} color="#3b82f6" /> Interactive Global Map</h2>
        </div>
        <div className="card-content"><div className="error-message">Failed to load map data.</div></div>
      </div>
    );
  }

  return (
    <div className="grid-layout">
      <div className="card" style={{ gridColumn: '1 / -1' }}>
        <div className="card-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
          <h2 className="card-title">
            <Globe2 size={24} color="#3b82f6" />
            Interactive Global Map
          </h2>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
              <button 
                style={{ padding: '0.4rem 0.8rem', cursor: 'pointer', border: 'none', background: mapMode === 'heatmap' ? 'var(--primary)' : 'var(--surface-hover)', color: mapMode === 'heatmap' ? '#fff' : 'var(--text-main)' }}
                onClick={() => setMapMode('heatmap')}
              >
                Heatmap Data
              </button>
              <button 
                style={{ padding: '0.4rem 0.8rem', cursor: 'pointer', border: 'none', borderLeft: '1px solid var(--border)', background: mapMode === 'cityClick' ? 'var(--primary)' : 'var(--surface-hover)', color: mapMode === 'cityClick' ? '#fff' : 'var(--text-main)' }}
                onClick={() => setMapMode('cityClick')}
              >
                City Click Mode
              </button>
            </div>
          </div>
        </div>
        <div style={{ padding: '0 1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Date: {new Date(time).toLocaleDateString()}</span>
          <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{mapMode === 'cityClick' ? 'Click anywhere on the map to fetch real-time local weather!' : 'Viewing Global Heatmap Data'}</span>
        </div>

        <div className="card-content" style={{ minHeight: '600px', padding: 0, position: 'relative', overflow: 'hidden', borderRadius: '0 0 12px 12px' }}>
          
          {selectedLocation && (
            <div style={{
              position: 'absolute', top: '20px', right: '20px', zIndex: 1000,
              background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(12px)',
              border: '1px solid var(--primary)', borderRadius: '12px',
              padding: '1.5rem', width: '280px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
                   <MapPin size={18} />
                   <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-main)' }}>{selectedLocation.name}</h3>
                 </div>
                 <button onClick={() => setSelectedLocation(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                   <X size={18} />
                 </button>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Lat: {selectedLocation.lat}°, Lon: {selectedLocation.lon}°
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444' }}>
                    <Thermometer size={18} /> <span>Temperature</span>
                  </div>
                  <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--text-main)' }}>{selectedLocation.temp} °C</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#3b82f6' }}>
                    <Droplets size={18} /> <span>Humidity</span>
                  </div>
                  <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--text-main)' }}>{selectedLocation.humidity} %</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
                    <Wind size={18} /> <span>Wind Speed</span>
                  </div>
                  <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--text-main)' }}>{selectedLocation.wind} km/h</span>
                </div>
              </div>
            </div>
          )}

          {weatherLoading && (
            <div style={{
              position: 'absolute', top: '20px', right: '20px', zIndex: 1000,
              background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(12px)',
              border: '1px solid var(--border)', borderRadius: '12px',
              padding: '1.5rem', width: '280px', display: 'flex', justifyContent: 'center'
            }}>
              <div className="loading-spinner" style={{ width: '24px', height: '24px' }}></div>
            </div>
          )}

          <MapContainer 
            center={[20, 0]} 
            zoom={2} 
            minZoom={2}
            maxBounds={[[-90, -180], [90, 180]]}
            maxBoundsViscosity={1.0}
            style={{ height: '600px', width: '100%', zIndex: 1, backgroundColor: '#aad3df' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              noWrap={true}
              bounds={[[-90, -180], [90, 180]]}
            />
            
            <MapViewController region={region} />
            <MapEvents onMapClick={handleMapClick} />
            
            {mapMode === 'heatmap' && data && (
                <LeafletHeatmap data={data} variable={variable} />
            )}

            {selectedLocation && (
                <Marker position={[selectedLocation.lat, selectedLocation.lon]}>
                    <Popup>
                        <strong>{selectedLocation.name}</strong><br/>
                        Temp: {selectedLocation.temp}°C
                    </Popup>
                </Marker>
            )}
          </MapContainer>
          
          {mapMode === 'heatmap' && (
             <div style={{
                position: 'absolute', bottom: '20px', left: '20px', zIndex: 1000,
                background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(12px)',
                border: '1px solid var(--border)', borderRadius: '8px',
                padding: '1rem', width: '300px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
             }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                   {variable === 'precipitation' ? 'Precipitation Intensity' : 'Temperature (°C)'}
                </div>
                <div style={{
                   height: '12px', width: '100%', borderRadius: '6px',
                   background: variable === 'precipitation' 
                       ? 'linear-gradient(to right, rgba(255,255,255,0), lightblue, darkblue)'
                       : 'linear-gradient(to right, blue, cyan, lime, yellow, red)'
                }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>
                   <span>{variable === 'precipitation' ? 'Low' : 'Cold (-30°C)'}</span>
                   <span>{variable === 'precipitation' ? 'Medium' : 'Mild (10°C)'}</span>
                   <span>{variable === 'precipitation' ? 'High' : 'Hot (50°C)'}</span>
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalMapView;

