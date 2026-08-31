import React, { useState } from 'react';
import { saveBaseRoute } from '../api';
import MapPicker from './MapPicker';

export default function RouteManager() {
  const [routeId, setRouteId] = useState('');
  const [points, setPoints] = useState([]);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!routeId.trim()) return alert('Please enter a route ID!');
    if (points.length < 2) return alert('Click at least 2 points on the map to define a route!');

    try {
      // Payload matches backend contract: { route_id, points }
      await saveBaseRoute({ route_id: routeId, points });
      setStatus('BASE ROUTE SAVED SUCCESSFULLY ✅');
      setTimeout(() => setStatus(null), 4000);
    } catch (error) {
      console.error(error);
      setStatus('ERROR SAVING ROUTE ❌');
    }
  };

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #E5DFD3', borderRadius: '16px', padding: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
      <h2 style={{ color: '#7A2021', marginTop: 0, fontSize: '1.4rem', fontWeight: '800' }}>
        Step 1: Establish Normal Baseline Route
      </h2>
      <p style={{ color: '#6B655E', marginBottom: '20px' }}>Save your baseline route here to compare future trips against.</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#6B655E', fontWeight: 'bold', fontSize: '0.9rem' }}>Route Identifier (route_id)</label>
            <input
              type="text"
              placeholder="e.g., route_name"
              value={routeId}
              onChange={(e) => setRouteId(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', padding: '14px', backgroundColor: '#F9F5F0', color: '#333', border: '1px solid #E5DFD3', borderRadius: '8px', fontSize: '1rem', outline: 'none' }}
            />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: '#6B655E', fontWeight: 'bold', fontSize: '0.9rem' }}>Trace Baseline Route on Map</label>
          <MapPicker points={points} setPoints={setPoints} lineColor="#1E3F2B" />
        </div>

        <button
          type="submit"
          style={{ padding: '16px', cursor: 'pointer', backgroundColor: '#7A2021', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', letterSpacing: '1px', boxShadow: '0 4px 15px rgba(122, 32, 33, 0.2)' }}
        >
          SAVE BASELINE PATTERN
        </button>
      </form>

      {status && (
        <div style={{ marginTop: '20px', textAlign: 'center', fontWeight: 'bold', padding: '15px', borderRadius: '8px', backgroundColor: status.includes('✅') ? '#F0FDF4' : '#FFF5F5', color: status.includes('✅') ? '#1E3F2B' : '#7A2021' }}>
          {status}
        </div>
      )}
    </div>
  );
}