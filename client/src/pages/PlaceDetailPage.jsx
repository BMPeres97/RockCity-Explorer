import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  MapPin,
  Clock,
  Star,
  Plus,
  Check,
  ExternalLink,
  ArrowLeft,
  DollarSign,
  AlertCircle,
  Lightbulb,
  Navigation,
  Calendar,
  Share2
} from 'lucide-react';
import { api } from '../services/api';
import { usePlan } from '../context/PlanContext';
import { getPlaceOpenStatus } from '../utils/openStatus';
import { formatDistance } from '../utils/geoDistance';
import { formatTravelTime } from '../utils/travelTime';
import {
  REFERENCE_LATITUDE,
  REFERENCE_LONGITUDE,
  REFERENCE_LOCATION_NAME
} from '../config/constants';

const PlaceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isPlaceInPlan, togglePlace, planWarning } = usePlan();

  const [place, setPlace] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPlace = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.getPlaceById(id);
        if (res.success && res.data) {
          setPlace(res.data);
          setSelectedImage(res.data.thumbnail || (res.data.images && res.data.images[0]) || '');
        } else {
          setError('Place not found');
        }
      } catch (err) {
        console.error('Error loading place:', err);
        setError('Failed to load place details.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlace();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '8rem 0', minHeight: '60vh' }}>
        <div className="spinner" />
        <p style={{ color: '#64748b', marginTop: '1rem' }}>Loading destination details...</p>
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className="container" style={{ padding: '6rem 1.25rem', textAlign: 'center' }}>
        <div className="empty-state">
          <AlertCircle className="empty-state-icon" style={{ color: '#ef4444' }} />
          <h3>Place Not Found</h3>
          <p>{error || 'The requested destination could not be found.'}</p>
          <Link to="/places" className="btn btn-primary" style={{ borderRadius: '9999px' }}>
            Back to All Places
          </Link>
        </div>
      </div>
    );
  }

  const inPlan = isPlaceInPlan(place._id);
  const openStatus = getPlaceOpenStatus(place.openingHours);
  const distanceStr = place.distanceFormatted || formatDistance(place.distanceFromReference);
  const travelTimeStr = place.travelTimeFormatted || formatTravelTime(place.estimatedTravelMinutes);
  
  // Standard Google Maps directions URL without requiring API key
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${REFERENCE_LATITUDE},${REFERENCE_LONGITUDE}&destination=${place.latitude},${place.longitude}`;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const getCategoryBadgeClass = (cat) => {
    const lower = (cat || '').toLowerCase();
    if (lower.includes('religious')) return 'badge-religious';
    if (lower.includes('nature')) return 'badge-nature';
    if (lower.includes('heritage')) return 'badge-heritage';
    if (lower.includes('cultural')) return 'badge-cultural';
    return 'badge-religious';
  };

  return (
    <div style={{ padding: '2rem 0 5rem', backgroundColor: '#f8fafc', minHeight: '85vh' }}>
      <div className="container">
        {/* Breadcrumb & Navigation */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.9rem'
            }}
          >
            <ArrowLeft size={18} />
            <span>Back to results</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={handleShare}
              className="btn btn-secondary btn-sm"
              title="Copy link to clipboard"
            >
              <Share2 size={15} />
              <span>{copied ? 'Link Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Main Place Layout Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'start'
        }}>
          {/* Left Column: Image Gallery & Imagery */}
          <div>
            {/* Primary Large Image */}
            <div style={{
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              backgroundColor: '#e2e8f0',
              height: '420px',
              marginBottom: '1rem',
              position: 'relative'
            }}>
              <img
                src={selectedImage || place.thumbnail}
                alt={place.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {/* Status & Category overlay badge */}
              <div style={{
                position: 'absolute',
                top: '1rem',
                left: '1rem',
                display: 'flex',
                gap: '0.5rem',
                zIndex: 2
              }}>
                <span className={`badge-category ${getCategoryBadgeClass(place.category)}`} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                  {place.category}
                </span>
                <span
                  className={`badge-status ${openStatus.isOpen ? 'badge-open' : 'badge-closed'}`}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    padding: '0.4rem 0.8rem',
                    fontSize: '0.8rem'
                  }}
                >
                  <span className={`status-dot ${openStatus.isOpen ? 'open' : 'closed'}`} />
                  <span>{openStatus.label}</span>
                </span>
              </div>
            </div>

            {/* Gallery Thumbnails */}
            {place.images && place.images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {place.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    style={{
                      border: selectedImage === img ? '3px solid #0d9488' : '1px solid #cbd5e1',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      width: '84px',
                      height: '64px',
                      padding: 0,
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                  >
                    <img src={img} alt={`${place.name} view ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}

            {/* Fixed Reference Distance Card */}
            <div style={{
              marginTop: '1.5rem',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '1.25rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0d9488', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                <Navigation size={16} />
                <span>Reference Proximity Metrics</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ backgroundColor: '#f0fdfa', padding: '0.85rem', borderRadius: '10px', border: '1px solid #ccfbf1' }}>
                  <div style={{ fontSize: '0.75rem', color: '#0f766e', fontWeight: '600' }}>Distance from Reference</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f766e' }}>{distanceStr}</div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Haversine straight-line</div>
                </div>

                <div style={{ backgroundColor: '#fffbeb', padding: '0.85rem', borderRadius: '10px', border: '1px solid #fef3c7' }}>
                  <div style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: '600' }}>Estimated Travel Time</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#b45309' }}>~{travelTimeStr}</div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>At 30 km/h avg speed</div>
                </div>
              </div>

              <div style={{ marginTop: '0.85rem', fontSize: '0.775rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={13} color="#94a3b8" />
                <span>Measured from {REFERENCE_LOCATION_NAME} ({REFERENCE_LATITUDE}, {REFERENCE_LONGITUDE})</span>
              </div>
            </div>
          </div>

          {/* Right Column: Place Information, Rules, Actions */}
          <div>
            {/* Title & Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#b45309', fontWeight: '700', fontSize: '0.95rem' }}>
                <Star size={18} fill="#f59e0b" color="#f59e0b" />
                <span>{place.rating ? place.rating.toFixed(1) : '4.5'}</span>
              </div>
              <span style={{ color: '#94a3b8' }}>•</span>
              <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
                {place.reviewsCount || 120} visitor ratings
              </span>
            </div>

            <h1 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.75rem', lineHeight: 1.2 }}>
              {place.name}
            </h1>

            {/* Address */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.95rem', marginBottom: '1.75rem' }}>
              <MapPin size={18} color="#0d9488" style={{ flexShrink: 0 }} />
              <span>{place.address}</span>
            </div>

            {/* Plan Warning Banner */}
            {planWarning && (
              <div style={{
                backgroundColor: '#fffbeb',
                border: '1px solid #fde68a',
                color: '#92400e',
                borderRadius: '10px',
                padding: '0.75rem 1rem',
                marginBottom: '1.25rem',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: '600'
              }}>
                <AlertCircle size={18} color="#d97706" style={{ flexShrink: 0 }} />
                <span>{planWarning}</span>
              </div>
            )}

            {/* Prominent Action Buttons: Add to Plan & Get Directions */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              marginBottom: '2rem',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => togglePlace(place)}
                className={`btn btn-lg ${inPlan ? 'btn-secondary' : 'btn-primary'}`}
                style={{
                  flexGrow: 1,
                  border: inPlan ? '2px solid #0d9488' : 'none',
                  color: inPlan ? '#0d9488' : '#ffffff',
                  backgroundColor: inPlan ? '#f0fdfa' : '#0d9488'
                }}
              >
                {inPlan ? (
                  <>
                    <Check size={20} color="#0d9488" />
                    <span>In Your Day Plan (Click to Remove)</span>
                  </>
                ) : (
                  <>
                    <Plus size={20} />
                    <span>Add to One-Day Plan</span>
                  </>
                )}
              </button>

              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold btn-lg"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', flexGrow: 1 }}
                title="Get Google Maps driving directions"
              >
                <ExternalLink size={20} />
                <span>Get Directions</span>
              </a>
            </div>

            {/* Full Description */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.75rem', color: '#0f172a' }}>
                About This Destination
              </h3>
              <p style={{ color: '#334155', fontSize: '1rem', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                {place.description}
              </p>
            </div>

            {/* Quick Details Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              {/* Opening Hours */}
              <div style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0d9488', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                  <Clock size={16} />
                  <span>Opening Hours</span>
                </div>
                <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#0f172a' }}>
                  {place.openingHours?.alwaysOpen
                    ? 'Open 24 Hours'
                    : `${place.openingHours?.open || '06:00'} - ${place.openingHours?.close || '18:00'}`}
                </div>
                <div style={{ fontSize: '0.8rem', color: openStatus.isOpen ? '#10b981' : '#ef4444', fontWeight: '600', marginTop: '0.2rem' }}>
                  {openStatus.detail}
                </div>
              </div>

              {/* Entry Fee */}
              <div style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#d97706', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                  <DollarSign size={16} />
                  <span>Admission Fee</span>
                </div>
                <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#0f172a' }}>
                  {place.entryFee?.isFree ? (
                    <span style={{ color: '#16a34a' }}>Free Admission</span>
                  ) : (
                    <span>
                      Local: LKR {place.entryFee?.localPrice || 0} / Foreign: LKR {place.entryFee?.foreignPrice || 0}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>
                  {place.entryFee?.note || 'Standard entry'}
                </div>
              </div>

              {/* Peak Hours */}
              <div style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#8b5cf6', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                  <Calendar size={16} />
                  <span>Peak Hours</span>
                </div>
                <div style={{ fontWeight: '600', fontSize: '0.9rem', color: '#334155' }}>
                  {place.peakHours || 'Late afternoon (16:00 - 18:00)'}
                </div>
              </div>

              {/* Geographic Coordinates */}
              <div style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0284c7', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                  <MapPin size={16} />
                  <span>Coordinates</span>
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#0f172a' }}>
                  {place.latitude.toFixed(6)}, {place.longitude.toFixed(6)}
                </div>
              </div>
            </div>

            {/* Dress Code & Etiquette Notice */}
            {place.dressCode && (
              <div style={{
                backgroundColor: '#fffbeb',
                border: '1px solid #fef3c7',
                borderRadius: '12px',
                padding: '1.25rem',
                marginBottom: '1.5rem',
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'flex-start'
              }}>
                <AlertCircle size={20} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#92400e', marginBottom: '0.25rem' }}>
                    Dress Code & Local Cultural Etiquette
                  </h4>
                  <p style={{ fontSize: '0.875rem', color: '#b45309', lineHeight: 1.5 }}>
                    {place.dressCode}
                  </p>
                </div>
              </div>
            )}

            {/* Local Travel Tips */}
            {place.localTravelTips && place.localTravelTips.length > 0 && (
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '1.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0d9488', fontSize: '0.95rem', fontWeight: '700', marginBottom: '1rem' }}>
                  <Lightbulb size={20} />
                  <span>Insider Travel Tips for Kurunegala Day Visitors</span>
                </div>
                <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {place.localTravelTips.map((tip, idx) => (
                    <li key={idx} style={{ color: '#334155', fontSize: '0.9rem', lineHeight: 1.5 }}>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetailPage;
