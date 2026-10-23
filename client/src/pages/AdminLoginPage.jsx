import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, User, AlertCircle, ArrowLeft, Mountain } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/places');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate required fields
    if (!username.trim() || !password) {
      setError('Invalid username or password.');
      return;
    }

    setSubmitting(true);

    try {
      await login(username.trim(), password);
      navigate('/admin/places');
    } catch (err) {
      // Generic invalid-login error - do not reveal whether username or password was incorrect
      setError('Invalid username or password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1.25rem',
      backgroundColor: '#f8fafc'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        padding: '2.5rem',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e2e8f0'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            backgroundColor: '#ccfbf1',
            color: '#0d9488',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            <ShieldCheck size={28} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.35rem' }}>
            Administrator Login
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
            Sign in to manage Kurunegala destinations and tourism categories.
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            marginBottom: '1.5rem',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Form: Username & Password */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>
              Username
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin or admin@rockcity.lk"
                className="input-control"
                style={{ paddingLeft: '2.75rem', height: '46px' }}
                autoComplete="username"
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="input-control"
                style={{ paddingLeft: '2.75rem', height: '46px' }}
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={{ height: '48px', fontSize: '1rem', fontWeight: '700', borderRadius: '12px', marginTop: '0.5rem' }}
          >
            {submitting ? 'Authenticating...' : 'Sign In as Administrator'}
          </button>
        </form>

        {/* Seed Credentials Reminder for Demonstration */}
        <div style={{
          marginTop: '1.75rem',
          padding: '0.85rem',
          backgroundColor: '#f1f5f9',
          borderRadius: '10px',
          fontSize: '0.8rem',
          color: '#475569',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ fontWeight: '700', color: '#0f172a', marginBottom: '0.2rem' }}>Seeded Demonstration Administrator:</div>
          <div>Username: <code>admin</code> (or <code>admin@rockcity.lk</code>)</div>
          <div>Password: <code>AdminRockCity@2026</code></div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/" style={{ color: '#64748b', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <ArrowLeft size={14} />
            <span>Return to Tourist Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
