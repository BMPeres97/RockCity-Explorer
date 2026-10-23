import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Plus,
  Edit,
  Archive,
  RotateCcw,
  Search,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  MapPin,
  Clock,
  Compass,
  X,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { formatDistance } from '../../utils/geoDistance';
import {
  REFERENCE_LATITUDE,
  REFERENCE_LONGITUDE
} from '../../config/constants';

const AdminPlacesPage = () => {
  const { isAuthenticated, admin, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'archived'
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  const fetchPlaces = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminPlaces({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: searchQuery
      });
      if (res.success) {
        setPlaces(res.data);
      }
    } catch (err) {
      console.error(err);
      setNotification({ type: 'error', text: 'Failed to load places.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchPlaces();
    }
  }, [isAuthenticated, statusFilter, searchQuery]);

  const handleArchive = async (place) => {
    if (!window.confirm(`Archive "${place.name}"? It will be hidden from tourists but preserved in database.`)) {
      return;
    }
    try {
      await api.archiveAdminPlace(place._id);
      setNotification({ type: 'success', text: `Place "${place.name}" archived successfully.` });
      fetchPlaces();
    } catch (err) {
      setNotification({ type: 'error', text: err.message || 'Failed to archive place' });
    }
  };

  const handleRestore = async (place) => {
    try {
      await api.restoreAdminPlace(place._id);
      setNotification({ type: 'success', text: `Place "${place.name}" restored to active status!` });
      fetchPlaces();
    } catch (err) {
      setNotification({ type: 'error', text: err.message || 'Failed to restore place' });
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
        {/* Navigation & Actions Top Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.75rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <Link
              to="/admin"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                color: '#64748b',
                fontSize: '0.875rem',
                fontWeight: '600',
                marginBottom: '0.35rem'
              }}
            >
              <ArrowLeft size={16} />
              <span>Back to Control Panel</span>
            </Link>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              Place Management
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.2rem' }}>
              Manage active destinations and soft-deleted archives.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button onClick={fetchPlaces} className="btn btn-secondary btn-sm" title="Refresh records">
              <RefreshCw size={15} />
              <span>Refresh</span>
            </button>
            <Link to="/admin/places/new" className="btn btn-primary" style={{ borderRadius: '10px' }}>
              <Plus size={18} />
              <span>Add New Place</span>
            </Link>
          </div>
        </div>

        {/* Notification Banner */}
        {notification && (
          <div style={{
            backgroundColor: notification.type === 'success' ? '#ecfdf5' : '#fef2f2',
            border: `1px solid ${notification.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
            color: notification.type === 'success' ? '#065f46' : '#991b1b',
            borderRadius: '12px',
            padding: '0.85rem 1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>
              {notification.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              <span>{notification.text}</span>
            </div>
            <button onClick={() => setNotification(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>
              <X size={16} />
            </button>
          </div>
        )}

        {/* Filter Controls Row */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '1.25rem',
          border: '1px solid #e2e8f0',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
        }}>
          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setStatusFilter('all')}
              className={`btn btn-sm ${statusFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: '8px' }}
            >
              All Records
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`btn btn-sm ${statusFilter === 'active' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: '8px' }}
            >
              Active Only
            </button>
            <button
              onClick={() => setStatusFilter('archived')}
              className={`btn btn-sm ${statusFilter === 'archived' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: '8px' }}
            >
              Archived (Soft Deleted)
            </button>
          </div>

          {/* Search Input */}
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search table by name/address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-control"
              style={{ height: '40px', paddingLeft: '2.5rem', fontSize: '0.85rem' }}
            />
          </div>
        </div>

        {/* Place Management Table (Sections 17 & 21) */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: '700' }}>
                  <th style={{ padding: '1rem' }}>Name</th>
                  <th style={{ padding: '1rem' }}>Category</th>
                  <th style={{ padding: '1rem' }}>Address</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem' }}>Last Updated</th>
                  <th style={{ padding: '1rem' }}>Updated By</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                      <div className="spinner" />
                    </td>
                  </tr>
                ) : places.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#64748b' }}>
                      <div style={{ fontWeight: '700', fontSize: '1.05rem', color: '#334155', marginBottom: '0.35rem' }}>
                        {statusFilter === 'archived' ? 'No archived places.' : 'No places found.'}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                        {statusFilter === 'archived'
                          ? 'All Kurunegala destinations are currently active in the tourist catalogue.'
                          : 'Try changing your search query or status filter.'}
                      </div>
                    </td>
                  </tr>
                ) : (
                  places.map((place) => (
                    <tr
                      key={place._id}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        backgroundColor: place.isArchived ? '#fafaf9' : '#ffffff',
                        transition: 'background-color 0.15s'
                      }}
                    >
                      {/* Name & Thumbnail */}
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img
                            src={place.thumbnail || place.imageUrl || (place.images && place.images[0])}
                            alt={place.name}
                            style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.95rem' }}>
                              {place.name}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                              {formatDistance(place.distanceFromReference)} from reference center
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td style={{ padding: '1rem' }}>
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

                      {/* Address */}
                      <td style={{ padding: '1rem', color: '#475569', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {place.address}
                      </td>

                      {/* Status (Active / Archived) */}
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '9999px',
                          backgroundColor: place.isArchived ? '#fef3c7' : '#ecfdf5',
                          color: place.isArchived ? '#b45309' : '#059669',
                          border: `1px solid ${place.isArchived ? 'rgba(217,119,6,0.3)' : 'rgba(16,185,129,0.3)'}`
                        }}>
                          <span style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: place.isArchived ? '#d97706' : '#10b981'
                          }} />
                          <span>{place.isArchived ? 'Archived' : 'Active'}</span>
                        </span>
                      </td>

                      {/* Last Updated (Section 21) */}
                      <td style={{ padding: '1rem', color: '#334155', fontSize: '0.825rem' }}>
                        <div>{new Date(place.updatedAt || place.createdAt).toLocaleDateString()}</div>
                        <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                          {new Date(place.updatedAt || place.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      {/* Updated By (Section 21) */}
                      <td style={{ padding: '1rem', color: '#334155', fontWeight: '600', fontSize: '0.825rem' }}>
                        {place.updatedBy || 'System / Admin'}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                          {/* Edit Action */}
                          <Link
                            to={`/admin/places/${place._id}/edit`}
                            className="btn btn-secondary btn-sm"
                            title="Edit place details and coordinates"
                          >
                            <Edit size={14} />
                            <span>Edit</span>
                          </Link>

                          {/* Archive or Restore Soft Delete Action */}
                          {place.isArchived ? (
                            <button
                              onClick={() => handleRestore(place)}
                              className="btn btn-sm"
                              style={{ backgroundColor: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0' }}
                              title="Restore place to public tourist view"
                            >
                              <RotateCcw size={14} />
                              <span>Restore</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleArchive(place)}
                              className="btn btn-sm btn-outline"
                              style={{ color: '#d97706', borderColor: '#fde68a' }}
                              title="Archive place (soft-delete)"
                            >
                              <Archive size={14} />
                              <span>Archive</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPlacesPage;
