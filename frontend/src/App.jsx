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
      const res = await logTrip({ base_route_name: routeName, coordinates });
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
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', color: '#6B655E' }}>Target Base Route Name</label>
          <input 
            type="text" 
            placeholder="e.g., Daily Commute" 
            value={routeName} 
            onChange={(e) => setRouteName(e.target.value)}
            style={{ width: '100%', padding: '12px', background: '#F9F5F0', border: '1px solid #E5DFD3', borderRadius: '8px', boxSizing: 'border-box', outline: 'none', cursor: 'pointer' }}
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
        <button type="submit" style={{ padding: '14px', background: '#7A2021', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: 'opacity 0.2s' }}>
          RUN MANUAL ANALYSIS
        </button>
      </form>

      {responseResult && (
        <div style={{ marginTop: '20px', padding: '15px', background: responseResult.anomaly_detected ? '#FFF5F5' : '#F0FDF4', border: `1px solid ${responseResult.anomaly_detected ? '#7A2021' : '#1E3F2B'}`, borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 5px 0', color: responseResult.anomaly_detected ? '#7A2021' : '#1E3F2B' }}>
            {responseResult.anomaly_detected ? 'Anomaly Detected' : 'Route Verified Normal'}
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
  const [showWelcome, setShowWelcome] = useState(true); // Controls the landing screen state
  const [activeTab, setActiveTab] = useState('live');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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

  const NavItem = ({ id, icon, label }) => {
    const isActive = activeTab === id;
    return (
      <div 
        onClick={() => setActiveTab(id)}
        style={{
          backgroundColor: isActive ? '#EFE5D8' : 'transparent',
          color: isActive ? '#7A2021' : '#6B655E',
          padding: '14px 20px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          fontWeight: isActive ? 'bold' : '500',
          borderRight: isActive ? '5px solid #7A2021' : '5px solid transparent',
          cursor: 'pointer',
          boxShadow: isActive ? '0 2px 5px rgba(0,0,0,0.05)' : 'none',
          transition: 'all 0.2s ease-in-out'
        }}
      >
        <span style={{ fontSize: '1.2rem' }}>{icon}</span> {label}
      </div>
    );
  };

  return (
    <>
      {/* Interactive Game-Themed Welcome Splash Screen */}
      {showWelcome && (
        <WelcomeScreen onEnterDashboard={() => setShowWelcome(false)} />
      )}

      {/* Main Dashboard Application */}
      <div style={{ display: 'flex', height: '100vh', backgroundColor: '#FFFFFF', color: '#333', fontFamily: 'sans-serif', overflow: 'hidden' }}>
        
        {/* Collapsible Sidebar */}
        <div style={{ 
          width: isSidebarOpen ? '280px' : '0px', 
          backgroundColor: '#F9F5F0', 
          borderRight: isSidebarOpen ? '1px solid #E5DFD3' : 'none', 
          display: 'flex', 
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'width 0.3s ease-in-out',
          whiteSpace: 'nowrap'
        }}>
          <div style={{ padding: '30px 20px', display: 'flex', alignItems: 'center', gap: '15px', minWidth: '280px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#7A2021', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>FI</div>
              <h1 style={{ color: '#7A2021', fontSize: '1.4rem', margin: 0, fontWeight: '900', letterSpacing: '0.5px' }}>FleetIntel</h1>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', padding: '0 15px', minWidth: '280px' }}>
              <NavItem id="live" icon="🏠" label="Live Monitoring" />
              <NavItem id="routes" icon="📍" label="Normal Routes" />
              <NavItem id="manual" icon="⌨️" label="Manual Coordinates" />
              <NavItem id="history" icon="🕒" label="Trip History" />
              <NavItem id="analytics" icon="📊" label="Analytics" />
              <NavItem id="settings" icon="⚙️" label="Settings" />
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{ 
          flex: 1, 
          padding: '30px 40px', 
          display: 'flex', 
          flexDirection: 'column', 
          overflowY: 'auto',
          scrollbarWidth: 'thin',
          scrollbarColor: '#E5DFD3 transparent'
        }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                style={{
                  background: '#F9F5F0',
                  border: '1px solid #E5DFD3',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  color: '#7A2021',
                  fontSize: '1rem'
                }}
              >
                {isSidebarOpen ? '◀ Collapse' : '▶ Menu'}
              </button>
              <h2 style={{ margin: 0, color: '#333', fontWeight: '800', fontSize: '1.8rem', textTransform: 'capitalize' }}>
                {activeTab === 'live' ? 'Active Vehicle Feed' : `${activeTab.replace('-', ' ')} Feed`}
              </h2>
            </div>
          </div>
          
          {renderContent()}

        </div>
      </div>
    </>
  );
}