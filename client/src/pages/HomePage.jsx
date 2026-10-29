import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  Calendar,
  MapPin,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Navigation,
  Clock,
  CheckCircle2,
  Mountain,
  Castle,
  Palette,
  Landmark
} from 'lucide-react';
import { api } from '../services/api';
import PlaceCard from '../components/PlaceCard';
import PlaceSkeletonCard from '../components/PlaceSkeletonCard';
import {
  REFERENCE_LATITUDE,
  REFERENCE_LONGITUDE,
  REFERENCE_LOCATION_NAME,
  DEFAULT_AVERAGE_SPEED_KMH
} from '../config/constants';

const HomePage = () => {
  const [featuredPlaces, setFeaturedPlaces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [quickSearch, setQuickSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [placesRes, catsRes] = await Promise.all([
          api.getPlaces({ sortBy: 'rating' }),
          api.getCategories()
        ]);
        if (placesRes.success) {
          // Take top 4 or featured
          const featured = placesRes.data.filter((p) => p.featured);
          setFeaturedPlaces(featured.length > 0 ? featured.slice(0, 4) : placesRes.data.slice(0, 4));
        }
        if (catsRes.success) {
          setCategories(catsRes.data);
        }
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleQuickSearch = (e) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      navigate(`/places?search=${encodeURIComponent(quickSearch.trim())}`);
    } else {
      navigate('/places');
    }
  };

  const getCategoryIcon = (name) => {
    const lower = (name || '').toLowerCase();
    if (lower.includes('religious')) return <Landmark size={24} color="#0d9488" />;
    if (lower.includes('nature')) return <Mountain size={24} color="#16a34a" />;
    if (lower.includes('heritage')) return <Castle size={24} color="#d97706" />;
    if (lower.includes('cultural')) return <Palette size={24} color="#8b5cf6" />;
    return <Compass size={24} color="#0d9488" />;
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          background: 'linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.85)), url("https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1920&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#ffffff',
          padding: '6rem 1.25rem 5rem',
          textAlign: 'center'
        }}
      >
        <div className="container" style={{ maxWidth: '900px' }}>
          {/* Eyebrow Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'rgba(13, 148, 136, 0.25)',
            border: '1px solid rgba(45, 212, 191, 0.4)',
            color: '#2dd4bf',
            padding: '0.35rem 1rem',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            fontWeight: '700',
            marginBottom: '1.5rem',
            backdropFilter: 'blur(8px)'
          }}>
            <Sparkles size={16} />
            <span>Athugalpura • City of the Seven Rocks</span>
          </div>

          {/* Main Hero Heading */}
          <h1 style={{
            fontSize: 'clamp(2.3rem, 5vw, 3.8rem)',
            fontWeight: '800',
            letterSpacing: '-0.025em',
            lineHeight: 1.15,
            color: '#ffffff',
            marginBottom: '1.25rem',
            fontFamily: 'var(--font-display)'
          }}>
            Explore Kurunegala in <span style={{ color: '#38bdf8' }}>One Perfect Day</span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: '#cbd5e1',
            lineHeight: 1.6,
            marginBottom: '2.5rem',
            maxWidth: '720px',
            margin: '0 auto 2.5rem'
          }}>
            Discover sacred cave temples, climb monumental rock outcrops, stroll scenic lake promenades,
            and build a smart day itinerary with instant travel times and Google Maps directions.
          </p>

          {/* Search Bar Input */}
          <form
            onSubmit={handleQuickSearch}
            style={{
              maxWidth: '650px',
              margin: '0 auto 2.5rem',
              display: 'flex',
              gap: '0.5rem',
              backgroundColor: '#ffffff',
              padding: '0.4rem',
              borderRadius: '9999px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '1.25rem', flexGrow: 1 }}>
              <Search size={20} color="#94a3b8" />
              <input
                type="text"
                placeholder="Where do you want to explore? (e.g. Ethagala, Lake, Silver Temple)"
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: '0.95rem',
                  color: '#0f172a'
                }}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ borderRadius: '9999px', padding: '0.75rem 1.75rem', fontWeight: '700' }}
            >
              Search
            </button>
          </form>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/places" className="btn btn-primary btn-lg" style={{ borderRadius: '9999px', padding: '0.85rem 2rem' }}>
              <Compass size={20} />
              <span>Explore Places</span>
            </Link>

            <Link to="/plan" className="btn btn-gold btn-lg" style={{ borderRadius: '9999px', padding: '0.85rem 2rem' }}>
              <Calendar size={20} />
              <span>Plan Your Day</span>
            </Link>

            <Link
              to="/map"
              className="btn btn-secondary btn-lg"
              style={{
                borderRadius: '9999px',
                padding: '0.85rem 1.75rem',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(8px)'
              }}
            >
              <MapPin size={20} />
              <span>Interactive Map</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Fixed Reference Point Spotlight Banner */}
      <section style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '1.25rem 0', borderBottom: '1px solid #1e293b' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              backgroundColor: '#d97706',
              color: '#ffffff',
              padding: '0.4rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Navigation size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#f59e0b', fontWeight: '700', letterSpacing: '0.05em' }}>
                Fixed Deterministic Reference Location
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff' }}>
                {REFERENCE_LOCATION_NAME} ({REFERENCE_LATITUDE}, {REFERENCE_LONGITUDE})
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Shortcuts Section */}
      <section style={{ padding: '4rem 0 3rem', backgroundColor: '#f8fafc' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 className="section-title">Explore by Category</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Choose your style of travel in Kurunegala — from historical cave sanctuaries to scenic natural ridges.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem'
          }}>
            {categories.map((cat) => (
              <Link
                key={cat._id || cat.name}
                to={`/places?category=${encodeURIComponent(cat.name)}`}
                className="card"
                style={{
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  textDecoration: 'none'
                }}
              >
                <div style={{
                  backgroundColor: cat.color ? `${cat.color}15` : '#f0fdfa',
                  padding: '0.85rem',
                  borderRadius: '12px',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {getCategoryIcon(cat.name)}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem', color: '#0f172a' }}>
                  {cat.name}
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1.25rem', flexGrow: 1 }}>
                  {cat.description || `Discover Kurunegala's top ${cat.name.toLowerCase()} attractions and heritage points.`}
                </p>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  color: '#0d9488',
                  fontSize: '0.85rem',
                  fontWeight: '700'
                }}>
                  <span>View Places ({cat.placeCount || 0})</span>
                  <ArrowRight size={15} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Highlighted Places Section */}
      <section style={{ padding: '3.5rem 0', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ color: '#0d9488', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                Handpicked Destinations
              </div>
              <h2 className="section-title">Highlighted Kurunegala Places</h2>
            </div>
            <Link
              to="/places"
              className="btn btn-outline"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <span>Browse All Places</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.75rem'
            }}>
              {[1, 2, 3].map((n) => (
                <PlaceSkeletonCard key={n} />
              ))}
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.75rem'
            }}>
              {featuredPlaces.map((place) => (
                <PlaceCard key={place._id} place={place} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works Guide */}
      <section style={{ padding: '4.5rem 0', backgroundColor: '#f1f5f9' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 className="section-title">How RockCity Explorer Works</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Craft an unforgettable one-day visit in three effortless steps.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            {/* Step 1 */}
            <div className="card" style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#ffffff' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#ccfbf1',
                color: '#0d9488',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                fontSize: '1.25rem',
                fontWeight: '800'
              }}>
                1
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.75rem' }}>
                Discover & Filter Places
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Browse Kurunegala's iconic rock landmarks, cave shrines, and nature reserves. Filter by category or find what's open right now.
              </p>
            </div>

            {/* Step 2 */}
            <div className="card" style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#ffffff' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#fef3c7',
                color: '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                fontSize: '1.25rem',
                fontWeight: '800'
              }}>
                2
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.75rem' }}>
                Build Your Day Visit Plan
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Click "Add to Plan" on any destination. Arrange your visit sequence smoothly with drag-and-drop reordering without losing your list.
              </p>
            </div>

            {/* Step 3 */}
            <div className="card" style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#ffffff' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#ede9fe',
                color: '#7c3aed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                fontSize: '1.25rem',
                fontWeight: '800'
              }}>
                3
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.75rem' }}>
                Navigate & Enjoy
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Review total estimated distance and travel time from the fixed Kurunegala center, or open Google Maps for turn-by-turn routing!
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/plan" className="btn btn-primary btn-lg" style={{ borderRadius: '9999px' }}>
              <span>Start Planning Your Day</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
