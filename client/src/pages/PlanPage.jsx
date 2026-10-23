import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
  GripVertical,
  Trash2,
  MapPin,
  Clock,
  Compass,
  Navigation,
  ExternalLink,
  Printer,
  Share2,
  Calendar,
  Sparkles,
  ArrowRight,
  Plus,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Info,
  X
} from 'lucide-react';
import { usePlan, MAX_PLAN_STOPS } from '../context/PlanContext';
import { api } from '../services/api';
import {
  REFERENCE_LATITUDE,
  REFERENCE_LONGITUDE,
  REFERENCE_LOCATION_NAME,
  DEFAULT_AVERAGE_SPEED_KMH
} from '../config/constants';

const PlanPage = () => {
  const {
    planPlaces,
    maxStops,
    removePlace,
    reorderPlaces,
    clearPlan,
    planWarning,
    clearPlanWarning,
    totalDistanceKm,
    totalDistanceFormatted,
    totalTravelMinutes,
    totalTravelTimeFormatted,
    firstStopDistanceFromReference,
    legs,
    includeReturn,
    setIncludeReturn,
    googleMapsRouteUrl
  } = usePlan();

  const [saving, setSaving] = useState(false);
  const [savedPlanCode, setSavedPlanCode] = useState(null);
  const [saveError, setSaveError] = useState(null);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;
    reorderPlaces(result.source.index, result.destination.index);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSavePlan = async () => {
    if (planPlaces.length === 0) return;
    setSaving(true);
    setSaveError(null);
    try {
      const payload = {
        title: `Kurunegala Day Tour (${new Date().toLocaleDateString()})`,
        items: planPlaces.map((p, idx) => ({ place: p._id, order: idx + 1 })),
        notes: `Tour with ${planPlaces.length} places starting from ${REFERENCE_LOCATION_NAME}`
      };
      const res = await api.savePlan(payload);
      if (res.success && res.data) {
        setSavedPlanCode(res.data.planCode);
      }
    } catch (err) {
      setSaveError(err.message || 'Failed to save itinerary');
    } finally {
      setSaving(false);
    }
  };

  const isMaxReached = planPlaces.length >= MAX_PLAN_STOPS;

  return (
    <div style={{ padding: '2.5rem 0 5rem', backgroundColor: '#f8fafc', minHeight: '85vh' }}>
      <div className="container">
        {/* Maximum Stop Warning Banner */}
        {(planWarning || isMaxReached) && (
          <div style={{
            backgroundColor: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            boxShadow: '0 2px 4px rgba(245, 158, 11, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <AlertTriangle size={22} color="#d97706" style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: '700', color: '#92400e', fontSize: '0.95rem' }}>
                  {planWarning || 'Your one-day plan can contain a maximum of 5 places.'}
                </div>
                <div style={{ fontSize: '0.825rem', color: '#b45309' }}>
                  To ensure a relaxed and achievable day visit, plans are capped at 5 destinations. Remove a stop to add another.
                </div>
              </div>
            </div>
            {planWarning && (
              <button
                onClick={clearPlanWarning}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#92400e' }}
                title="Dismiss warning"
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}

        {/* Workspace Header: Section 13 Heading & Count */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#0d9488',
              backgroundColor: '#ccfbf1',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.8rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.5rem'
            }}>
              <Calendar size={15} />
              <span>One-Day Visit Itinerary Builder</span>
            </div>

            {/* Exact required heading */}
            <h1 style={{ fontSize: '2.4rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#0f172a' }}>
              Your Day Plan
            </h1>

            {/* Number of selected places */}
            <p style={{ color: '#64748b', fontSize: '1.05rem', marginTop: '0.25rem' }}>
              <strong>{planPlaces.length} of {MAX_PLAN_STOPS}</strong> places selected for your Kurunegala day visit.
            </p>
          </div>

          {/* Plan Actions: Clear Plan & Print */}
          {planPlaces.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button onClick={handlePrint} className="btn btn-secondary btn-sm" title="Print itinerary">
                <Printer size={16} />
                <span>Print Itinerary</span>
              </button>
              {/* Exact required Clear Plan button */}
              <button
                onClick={clearPlan}
                className="btn btn-outline btn-sm"
                style={{ color: '#ef4444', borderColor: '#fca5a5' }}
                title="Clear all destinations from plan"
              >
                <Trash2 size={16} />
                <span>Clear Plan</span>
              </button>
            </div>
          )}
        </div>

        {planPlaces.length === 0 ? (
          /* Empty Plan Message (SRS Section 36) */
          <div className="empty-state">
            <Sparkles className="empty-state-icon" style={{ color: '#f59e0b' }} />
            <h3 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
              Your day plan is empty.
            </h3>
            <p style={{ fontSize: '1rem', color: '#64748b', marginBottom: '1.75rem' }}>
              Explore places and add your first stop.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/places" className="btn btn-primary" style={{ borderRadius: '9999px', padding: '0.75rem 1.75rem' }}>
                <Compass size={18} />
                <span>Explore Kurunegala Places</span>
              </Link>
              <Link to="/map" className="btn btn-secondary" style={{ borderRadius: '9999px', padding: '0.75rem 1.5rem' }}>
                <MapPin size={18} />
                <span>Open Interactive Map</span>
              </Link>
            </div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            alignItems: 'start'
          }}>
            {/* Left Column: Ordered Stop Cards with Drag Handle */}
            <div>
              {/* Origin Reference Point Strip */}
              <div style={{
                backgroundColor: '#0f172a',
                color: '#ffffff',
                padding: '1rem 1.25rem',
                borderRadius: '14px',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    backgroundColor: '#f59e0b',
                    color: '#ffffff',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '800',
                    fontSize: '0.8rem',
                    flexShrink: 0
                  }}>
                    START
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#f59e0b', fontWeight: '700' }}>
                      Fixed Departure Point
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '700' }}>
                      {REFERENCE_LOCATION_NAME}
                    </div>
                  </div>
                </div>

                {firstStopDistanceFromReference && (
                  <div style={{ fontSize: '0.8rem', color: '#38bdf8', backgroundColor: '#1e293b', padding: '0.3rem 0.6rem', borderRadius: '6px' }}>
                    First Stop Distance: <strong>{firstStopDistanceFromReference.formatted}</strong> (~{firstStopDistanceFromReference.travelTimeFormatted})
                  </div>
                )}
              </div>

              {/* Drag and Drop Ordered Stop Cards List */}
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="plan-places-list">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                    >
                      {planPlaces.map((place, index) => {
                        const matchingLeg = legs.find((l) => !l.isReturnLeg && l.place && l.place._id === place._id);

                        return (
                          <Draggable key={place._id} draggableId={place._id} index={index}>
                            {(dragProvided, snapshot) => (
                              <div
                                ref={dragProvided.innerRef}
                                {...dragProvided.draggableProps}
                                style={{
                                  ...dragProvided.draggableProps.style,
                                  backgroundColor: snapshot.isDragging ? '#f0fdfa' : '#ffffff',
                                  borderRadius: '16px',
                                  border: snapshot.isDragging ? '2px solid #0d9488' : '1px solid #e2e8f0',
                                  boxShadow: snapshot.isDragging
                                    ? '0 12px 25px -4px rgba(13, 148, 136, 0.3)'
                                    : '0 2px 6px rgba(0,0,0,0.04)',
                                  padding: '1.25rem',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '0.85rem'
                                }}
                              >
                                {/* Card Header with Drag Handle, Stop Number, Title, Remove Button */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                  {/* Drag Handle */}
                                  <div
                                    {...dragProvided.dragHandleProps}
                                    style={{
                                      cursor: 'grab',
                                      color: '#94a3b8',
                                      display: 'flex',
                                      alignItems: 'center',
                                      padding: '0.35rem'
                                    }}
                                    title="Drag up or down to reorder visit order"
                                    aria-label="Drag handle"
                                  >
                                    <GripVertical size={22} />
                                  </div>

                                  {/* Stop Number Badge */}
                                  <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    backgroundColor: '#0d9488',
                                    color: '#ffffff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: '800',
                                    fontSize: '0.9rem',
                                    flexShrink: 0
                                  }}>
                                    {index + 1}
                                  </div>

                                  {/* Thumbnail */}
                                  <img
                                    src={place.thumbnail || (place.images && place.images[0])}
                                    alt={place.name}
                                    style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }}
                                  />

                                  {/* Place Name & Category */}
                                  <div style={{ flexGrow: 1, minWidth: 0 }}>
                                    <span style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', color: '#0d9488' }}>
                                      {place.category}
                                    </span>
                                    <h3 style={{ fontSize: '1.05rem', fontWeight: '700', margin: 0, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                      <Link to={`/places/${place._id}`} style={{ color: 'inherit' }}>
                                        {place.name}
                                      </Link>
                                    </h3>
                                    <div style={{ fontSize: '0.775rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem' }}>
                                      <MapPin size={12} />
                                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {place.address}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Remove Button */}
                                  <button
                                    onClick={() => removePlace(place._id)}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: '#94a3b8',
                                      cursor: 'pointer',
                                      padding: '0.5rem',
                                      borderRadius: '8px',
                                      transition: 'color 0.15s'
                                    }}
                                    title="Remove this stop from plan"
                                    aria-label="Remove stop"
                                    onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                                    onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                                  >
                                    <Trash2 size={20} />
                                  </button>
                                </div>

                                {/* Consecutive Leg Travel Distance & Time Strip */}
                                {matchingLeg && (
                                  <div style={{
                                    backgroundColor: '#f8fafc',
                                    borderRadius: '10px',
                                    padding: '0.65rem 0.85rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    flexWrap: 'wrap',
                                    gap: '0.5rem',
                                    fontSize: '0.825rem',
                                    border: '1px solid #f1f5f9'
                                  }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569' }}>
                                      <Navigation size={14} color="#0d9488" />
                                      <span>
                                        From <strong>{matchingLeg.from}</strong>:
                                      </span>
                                      <strong style={{ color: '#0f172a' }}>{matchingLeg.distanceFormatted}</strong>
                                      <span style={{ color: '#94a3b8' }}>•</span>
                                      <span style={{ color: '#b45309', fontWeight: '600' }}>
                                        ~{matchingLeg.travelTimeFormatted} (est.)
                                      </span>
                                    </div>

                                    {/* Get Directions for this individual stop */}
                                    <a
                                      href={matchingLeg.googleMapsLegUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="btn btn-secondary btn-sm"
                                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', borderRadius: '6px' }}
                                      title="Open directions to this stop in Google Maps"
                                    >
                                      <ExternalLink size={12} />
                                      <span>Directions</span>
                                    </a>
                                  </div>
                                )}
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              {/* Round Trip Return Toggle */}
              <div style={{
                marginTop: '1.25rem',
                padding: '1rem',
                backgroundColor: '#ffffff',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', color: '#334155' }}>
                  <input
                    type="checkbox"
                    checked={includeReturn}
                    onChange={(e) => setIncludeReturn(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: '#0d9488', cursor: 'pointer' }}
                  />
                  <span>Include return drive back to {REFERENCE_LOCATION_NAME}</span>
                </label>
                <RotateCcw size={18} color="#64748b" />
              </div>

              {/* Add More Places Button (if under 5) */}
              <div style={{ marginTop: '1.25rem' }}>
                {!isMaxReached ? (
                  <Link
                    to="/places"
                    className="btn btn-outline"
                    style={{ width: '100%', borderRadius: '12px', padding: '0.75rem' }}
                  >
                    <Plus size={16} />
                    <span>Add Another Place ({MAX_PLAN_STOPS - planPlaces.length} remaining)</span>
                  </Link>
                ) : (
                  <div style={{ textAlign: 'center', padding: '0.75rem', backgroundColor: '#f1f5f9', borderRadius: '12px', fontSize: '0.85rem', color: '#64748b' }}>
                    Plan is at maximum capacity (5 of 5 stops).
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Route Distance & Travel-Time Summary */}
            <div>
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                padding: '1.75rem',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                position: 'sticky',
                top: '90px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0d9488', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                  <Navigation size={18} />
                  <span>Itinerary Totals (Consecutive Stops)</span>
                </div>

                {/* Total Metrics Display */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  {/* Total Distance */}
                  <div style={{ backgroundColor: '#f0fdfa', padding: '1.1rem', borderRadius: '14px', border: '1px solid #ccfbf1' }}>
                    <div style={{ fontSize: '0.725rem', color: '#0f766e', fontWeight: '700', textTransform: 'uppercase' }}>
                      TOTAL ESTIMATED DISTANCE
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: '#0f766e', lineHeight: 1.1, margin: '0.35rem 0' }}>
                      {totalDistanceFormatted}
                    </div>
                    <div style={{ fontSize: '0.725rem', color: '#64748b' }}>
                      Across {legs.length} consecutive leg{legs.length === 1 ? '' : 's'}
                    </div>
                  </div>

                  {/* Estimated Total Travel Time */}
                  <div style={{ backgroundColor: '#fffbeb', padding: '1.1rem', borderRadius: '14px', border: '1px solid #fef3c7' }}>
                    <div style={{ fontSize: '0.725rem', color: '#b45309', fontWeight: '700', textTransform: 'uppercase' }}>
                      ESTIMATED TRAVEL TIME
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: '#b45309', lineHeight: 1.1, margin: '0.35rem 0' }}>
                      ~{totalTravelTimeFormatted}
                    </div>
                    <div style={{ fontSize: '0.725rem', color: '#64748b' }}>
                      At {DEFAULT_AVERAGE_SPEED_KMH} km/h (Estimate)
                    </div>
                  </div>
                </div>

                {/* Multi-Stop Full Route Google Maps Button */}
                <a
                  href={googleMapsRouteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '0.9rem',
                    borderRadius: '12px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    marginBottom: '1rem'
                  }}
                  title="Open full multi-stop directions in Google Maps"
                >
                  <ExternalLink size={18} />
                  <span>Navigate Full Day Route in Google Maps</span>
                </a>

                {/* Cloud Save & Share Code */}
                <div style={{ paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                  {savedPlanCode ? (
                    <div style={{
                      backgroundColor: '#ecfdf5',
                      border: '1px solid #a7f3d0',
                      borderRadius: '12px',
                      padding: '1rem',
                      textAlign: 'center'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: '#059669', fontWeight: '700', fontSize: '0.9rem' }}>
                        <CheckCircle size={18} />
                        <span>Plan Saved Successfully!</span>
                      </div>
                      <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#065f46' }}>
                        Share Code: <strong style={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>{savedPlanCode}</strong>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={handleSavePlan}
                      disabled={saving}
                      className="btn btn-secondary"
                      style={{ width: '100%', borderRadius: '12px', fontSize: '0.875rem' }}
                    >
                      <Share2 size={16} />
                      <span>{saving ? 'Generating Share Code...' : 'Save & Share Itinerary'}</span>
                    </button>
                  )}
                  {saveError && (
                    <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                      {saveError}
                    </div>
                  )}
                </div>

                {/* Note on Consecutive Calculations */}
                <div style={{
                  marginTop: '1.25rem',
                  padding: '0.85rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '10px',
                  fontSize: '0.785rem',
                  color: '#64748b',
                  lineHeight: 1.5,
                  display: 'flex',
                  gap: '0.5rem'
                }}>
                  <Info size={16} color="#0d9488" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    Distances are measured between consecutive stops along your itinerary, beginning from {REFERENCE_LOCATION_NAME} ({REFERENCE_LATITUDE}, {REFERENCE_LONGITUDE}). All travel times are transparent estimates.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanPage;
