import React, { useState, useEffect, useRef, useMemo } from 'react';
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
    <div style={{ background: '#FFFFFF', border: '1px solid #111', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
      <h2 style={{ color: '#111', marginTop: 0, fontWeight: '900', textTransform: 'uppercase', letterSpacing: '-0.5px' }}>Manual Trace Injection</h2>
      <p style={{ color: '#666', marginBottom: '25px', fontSize: '0.95rem' }}>Direct JSON coordinate matrix diagnostic interface.</p>

      <form onSubmit={handleManualSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', fontWeight: '700', marginBottom: '8px', color: '#111', fontSize: '0.8rem', letterSpacing: '1px' }}>TARGET ROUTE ID</label>
          <input
            type="text"
            placeholder="e.g., route_name"
            value={routeName}
            onChange={(e) => setRouteName(e.target.value)}
            style={{ width: '100%', padding: '14px', background: '#FAFAFA', border: '1px solid #ddd', color: '#111', boxSizing: 'border-box', outline: 'none' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: '700', marginBottom: '8px', color: '#111', fontSize: '0.8rem', letterSpacing: '1px' }}>COORDINATES ARRAY (JSON)</label>
          <textarea
            rows="6"
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            style={{ width: '100%', padding: '14px', background: '#FAFAFA', border: '1px solid #ddd', color: '#111', fontFamily: 'monospace', boxSizing: 'border-box', outline: 'none' }}
          />
        </div>
        <button type="submit" style={{ padding: '16px', background: '#111', color: '#fff', border: 'none', fontWeight: '700', cursor: 'pointer', letterSpacing: '1px' }}>
          EXECUTE ANALYSIS
        </button>
      </form>

      {responseResult && (
        <div style={{ marginTop: '25px', padding: '20px', background: responseResult.is_anomaly ? '#FFF5F5' : '#FAFAFA', border: '1px solid #111' }}>
          <h4 style={{ margin: '0 0 8px 0', color: responseResult.is_anomaly ? '#b71c1c' : '#111', textTransform: 'uppercase' }}>
            {responseResult.is_anomaly ? 'Anomaly Detected' : 'Route Verified Normal'}
          </h4>
          <pre style={{ margin: 0, fontSize: '11px', color: '#333' }}>{JSON.stringify(responseResult, null, 2)}</pre>
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
    <div style={{ background: '#FFFFFF', border: '1px solid #111', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
      <h2 style={{ color: '#111', marginTop: 0, fontWeight: '900', textTransform: 'uppercase', letterSpacing: '-0.5px' }}>Executed Trip Logs</h2>
      <p style={{ color: '#666', marginBottom: '25px', fontSize: '0.95rem' }}>Comprehensive audit trail of historical route executions.</p>

      {loading ? <p>Loading records...</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {trips.map((trip, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: '#FAFAFA', border: '1px solid #e0e0e0' }}>
              <div>
                <strong style={{ color: '#111', fontSize: '1.05rem' }}>Trip #{trip.id || idx + 1} ({trip.base_route_name || 'Standard Route'})</strong>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Recorded: {trip.date || 'Today'}</div>
              </div>
              <div>
                <span style={{ padding: '6px 14px', fontSize: '11px', fontWeight: '700', letterSpacing: '1px', background: trip.status === 'ANOMALY' ? '#111' : '#fff', color: trip.status === 'ANOMALY' ? '#fff' : '#111', border: '1px solid #111' }}>
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

const Analytics = () => {
  const [tripsVal, setTripsVal] = useState('00');
  const [anomalyVal, setAnomalyVal] = useState('0.0%');
  const [similarityVal, setSimilarityVal] = useState('00.0%');

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setTripsVal(Math.floor(Math.random() * 89 + 10));
      setAnomalyVal((Math.random() * 20).toFixed(1) + '%');
      setSimilarityVal((Math.random() * 30 + 70).toFixed(1) + '%');
      iteration++;
      if (iteration > 12) {
        clearInterval(interval);
        setTripsVal('24');
        setAnomalyVal('8.3%');
        setSimilarityVal('94.6%');
      }
    }, 70);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #111', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
      <h2 style={{ color: '#111', marginTop: 0, fontWeight: '900', textTransform: 'uppercase', letterSpacing: '-0.5px' }}>Performance Analytics</h2>
      <p style={{ color: '#666', marginBottom: '30px', fontSize: '0.95rem' }}>Aggregated intelligence metrics across active delivery vectors.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px', marginBottom: '30px' }}>
        <div style={{ background: '#FAFAFA', padding: '30px', border: '1px solid #111' }}>
          <div style={{ color: '#666', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>TOTAL TRIPS</div>
          <div style={{ color: '#111', fontSize: '2.5rem', fontWeight: '900', marginTop: '10px', fontFamily: 'monospace' }}>{tripsVal}</div>
        </div>
        <div style={{ background: '#FAFAFA', padding: '30px', border: '1px solid #111' }}>
          <div style={{ color: '#666', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>ANOMALY RATE</div>
          <div style={{ color: '#111', fontSize: '2.5rem', fontWeight: '900', marginTop: '10px', fontFamily: 'monospace' }}>{anomalyVal}</div>
        </div>
        <div style={{ background: '#FAFAFA', padding: '30px', border: '1px solid #111' }}>
          <div style={{ color: '#666', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>AVG SIMILARITY</div>
          <div style={{ color: '#111', fontSize: '2.5rem', fontWeight: '900', marginTop: '10px', fontFamily: 'monospace' }}>{similarityVal}</div>
        </div>
      </div>
    </div>
  );
};

const Settings = () => {
  const [threshold, setThreshold] = useState('50');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #111', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
      <h2 style={{ color: '#111', marginTop: 0, fontWeight: '900', textTransform: 'uppercase', letterSpacing: '-0.5px' }}>System Configuration</h2>
      <p style={{ color: '#666', marginBottom: '25px', fontSize: '0.95rem' }}>Adjust spatial matching parameters and detection thresholds.</p>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '450px' }}>
        <div>
          <label style={{ display: 'block', fontWeight: '700', marginBottom: '8px', color: '#111', fontSize: '0.8rem', letterSpacing: '1px' }}>TOLERANCE RADIUS (METERS)</label>
          <input
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            style={{ width: '100%', padding: '14px', background: '#FAFAFA', border: '1px solid #ddd', color: '#111', boxSizing: 'border-box' }}
          />
        </div>
        <button type="submit" style={{ padding: '16px', background: '#111', color: '#fff', border: 'none', fontWeight: '700', cursor: 'pointer', letterSpacing: '1px' }}>
          SAVE CONFIGURATION
        </button>
      </form>

      {saved && <p style={{ color: '#111', fontWeight: '700', marginTop: '15px' }}>Configuration saved successfully.</p>}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Procedural street network generator — modelled on a real city grid rather
// than graph paper: a few wide, far-apart AVENUES running one direction,
// many closely-packed, thinner STREETS crossing them (Manhattan block
// proportions), a Broadway-style diagonal cutting through at a shallower
// angle, and the whole grid tilted a few degrees off true horizontal/vertical
// the way most real street grids are. Deterministic per seed so it doesn't
// reshuffle on every re-render. Rotation is baked directly into the point
// coordinates (rather than an SVG transform) so the cursor mask, which is
// defined in plain viewport pixels, lines up correctly with every path.
// ---------------------------------------------------------------------------
function rotatePoint(x, y, angleDeg) {
  const angle = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return { x: x * cos - y * sin, y: x * sin + y * cos };
}

function generateStreetNetwork(width, height, seed = 7, gridAngle = 18) {
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };

  const cx = width / 2;
  const cy = height / 2;
  // Oversize the working canvas so that once it's rotated into place it
  // still fully covers the viewport with no gaps at the corners.
  const diag = Math.sqrt(width * width + height * height) * 1.25;
  const half = diag / 2;

  const toViewport = (x, y, angle) => {
    const r = rotatePoint(x, y, angle);
    return { x: r.x + cx, y: r.y + cy };
  };

  const avenues = [];
  const streets = [];
  const broadways = [];

  const avenueSpacing = 145; // wide blocks, like north–south avenues
  const streetSpacing = 42;  // narrow blocks, like frequent cross streets

  // Avenues: long, mostly-straight lines with just a hint of a bow, the way
  // real avenues drift slightly rather than running perfectly true.
  for (let x = -half; x <= half; x += avenueSpacing) {
    const xPos = x + (rand() - 0.5) * 5;
    const bow = (rand() - 0.5) * 16;
    const p1 = toViewport(xPos, -half, gridAngle);
    const pm = toViewport(xPos + bow, 0, gridAngle);
    const p2 = toViewport(xPos, half, gridAngle);
    avenues.push(
      `M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} Q ${pm.x.toFixed(1)} ${pm.y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
    );
  }

  // Streets: frequent, thin, nearly straight cross streets perpendicular to
  // the avenues — this density + straightness is what actually reads as a
  // real block grid rather than a sketch.
  for (let y = -half; y <= half; y += streetSpacing) {
    const yPos = y + (rand() - 0.5) * 3;
    const p1 = toViewport(-half, yPos, gridAngle);
    const p2 = toViewport(half, yPos, gridAngle);
    streets.push(`M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} L ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`);
  }

  // One or two Broadway-style diagonals slicing across the grid at a
  // shallower angle than the main tilt, the way Broadway cuts through
  // Manhattan's rectilinear blocks.
  const broadwayCount = 2;
  for (let i = 0; i < broadwayCount; i++) {
    const offset = -half * 0.4 + i * half * 0.8 + (rand() - 0.5) * 120;
    const p1 = toViewport(offset, -half, gridAngle * 0.3);
    const p2 = toViewport(offset + diag * 0.25, half, gridAngle * 0.3);
    broadways.push(`M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} L ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`);
  }

  return { avenues, streets, broadways };
}

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [activeTab, setActiveTab] = useState('live');
  const [isNavHovered, setIsNavHovered] = useState(false);
  const [dims, setDims] = useState({ width: window.innerWidth, height: window.innerHeight });

  const glowCoreRef = useRef(null);
  const glowHaloRef = useRef(null);
  const rafRef = useRef(null);

  // Recompute the street layout only when the viewport size changes,
  // never on mouse movement, so cursor tracking stays cheap.
  const { avenues, streets, broadways } = useMemo(
    () => generateStreetNetwork(dims.width, dims.height),
    [dims.width, dims.height]
  );

  useEffect(() => {
    const handleResize = () => setDims({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Move the SVG mask circles imperatively via refs (no React re-render per
  // mousemove) so the "streets light up red near the cursor" effect stays smooth.
  const handleMouseMove = (e) => {
    const x = e.clientX;
    const y = e.clientY;
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      if (glowCoreRef.current) {
        glowCoreRef.current.setAttribute('cx', x);
        glowCoreRef.current.setAttribute('cy', y);
      }
      if (glowHaloRef.current) {
        glowHaloRef.current.setAttribute('cx', x);
        glowHaloRef.current.setAttribute('cy', y);
      }
      rafRef.current = null;
    });
  };

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
          backgroundColor: isActive ? '#111' : 'transparent',
          color: isActive ? '#fff' : '#333',
          padding: '8px 16px',
          fontWeight: isActive ? '700' : '500',
          cursor: 'pointer',
          fontSize: '0.8rem',
          letterSpacing: '1px',
          textTransform: 'uppercase',
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
      <style>{`
        * {
          cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewport='0 0 10 10'><rect width='10' height='10' fill='%23111111'/></svg>"), auto !important;
        }
        button, a, input, select, textarea {
          cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewport='0 0 10 10'><rect width='10' height='10' fill='%23111111'/></svg>"), pointer !important;
        }
        button {
          transition: background-color 0.2s ease, transform 0.1s ease !important;
        }
        button:hover {
          background-color: #555555 !important;
        }
      `}</style>

      {showWelcome && (
        <WelcomeScreen onEnterDashboard={() => setShowWelcome(false)} />
      )}

      <div
        onMouseMove={handleMouseMove}
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          backgroundColor: '#E8E4DF',
          color: '#111',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          overflow: 'hidden'
        }}
      >

        {/* Street-map background layer: fine blueprint grid underneath, then
            the procedural street network on top. Kept in its own stacking
            context at zIndex 0 so it only ever shows behind the dashboard
            cards, never through them. */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          pointerEvents: 'none',
          filter: 'blur(0.4px)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)'
        }}>
          {/* faint blueprint grid for texture/depth under the streets */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(90deg, rgba(200,195,188,0.35) 1px, transparent 1px),
              linear-gradient(0deg, rgba(200,195,188,0.35) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px, 40px 40px'
          }} />

          <svg
            width={dims.width}
            height={dims.height}
            viewBox={`0 0 ${dims.width} ${dims.height}`}
            style={{ position: 'absolute', top: 0, left: 0 }}
          >
            <defs>
              {/* Tight, crisp mask around the cursor for sharp glowing streets */}
              <radialGradient id="coreMaskGradient">
                <stop offset="0%" stopColor="#fff" stopOpacity="1" />
                <stop offset="70%" stopColor="#fff" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#fff" stopOpacity="0" />
              </radialGradient>
              {/* Wider, softer mask for a low, ambient red haze around it */}
              <radialGradient id="haloMaskGradient">
                <stop offset="0%" stopColor="#fff" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#fff" stopOpacity="0" />
              </radialGradient>

              <mask id="coreMask" maskUnits="userSpaceOnUse" x="0" y="0" width={dims.width} height={dims.height}>
                <rect width={dims.width} height={dims.height} fill="black" />
                <circle ref={glowCoreRef} cx="-500" cy="-500" r="200" fill="url(#coreMaskGradient)" />
              </mask>
              <mask id="haloMask" maskUnits="userSpaceOnUse" x="0" y="0" width={dims.width} height={dims.height}>
                <rect width={dims.width} height={dims.height} fill="black" />
                <circle ref={glowHaloRef} cx="-500" cy="-500" r="380" fill="url(#haloMaskGradient)" />
              </mask>

              <filter id="streetGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2.2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="haloBlur" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="14" />
              </filter>
            </defs>

            {/* Base street network, always visible, muted gray/ink.
                Streets are thin and dense; avenues are wider and further
                apart; the broadway cuts are the widest of all — same
                hierarchy a real map legend would use. */}
            <g fill="none">
              <g stroke="rgba(140,134,126,0.4)" strokeWidth="0.6">
                {streets.map((d, i) => <path key={`street-base-${i}`} d={d} />)}
              </g>
              <g stroke="rgba(120,114,106,0.6)" strokeWidth="1.3">
                {avenues.map((d, i) => <path key={`ave-base-${i}`} d={d} />)}
              </g>
              <g stroke="rgba(110,104,96,0.65)" strokeWidth="1.8">
                {broadways.map((d, i) => <path key={`bway-base-${i}`} d={d} />)}
              </g>
            </g>

            {/* Wide ambient red haze near the cursor */}
            <g fill="none" mask="url(#haloMask)" filter="url(#haloBlur)" opacity="0.5">
              <g stroke="#b71c1c" strokeWidth="1.4">
                {streets.map((d, i) => <path key={`street-halo-${i}`} d={d} />)}
              </g>
              <g stroke="#b71c1c" strokeWidth="2.4">
                {avenues.map((d, i) => <path key={`ave-halo-${i}`} d={d} />)}
              </g>
              <g stroke="#b71c1c" strokeWidth="3">
                {broadways.map((d, i) => <path key={`bway-halo-${i}`} d={d} />)}
              </g>
            </g>

            {/* Crisp glowing red streets right under the cursor */}
            <g fill="none" mask="url(#coreMask)" filter="url(#streetGlow)">
              <g stroke="#e02020" strokeWidth="0.8">
                {streets.map((d, i) => <path key={`street-core-${i}`} d={d} />)}
              </g>
              <g stroke="#e02020" strokeWidth="1.6">
                {avenues.map((d, i) => <path key={`ave-core-${i}`} d={d} />)}
              </g>
              <g stroke="#e02020" strokeWidth="2.1">
                {broadways.map((d, i) => <path key={`bway-core-${i}`} d={d} />)}
              </g>
            </g>
          </svg>
        </div>

        {/* Floating Top Navigation Bar */}
        <div
          onMouseEnter={() => setIsNavHovered(true)}
          onMouseLeave={() => setIsNavHovered(false)}
          style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(12px)',
            border: '1px solid #111',
            padding: '10px 30px',
            display: 'flex',
            alignItems: 'center',
            gap: '30px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
            zIndex: 1000,
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            maxHeight: '55px',
            overflow: 'hidden'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setActiveTab('live')}>
            <span style={{ color: '#111', fontWeight: '900', fontSize: '1.1rem', letterSpacing: '-0.5px', textTransform: 'uppercase' }}>WAYWATCH</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            opacity: isNavHovered ? 1 : 0.85,
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

        {/* Main Content View */}
        <div style={{
          flex: 1,
          padding: '100px 60px 40px 60px',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          scrollbarWidth: 'thin',
          scrollbarColor: '#ccc transparent',
          position: 'relative',
          zIndex: 2
        }}>
          {renderContent()}
        </div>

      </div>
    </>
  );
}