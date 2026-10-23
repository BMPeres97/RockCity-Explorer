import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { Compass, ExternalLink, ArrowRight, Clock, Star } from 'lucide-react';
import {
  REFERENCE_LATITUDE,
  REFERENCE_LONGITUDE,
  REFERENCE_LOCATION_NAME
} from '../config/constants';
import { formatDistance } from '../utils/geoDistance';
import { formatTravelTime } from '../utils/travelTime';

// Custom Marker Generator with SVG
const createCustomMarker = (color, iconSymbol, isReference = false) => {
  const size = isReference ? 42 : 34;
  const html = `
    <div style="
      width: ${size}px;
      height: ${size}px;
      background: ${isReference ? 'linear-gradient(135deg, #f59e0b, #b45309)' : color};
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 10px rgba(0,0,0,0.35);
      border: 2px solid #ffffff;
      cursor: pointer;
    ">
      <div style="
        transform: rotate(45deg);
        color: #ffffff;
        font-size: ${isReference ? '18px' : '14px'};
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        ${iconSymbol}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-leaflet-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size]
  });
};

// Category Icon Mapping
const getMarkerForPlace = (place) => {
  const cat = (place.category || '').toLowerCase();
  if (cat.includes('religious')) return createCustomMarker('#0d9488', '🛕');
  if (cat.includes('nature')) return createCustomMarker('#16a34a', '🌿');
  if (cat.includes('heritage')) return createCustomMarker('#d97706', '🏛️');
  if (cat.includes('cultural')) return createCustomMarker('#7c3aed', '🎨');
  return createCustomMarker('#0284c7', '📍');
};

const referenceMarkerIcon = createCustomMarker('#f59e0b', '⭐', true);

// Component to dynamically fit map bounds to places
const MapBoundsAdjuster = ({ places }) => {
  const map = useMap();

  useEffect(() => {
    if (!places || places.length === 0) {
      map.setView([REFERENCE_LATITUDE, REFERENCE_LONGITUDE], 12);
      return;
    }

    const bounds = L.latLngBounds([
      [REFERENCE_LATITUDE, REFERENCE_LONGITUDE],
      ...places.map((p) => [p.latitude, p.longitude])
    ]);
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
  }, [places, map]);

  return null;
};

// Error boundary for map loading failures (SRS Section 27)
class MapErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Map loading failure:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            height: this.props.height || '550px',
            width: '100%',
            borderRadius: '16px',
            backgroundColor: '#f8fafc',
            border: '2px dashed #cbd5e1',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            textAlign: 'center'
          }}
        >
          <div style={{ color: '#ef4444', marginBottom: '0.75rem', fontSize: '2.5rem' }}>🗺️</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
            Map Loading Failure
          </h3>
          <p style={{ color: '#64748b', maxWidth: '420px', fontSize: '0.9rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
            Interactive map tiles could not be loaded. You can still explore Kurunegala destinations and view distance metrics below.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: '9999px', padding: '0.5rem 1.25rem' }}
          >
            Retry Map
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const MapComponent = ({ places = [], height = '550px', selectedPlaceId = null }) => {
  const defaultCenter = [REFERENCE_LATITUDE, REFERENCE_LONGITUDE];

  return (
    <MapErrorBoundary height={height}>
      <div style={{ height, width: '100%', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', position: 'relative' }}>
        <MapContainer
          center={defaultCenter}
          zoom={12}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapBoundsAdjuster places={places} />

        {/* Fixed Kurunegala Reference Location Marker */}
        <Marker position={[REFERENCE_LATITUDE, REFERENCE_LONGITUDE]} icon={referenceMarkerIcon}>
          <Popup>
            <div style={{ padding: '0.25rem', maxWidth: '240px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                backgroundColor: '#fef3c7',
                color: '#b45309',
                fontSize: '0.7rem',
                fontWeight: '700',
                padding: '0.15rem 0.45rem',
                borderRadius: '4px',
                marginBottom: '0.4rem',
                textTransform: 'uppercase'
              }}>
                ⭐ Fixed Reference Point
              </div>
              <h4 style={{ margin: '0 0 0.35rem', fontSize: '0.95rem', fontWeight: '700', color: '#0f172a' }}>
                {REFERENCE_LOCATION_NAME}
              </h4>
              <p style={{ margin: '0 0 0.5rem', fontSize: '0.785rem', color: '#64748b', lineHeight: 1.4 }}>
                All distances and travel times in RockCity Explorer are measured from this fixed coordinate.
              </p>
              <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#0d9488', backgroundColor: '#f1f5f9', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                {REFERENCE_LATITUDE}, {REFERENCE_LONGITUDE}
              </div>
            </div>
          </Popup>
        </Marker>

        {/* Tourist Place Markers */}
        {places.map((place) => {
          const markerIcon = getMarkerForPlace(place);
          const distanceStr = place.distanceFormatted || formatDistance(place.distanceFromReference);
          const travelTimeStr = place.travelTimeFormatted || formatTravelTime(place.estimatedTravelMinutes);
          const directionsUrl = place.googleMapsDirectionsUrl || `https://www.google.com/maps/dir/?api=1&origin=${REFERENCE_LATITUDE},${REFERENCE_LONGITUDE}&destination=${place.latitude},${place.longitude}`;

          return (
            <Marker
              key={place._id}
              position={[place.latitude, place.longitude]}
              icon={markerIcon}
            >
              <Popup>
                <div style={{ padding: '0.2rem', width: '230px' }}>
                  {/* Thumbnail */}
                  <img
                    src={place.thumbnail || (place.images && place.images[0])}
                    alt={place.name}
                    style={{
                      width: '100%',
                      height: '110px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      marginBottom: '0.5rem'
                    }}
                  />

                  {/* Category and Distance */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      color: '#0d9488',
                      backgroundColor: '#ccfbf1',
                      padding: '0.1rem 0.4rem',
                      borderRadius: '4px'
                    }}>
                      {place.category}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b' }}>
                      {distanceStr} away
                    </span>
                  </div>

                  {/* Title */}
                  <h4 style={{ margin: '0 0 0.35rem', fontSize: '0.925rem', fontWeight: '700', color: '#0f172a', lineHeight: 1.3 }}>
                    {place.name}
                  </h4>

                  {/* Rating & Travel Time */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.65rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#b45309', fontWeight: '600' }}>
                      <Star size={13} fill="#f59e0b" color="#f59e0b" />
                      {place.rating ? place.rating.toFixed(1) : '4.5'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <Clock size={13} color="#0d9488" />
                      ~{travelTimeStr}
                    </span>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', marginTop: '0.5rem' }}>
                    <Link
                      to={`/places/${place._id}`}
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: '0.75rem', padding: '0.35rem 0.5rem', textAlign: 'center' }}
                    >
                      View Details
                    </Link>
                    <a
                      href={directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.75rem', padding: '0.35rem 0.5rem', textAlign: 'center', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                      title="Open in Google Maps"
                    >
                      <ExternalLink size={12} />
                      Directions
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
    </MapErrorBoundary>
  );
};

export default MapComponent;
