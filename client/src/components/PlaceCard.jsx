import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Clock,
  Star,
  Plus,
  Check,
  ArrowRight,
  ExternalLink,
  Compass
} from 'lucide-react';
import { usePlan } from '../context/PlanContext';
import { getPlaceOpenStatus } from '../utils/openStatus';
import { formatDistance } from '../utils/geoDistance';
import { formatTravelTime } from '../utils/travelTime';

const PlaceCard = ({ place }) => {
  const { isPlaceInPlan, togglePlace } = usePlan();

  if (!place) return null;

  const inPlan = isPlaceInPlan(place._id);
  const openStatus = getPlaceOpenStatus(place.openingHours);

  // Category styling helper
  const getCategoryClass = (category) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('religious')) return 'badge-religious';
    if (cat.includes('nature')) return 'badge-nature';
    if (cat.includes('heritage')) return 'badge-heritage';
    if (cat.includes('cultural')) return 'badge-cultural';
    return 'badge-religious';
  };

  const distanceDisplay = place.distanceFormatted || formatDistance(place.distanceFromReference);
  const travelTimeDisplay = place.travelTimeFormatted || formatTravelTime(place.estimatedTravelMinutes);

  const [cardWarning, setCardWarning] = React.useState(false);

  const handleToggle = () => {
    const res = togglePlace(place);
    if (res && res.reason === 'MAX_LIMIT') {
      setCardWarning(true);
      setTimeout(() => setCardWarning(false), 4000);
    }
  };

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        backgroundColor: '#ffffff'
      }}
    >
      {/* Thumbnail Banner */}
      <div style={{ position: 'relative', height: '210px', overflow: 'hidden', backgroundColor: '#e2e8f0' }}>
        <img
          src={place.thumbnail || (place.images && place.images[0]) || 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80'}
          alt={place.name}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }}
          className="place-card-img"
        />

        {/* Top Badges: Category & Open Status */}
        <div style={{
          position: 'absolute',
          top: '0.75rem',
          left: '0.75rem',
          right: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 2
        }}>
          <span className={`badge-category ${getCategoryClass(place.category)}`} style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}>
            {place.category}
          </span>

          {openStatus.isOpen === true ? (
            <span
              className="badge-status badge-open"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(4px)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
              }}
            >
              <span className="status-dot open" />
              <span>Open Now</span>
            </span>
          ) : openStatus.isOpen === false ? (
            <span
              className="badge-status badge-closed"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(4px)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
              }}
            >
              <span className="status-dot closed" />
              <span>Closed</span>
            </span>
          ) : (
            <span
              className="badge-status"
              style={{
                backgroundColor: 'rgba(241, 245, 249, 0.95)',
                color: '#64748b',
                backdropFilter: 'blur(4px)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                border: '1px solid #cbd5e1'
              }}
            >
              <span>Hours Unknown</span>
            </span>
          )}
        </div>

        {/* Bottom Distance & Travel Time Tag */}
        <div style={{
          position: 'absolute',
          bottom: '0.75rem',
          left: '0.75rem',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem'
        }}>
          <span className="distance-tag" title="Straight-line distance from fixed Kurunegala reference point">
            <Compass size={13} color="#38bdf8" />
            <span>{distanceDisplay} away</span>
          </span>
          <span
            className="distance-tag"
            style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)' }}
            title="Estimated travel time from reference location"
          >
            <Clock size={13} color="#f59e0b" />
            <span>~{travelTimeDisplay}</span>
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        {/* Rating and Reviews */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', fontWeight: '700', color: '#b45309' }}>
            <Star size={15} fill="#f59e0b" color="#f59e0b" />
            <span>{place.rating ? place.rating.toFixed(1) : '4.5'}</span>
            <span style={{ color: '#94a3b8', fontWeight: '500', fontSize: '0.775rem' }}>
              ({place.reviewsCount || 100}+ reviews)
            </span>
          </div>
          {place.featured && (
            <span style={{
              fontSize: '0.7rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              color: '#d97706',
              backgroundColor: '#fef3c7',
              padding: '0.15rem 0.45rem',
              borderRadius: '4px'
            }}>
              Top Choice
            </span>
          )}
        </div>

        {/* Place Title */}
        <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.5rem', lineHeight: '1.3' }}>
          <Link to={`/places/${place._id}`} style={{ color: '#0f172a' }}>
            {place.name}
          </Link>
        </h3>

        {/* Short Description */}
        <p style={{
          color: '#64748b',
          fontSize: '0.875rem',
          lineHeight: '1.5',
          marginBottom: '1rem',
          flexGrow: 1,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {place.shortDescription || place.description}
        </p>

        {/* Address Preview */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '1.25rem' }}>
          <MapPin size={14} style={{ flexShrink: 0 }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {place.address}
          </span>
        </div>

        {/* Max 5 Stops Warning Feedback */}
        {cardWarning && (
          <div style={{
            fontSize: '0.725rem',
            color: '#92400e',
            backgroundColor: '#fef3c7',
            padding: '0.35rem 0.5rem',
            borderRadius: '6px',
            textAlign: 'center',
            marginBottom: '0.5rem',
            fontWeight: '700',
            border: '1px solid #fde68a'
          }}>
            Your one-day plan can contain a maximum of 5 places.
          </div>
        )}

        {/* Card Actions Footer */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.65rem',
          paddingTop: '0.85rem',
          borderTop: '1px solid #f1f5f9',
          marginTop: 'auto'
        }}>
          {/* Add to Plan Button */}
          <button
            onClick={handleToggle}
            className={`btn btn-sm ${inPlan ? 'btn-secondary' : 'btn-outline'}`}
            style={{
              borderColor: inPlan ? '#0d9488' : '#cbd5e1',
              color: inPlan ? '#0d9488' : '#334155',
              backgroundColor: inPlan ? '#f0fdfa' : 'transparent',
              fontWeight: '600'
            }}
            title={inPlan ? 'Remove from your day visit plan' : 'Add to your day visit plan'}
          >
            {inPlan ? (
              <>
                <Check size={15} color="#0d9488" />
                <span>In Plan</span>
              </>
            ) : (
              <>
                <Plus size={15} />
                <span>Add to Plan</span>
              </>
            )}
          </button>

          {/* View Details Button */}
          <Link
            to={`/places/${place._id}`}
            className="btn btn-primary btn-sm"
            style={{ fontWeight: '600' }}
          >
            <span>Details</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PlaceCard;
