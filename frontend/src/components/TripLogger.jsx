import React, { useState } from 'react';
import { saveBaseRoute, logTrip } from '../api';
import MapPicker from './MapPicker';

export default function TripLogger() {
  const [step, setStep] = useState(1); // 1: Baseline, 2: Verification
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
      await saveBaseRoute({ route_id: routeId, points: baselinePoints });
      setStatusMsg('Baseline path successfully locked.');
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Top Status Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFFFFF', padding: '24px 35px', border: '1px solid #111', borderRadius: '16px' }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '2px', color: '#666', textTransform: 'uppercase', marginBottom: '4px' }}>
            Live Telemetry Feed {routeId ? `— [${routeId}]` : ''}
          </div>
          <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: '900', color: '#111', textTransform: 'uppercase', letterSpacing: '-0.5px' }}>
            {step === 1 ? 'Step 1: Define Baseline Route' : 'Step 2: Verify Trip Trajectory'}
          </h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: '#FAFAFA', border: '1px solid #111', fontSize: '11px', fontWeight: '700', letterSpacing: '1px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#1b3b2b', display: 'inline-block' }}></span>
            SYSTEM ONLINE
          </div>
          {step === 2 && (
            <button 
              onClick={resetAll}
              style={{ background: '#111', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: '700', letterSpacing: '1px' }}
            >
              RESET SESSION
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Map & Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: result ? '1.5fr 1fr' : '1fr', gap: '30px', alignItems: 'start' }}>
        
        {/* Map Container */}
        <div style={{ background: '#FFFFFF', padding: '30px', border: '1px solid #111', borderRadius: '16px' }}>
          {step === 1 ? (
            <form onSubmit={handleSaveBaseline} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#111', fontWeight: '700', fontSize: '0.8rem', letterSpacing: '1px' }}>ROUTE IDENTIFIER (ROUTE_ID)</label>
                <input
                  type="text"
                  placeholder="e.g., morning_commute"
                  value={routeId}
                  onChange={(e) => setRouteId(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '14px', backgroundColor: '#FAFAFA', color: '#111', border: '1px solid #ddd', outline: 'none', fontWeight: '600' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#111', fontWeight: '700', fontSize: '0.8rem', letterSpacing: '1px' }}>CLICK MAP TO PLOT EXPECTED BASELINE</label>
                <MapPicker points={baselinePoints} setPoints={setBaselinePoints} isInteractive={true} />
              </div>

              <button
                type="submit"
                style={{ padding: '16px', cursor: 'pointer', backgroundColor: '#111', color: '#fff', border: 'none', fontWeight: '700', fontSize: '0.85rem', letterSpacing: '1.5px', textTransform: 'uppercase' }}
              >
                LOCK BASELINE & PROCEED TO VERIFY →
              </button>
            </form>
          ) : (
            <form onSubmit={handleAnalyzeTrip} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {statusMsg && <div style={{ padding: '12px', background: '#FAFAFA', color: '#111', border: '1px solid #111', fontWeight: '700', fontSize: '0.85rem' }}>{statusMsg}</div>}

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#111', fontWeight: '700', fontSize: '0.8rem', letterSpacing: '1px' }}>TRACE VERIFICATION PATH (OVERLAID ON BASELINE)</label>
                <MapPicker 
                  points={verifyPoints} 
                  setPoints={setVerifyPoints} 
                  baselinePoints={baselinePoints} 
                  flaggedSegments={result?.flagged_segments || []}
                  isInteractive={true} 
                />
              </div>

              <button
                type="submit"
                style={{ padding: '16px', cursor: 'pointer', backgroundColor: '#111', color: '#fff', border: 'none', fontWeight: '700', fontSize: '0.85rem', letterSpacing: '1.5px', textTransform: 'uppercase' }}
              >
                EXECUTE ANOMALY EVALUATION
              </button>
            </form>
          )}
        </div>

        {/* Right Panel: Explainable Anomaly Report & Route Health */}
        {result && (
          <div style={{ background: '#FFFFFF', padding: '30px', border: '1px solid #111', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '25px' }}>
            
            {/* Health Score / Status Banner */}
            <div style={{ padding: '20px', background: result.is_anomaly ? '#FFF5F5' : '#FAFAFA', border: `1px solid ${result.is_anomaly ? '#b71c1c' : '#111'}`, textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#666', letterSpacing: '1px', marginBottom: '5px' }}>EVALUATION STATUS</div>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '1.3rem', fontWeight: '900', color: result.is_anomaly ? '#b71c1c' : '#111', textTransform: 'uppercase' }}>
                {result.is_anomaly ? '⚠️ ANOMALY DETECTED' : '✓ ROUTE VERIFIED NORMAL'}
              </h3>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '0.85rem', fontWeight: '700' }}>
                <span>SCORE: {result.anomaly_score}</span>
                <span>CONFIDENCE: {result.confidence}%</span>
              </div>
            </div>

            {/* Explainable Reasons */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#666', letterSpacing: '1px', marginBottom: '10px', textTransform: 'uppercase' }}>Diagnostic Analysis</div>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.9rem', color: '#333', lineHeight: '1.6' }}>
                {result.reasons?.map((reason, idx) => (
                  <li key={idx} style={{ marginBottom: '6px', fontWeight: '600' }}>{reason}</li>
                )) || <li>Trajectory matches standard spatial distribution.</li>}
              </ul>
            </div>

            {/* Turn Sequence Comparison */}
            {(result.turns_expected || result.turns_observed) && (
              <div style={{ background: '#FAFAFA', padding: '20px', border: '1px solid #ddd' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#666', letterSpacing: '1px', marginBottom: '12px', textTransform: 'uppercase' }}>Turn Sequence Check</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '0.8rem' }}>
                  <div>
                    <div style={{ fontWeight: '700', color: '#666', marginBottom: '4px' }}>EXPECTED</div>
                    <div style={{ fontFamily: 'monospace', background: '#fff', padding: '8px', border: '1px solid #ddd' }}>
                      {result.turns_expected?.join(' → ') || 'None'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', color: '#666', marginBottom: '4px' }}>OBSERVED</div>
                    <div style={{ fontFamily: 'monospace', background: '#fff', padding: '8px', border: '1px solid #ddd' }}>
                      {result.turns_observed?.join(' → ') || 'None'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button 
              onClick={() => setResult(null)}
              style={{ padding: '12px', background: '#111', color: '#fff', border: 'none', fontWeight: '700', fontSize: '0.8rem', letterSpacing: '1px', cursor: 'pointer', textTransform: 'uppercase' }}
            >
              Clear Analysis
            </button>
          </div>
        )}

      </div>
    </div>
  );
}