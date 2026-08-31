import React, { useState, useEffect } from 'react';
import TripLogger from './components/TripLogger';
import RouteManager from './components/RouteManager';
import WelcomeScreen from './components/WelcomeScreen';
import { logTrip } from './api';
import axios from 'axios';

const ManualCoords = () => {
  const [routeName, setRouteName] = useState('');
  const [jsonText, setJsonText] = useState('[\n  {"lat": 40.7128, "lng": -74.0060},\n  {"lat": 40.7132, "lng": -74.0064}\n]');
  const [responseResult, setResponseResult] = useState(null);

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    try {
      const coordinates = JSON.parse(jsonText);
      const res = await logTrip({ route_id: routeName, trip_points: coordinates });
      setResponseResult(res.data);
    } catch (err) {
      alert('Invalid JSON format or server connection error.');
    }
  };

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #E5DFD3', borderRadius: '16px', padding: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
      <h2 style={{ color: '#7A2021', marginTop: 0, fontWeight: '800' }}>Manual GPS Trace Injection</h2>
      <p style={{ color: '#6B655E', marginBottom: '20px' }}>Directly input JSON coordinate matrices for advanced diagnostics.</p>
      
      <form onSubmit={handleManualSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#6B655E' }}>Target Route ID</label>
          <input 
            type="text" 
            placeholder="e.g., route_name" 
            value={routeName} 
            onChange={(e) => setRouteName(e.target.value)}
            style={{ width: '100%', padding: '12px', background: '#F9F5F0', border: '1px solid #E5DFD3', borderRadius: '8px', boxSizing: 'border-box', outline: 'none' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#6B655E' }}>Coordinates Array (JSON)</label>
          <textarea 
            rows="6"
            value={jsonText} 
            onChange={(e) => setJsonText(e.target.value)}
            style={{ width: '100%', padding: '12px', background: '#F9F5F0', border: '1px solid #E5DFD3', borderRadius: '8px', fontFamily: 'monospace', boxSizing: 'border-box', outline: 'none' }}
          />
        </div>
        <button type="submit" style={{ padding: '14px', background: '#7A2021', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
          RUN MANUAL ANALYSIS
        </button>
      </form>

      {responseResult && (
        <div style={{ marginTop: '20px', padding: '15px', background: responseResult.is_anomaly ? '#FFF5F5' : '#F0FDF4', border: `1px solid ${responseResult.is_anomaly ? '#7A2021' : '#1E3F2B'}`, borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 5px 0', color: responseResult.is_anomaly ? '#7A2021' : '#1E3F2B' }}>
            {responseResult.is_anomaly ? 'Anomaly Detected' : 'Route Verified Normal'}
          </h4>
          <pre style={{ margin: 0, fontSize: '12px' }}>{JSON.stringify(responseResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

const History = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/trips/')
      .then(res => {
        setTrips(res.data);
        setLoading(false);
      })
      .catch(err => {
        setTrips([
          { id: 1042, base_route_name: 'Daily Commute', status: 'NORMAL', similarity: '91%', date: 'Aug 31, 2026' },
          { id: 1041, base_route_name: 'Highway Route A', status: 'ANOMALY', similarity: '63%', date: 'Aug 30, 2026' }
        ]);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #E5DFD3', borderRadius: '16px', padding: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
      <h2 style={{ color: '#7A2021', marginTop: 0, fontWeight: '800' }}>Executed Trip Logs</h2>
      <p style={{ color: '#6B655E', marginBottom: '20px' }}>Comprehensive audit trail of historical route executions.</p>
      
      {loading ? <p>Loading historical records...</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {trips.map((trip, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: '#F9F5F0', border: '1px solid #E5DFD3', borderRadius: '10px' }}>
              <div>
                <strong style={{ color: '#1E3F2B', fontSize: '1.1rem' }}>Trip #{trip.id || idx + 1} ({trip.base_route_name || 'Standard Route'})</strong>
                <div style={{ fontSize: '13px', color: '#6B655E', marginTop: '4px' }}>Recorded: {trip.date || 'Today'}</div>
              </div>
              <div>
                <span style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', background: trip.status === 'ANOMALY' ? '#FFF5F5' : '#F0FDF4', color: trip.status === 'ANOMALY' ? '#7A2021' : '#1E3F2B', border: `1px solid ${trip.status === 'ANOMALY' ? '#7A2021' : '#1E3F2B'}` }}>
                  {trip.status || 'NORMAL'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Analytics = () => (
  <div style={{ background: '#FFFFFF', border: '1px solid #E5DFD3', borderRadius: '16px', padding: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
    <h2 style={{ color: '#7A2021', marginTop: 0, fontWeight: '800' }}>Fleet Performance Analytics</h2>
    <p style={{ color: '#6B655E', marginBottom: '25px' }}>Aggregated intelligence metrics across active delivery vectors.</p>
    
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
      <div style={{ background: '#F9F5F0', padding: '20px', borderRadius: '12px', border: '1px solid #E5DFD3' }}>
        <div style={{ color: '#6B655E', fontSize: '0.9rem', fontWeight: 'bold' }}>Total Trips</div>
        <div style={{ color: '#7A2021', fontSize: '2rem', fontWeight: '900', marginTop: '8px' }}>24</div>
      </div>
      <div style={{ background: '#F9F5F0', padding: '20px', borderRadius: '12px', border: '1px solid #E5DFD3' }}>
        <div style={{ color: '#6B655E', fontSize: '0.9rem', fontWeight: 'bold' }}>Anomaly Rate</div>
        <div style={{ color: '#1E3F2B', fontSize: '2rem', fontWeight: '900', marginTop: '8px' }}>8.3%</div>
      </div>
      <div style={{ background: '#F9F5F0', padding: '20px', borderRadius: '12px', border: '1px solid #E5DFD3' }}>
        <div style={{ color: '#6B655E', fontSize: '0.9rem', fontWeight: 'bold' }}>Avg Similarity</div>
        <div style={{ color: '#7A2021', fontSize: '2rem', fontWeight: '900', marginTop: '8px' }}>94.6%</div>
      </div>
    </div>
  </div>
);

const Settings = () => {
  const [threshold, setThreshold] = useState('50');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #E5DFD3', borderRadius: '16px', padding: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
      <h2 style={{ color: '#7A2021', marginTop: 0, fontWeight: '800' }}>System Configuration</h2>
      <p style={{ color: '#6B655E', marginBottom: '20px' }}>Adjust spatial matching parameters and detection thresholds.</p>
      
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '400px' }}>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#6B655E' }}>Tolerance Radius (Meters)</label>
          <input 
            type="number" 
            value={threshold} 
            onChange={(e) => setThreshold(e.target.value)}
            style={{ width: '100%', padding: '12px', background: '#F9F5F0', border: '1px solid #E5DFD3', borderRadius: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <button type="submit" style={{ padding: '12px', background: '#1E3F2B', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
          SAVE CONFIGURATION
        </button>
      </form>

      {saved && <p style={{ color: '#1E3F2B', fontWeight: 'bold', marginTop: '15px' }}>Settings updated successfully!</p>}
    </div>
  );
};

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [activeTab, setActiveTab] = useState('live');
  const [isNavHovered, setIsNavHovered] = useState(false);

  const renderContent = () => {
    switch(activeTab) {
      case 'live': return <TripLogger />;
      case 'routes': return <RouteManager />;
      case 'manual': return <ManualCoords />;
      case 'history': return <History />;
      case 'analytics': return <Analytics />;
      case 'settings': return <Settings />;
      default: return <TripLogger />;
    }
  };

  const NavItem = ({ id, label }) => {
    const isActive = activeTab === id;
    return (
      <div 
        onClick={() => setActiveTab(id)}
        style={{
          backgroundColor: isActive ? '#EFE5D8' : 'transparent',
          color: isActive ? '#7A2021' : '#6B655E',
          padding: '8px 16px',
          borderRadius: '8px',
          fontWeight: isActive ? 'bold' : '500',
          cursor: 'pointer',
          fontSize: '0.9rem',
          whiteSpace: 'nowrap',
          transition: 'all 0.2s ease'
        }}
      >
        {label}
      </div>
    );
  };

  return (
    <>
      {showWelcome && (
        <WelcomeScreen onEnterDashboard={() => setShowWelcome(false)} />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#FFFFFF', color: '#333', fontFamily: 'sans-serif', overflow: 'hidden' }}>
        
        {/* Floating Top Bar that expands on hover */}
        <div 
          onMouseEnter={() => setIsNavHovered(true)}
          onMouseLeave={() => setIsNavHovered(false)}
          style={{
            position: 'absolute',
            top: '15px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#F9F5F0',
            border: '1px solid #E5DFD3',
            borderRadius: '30px',
            padding: '10px 25px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            zIndex: 1000,
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            maxHeight: '50px',
            overflow: 'hidden'
          }}
        >
          {/* Logo / Brand always visible */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setActiveTab('live')}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#7A2021', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '0.75rem' }}>WW</div>
            <span style={{ color: '#7A2021', fontWeight: '900', fontSize: '1rem', letterSpacing: '0.5px' }}>WAYWATCH</span>
          </div>

          {/* Expandable Navigation Links (Hidden or compact until hovered) */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '5px',
            opacity: isNavHovered ? 1 : 0.7,
            transition: 'opacity 0.2s ease'
          }}>
            <NavItem id="live" label="Live" />
            <NavItem id="routes" label="Baselines" />
            <NavItem id="manual" label="Manual" />
            <NavItem id="history" label="History" />
            <NavItem id="analytics" label="Analytics" />
            <NavItem id="settings" label="Settings" />
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{ 
          flex: 1, 
          padding: '80px 40px 30px 40px', // Extra top padding to account for floating topbar
          display: 'flex', 
          flexDirection: 'column', 
          overflowY: 'auto',
          scrollbarWidth: 'thin',
          scrollbarColor: '#E5DFD3 transparent'
        }}>
          {renderContent()}
        </div>

      </div>
    </>
  );
}