import React, { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation } from 'lucide-react';
import {
  REFERENCE_LATITUDE,
  REFERENCE_LONGITUDE,
  REFERENCE_LOCATION_NAME
} from '../config/constants';

// Custom Pin for Map Picker
const pickerIcon = L.divIcon({
  html: `
    <div style="
      width: 38px;
      height: 38px;
      background: linear-gradient(135deg, #0d9488, #115e59);
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(13, 148, 136, 0.4);
      border: 3px solid #ffffff;
      cursor: grab;
    ">
      <div style="transform: rotate(45deg); color: #ffffff; font-size: 16px;">📍</div>
    </div>
  `,
  className: 'admin-map-picker-pin',
  iconSize: [38, 38],
  iconAnchor: [19, 38]
});

// Event Handler Component: Map Click & View Synchronization
const MapEventController = ({ position, onLocationChange }) => {
  const map = useMap();

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onLocationChange(
        Math.round(lat * 10000000) / 10000000,
        Math.round(lng * 10000000) / 10000000
      );
    }
  });

  // Pan map when position prop changes externally
  useEffect(() => {
    if (position && !isNaN(position[0]) && !isNaN(position[1])) {
      map.setView(position, map.getZoom(), { animate: true });
    }
  }, [position, map]);

  return null;
};

const AdminMapPicker = ({ latitude, longitude, onChange, height = '320px' }) => {
  const markerRef = useRef(null);

  const lat = typeof latitude === 'number' && !isNaN(latitude) ? latitude : REFERENCE_LATITUDE;
  const lon = typeof longitude === 'number' && !isNaN(longitude) ? longitude : REFERENCE_LONGITUDE;

  const currentPos = useMemo(() => [lat, lon], [lat, lon]);

  // Event handlers for dragging marker
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const { lat: newLat, lng: newLng } = marker.getLatLng();
          onChange(
            Math.round(newLat * 10000000) / 10000000,
            Math.round(newLng * 10000000) / 10000000
          );
        }
      }
    }),
    [onChange]
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{
        height,
        width: '100%',
        borderRadius: '14px',
        overflow: 'hidden',
        border: '2px solid #e2e8f0',
        position: 'relative'
      }}>
        <MapContainer
          center={currentPos}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapEventController position={currentPos} onLocationChange={onChange} />

          <Marker
            draggable={true}
            eventHandlers={eventHandlers}
            position={currentPos}
            ref={markerRef}
            icon={pickerIcon}
          />
        </MapContainer>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem',
        fontSize: '0.8rem',
        color: '#64748b',
        backgroundColor: '#f8fafc',
        padding: '0.5rem 0.75rem',
        borderRadius: '8px',
        border: '1px solid #f1f5f9'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <MapPin size={14} color="#0d9488" />
          <span>Click map or drag the pin to select place coordinates</span>
        </div>
        <div style={{ fontFamily: 'monospace', fontWeight: '700', color: '#0f172a' }}>
          Lat: {lat.toFixed(7)}, Lon: {lon.toFixed(7)}
        </div>
      </div>
    </div>
  );
};

export default AdminMapPicker;
