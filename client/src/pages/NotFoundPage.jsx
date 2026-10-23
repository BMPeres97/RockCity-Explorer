import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div style={{
      minHeight: '75vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 1.25rem',
      backgroundColor: '#f8fafc',
      textAlign: 'center'
    }}>
      <div className="card" style={{ maxWidth: '520px', padding: '3rem 2rem', borderRadius: '24px' }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: '#ccfbf1',
          color: '#0d9488',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem'
        }}>
          <Compass size={36} />
        </div>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem', lineHeight: 1 }}>
          404
        </h1>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#334155', marginBottom: '1rem' }}>
          Destination Not Found
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
          The page or landmark you are looking for doesn't exist or has moved. Return to our Kurunegala tourist guide to continue exploring.
        </p>
        <Link to="/" className="btn btn-primary btn-lg" style={{ borderRadius: '9999px', padding: '0.75rem 2rem' }}>
          <ArrowLeft size={18} />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
