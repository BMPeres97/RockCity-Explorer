import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Compass,
  MapPin,
  Calendar,
  ShieldCheck,
  Menu,
  X,
  Sparkles,
  LogOut,
  Mountain
} from 'lucide-react';
import { usePlan } from '../context/PlanContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { planPlaces } = usePlan();
  const { isAuthenticated, admin, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="glass-nav" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div style={{
            background: 'linear-gradient(135deg, #0d9488, #115e59)',
            color: 'white',
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(13, 148, 136, 0.35)'
          }}>
            <Mountain size={24} />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#0f172a', display: 'block', lineHeight: 1.1 }}>
              RockCity<span style={{ color: '#0d9488' }}>.</span>
            </span>
            <span style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b' }}>
              Kurunegala Explorer
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '1.75rem' }} className="desktop-nav">
          <Link
            to="/"
            style={{
              fontWeight: isActive('/') ? '700' : '600',
              color: isActive('/') ? '#0d9488' : '#334155',
              fontSize: '0.925rem',
              transition: 'color 0.15s'
            }}
          >
            Home
          </Link>
          <Link
            to="/places"
            style={{
              fontWeight: isActive('/places') ? '700' : '600',
              color: isActive('/places') ? '#0d9488' : '#334155',
              fontSize: '0.925rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <Compass size={17} />
            Explore Places
          </Link>
          <Link
            to="/map"
            style={{
              fontWeight: isActive('/map') ? '700' : '600',
              color: isActive('/map') ? '#0d9488' : '#334155',
              fontSize: '0.925rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <MapPin size={17} />
            Map
          </Link>
          <Link
            to="/plan"
            style={{
              fontWeight: isActive('/plan') ? '700' : '600',
              color: isActive('/plan') ? '#0d9488' : '#334155',
              fontSize: '0.925rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              position: 'relative'
            }}
          >
            <Calendar size={17} />
            My Day Plan
            {planPlaces.length > 0 && (
              <span
                style={{
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  borderRadius: '9999px',
                  padding: '0.1rem 0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  boxShadow: '0 2px 5px rgba(245, 158, 11, 0.4)'
                }}
              >
                {planPlaces.length}
              </span>
            )}
          </Link>
        </nav>

        {/* Action Controls & Admin */}
        <div style={{ display: 'none', alignItems: 'center', gap: '1rem' }} className="desktop-actions">
          <Link
            to="/plan"
            className="btn btn-primary btn-sm"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.55rem 1.1rem',
              borderRadius: '9999px'
            }}
          >
            <Sparkles size={16} />
            <span>My Plan ({planPlaces.length})</span>
          </Link>

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link
                to="/admin"
                className="btn btn-secondary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                title={`Logged in as ${admin?.email}`}
              >
                <ShieldCheck size={16} color="#0d9488" />
                <span>Admin</span>
              </Link>
              <button
                onClick={logout}
                className="btn btn-outline btn-sm"
                style={{ padding: '0.45rem' }}
                title="Log out administrator"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link
              to="/admin/login"
              style={{
                color: '#94a3b8',
                fontSize: '0.8rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.4rem 0.6rem',
                borderRadius: '6px'
              }}
              title="Administrator Sign In"
            >
              <ShieldCheck size={14} />
              <span>Admin</span>
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: '#0f172a',
            cursor: 'pointer',
            padding: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          className="mobile-toggle"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
          }}
          className="mobile-menu"
        >
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: '600', padding: '0.5rem 0', color: isActive('/') ? '#0d9488' : '#334155' }}
          >
            Home
          </Link>
          <Link
            to="/places"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              fontWeight: '600',
              padding: '0.5rem 0',
              color: isActive('/places') ? '#0d9488' : '#334155',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Compass size={18} />
            Explore Places
          </Link>
          <Link
            to="/map"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              fontWeight: '600',
              padding: '0.5rem 0',
              color: isActive('/map') ? '#0d9488' : '#334155',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <MapPin size={18} />
            Map
          </Link>
          <Link
            to="/plan"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              fontWeight: '600',
              padding: '0.5rem 0',
              color: isActive('/plan') ? '#0d9488' : '#334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={18} />
              My Day Plan
            </span>
            <span
              style={{
                backgroundColor: '#f59e0b',
                color: 'white',
                borderRadius: '9999px',
                padding: '0.1rem 0.5rem',
                fontSize: '0.75rem',
                fontWeight: '700'
              }}
            >
              {planPlaces.length} places
            </span>
          </Link>

          <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9' }} />

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-secondary btn-sm"
              >
                <ShieldCheck size={16} /> Admin Portal
              </Link>
              <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="btn btn-outline btn-sm">
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <Link
              to="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: '#64748b', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <ShieldCheck size={16} /> Administrator Login
            </Link>
          )}
        </div>
      )}

      {/* Embedded CSS for responsive navbar toggle */}
      <style>{`
        @media (min-width: 769px) {
          .desktop-nav { display: flex !important; }
          .desktop-actions { display: flex !important; }
          .mobile-toggle { display: none !important; }
          .mobile-menu { display: none !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
