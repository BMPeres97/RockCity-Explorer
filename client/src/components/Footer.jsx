import React from 'react';
import { Link } from 'react-router-dom';
import { Mountain, MapPin, Navigation, Info, Heart, Shield } from 'lucide-react';
import {
  REFERENCE_LATITUDE,
  REFERENCE_LONGITUDE,
  REFERENCE_LOCATION_NAME,
  DEFAULT_AVERAGE_SPEED_KMH
} from '../config/constants';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#0f172a', color: '#cbd5e1', marginTop: 'auto', borderTop: '1px solid #1e293b' }}>
      {/* Reference Coordinate Highlight Strip */}
      <div style={{ backgroundColor: '#1e293b', borderBottom: '1px solid #334155', padding: '0.85rem 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.825rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8' }}>
            <Navigation size={16} />
            <span style={{ fontWeight: '600' }}>Fixed Application Reference Point:</span>
            <code style={{ backgroundColor: '#0f172a', padding: '0.2rem 0.5rem', borderRadius: '4px', color: '#f59e0b', fontFamily: 'monospace' }}>
              Lat {REFERENCE_LATITUDE}, Lon {REFERENCE_LONGITUDE}
            </code>
          </div>
          <div style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={15} color="#0d9488" />
            <span>{REFERENCE_LOCATION_NAME}</span>
            <span style={{ color: '#475569' }}>•</span>
            <span>Speed: {DEFAULT_AVERAGE_SPEED_KMH} km/h</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '3.5rem 1.25rem 2.5rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, #0d9488, #115e59)',
                color: 'white',
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Mountain size={20} />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff' }}>
                RockCity<span style={{ color: '#0d9488' }}>.</span>
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1rem' }}>
              Local tourist day-visit planner and heritage guide for Kurunegala (Athugalpura), Sri Lanka.
              Discover ancient rock fortresses, peaceful cave monasteries, scenic lakeside walks, and cultural treasures.
            </p>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Designed for modern local day-travelers. No tourist login required.
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: '700', marginBottom: '1.25rem', letterSpacing: '0.02em' }}>
              Explore
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <li>
                <Link to="/places" style={{ color: '#cbd5e1', transition: 'color 0.15s' }}>
                  Browse All Places
                </Link>
              </li>
              <li>
                <Link to="/places?category=Religious" style={{ color: '#cbd5e1' }}>
                  Religious & Cave Temples
                </Link>
              </li>
              <li>
                <Link to="/places?category=Nature" style={{ color: '#cbd5e1' }}>
                  Nature & Rock Outcrops
                </Link>
              </li>
              <li>
                <Link to="/places?category=Heritage" style={{ color: '#cbd5e1' }}>
                  Ancient Kingdoms & Heritage Sites
                </Link>
              </li>
              <li>
                <Link to="/map" style={{ color: '#cbd5e1' }}>
                  Interactive Map View
                </Link>
              </li>
              <li>
                <Link to="/plan" style={{ color: '#cbd5e1' }}>
                  One-Day Itinerary Planner
                </Link>
              </li>
            </ul>
          </div>

          {/* Travel Reference Notes */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: '700', marginBottom: '1.25rem', letterSpacing: '0.02em' }}>
              Travel Reference
            </h4>
            <div style={{
              backgroundColor: '#1e293b',
              padding: '1rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              border: '1px solid #334155',
              lineHeight: 1.6
            }}>
              <p style={{ color: '#e2e8f0', marginBottom: '0.5rem', fontWeight: '600' }}>
                Fixed Deterministic Distances
              </p>
              <p style={{ color: '#94a3b8' }}>
                All distance measurements and proximity sort orders are measured deterministically from Kurunegala's fixed reference coordinate
                using the spherical Haversine formula.
              </p>
            </div>
          </div>

          {/* Emergency & Admin Access */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: '700', marginBottom: '1.25rem', letterSpacing: '0.02em' }}>
              Tourist Support
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: '#94a3b8' }}>
              <li>Kurunegala Tourist Police: 1912</li>
              <li>Emergency Medical Service: 1990</li>
              <li>General Hospital Kurunegala: 037-2222261</li>
              <li style={{ marginTop: '0.5rem' }}>
                <Link
                  to="/admin/login"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    color: '#38bdf8',
                    textDecoration: 'underline'
                  }}
                >
                  <Shield size={14} />
                  Administrator Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div style={{
          borderTop: '1px solid #1e293b',
          paddingTop: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.825rem',
          color: '#64748b'
        }}>
          <div>
            © {new Date().getFullYear()} RockCity Explorer — Kurunegala Tourist Day-Visit Planner. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>Crafted with</span>
            <Heart size={14} color="#ef4444" fill="#ef4444" />
            <span>for Sri Lankan Tourism</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
