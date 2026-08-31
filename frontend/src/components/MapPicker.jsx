import React from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function ClickHandler({ onAddPoint }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onAddPoint({ lat: parseFloat(lat.toFixed(5)), lng: parseFloat(lng.toFixed(5)) });
    },
  });
  return null;
}

export default function MapPicker({ 
  points = [], 
  setPoints, 
  baselinePoints = [], 
  flaggedSegments = [], 
  isInteractive = true 
}) {
  const defaultCenter = [40.7128, -74.0060];

  // Determine center based on available points
  const activePoints = points.length > 0 ? points : baselinePoints;
  const mapCenter = activePoints.length > 0 ? [activePoints[0].lat, activePoints[0].lng] : defaultCenter;

  const handleAddPoint = (e) => {
    if (!isInteractive || !setPoints) return;
    const { lat, lng } = e.latlng;
    setPoints((prev) => [...prev, { lat: parseFloat(lat.toFixed(5)), lng: parseFloat(lng.toFixed(5)) }]);
  };

  const handleClear = (e) => {
    e.preventDefault();
    if (setPoints) setPoints([]);
  };

  return (
    <div style={{ position: 'relative', border: '1px solid #111', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', backgroundColor: '#FFFFFF' }}>
      
      {/* Map Legend Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFFFFF', padding: '12px 20px', fontSize: '11px', fontWeight: '700', color: '#111', borderBottom: '1px solid #e0e0e0', letterSpacing: '1px', textTransform: 'uppercase' }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          {baselinePoints.length > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '3px', backgroundColor: '#111', display: 'inline-block' }}></span> Baseline Route
            </span>
          )}
          {points.length > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '3px', backgroundColor: '#b71c1c', display: 'inline-block' }}></span> Verification Path
            </span>
          )}
          <span>Waypoints: <b>{points.length}</b></span>
        </div>
        {isInteractive && setPoints && (
          <button
            type="button"
            onClick={handleClear}
            style={{ background: '#111', color: '#fff', border: 'none', borderRadius: '4px', padding: '5px 12px', cursor: 'pointer', fontSize: '10px', fontWeight: '700', letterSpacing: '1px' }}
          >
            CLEAR PATH
          </button>
        )}
      </div>

      <div style={{ height: '480px', width: '100%' }}>
        <MapContainer
          center={mapCenter}
          zoom={14}
          style={{ height: '100%', width: '100%', cursor: isInteractive ? 'crosshair' : 'default' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {isInteractive && <ClickHandler onAddPoint={(pt) => setPoints([...points, pt])} />}

          {/* 1. Render Baseline Route (Solid Dark Editorial Line) */}
          {baselinePoints.length > 1 && (
            <Polyline
              positions={baselinePoints.map((p) => [p.lat, p.lng])}
              pathOptions={{ color: '#111111', weight: 4, opacity: 0.8, dashArray: '6, 6' }}
            />
          )}

          {/* 2. Render Current/Verification Route */}
          {points.length > 1 && (
            <Polyline
              positions={points.map((p) => [p.lat, p.lng])}
              pathOptions={{ color: '#b71c1c', weight: 5, opacity: 0.9 }}
            />
          )}

          {/* 3. Render Waypoint Markers for Verification Path */}
          {points.map((pt, idx) => (
            <CircleMarker
              key={`pt-${idx}`}
              center={[pt.lat, pt.lng]}
              radius={idx === 0 || idx === points.length - 1 ? 6 : 4}
              pathOptions={{
                color: '#111',
                fillColor: idx === 0 ? '#1b3b2b' : idx === points.length - 1 ? '#b71c1c' : '#fff',
                fillOpacity: 1,
                weight: 2
              }}
            />
          ))}

          {/* 4. Render Flagged Anomaly Segments */}
          {flaggedSegments.map((seg, idx) => (
            <CircleMarker
              key={`flag-${idx}`}
              center={[seg.lat, seg.lng]}
              radius={8}
              pathOptions={{
                color: '#b71c1c',
                fillColor: '#ffebee',
                fillOpacity: 0.9,
                weight: 2
              }}
            />
          ))}
        </MapContainer>
      </div>
    </div>
  );
}