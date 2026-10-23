import React from 'react';

/**
 * PlaceSkeletonCard Component
 * Displays an animated placeholder card while place data is being fetched
 */
const PlaceSkeletonCard = () => {
  return (
    <div className="card place-card skeleton-card" style={{ overflow: 'hidden', pointerEvents: 'none' }}>
      {/* Image Skeleton */}
      <div
        className="skeleton"
        style={{
          height: '210px',
          width: '100%',
          backgroundColor: '#e2e8f0'
        }}
      />

      {/* Content Skeleton */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {/* Badges line */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="skeleton" style={{ width: '80px', height: '22px', borderRadius: '999px', backgroundColor: '#e2e8f0' }} />
          <div className="skeleton" style={{ width: '60px', height: '18px', borderRadius: '4px', backgroundColor: '#e2e8f0' }} />
        </div>

        {/* Title */}
        <div className="skeleton" style={{ width: '85%', height: '24px', borderRadius: '6px', backgroundColor: '#e2e8f0' }} />

        {/* Subtitle / address */}
        <div className="skeleton" style={{ width: '65%', height: '16px', borderRadius: '4px', backgroundColor: '#e2e8f0' }} />

        {/* Description lines */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.2rem' }}>
          <div className="skeleton" style={{ width: '100%', height: '14px', borderRadius: '4px', backgroundColor: '#e2e8f0' }} />
          <div className="skeleton" style={{ width: '92%', height: '14px', borderRadius: '4px', backgroundColor: '#e2e8f0' }} />
        </div>

        {/* Stats grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.5rem',
            padding: '0.75rem',
            borderRadius: '8px',
            backgroundColor: '#f8fafc',
            marginTop: '0.35rem'
          }}
        >
          <div className="skeleton" style={{ width: '80%', height: '16px', borderRadius: '4px', backgroundColor: '#e2e8f0' }} />
          <div className="skeleton" style={{ width: '75%', height: '16px', borderRadius: '4px', backgroundColor: '#e2e8f0' }} />
        </div>

        {/* Actions buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
          <div className="skeleton" style={{ height: '36px', borderRadius: '8px', backgroundColor: '#e2e8f0' }} />
          <div className="skeleton" style={{ height: '36px', borderRadius: '8px', backgroundColor: '#e2e8f0' }} />
        </div>
      </div>
    </div>
  );
};

export default PlaceSkeletonCard;
