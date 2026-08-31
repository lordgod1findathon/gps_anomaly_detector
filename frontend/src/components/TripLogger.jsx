import React, { useState } from 'react';
import { saveBaseRoute, logTrip } from '../api';
import MapPicker from './MapPicker';

export default function TripLogger() {
  const [step, setStep] = useState(1);
  const [routeId, setRouteId] = useState('');
  const [baselinePoints, setBaselinePoints] = useState([]);
  const [verifyPoints, setVerifyPoints] = useState([]);
  const [result, setResult] = useState(null);
  const [statusMsg, setStatusMsg] = useState('');

  const handleSaveBaseline = async (e) => {
    e.preventDefault();
    if (!routeId.trim()) return alert('Please enter a route ID.');
    if (baselinePoints.length < 2) return alert('Click at least 2 points on the map for the baseline path.');

    try {
      // Matches POST /base-route/
      await saveBaseRoute({ route_id: routeId, points: baselinePoints });
      setStatusMsg('Baseline path locked successfully.');
      setStep(2);
    } catch (err) {
      console.error(err);
      alert('Error saving baseline path to server.');
    }
  };

  const handleAnalyzeTrip = async (e) => {
    e.preventDefault();
    if (verifyPoints.length < 2) return alert('Click at least 2 points on the map for the verification path.');

    try {
      // Matches POST /evaluate/
      const response = await logTrip({ route_id: routeId, trip_points: verifyPoints });
      setResult(response.data);
    } catch (error) {
      console.error(error);
      alert('Failed to analyze verification path.');
    }
  };

  const resetAll = () => {
    setStep(1);
    setRouteId('');
    setBaselinePoints([]);
    setVerifyPoints([]);
    setResult(null);
    setStatusMsg('');
  };

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #E5DFD3', borderRadius: '16px', padding: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#1E3F2B', margin: 0, fontSize: '1.4rem', fontWeight: '800' }}>
          {step === 1 ? 'Step 1: Define & Save Baseline Path' : `Step 2: Trace Verification Path (${routeId})`}
        </h2>
        {step === 2 && (
          <button 
            onClick={resetAll}
            style={{ background: '#F9F5F0', border: '1px solid #E5DFD3', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', color: '#7A2021' }}
          >
            Reset / Change Route ID
          </button>
        )}
      </div>

      {step === 1 ? (
        <form onSubmit={handleSaveBaseline} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
            <label style={{ display: 'block', marginBottom: '8px', color: '#6B655E', fontWeight: 'bold', fontSize: '0.9rem' }}>Click Map to Plot Baseline Route</label>
            <MapPicker points={baselinePoints} setPoints={setBaselinePoints} lineColor="#1E3F2B" />
          </div>

          <button
            type="submit"
            style={{ padding: '16px', cursor: 'pointer', backgroundColor: '#1E3F2B', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', letterSpacing: '1px' }}
          >
            LOCK BASELINE PATH & PROCEED TO VERIFY
          </button>
        </form>
      ) : (
        <form onSubmit={handleAnalyzeTrip} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {statusMsg && <div style={{ padding: '10px', background: '#F0FDF4', color: '#1E3F2B', borderRadius: '6px', fontWeight: 'bold' }}>{statusMsg}</div>}

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#6B655E', fontWeight: 'bold', fontSize: '0.9rem' }}>Trace Verification Path to Test for Anomalies</label>
            <MapPicker points={verifyPoints} setPoints={setVerifyPoints} lineColor="#7A2021" />
          </div>

          <button
            type="submit"
            style={{ padding: '16px', cursor: 'pointer', backgroundColor: '#7A2021', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', letterSpacing: '1px' }}
          >
            ANALYZE VERIFICATION TRACE
          </button>
        </form>
      )}

      {/* Results Panel showing backend evaluation response details */}
      {result && (
        <div style={{ marginTop: '25px', padding: '20px', backgroundColor: result.is_anomaly ? '#FFF5F5' : '#F0FDF4', border: `2px solid ${result.is_anomaly ? '#7A2021' : '#1E3F2B'}`, borderRadius: '12px', textAlign: 'center' }}>
          {result.is_anomaly ? (
            <>
              <h3 style={{ color: '#7A2021', fontSize: '1.6rem', margin: '0 0 10px 0', fontWeight: '900' }}>
                ⚠️ ANOMALY DETECTED (Score: {result.anomaly_score})
              </h3>
              <p style={{ color: '#666', fontSize: '15px', margin: '0 0 10px 0' }}>
                Confidence: {result.confidence}%
              </p>
              <div style={{ color: '#7A2021', fontSize: '13px', marginBottom: '20px', fontFamily: 'monospace' }}>
                Reasons: {result.reasons?.join(', ')}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                <button 
                  type="button" 
                  onClick={() => resetAll()}
                  style={{ padding: '10px 20px', backgroundColor: '#FFF', color: '#1E3F2B', border: '2px solid #1E3F2B', cursor: 'pointer', fontWeight: 'bold', borderRadius: '8px' }}
                >
                  Approve Deviation
                </button>
                <button 
                  type="button" 
                  onClick={() => resetAll()}
                  style={{ padding: '10px 20px', backgroundColor: '#7A2021', color: '#FFF', border: 'none', cursor: 'pointer', fontWeight: 'bold', borderRadius: '8px' }}
                >
                  Flag for Review
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
              <h3 style={{ color: '#1E3F2B', fontSize: '1.5rem', margin: 0, fontWeight: '900' }}>
                ✅ ROUTE VERIFIED: NORMAL (Score: {result.anomaly_score})
              </h3>
              <button 
                type="button" 
                onClick={() => resetAll()}
                style={{ padding: '8px 16px', backgroundColor: '#1E3F2B', color: '#FFF', border: 'none', cursor: 'pointer', fontWeight: 'bold', borderRadius: '6px' }}
              >
                Test Another Route
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}