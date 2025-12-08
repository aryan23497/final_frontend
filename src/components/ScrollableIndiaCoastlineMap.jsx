// ScrollableIndiaCoastlineMap.jsx
// A React component (Tailwind + react-leaflet) that renders a map tightly focused on
// India's coastal perimeter. This version is zoomed-in to show India more closely.

import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

const createIcon = (color = '#2dd4bf') => {
  const svg = `
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="6" fill="${color}" />
    </svg>`;
  
  return L.divIcon({
    className: 'custom-coast-marker',
    html: svg,
    iconSize: [36, 36],     // bigger icon
    iconAnchor: [18, 18]    // center the marker
  });
};


// MapSetup applies maxBounds and optional minZoom when the map instance becomes available.
function MapSetup({ bounds, minZoom }) {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    try {
      if (bounds) {
        map.setMaxBounds(bounds);
        map.options.maxBoundsViscosity = 0.95;
        // fit to bounds on first load so the map shows the coastal area tightly
        map.fitBounds(bounds, { padding: [20, 20] });
      }
      if (typeof minZoom === 'number') {
        map.setMinZoom(minZoom);
      }
    } catch (e) {
      // ignore silently in non-browser environments
    }
  }, [map, bounds, minZoom]);
  return null;
}

MapSetup.propTypes = { bounds: PropTypes.array, minZoom: PropTypes.number };

export default function ScrollableIndiaCoastlineMap({ height = '480px' }) {
  const leafletRef = useRef(null);

  const coastalCities = [
    { name: 'Kutch (Gujarat)', lat: 23.73, lng: 69.84 },
    { name: 'Mumbai', lat: 18.9667, lng: 72.8333 },
    { name: 'Goa', lat: 15.4909, lng: 73.8278 },
    { name: 'Mangalore', lat: 12.9141, lng: 74.8560 },
    { name: 'Kochi', lat: 9.9312, lng: 76.2673 },
    { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
    { name: 'Visakhapatnam', lat: 17.6868, lng: 83.2185 },
    { name: 'Kolkata', lat: 22.5726, lng: 88.3639 }
  ];

  // Tightened bounds to focus on India more closely and avoid Myanmar
  // Format: [southWest, northEast] -> [lat, lng]
  const INDIA_BOUNDS = [[6.5, 78.0], [27.5, 85.0]];

  // Center and zoom tuned for a zoomed-in India view
  const initialCenter = [22.0, 80.0];
  const initialZoom = 6;   // closer initial zoom
  const MIN_ZOOM = 5;      // allow slight zoom out, but not too far
  const MAX_ZOOM = 12;

  const handleMapCreated = (map) => {
    leafletRef.current = map;
  };

  return (
    <div className="w-full" style={{ background: '#020617', padding: 10 }}>
      <div className="mb-3">
        <h3 className="text-sm font-semibold" style={{ color: '#e5e7eb', margin: 0 }}>
          India coastline — focused view
        </h3>
        <div className="text-xs" style={{ color: '#94a3b8' }}>Map is constrained to India's coastal perimeter — you can pan and zoom in only.</div>
      </div>

      <div style={{ width: '100%', height, borderRadius: 12, overflow: 'hidden', boxShadow: '0 6px 18px rgba(0,0,0,0.6)' }}>
        <MapContainer
          whenCreated={handleMapCreated}
          center={initialCenter}
          zoom={initialZoom}
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}
          style={{ height: '100%', width: '100%' }}
        >
          <MapSetup bounds={INDIA_BOUNDS} minZoom={MIN_ZOOM} />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />

          {coastalCities.map((c) => (
            <Marker key={c.name} position={[c.lat, c.lng]} icon={createIcon('#2dd4bf')}>
              <Popup>
                <div style={{ color: '#020617' }}>
                  <strong>{c.name}</strong>
                  <div className="text-xs">Lat: {c.lat}, Lng: {c.lng}</div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <style>{`
        .custom-coast-marker { display: inline-block }
      `}</style>
    </div>
  );
}

ScrollableIndiaCoastlineMap.propTypes = { height: PropTypes.string };
