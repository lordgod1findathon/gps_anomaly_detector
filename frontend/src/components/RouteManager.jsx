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
      await saveBaseRoute({ route_id: routeId, points });
      setStatus('BASELINE PATTERN COMMITTED SUCCESSFULLY');
      setTimeout(() => setStatus(null), 4000);
    } catch (error) {
      console.error(error);
      setStatus('ERROR COMMITTING BASELINE');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div style={{ background: '#FFFFFF', padding: '30px 35px', border: '1px solid #111', borderRadius: '16px' }}>
        <h2 style={{ color: '#111', marginTop: 0, fontSize: '1.6rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '-0.5px' }}>
          Baseline Route Registry
        </h2>
        <p style={{ color: '#666', margin: '5px 0 0 0', fontSize: '0.95rem' }}>Establish normative spatial corridors for recurring journeys and automated deviation auditing.</p>
      </div>

      <div style={{ background: '#FFFFFF', border: '1px solid #111', borderRadius: '16px', padding: '40px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#111', fontWeight: '700', fontSize: '0.8rem', letterSpacing: '1px' }}>ROUTE IDENTIFIER (ROUTE_ID)</label>
              <input
                type="text"
                placeholder="e.g., sector_7_dispatch"
                value={routeId}
                onChange={(e) => setRouteId(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', padding: '14px', backgroundColor: '#FAFAFA', color: '#111', border: '1px solid #ddd', outline: 'none', fontWeight: '600' }}
              />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#111', fontWeight: '700', fontSize: '0.8rem', letterSpacing: '1px' }}>TRACE BASELINE CORRIDOR ON MAP</label>
            <MapPicker points={points} setPoints={setPoints} isInteractive={true} />
          </div>

          <button
            type="submit"
            style={{ padding: '16px', cursor: 'pointer', backgroundColor: '#111', color: '#fff', border: 'none', fontWeight: '700', fontSize: '0.9rem', letterSpacing: '1.5px', textTransform: 'uppercase' }}
          >
            COMMIT BASELINE PATTERN
          </button>
        </form>

        {status && (
          <div style={{ marginTop: '20px', textAlign: 'center', fontWeight: '700', padding: '15px', borderRadius: '4px', backgroundColor: '#FAFAFA', border: '1px solid #111', color: '#111', letterSpacing: '1px', fontSize: '0.85rem' }}>
            {status}
          </div>
        )}
      </div>
    </div>
  );
}