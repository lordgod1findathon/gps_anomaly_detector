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

export default function MapPicker({ points, setPoints, lineColor = "#7A2021" }) {
  const defaultCenter = [40.7128, -74.0060];

  const handleAddPoint = (newPoint) => {
    setPoints((prev) => [...prev, newPoint]);
  };

  const handleClear = (e) => {
    e.preventDefault();
    setPoints([]);
  };

  return (
    <div style={{ position: 'relative', border: '2px solid #E5DFD3', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
      
      {/* WE INCREASED THE HEIGHT HERE TO 500px */}
      <div style={{ height: '500px', width: '100%' }}>
        <MapContainer
          center={points.length > 0 ? [points[0].lat, points[0].lng] : defaultCenter}
          zoom={14}
          style={{ height: '100%', width: '100%' }}
        >
          {/* Changed to a clean, light standard map tile layer */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <ClickHandler onAddPoint={handleAddPoint} />

          {points.map((pt, idx) => (
            <CircleMarker
              key={idx}
              center={[pt.lat, pt.lng]}
              radius={idx === 0 ? 8 : 5}
              pathOptions={{
                color: idx === 0 ? '#1E3F2B' : lineColor,
                fillColor: idx === 0 ? '#1E3F2B' : lineColor,
                fillOpacity: 1,
              }}
            />
          ))}

          {points.length > 1 && (
            <Polyline
              positions={points.map((p) => [p.lat, p.lng])}
              pathOptions={{ color: lineColor, weight: 5 }}
            />
          )}
        </MapContainer>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F9F5F0', padding: '12px 20px', fontSize: '14px', fontWeight: 'bold', color: '#6B655E', borderTop: '1px solid #E5DFD3' }}>
        <span>📍 Waypoints Logged: <b style={{ color: lineColor }}>{points.length}</b></span>
        <button
          type="button"
          onClick={handleClear}
          style={{ background: '#7A2021', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
        >
          Clear Path
        </button>
      </div>
    </div>
  );
}