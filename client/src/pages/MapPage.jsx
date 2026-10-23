import React, { useState, useEffect } from 'react';
import { Compass, Filter, Clock, Search, Navigation, List, MapPin } from 'lucide-react';
import { api } from '../services/api';
import MapComponent from '../components/MapComponent';
import {
  REFERENCE_LATITUDE,
  REFERENCE_LONGITUDE,
  REFERENCE_LOCATION_NAME
} from '../config/constants';
import { formatDistance } from '../utils/geoDistance';

const MapPage = () => {
  const [places, setPlaces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Load categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.getCategories();
        if (res.success) setCategories(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchCats();
  }, []);

  // Fetch places with active map filters
  useEffect(() => {
    const fetchPlaces = async () => {
      setLoading(true);
      try {
        const res = await api.getPlaces({
          search: searchQuery,
          categories: selectedCategories,
          openNow: openNowOnly,
          sortBy: 'nearest'
        });
        if (res.success) {
          setPlaces(res.data);
        }
      } catch (err) {
        console.error('Error loading places for map:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [searchQuery, selectedCategories, openNowOnly]);

  const toggleCategory = (catName) => {
    setSelectedCategories((prev) =>
      prev.includes(catName) ? prev.filter((c) => c !== catName) : [...prev, catName]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setOpenNowOnly(false);
    setSearchQuery('');
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 72px)', display: 'flex', flexDirection: 'column' }}>
      {/* Top Filter Bar */}
      <div style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '0.85rem 1.25rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
        zIndex: 10
      }}>
        <div className="container-wide" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          {/* Title & Reference Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              backgroundColor: '#ccfbf1',
              color: '#0d9488',
              padding: '0.45rem',
              borderRadius: '8px'
            }}>
              <MapPin size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                Kurunegala Interactive Map
              </h2>
              <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span>Centered at fixed reference:</span>
                <strong style={{ color: '#b45309' }}>{REFERENCE_LOCATION_NAME} ({REFERENCE_LATITUDE}, {REFERENCE_LONGITUDE})</strong>
              </div>
            </div>
          </div>

          {/* Quick Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', width: '220px' }}>
              <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search pins..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-control"
                style={{ height: '38px', paddingLeft: '2.25rem', fontSize: '0.85rem' }}
              />
            </div>

            {/* Open Now Toggle */}
            <button
              onClick={() => setOpenNowOnly(!openNowOnly)}
              className={`btn btn-sm ${openNowOnly ? 'btn-primary' : 'btn-secondary'}`}
              style={{
                height: '38px',
                borderRadius: '8px',
                border: openNowOnly ? '1px solid #0d9488' : '1px solid #cbd5e1',
                fontSize: '0.825rem'
              }}
              title="Show only places that are open now"
            >
              <Clock size={15} />
              <span>Open Now</span>
            </button>

            {/* Toggle List Sidebar */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="btn btn-secondary btn-sm"
              style={{ height: '38px', borderRadius: '8px', fontSize: '0.825rem' }}
            >
              <List size={15} />
              <span>{sidebarOpen ? 'Hide List' : `Show List (${places.length})`}</span>
            </button>
          </div>
        </div>

        {/* Categories Strip */}
        <div className="container-wide" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.65rem', paddingTop: '0.65rem', borderTop: '1px solid #f1f5f9' }}>
          <span style={{ fontSize: '0.775rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
            Categories:
          </span>
          {categories.map((cat) => {
            const isSelected = selectedCategories.includes(cat.name);
            return (
              <button
                key={cat._id || cat.name}
                onClick={() => toggleCategory(cat.name)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.25rem 0.65rem',
                  borderRadius: '9999px',
                  fontSize: '0.775rem',
                  fontWeight: isSelected ? '700' : '600',
                  border: isSelected ? '2px solid #0d9488' : '1px solid #cbd5e1',
                  backgroundColor: isSelected ? '#ccfbf1' : '#ffffff',
                  color: isSelected ? '#0f766e' : '#475569',
                  cursor: 'pointer'
                }}
              >
                <span>{cat.name}</span>
              </button>
            );
          })}

          {(selectedCategories.length > 0 || openNowOnly || searchQuery) && (
            <button
              onClick={clearAllFilters}
              style={{
                marginLeft: 'auto',
                background: 'none',
                border: 'none',
                color: '#ef4444',
                fontSize: '0.775rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Map Content with Side Drawer */}
      <div style={{ flexGrow: 1, display: 'flex', position: 'relative', height: 'calc(100vh - 195px)', minHeight: '500px' }}>
        {/* Left Side Place List Drawer */}
        {sidebarOpen && (
          <aside
            style={{
              width: '340px',
              backgroundColor: '#ffffff',
              borderRight: '1px solid #e2e8f0',
              overflowY: 'auto',
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '2px 0 6px rgba(0,0,0,0.03)',
              zIndex: 5
            }}
          >
            <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid #f1f5f9', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.825rem', fontWeight: '700', color: '#475569' }}>
                Visible Places ({places.length})
              </span>
              <span style={{ fontSize: '0.75rem', color: '#0d9488', fontWeight: '600' }}>
                Sorted by nearest
              </span>
            </div>

            <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
                  <div className="spinner" style={{ width: '32px', height: '32px', margin: '0 auto 0.75rem' }} />
                  <p style={{ fontSize: '0.825rem', color: '#64748b' }}>Updating map markers...</p>
                </div>
              ) : places.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#64748b' }}>
                  <Compass size={32} style={{ color: '#cbd5e1', marginBottom: '0.5rem' }} />
                  <p style={{ fontSize: '0.85rem', fontWeight: '600' }}>No places match current map filters.</p>
                  <button onClick={clearAllFilters} className="btn btn-secondary btn-sm" style={{ marginTop: '0.5rem' }}>
                    Reset Filters
                  </button>
                </div>
              ) : (
                places.map((place) => (
                  <div
                    key={place._id}
                    style={{
                      display: 'flex',
                      gap: '0.75rem',
                      padding: '0.65rem',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#ffffff',
                      transition: 'background-color 0.15s'
                    }}
                  >
                    <img
                      src={place.thumbnail || (place.images && place.images[0])}
                      alt={place.name}
                      style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
                    />
                    <div style={{ flexGrow: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', color: '#0d9488' }}>
                          {place.category}
                        </span>
                        <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#0f172a' }}>
                          {formatDistance(place.distanceFromReference)}
                        </span>
                      </div>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: '700', margin: '0.2rem 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {place.name}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.725rem', color: '#64748b' }}>
                        <span>~{place.travelTimeFormatted || `${place.estimatedTravelMinutes} mins`}</span>
                        <span>•</span>
                        <a
                          href={place.googleMapsDirectionsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#0284c7', textDecoration: 'underline' }}
                        >
                          Directions
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </aside>
        )}

        {/* Leaflet Map Area */}
        <div style={{ flexGrow: 1, height: '100%' }}>
          <MapComponent places={places} height="100%" />
        </div>
      </div>
    </div>
  );
};

export default MapPage;
