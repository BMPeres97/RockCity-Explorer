import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Plus,
  Trash2,
  Edit,
  MapPin,
  Compass,
  Tag,
  CheckCircle,
  AlertCircle,
  X,
  Star,
  ExternalLink,
  LogOut,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { formatDistance } from '../utils/geoDistance';
import {
  REFERENCE_LATITUDE,
  REFERENCE_LONGITUDE,
  REFERENCE_LOCATION_NAME
} from '../config/constants';

const AdminDashboardPage = () => {
  const { isAuthenticated, admin, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('places'); // 'places' | 'categories'
  const [places, setPlaces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState(null);

  // Place Modal state
  const [placeModalOpen, setPlaceModalOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState(null);
  const [placeForm, setPlaceForm] = useState({
    name: '',
    category: 'Religious',
    shortDescription: '',
    description: '',
    address: '',
    latitude: 7.4867,
    longitude: 80.3685,
    thumbnail: '',
    openingHours: { open: '06:00', close: '18:00', alwaysOpen: false },
    entryFee: { isFree: true, localPrice: 0, foreignPrice: 0, currency: 'LKR', note: 'Free' },
    dressCode: 'Modest attire covering shoulders and knees',
    peakHours: 'Late afternoon (16:00 - 18:00)',
    rating: 4.5,
    featured: false
  });

  // Category Modal state
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    color: '#0d9488',
    icon: 'landmark'
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [placesRes, catsRes] = await Promise.all([
        api.getPlaces({ sortBy: 'nearest' }),
        api.getCategories()
      ]);
      if (placesRes.success) setPlaces(placesRes.data);
      if (catsRes.success) setCategories(catsRes.data);
    } catch (err) {
      console.error(err);
      setStatusMessage({ type: 'error', text: 'Failed to load dashboard data' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleOpenAddPlace = () => {
    setEditingPlace(null);
    setPlaceForm({
      name: '',
      category: categories[0]?.name || 'Religious',
      shortDescription: '',
      description: '',
      address: 'Kurunegala, Sri Lanka',
      latitude: 7.4867,
      longitude: 80.3685,
      thumbnail: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
      openingHours: { open: '06:00', close: '18:00', alwaysOpen: false },
      entryFee: { isFree: true, localPrice: 0, foreignPrice: 0, currency: 'LKR', note: 'Free' },
      dressCode: 'Modest temple attire recommended',
      peakHours: '16:00 - 18:00',
      rating: 4.5,
      featured: false
    });
    setPlaceModalOpen(true);
  };

  const handleOpenEditPlace = (place) => {
    setEditingPlace(place);
    setPlaceForm({
      name: place.name || '',
      category: place.category || 'Religious',
      shortDescription: place.shortDescription || '',
      description: place.description || '',
      address: place.address || '',
      latitude: place.latitude || 7.4867,
      longitude: place.longitude || 80.3685,
      thumbnail: place.thumbnail || '',
      openingHours: place.openingHours || { open: '06:00', close: '18:00', alwaysOpen: false },
      entryFee: place.entryFee || { isFree: true, localPrice: 0, foreignPrice: 0, currency: 'LKR', note: 'Free' },
      dressCode: place.dressCode || '',
      peakHours: place.peakHours || '',
      rating: place.rating || 4.5,
      featured: Boolean(place.featured)
    });
    setPlaceModalOpen(true);
  };

  const handleSavePlace = async (e) => {
    e.preventDefault();
    try {
      if (editingPlace) {
        await api.updatePlace(editingPlace._id, placeForm);
        setStatusMessage({ type: 'success', text: `Place "${placeForm.name}" updated successfully!` });
      } else {
        await api.createPlace(placeForm);
        setStatusMessage({ type: 'success', text: `Place "${placeForm.name}" created successfully!` });
      }
      setPlaceModalOpen(false);
      loadData();
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Operation failed' });
    }
  };

  const handleDeletePlace = async (place) => {
    if (!window.confirm(`Are you sure you want to delete "${place.name}"? This action cannot be undone.`)) {
      return;
    }
    try {
      await api.deletePlace(place._id);
      setStatusMessage({ type: 'success', text: `Place "${place.name}" deleted.` });
      loadData();
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to delete place' });
    }
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      await api.createCategory(categoryForm);
      setStatusMessage({ type: 'success', text: `Category "${categoryForm.name}" created!` });
      setCategoryModalOpen(false);
      setCategoryForm({ name: '', description: '', color: '#0d9488', icon: 'tag' });
      loadData();
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to create category' });
    }
  };

  const handleDeleteCategory = async (cat) => {
    if (!window.confirm(`Delete category "${cat.name}"?`)) return;
    try {
      await api.deleteCategory(cat._id);
      setStatusMessage({ type: 'success', text: `Category "${cat.name}" deleted.` });
      loadData();
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to delete category' });
    }
  };

  if (authLoading || (!isAuthenticated && authLoading)) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 0' }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div style={{ padding: '2.5rem 0 5rem', backgroundColor: '#f8fafc', minHeight: '85vh' }}>
      <div className="container-wide">
        {/* Dashboard Header Banner */}
        <div style={{
          backgroundColor: '#0f172a',
          color: '#ffffff',
          borderRadius: '18px',
          padding: '1.75rem 2rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem',
          boxShadow: '0 10px 20px -5px rgba(15, 23, 42, 0.2)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <ShieldCheck size={20} color="#2dd4bf" />
              <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', color: '#2dd4bf', letterSpacing: '0.05em' }}>
                Administrator Management Console
              </span>
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
              RockCity Explorer Dashboard
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Logged in as <strong style={{ color: '#f1f5f9' }}>{admin?.email || 'admin@rockcity.lk'}</strong>
            </p>
          </div>

          {/* Quick Metrics */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ backgroundColor: '#1e293b', padding: '0.75rem 1.25rem', borderRadius: '12px', textAlign: 'center', border: '1px solid #334155' }}>
              <div style={{ fontSize: '0.725rem', color: '#94a3b8', fontWeight: '600' }}>TOTAL PLACES</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#38bdf8' }}>{places.length}</div>
            </div>
            <div style={{ backgroundColor: '#1e293b', padding: '0.75rem 1.25rem', borderRadius: '12px', textAlign: 'center', border: '1px solid #334155' }}>
              <div style={{ fontSize: '0.725rem', color: '#94a3b8', fontWeight: '600' }}>CATEGORIES</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#34d399' }}>{categories.length}</div>
            </div>
            <button onClick={logout} className="btn btn-outline" style={{ color: '#f87171', borderColor: '#7f1d1d' }}>
              <LogOut size={16} />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Status Notification */}
        {statusMessage && (
          <div style={{
            backgroundColor: statusMessage.type === 'success' ? '#ecfdf5' : '#fef2f2',
            border: `1px solid ${statusMessage.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
            color: statusMessage.type === 'success' ? '#065f46' : '#991b1b',
            borderRadius: '12px',
            padding: '0.85rem 1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>
              {statusMessage.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              <span>{statusMessage.text}</span>
            </div>
            <button onClick={() => setStatusMessage(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>
              <X size={16} />
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
          <button
            onClick={() => setActiveTab('places')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1rem',
              fontWeight: '700',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              color: activeTab === 'places' ? '#0d9488' : '#64748b',
              borderBottom: activeTab === 'places' ? '3px solid #0d9488' : 'none'
            }}
          >
            Tourist Places ({places.length})
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1rem',
              fontWeight: '700',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              color: activeTab === 'categories' ? '#0d9488' : '#64748b',
              borderBottom: activeTab === 'categories' ? '3px solid #0d9488' : 'none'
            }}
          >
            Categories ({categories.length})
          </button>
        </div>

        {/* PLACES TAB */}
        {activeTab === 'places' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a' }}>
                  Catalogue Management
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
                  Distances are auto-calculated from fixed reference ({REFERENCE_LATITUDE}, {REFERENCE_LONGITUDE})
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={loadData} className="btn btn-secondary btn-sm">
                  <RefreshCw size={15} /> Refresh
                </button>
                <button onClick={handleOpenAddPlace} className="btn btn-primary btn-sm">
                  <Plus size={16} /> Add New Place
                </button>
              </div>
            </div>

            {/* Places Table */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
            }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: '700' }}>
                      <th style={{ padding: '0.85rem 1rem' }}>Place</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Category</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Distance from Reference</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Coordinates</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Rating</th>
                      <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {places.map((place) => (
                      <tr key={place._id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.15s' }}>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <img
                              src={place.thumbnail || (place.images && place.images[0])}
                              alt={place.name}
                              style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                            />
                            <div>
                              <div style={{ fontWeight: '700', color: '#0f172a' }}>{place.name}</div>
                              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{place.address}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <span style={{
                            fontSize: '0.725rem',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            backgroundColor: '#ccfbf1',
                            color: '#0d9488',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px'
                          }}>
                            {place.category}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: '700', color: '#0f172a' }}>
                          {formatDistance(place.distanceFromReference)}
                        </td>
                        <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontSize: '0.8rem', color: '#64748b' }}>
                          {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}
                        </td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#b45309', fontWeight: '700' }}>
                            <Star size={14} fill="#f59e0b" color="#f59e0b" />
                            <span>{place.rating ? place.rating.toFixed(1) : '4.5'}</span>
                          </div>
                        </td>
                        <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => handleOpenEditPlace(place)}
                              className="btn btn-secondary btn-sm"
                              title="Edit destination"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleDeletePlace(place)}
                              className="btn btn-outline btn-sm"
                              style={{ color: '#ef4444', borderColor: '#fca5a5' }}
                              title="Delete destination"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* CATEGORIES TAB */}
        {activeTab === 'categories' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a' }}>
                  Category Registry
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
                  Manage tourism classifications dynamically
                </p>
              </div>
              <button onClick={() => setCategoryModalOpen(true)} className="btn btn-primary btn-sm">
                <Plus size={16} /> Add Category
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem'
            }}>
              {categories.map((cat) => (
                <div key={cat._id} className="card" style={{ padding: '1.5rem', backgroundColor: '#ffffff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a' }}>
                      {cat.name}
                    </span>
                    <span style={{ fontSize: '0.8rem', backgroundColor: '#f1f5f9', color: '#475569', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontWeight: '700' }}>
                      {cat.placeCount || 0} places
                    </span>
                  </div>
                  <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1rem', minHeight: '40px' }}>
                    {cat.description || 'No description provided.'}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                    <button
                      onClick={() => handleDeleteCategory(cat)}
                      className="btn btn-outline btn-sm"
                      style={{ color: '#ef4444', borderColor: '#fca5a5' }}
                      title="Delete category"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ADD/EDIT PLACE MODAL */}
        {placeModalOpen && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem'
          }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '680px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '2rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a' }}>
                  {editingPlace ? 'Edit Place' : 'Create New Destination'}
                </h3>
                <button onClick={() => setPlaceModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSavePlace} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                    Place Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={placeForm.name}
                    onChange={(e) => setPlaceForm({ ...placeForm, name: e.target.value })}
                    className="input-control"
                    placeholder="e.g. Athugala Elephant Rock"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                      Category *
                    </label>
                    <select
                      value={placeForm.category}
                      onChange={(e) => setPlaceForm({ ...placeForm, category: e.target.value })}
                      className="input-control"
                    >
                      {categories.map((c) => (
                        <option key={c._id || c.name} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                      Rating (1 to 5)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      value={placeForm.rating}
                      onChange={(e) => setPlaceForm({ ...placeForm, rating: Number(e.target.value) })}
                      className="input-control"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                    Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={placeForm.address}
                    onChange={(e) => setPlaceForm({ ...placeForm, address: e.target.value })}
                    className="input-control"
                    placeholder="e.g. Ethagala Peak Road, Kurunegala"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                      Latitude *
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={placeForm.latitude}
                      onChange={(e) => setPlaceForm({ ...placeForm, latitude: Number(e.target.value) })}
                      className="input-control"
                      placeholder="e.g. 7.4867"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                      Longitude *
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={placeForm.longitude}
                      onChange={(e) => setPlaceForm({ ...placeForm, longitude: Number(e.target.value) })}
                      className="input-control"
                      placeholder="e.g. 80.3685"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                    Thumbnail Image URL
                  </label>
                  <input
                    type="url"
                    value={placeForm.thumbnail}
                    onChange={(e) => setPlaceForm({ ...placeForm, thumbnail: e.target.value })}
                    className="input-control"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                    Short Description
                  </label>
                  <input
                    type="text"
                    value={placeForm.shortDescription}
                    onChange={(e) => setPlaceForm({ ...placeForm, shortDescription: e.target.value })}
                    className="input-control"
                    placeholder="Brief 1-line overview"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                    Full Description *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={placeForm.description}
                    onChange={(e) => setPlaceForm({ ...placeForm, description: e.target.value })}
                    className="input-control"
                    placeholder="Comprehensive background, historical context, and tourist attractions..."
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                    Dress Code & Etiquette
                  </label>
                  <input
                    type="text"
                    value={placeForm.dressCode}
                    onChange={(e) => setPlaceForm({ ...placeForm, dressCode: e.target.value })}
                    className="input-control"
                    placeholder="e.g. Modest attire covering shoulders and knees"
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                  <button type="button" onClick={() => setPlaceModalOpen(false)} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingPlace ? 'Save Changes' : 'Create Destination'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ADD CATEGORY MODAL */}
        {categoryModalOpen && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem'
          }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '480px',
              padding: '2rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Add Tourism Category</h3>
                <button onClick={() => setCategoryModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveCategory} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    className="input-control"
                    placeholder="e.g. Adventure, Food & Spices"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                    className="input-control"
                    placeholder="Short description of this category"
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button type="button" onClick={() => setCategoryModalOpen(false)} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
