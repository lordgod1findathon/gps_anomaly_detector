import React, { useState, useEffect } from 'react';
import RouteManager from './components/RouteManager';
import TripLogger from './components/TripLogger';
import { fetchDashboard } from './api';

function App() {
    const [trips, setTrips] = useState([]);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            const res = await fetchDashboard();
            setTrips(res.data.recent_trips);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '900px', margin: '0 auto' }}>
            <h1 style={{textAlign: 'center', marginBottom: '40px'}}>GPS Deviation & Anomaly Detector</h1>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
                <RouteManager />
                <TripLogger />
            </div>

            <div style={{borderTop: '2px solid #eee', paddingTop: '20px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <h2>Recent Logs</h2>
                    <button onClick={loadDashboard} style={{padding: '8px 16px', cursor:'pointer'}}>Refresh Logs</button>
                </div>
                
                <ul style={{listStyle: 'none', padding: 0}}>
                    {trips.length === 0 && <p>No trips logged yet.</p>}
                    {trips.map((trip, index) => (
                        <li key={index} style={{padding: '12px', borderBottom: '1px solid #eee'}}>
                            <strong>{trip.base_route_name}</strong>: 
                            {trip.is_anomaly ? <span style={{color:'red'}}> 🔴 Anomaly</span> : <span style={{color:'green'}}> 🟢 Normal</span>} 
                            <span style={{color: '#666', float: 'right'}}> {new Date(trip.logged_at).toLocaleString()}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default App;
