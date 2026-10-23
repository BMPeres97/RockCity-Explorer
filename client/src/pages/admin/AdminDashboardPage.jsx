import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Plus,
  MapPin,
  Compass,
  Archive,
  CheckCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  FolderKanban,
  RefreshCw,
  LogOut,
  Calendar
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  REFERENCE_LATITUDE,
  REFERENCE_LONGITUDE,
  REFERENCE_LOCATION_NAME
} from '../../config/constants';

const AdminDashboardPage = () => {
  const { isAuthenticated, admin, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  const loadSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getAdminSummary();
      if (res.success) {
        setSummary(res.data);
      }
    } catch (err) {
      console.error('Error fetching admin summary:', err);
      setError(err.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadSummary();
    }
  }, [isAuthenticated]);

  if (authLoading || (!isAuthenticated && authLoading)) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 0' }}>
        <div className="spinner" />
      </div>
    );
  }

  const activeCount = summary?.totalActive ?? 0;
  const archivedCount = summary?.totalArchived ?? 0;
  const totalPlaces = summary?.totalPlaces ?? 0;
  const categories = summary?.categoryStats || [];
  const recentPlaces = summary?.recentlyUpdated || [];

  return (
    <div style={{ padding: '2.5rem 0 5rem', backgroundColor: '#f8fafc', minHeight: '85vh' }}>
      <div className="container">
        {/* Admin Navigation Strip */}
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
                Administrator Overview
              </span>
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
              RockCity Explorer Control Panel
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Logged in as <strong style={{ color: '#f1f5f9' }}>{admin?.username || admin?.email || 'admin'}</strong>
            </p>
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/admin/places/new" className="btn btn-primary btn-sm" style={{ padding: '0.6rem 1.1rem' }}>
              <Plus size={16} />
              <span>Add New Place</span>
            </Link>
            <Link to="/admin/places" className="btn btn-secondary btn-sm" style={{ padding: '0.6rem 1.1rem' }}>
              <FolderKanban size={16} />
              <span>Manage Places</span>
            </Link>
            <button onClick={logout} className="btn btn-outline btn-sm" style={{ color: '#f87171', borderColor: '#7f1d1d' }}>
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Metric Cards Row (SRS Section 28: Dashboard loading state) */}
        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2rem'
          }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card" style={{ padding: '1.5rem', backgroundColor: '#ffffff' }}>
                <div className="skeleton" style={{ width: '50%', height: '14px', borderRadius: '4px', marginBottom: '0.75rem' }} />
                <div className="skeleton" style={{ width: '35%', height: '34px', borderRadius: '6px', marginBottom: '0.5rem' }} />
                <div className="skeleton" style={{ width: '70%', height: '12px', borderRadius: '4px' }} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2rem'
          }}>
            {/* Active Places Card */}
            <div className="card" style={{ padding: '1.5rem', backgroundColor: '#ffffff', borderLeft: '4px solid #10b981' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.775rem', fontWeight: '700', textTransform: 'uppercase', color: '#64748b' }}>
                  Active Places
                </span>
                <div style={{ backgroundColor: '#ecfdf5', color: '#10b981', padding: '0.35rem', borderRadius: '8px' }}>
                  <CheckCircle size={18} />
                </div>
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#0f172a', lineHeight: 1.1 }}>
                {activeCount}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.35rem' }}>
                Visible to tourists in Kurunegala
              </div>
            </div>

            {/* Archived Places Card (Soft Delete) */}
            <div className="card" style={{ padding: '1.5rem', backgroundColor: '#ffffff', borderLeft: '4px solid #f59e0b' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.775rem', fontWeight: '700', textTransform: 'uppercase', color: '#64748b' }}>
                  Archived Places
                </span>
                <div style={{ backgroundColor: '#fffbeb', color: '#f59e0b', padding: '0.35rem', borderRadius: '8px' }}>
                  <Archive size={18} />
                </div>
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#0f172a', lineHeight: 1.1 }}>
                {archivedCount}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.35rem' }}>
                Soft-deleted (hidden from tourist views)
              </div>
            </div>

            {/* Total Catalogue Records */}
            <div className="card" style={{ padding: '1.5rem', backgroundColor: '#ffffff', borderLeft: '4px solid #0d9488' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.775rem', fontWeight: '700', textTransform: 'uppercase', color: '#64748b' }}>
                  Total in Database
                </span>
                <div style={{ backgroundColor: '#ccfbf1', color: '#0d9488', padding: '0.35rem', borderRadius: '8px' }}>
                  <FolderKanban size={18} />
                </div>
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#0f172a', lineHeight: 1.1 }}>
                {totalPlaces}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.35rem' }}>
                Across {categories.length} tourism categories
              </div>
            </div>

            {/* Reference Location Info */}
            <div className="card" style={{ padding: '1.5rem', backgroundColor: '#ffffff', borderLeft: '4px solid #38bdf8' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.775rem', fontWeight: '700', textTransform: 'uppercase', color: '#64748b' }}>
                  Reference Center
                </span>
                <div style={{ backgroundColor: '#e0f2fe', color: '#0284c7', padding: '0.35rem', borderRadius: '8px' }}>
                  <Compass size={18} />
                </div>
              </div>
              <div style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a', lineHeight: 1.2 }}>
                {REFERENCE_LATITUDE}, {REFERENCE_LONGITUDE}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.35rem' }}>
                {REFERENCE_LOCATION_NAME}
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Content Grid: Categories Breakdown & Recently Updated */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem'
        }}>
          {/* Places by Category */}
          <div className="card" style={{ padding: '1.75rem', backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                Places by Category
              </h3>
              <Link to="/admin/places" style={{ fontSize: '0.825rem', color: '#0d9488', fontWeight: '700' }}>
                View Table
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {loading ? (
                [1, 2, 3, 4].map((i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <div className="skeleton" style={{ width: '45%', height: '14px', borderRadius: '4px' }} />
                    <div className="skeleton" style={{ width: '100%', height: '8px', borderRadius: '4px' }} />
                  </div>
                ))
              ) : categories.map((cat) => {
                const percent = totalPlaces > 0 ? Math.round((cat.count / totalPlaces) * 100) : 0;
                return (
                  <div key={cat._id} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                      <span style={{ fontWeight: '700', color: '#334155' }}>{cat._id}</span>
                      <span style={{ color: '#64748b', fontSize: '0.8rem' }}>
                        {cat.count} places ({cat.activeCount} active)
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div style={{ height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${percent}%`,
                        height: '100%',
                        backgroundColor: '#0d9488',
                        borderRadius: '4px'
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recently Updated Places */}
          <div className="card" style={{ padding: '1.75rem', backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                Recently Updated Places
              </h3>
              <Link to="/admin/places" style={{ fontSize: '0.825rem', color: '#0d9488', fontWeight: '700' }}>
                All Places
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {loading ? (
                [1, 2, 3].map((i) => (
                  <div key={i} className="skeleton" style={{ height: '56px', borderRadius: '10px' }} />
                ))
              ) : recentPlaces.length === 0 ? (
                <p style={{ color: '#64748b', fontSize: '0.875rem' }}>No recently updated places.</p>
              ) : (
                recentPlaces.map((p) => (
                  <div
                    key={p._id}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '10px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.75rem'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#0f172a' }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.15rem' }}>
                        <span>Updated by <strong>{p.updatedBy || 'Admin'}</strong></span>
                        <span>•</span>
                        <span>{new Date(p.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        padding: '0.15rem 0.45rem',
                        borderRadius: '4px',
                        backgroundColor: p.isArchived ? '#fef3c7' : '#ecfdf5',
                        color: p.isArchived ? '#b45309' : '#059669'
                      }}>
                        {p.isArchived ? 'Archived' : 'Active'}
                      </span>
                      <Link
                        to={`/admin/places/${p._id}/edit`}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
