import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  REFERENCE_LATITUDE,
  REFERENCE_LONGITUDE,
  REFERENCE_LOCATION_NAME,
  DEFAULT_AVERAGE_SPEED_KMH
} from '../config/constants';
import { calculateDistanceBetween, formatDistance } from '../utils/geoDistance';
import { estimateTravelTimeMinutes, formatTravelTime } from '../utils/travelTime';

const PlanContext = createContext();

const STORAGE_KEY = 'rockcity_day_plan_places';
const RETURN_STORAGE_KEY = 'rockcity_include_return_leg';
export const MAX_PLAN_STOPS = 5;

export const PlanProvider = ({ children }) => {
  const [planPlaces, setPlanPlaces] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [includeReturn, setIncludeReturn] = useState(() => {
    try {
      return localStorage.getItem(RETURN_STORAGE_KEY) === 'true';
    } catch (e) {
      return false;
    }
  });

  const [planWarning, setPlanWarning] = useState(null);

  // Persist plan state to localStorage for accidental page refresh resilience
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(planPlaces));
    } catch (e) {
      console.error('Failed to persist plan to localStorage', e);
    }
  }, [planPlaces]);

  useEffect(() => {
    try {
      localStorage.setItem(RETURN_STORAGE_KEY, String(includeReturn));
    } catch (e) {
      console.error('Failed to persist includeReturn', e);
    }
  }, [includeReturn]);

  /**
   * Add a place to the one-day plan with strict max 5 stop enforcement
   */
  const addPlace = (place) => {
    if (!place || !place._id) return { success: false };

    // Check if place is already in plan
    if (planPlaces.some((p) => p._id === place._id)) {
      return { success: false, reason: 'ALREADY_EXISTS' };
    }

    // Requirement: Prevent more than 5 places
    // If the user attempts to add a sixth:
    // "Your one-day plan can contain a maximum of 5 places."
    // Do not add the sixth place.
    if (planPlaces.length >= MAX_PLAN_STOPS) {
      const warningMsg = 'Your one-day plan can contain a maximum of 5 places.';
      setPlanWarning(warningMsg);
      return {
        success: false,
        reason: 'MAX_LIMIT',
        message: warningMsg
      };
    }

    setPlanPlaces((prev) => [...prev, place]);
    setPlanWarning(null);
    return { success: true };
  };

  /**
   * Remove a place from the plan
   */
  const removePlace = (placeId) => {
    setPlanPlaces((prev) => prev.filter((p) => p._id !== placeId));
    setPlanWarning(null);
  };

  /**
   * Toggle place in plan
   */
  const togglePlace = (place) => {
    if (!place || !place._id) return { success: false };

    const exists = planPlaces.some((p) => p._id === place._id);
    if (exists) {
      removePlace(place._id);
      return { success: true, action: 'removed' };
    } else {
      return addPlace(place);
    }
  };

  const isPlaceInPlan = (placeId) => {
    return planPlaces.some((p) => p._id === placeId);
  };

  /**
   * Reorder places using drag-and-drop
   */
  const reorderPlaces = (startIndex, endIndex) => {
    setPlanPlaces((prev) => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  };

  const clearPlan = () => {
    setPlanPlaces([]);
    setPlanWarning(null);
  };

  const clearPlanWarning = () => {
    setPlanWarning(null);
  };

  /**
   * CONSECUTIVE STOPS DISTANCE & TRAVEL TIME CALCULATION
   * "For the plan, calculate travel distance between consecutive stops rather than simply summing reference-to-place distances.
   * Also show the first stop's distance from the fixed reference point where useful."
   */
  const metrics = useMemo(() => {
    if (planPlaces.length === 0) {
      return {
        totalDistanceKm: 0,
        totalDistanceFormatted: '0.0 km',
        totalTravelMinutes: 0,
        totalTravelTimeFormatted: '0 mins',
        firstStopDistanceFromReference: null,
        legs: [],
        googleMapsRouteUrl: ''
      };
    }

    // Departure point: Fixed Reference Location (7.4692807, 80.4424776)
    let currentLat = REFERENCE_LATITUDE;
    let currentLon = REFERENCE_LONGITUDE;
    let currentName = REFERENCE_LOCATION_NAME;

    let totalDist = 0;
    let totalMins = 0;
    const legs = [];

    let firstStopDistance = null;

    planPlaces.forEach((place, index) => {
      // Calculate distance between consecutive stops
      const legDist = calculateDistanceBetween(currentLat, currentLon, place.latitude, place.longitude);
      const legMins = estimateTravelTimeMinutes(legDist, DEFAULT_AVERAGE_SPEED_KMH);

      totalDist += legDist;
      totalMins += legMins;

      if (index === 0) {
        firstStopDistance = {
          km: legDist,
          formatted: formatDistance(legDist),
          travelMinutes: legMins,
          travelTimeFormatted: formatTravelTime(legMins)
        };
      }

      legs.push({
        legIndex: index + 1,
        stopNumber: index + 1,
        from: currentName,
        to: place.name,
        fromCoords: { lat: currentLat, lng: currentLon },
        toCoords: { lat: place.latitude, lng: place.longitude },
        place,
        isFromReference: index === 0,
        distanceKm: legDist,
        distanceFormatted: formatDistance(legDist),
        travelMinutes: legMins,
        travelTimeFormatted: formatTravelTime(legMins),
        googleMapsLegUrl: `https://www.google.com/maps/dir/?api=1&origin=${currentLat},${currentLon}&destination=${place.latitude},${place.longitude}`
      });

      // Update current position for next consecutive leg
      currentLat = place.latitude;
      currentLon = place.longitude;
      currentName = place.name;
    });

    // Optional return leg back to the fixed reference point
    if (includeReturn && planPlaces.length > 0) {
      const returnDist = calculateDistanceBetween(currentLat, currentLon, REFERENCE_LATITUDE, REFERENCE_LONGITUDE);
      const returnMins = estimateTravelTimeMinutes(returnDist, DEFAULT_AVERAGE_SPEED_KMH);

      totalDist += returnDist;
      totalMins += returnMins;

      legs.push({
        legIndex: legs.length + 1,
        from: currentName,
        to: `${REFERENCE_LOCATION_NAME} (Return)`,
        fromCoords: { lat: currentLat, lng: currentLon },
        toCoords: { lat: REFERENCE_LATITUDE, lng: REFERENCE_LONGITUDE },
        isReturnLeg: true,
        distanceKm: returnDist,
        distanceFormatted: formatDistance(returnDist),
        travelMinutes: returnMins,
        travelTimeFormatted: formatTravelTime(returnMins),
        googleMapsLegUrl: `https://www.google.com/maps/dir/?api=1&origin=${currentLat},${currentLon}&destination=${REFERENCE_LATITUDE},${REFERENCE_LONGITUDE}`
      });
    }

    // Google Maps multi-stop route
    const waypoints = [
      `${REFERENCE_LATITUDE},${REFERENCE_LONGITUDE}`,
      ...planPlaces.map((p) => `${p.latitude},${p.longitude}`)
    ];
    if (includeReturn) {
      waypoints.push(`${REFERENCE_LATITUDE},${REFERENCE_LONGITUDE}`);
    }
    const googleMapsRouteUrl = `https://www.google.com/maps/dir/${waypoints.join('/')}`;

    return {
      totalDistanceKm: Math.round(totalDist * 100) / 100,
      totalDistanceFormatted: formatDistance(totalDist),
      totalTravelMinutes: totalMins,
      totalTravelTimeFormatted: formatTravelTime(totalMins),
      firstStopDistanceFromReference: firstStopDistance,
      legs,
      googleMapsRouteUrl
    };
  }, [planPlaces, includeReturn]);

  return (
    <PlanContext.Provider
      value={{
        planPlaces,
        maxStops: MAX_PLAN_STOPS,
        addPlace,
        removePlace,
        togglePlace,
        isPlaceInPlan,
        reorderPlaces,
        clearPlan,
        planWarning,
        setPlanWarning,
        clearPlanWarning,
        includeReturn,
        setIncludeReturn,
        ...metrics
      }}
    >
      {children}
    </PlanContext.Provider>
  );
};

export const usePlan = () => {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
};
