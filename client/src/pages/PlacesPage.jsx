import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Compass, AlertTriangle, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import PlaceCard from '../components/PlaceCard';
import PlaceSkeletonCard from '../components/PlaceSkeletonCard';
import FilterBar from '../components/FilterBar';
import {
  REFERENCE_LATITUDE,
  REFERENCE_LONGITUDE,
  REFERENCE_LOCATION_NAME
} from '../config/constants';

const PlacesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [places, setPlaces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const searchQuery = searchParams.get('search') || '';
  const selectedCategories = searchParams.get('category')
    ? searchParams.get('category').split(',').map((c) => c.trim()).filter(Boolean)
    : [];
  const openNowOnly = searchParams.get('openNow') === 'true';
  const sortBy = searchParams.get('sortBy') || searchParams.get('sort') || 'nearest';

  // Fetch categories on mount
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.getCategories();
        if (res.success) {
          setCategories(res.data);
        }
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCats();
  }, []);

  // Fetch places whenever filters change
  useEffect(() => {
    const fetchPlaces = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.getPlaces({
          search: searchQuery,
          categories: selectedCategories,
          openNow: openNowOnly,
          sort: sortBy,
          sortBy
        });
        if (res.success) {
          setPlaces(res.data);
        } else {
          setError(res.message || 'Failed to fetch places from server');
        }
      } catch (err) {
        console.error('Error fetching places:', err);
        setError('Unable to connect to the RockCity Explorer backend server. Please check your internet connection or server status and try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [searchQuery, searchParams.get('category'), openNowOnly, sortBy]);

  // Filter Handlers
  const handleSearchChange = (val) => {
    const nextParams = new URLSearchParams(searchParams);
    if (val.trim()) {
      nextParams.set('search', val);
    } else {
      nextParams.delete('search');
    }
    setSearchParams(nextParams);
  };

  const handleCategoryToggle = (catName) => {
    const nextParams = new URLSearchParams(searchParams);
    let current = selectedCategories;
    if (current.includes(catName)) {
      current = current.filter((c) => c !== catName);
    } else {
      current = [...current, catName];
    }

    if (current.length > 0) {
      nextParams.set('category', current.join(','));
    } else {
      nextParams.delete('category');
    }
    setSearchParams(nextParams);
  };

  const handleOpenNowToggle = () => {
    const nextParams = new URLSearchParams(searchParams);
    if (!openNowOnly) {
      nextParams.set('openNow', 'true');
    } else {
      nextParams.delete('openNow');
    }
    setSearchParams(nextParams);
  };

  const handleSortChange = (newSort) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('sort', newSort);
    nextParams.set('sortBy', newSort);
    setSearchParams(nextParams);
  };

  const handleClearFilters = () => {
    setSearchParams({});
  };

  return (
    <div style={{ padding: '2.5rem 0 5rem', minHeight: '80vh', backgroundColor: '#f8fafc' }}>
      <div className="container">
        {/* Page Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0d9488', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
            <Compass size={16} />
            <span>Catalogue & Discovery</span>
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#0f172a', marginBottom: '0.5rem' }}>
            Explore Kurunegala Destinations
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '700px' }}>
            Browse curated local places sorted by straight-line proximity to the fixed Kurunegala reference location ({REFERENCE_LATITUDE}, {REFERENCE_LONGITUDE}).
          </p>
        </div>

        {/* Filter Controls Bar */}
        <FilterBar
          categories={categories}
          selectedCategories={selectedCategories}
          onCategoryToggle={handleCategoryToggle}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          openNowOnly={openNowOnly}
          onOpenNowToggle={handleOpenNowToggle}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          onClearFilters={handleClearFilters}
          totalResults={places.length}
        />

        {/* Content Body */}
        {loading ? (
          /* Skeleton Loading Cards (SRS Section 28) */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: '1.75rem'
          }}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <PlaceSkeletonCard key={n} />
            ))}
          </div>
        ) : error ? (
          /* Error State Message (SRS Section 27) */
          <div className="error-banner">
            <AlertTriangle className="error-banner-icon" size={26} />
            <div style={{ flexGrow: 1 }}>
              <div className="error-banner-title">Service Connection Issue</div>
              <div className="error-banner-text">{error}</div>
              <button
                onClick={() => window.location.reload()}
                className="btn btn-secondary btn-sm"
                style={{ marginTop: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <RefreshCw size={14} />
                <span>Retry Connection</span>
              </button>
            </div>
          </div>
        ) : places.length === 0 ? (
          /* Exact required empty state message (SRS Section 36) */
          <div className="empty-state">
            <Compass className="empty-state-icon" />
            <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
              No places found.
            </h3>
            <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '1.5rem' }}>
              Try changing your filters.
            </p>
            <button onClick={handleClearFilters} className="btn btn-primary" style={{ borderRadius: '9999px' }}>
              Reset All Filters
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: '1.75rem'
          }}>
            {places.map((place) => (
              <PlaceCard key={place._id} place={place} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlacesPage;
