import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  MapPin,
  Compass,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Calendar,
  Image as ImageIcon,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import AdminMapPicker from '../../components/AdminMapPicker';
import {
  REFERENCE_LATITUDE,
  REFERENCE_LONGITUDE
} from '../../config/constants';

const AdminPlaceFormPage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Religious',
    description: '',
    address: '',
    latitude: REFERENCE_LATITUDE,
    longitude: REFERENCE_LONGITUDE,
    travelTips: '',
    imageUrl: '',
    openingHoursText: '06:00 - 18:00',
    entryFee: 'Free admission',
    dressCode: 'Modest temple attire covering shoulders and knees',
    peakHours: 'Late afternoon (16:00 - 18:00)',
    rating: 4.5,
    popularity: 85
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Fetch categories and existing place if editing
  useEffect(() => {
    const init = async () => {
      try {
        const catRes = await api.getCategories();
        if (catRes.success) {
          setCategories(catRes.data);
          if (!isEditMode && catRes.data.length > 0) {
            setFormData((prev) => ({ ...prev, category: catRes.data[0].name }));
          }
        }

        if (isEditMode) {
          const placeRes = await api.getPlaceById(id);
          if (placeRes.success && placeRes.data) {
            const p = placeRes.data;
            const hoursStr = p.openingHours?.alwaysOpen
              ? 'Open 24 Hours'
              : (p.openingHours?.open && p.openingHours?.close ? `${p.openingHours.open} - ${p.openingHours.close}` : (typeof p.openingHours === 'string' ? p.openingHours : '06:00 - 18:00'));

            setFormData({
              name: p.name || '',
              category: p.category || (catRes.data[0]?.name || 'Religious'),
              description: p.description || '',
              address: p.address || '',
              latitude: Number(p.latitude ?? REFERENCE_LATITUDE),
              longitude: Number(p.longitude ?? REFERENCE_LONGITUDE),
              travelTips: p.travelTips || (Array.isArray(p.localTravelTips) ? p.localTravelTips.join('\n') : ''),
              imageUrl: p.imageUrl || p.thumbnail || '',
              openingHoursText: hoursStr,
              entryFee: typeof p.entryFee === 'string' ? p.entryFee : (p.entryFee?.isFree ? 'Free admission' : `Local: ${p.entryFee?.localPrice} LKR / Foreign: ${p.entryFee?.foreignPrice} LKR`),
              dressCode: p.dressCode || '',
              peakHours: p.peakHours || '',
              rating: p.rating || 4.5,
              popularity: p.popularity || 85
            });
          }
        }
      } catch (err) {
        console.error(err);
        setServerError('Failed to initialize form data.');
      } finally {
        setFetching(false);
      }
    };

    if (isAuthenticated) {
      init();
    }
  }, [id, isEditMode, isAuthenticated]);

  // Coordinate change from Leaflet map picker
  const handleMapLocationChange = (lat, lng) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }));
    // Clear coordinate errors if any
    setErrors((prev) => ({
      ...prev,
      latitude: null,
      longitude: null
    }));
  };

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Place name is required.';
    }
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required.';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required.';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required.';
    }
    if (!formData.travelTips.trim()) {
      newErrors.travelTips = 'Travel tips are required.';
    }
    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Image URL is required.';
    } else if (!/^https?:\/\/.+/i.test(formData.imageUrl.trim())) {
      newErrors.imageUrl = 'Please enter a valid HTTP/HTTPS image URL.';
    }

    // Latitude validation (-90 to 90)
    if (formData.latitude === '' || isNaN(formData.latitude)) {
      newErrors.latitude = 'Valid latitude coordinate is required.';
    } else if (Number(formData.latitude) < -90 || Number(formData.latitude) > 90) {
      newErrors.latitude = 'Latitude must be between -90 and 90 degrees.';
    }

    // Longitude validation (-180 to 180)
    if (formData.longitude === '' || isNaN(formData.longitude)) {
      newErrors.longitude = 'Valid longitude coordinate is required.';
    } else if (Number(formData.longitude) < -180 || Number(formData.longitude) > 180) {
      newErrors.longitude = 'Longitude must be between -180 and 180 degrees.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        category: formData.category.trim(),
        description: formData.description.trim(),
        address: formData.address.trim(),
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        travelTips: formData.travelTips.trim(),
        localTravelTips: formData.travelTips.split('\n').map((t) => t.trim()).filter(Boolean),
        imageUrl: formData.imageUrl.trim(),
        thumbnail: formData.imageUrl.trim(),
        openingHours: {
          open: '06:00',
          close: '18:00',
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          alwaysOpen: false
        },
        entryFee: formData.entryFee.trim(),
        dressCode: formData.dressCode.trim(),
        peakHours: formData.peakHours.trim(),
        rating: Number(formData.rating) || 4.5,
        popularity: Number(formData.popularity) || 85
      };

      if (isEditMode) {
        await api.updateAdminPlace(id, payload);
      } else {
        await api.createAdminPlace(payload);
      }

      navigate('/admin/places');
    } catch (err) {
      console.error(err);
      // Display authoritative backend duplicate warning or validation message
      setServerError(err.message || 'Failed to save place.');
    } finally {
      setSubmitting(false);
    }
  };

  if (fetching || authLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 0' }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div style={{ padding: '2.5rem 0 5rem', backgroundColor: '#f8fafc', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '880px' }}>
        {/* Header Breadcrumbs */}
        <div style={{ marginBottom: '1.75rem' }}>
          <Link
            to="/admin/places"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#64748b',
              fontSize: '0.875rem',
              fontWeight: '600',
              marginBottom: '0.5rem'
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to Place Management</span>
          </Link>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
            {isEditMode ? 'Edit Destination' : 'Add New Tourist Destination'}
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Enter destination metadata and select geographic coordinates with the interactive Leaflet map picker.
          </p>
        </div>

        {/* Server Error Alert (e.g. Duplicate Warning) */}
        {serverError && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#991b1b',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            marginBottom: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            boxShadow: '0 2px 4px rgba(239, 68, 68, 0.1)'
          }}>
            <AlertCircle size={22} style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>Submission Error</div>
              <div style={{ fontSize: '0.875rem' }}>{serverError}</div>
            </div>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Card 1: Core Details */}
          <div className="card" style={{ padding: '2rem', backgroundColor: '#ffffff' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
              Basic Destination Details
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Place Name */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: '#334155', marginBottom: '0.35rem' }}>
                  Place Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ethagala (Elephant Rock) & Samadhi Buddha"
                  className="input-control"
                  style={{ borderColor: errors.name ? '#ef4444' : undefined }}
                />
                {errors.name && <div style={{ color: '#ef4444', fontSize: '0.775rem', marginTop: '0.25rem' }}>{errors.name}</div>}
              </div>

              {/* Category & Rating */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: '#334155', marginBottom: '0.35rem' }}>
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input-control"
                    style={{ cursor: 'pointer', fontWeight: '600' }}
                  >
                    {categories.map((cat) => (
                      <option key={cat._id || cat.name} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && <div style={{ color: '#ef4444', fontSize: '0.775rem', marginTop: '0.25rem' }}>{errors.category}</div>}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: '#334155', marginBottom: '0.35rem' }}>
                    Rating (1.0 to 5.0)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    className="input-control"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: '#334155', marginBottom: '0.35rem' }}>
                  Address *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. Ethagala Peak Road, Kurunegala 60000, Sri Lanka"
                  className="input-control"
                  style={{ borderColor: errors.address ? '#ef4444' : undefined }}
                />
                {errors.address && <div style={{ color: '#ef4444', fontSize: '0.775rem', marginTop: '0.25rem' }}>{errors.address}</div>}
              </div>

              {/* Description */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: '#334155', marginBottom: '0.35rem' }}>
                  Full Description *
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed narrative describing the history, cultural importance, geological features, and tourist attractions..."
                  className="input-control"
                  style={{ borderColor: errors.description ? '#ef4444' : undefined, lineHeight: 1.6 }}
                />
                {errors.description && <div style={{ color: '#ef4444', fontSize: '0.775rem', marginTop: '0.25rem' }}>{errors.description}</div>}
              </div>

              {/* Image URL */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: '#334155', marginBottom: '0.35rem' }}>
                  Image URL *
                </label>
                <div style={{ position: 'relative' }}>
                  <ImageIcon size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="input-control"
                    style={{ paddingLeft: '2.5rem', borderColor: errors.imageUrl ? '#ef4444' : undefined }}
                  />
                </div>
                {errors.imageUrl && <div style={{ color: '#ef4444', fontSize: '0.775rem', marginTop: '0.25rem' }}>{errors.imageUrl}</div>}
              </div>
            </div>
          </div>

          {/* Card 2: Interactive Leaflet Map Picker (Section 18) */}
          <div className="card" style={{ padding: '2rem', backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>
                  Location Coordinates & Leaflet Map Picker
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.825rem', marginTop: '0.2rem' }}>
                  New places default to My Home Location ({REFERENCE_LATITUDE}, {REFERENCE_LONGITUDE}). Click the map, drag the marker, or enter coordinates to set the place location.
                </p>
              </div>
              <span style={{ fontSize: '0.75rem', backgroundColor: '#ccfbf1', color: '#0d9488', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: '700' }}>
                Leaflet OpenStreetMap
              </span>
            </div>

            {/* Embedded Map Picker */}
            <div style={{ marginBottom: '1.25rem' }}>
              <AdminMapPicker
                latitude={formData.latitude}
                longitude={formData.longitude}
                onChange={handleMapLocationChange}
                height="340px"
              />
            </div>

            {/* Latitude and Longitude Input Fields (Section 18) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.35rem' }}>
                  Latitude * (-90 to 90)
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                  className="input-control"
                  style={{ borderColor: errors.latitude ? '#ef4444' : undefined, fontFamily: 'monospace' }}
                />
                {errors.latitude && <div style={{ color: '#ef4444', fontSize: '0.775rem', marginTop: '0.25rem' }}>{errors.latitude}</div>}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.35rem' }}>
                  Longitude * (-180 to 180)
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                  className="input-control"
                  style={{ borderColor: errors.longitude ? '#ef4444' : undefined, fontFamily: 'monospace' }}
                />
                {errors.longitude && <div style={{ color: '#ef4444', fontSize: '0.775rem', marginTop: '0.25rem' }}>{errors.longitude}</div>}
              </div>
            </div>
          </div>

          {/* Card 3: Visitor Practicalities & Etiquette */}
          <div className="card" style={{ padding: '2rem', backgroundColor: '#ffffff' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
              Visitor Practicalities & Guidelines
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Opening Hours & Entry Fee */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: '#334155', marginBottom: '0.35rem' }}>
                    Opening Hours *
                  </label>
                  <input
                    type="text"
                    value={formData.openingHoursText}
                    onChange={(e) => setFormData({ ...formData, openingHoursText: e.target.value })}
                    placeholder="e.g. 06:00 - 18:30 daily"
                    className="input-control"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: '#334155', marginBottom: '0.35rem' }}>
                    Entry Fee
                  </label>
                  <input
                    type="text"
                    value={formData.entryFee}
                    onChange={(e) => setFormData({ ...formData, entryFee: e.target.value })}
                    placeholder="e.g. Free admission / LKR 500"
                    className="input-control"
                  />
                </div>
              </div>

              {/* Dress Code & Peak Hours */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: '#334155', marginBottom: '0.35rem' }}>
                    Dress Code / Cultural Etiquette
                  </label>
                  <input
                    type="text"
                    value={formData.dressCode}
                    onChange={(e) => setFormData({ ...formData, dressCode: e.target.value })}
                    placeholder="e.g. Modest attire covering shoulders and knees"
                    className="input-control"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: '#334155', marginBottom: '0.35rem' }}>
                    Peak Visiting Hours
                  </label>
                  <input
                    type="text"
                    value={formData.peakHours}
                    onChange={(e) => setFormData({ ...formData, peakHours: e.target.value })}
                    placeholder="e.g. Late afternoon (16:30 - 18:30)"
                    className="input-control"
                  />
                </div>
              </div>

              {/* Travel Tips */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', color: '#334155', marginBottom: '0.35rem' }}>
                  Local Travel Tips * (one per line)
                </label>
                <textarea
                  rows={3}
                  value={formData.travelTips}
                  onChange={(e) => setFormData({ ...formData, travelTips: e.target.value })}
                  placeholder="Climb early morning to avoid midday heat&#10;Carry bottled water and sunscreen&#10;Tuk-tuks available from Kurunegala Clock Tower"
                  className="input-control"
                  style={{ borderColor: errors.travelTips ? '#ef4444' : undefined }}
                />
                {errors.travelTips && <div style={{ color: '#ef4444', fontSize: '0.775rem', marginTop: '0.25rem' }}>{errors.travelTips}</div>}
              </div>
            </div>
          </div>

          {/* Form Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1rem' }}>
            <Link to="/admin/places" className="btn btn-secondary btn-lg" style={{ borderRadius: '12px' }}>
              Cancel
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-lg"
              style={{ borderRadius: '12px', minWidth: '160px' }}
            >
              <Save size={18} />
              <span>{submitting ? 'Saving...' : (isEditMode ? 'Update Place' : 'Create Destination')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPlaceFormPage;
