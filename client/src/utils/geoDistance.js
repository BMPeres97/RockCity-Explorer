import { REFERENCE_LATITUDE, REFERENCE_LONGITUDE, EARTH_RADIUS_KM } from '../config/constants';

const toRadians = (degrees) => degrees * (Math.PI / 180);

/**
 * Calculate straight-line distance in km using the Haversine formula
 */
export const calculateDistanceBetween = (lat1, lon1, lat2, lon2) => {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) {
    return 0;
  }

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = EARTH_RADIUS_KM * c;

  return Math.round(distance * 100) / 100;
};

/**
 * Calculate distance from the fixed Kurunegala reference point (7.4692807, 80.4424776)
 */
export const calculateDistanceFromReference = (targetLat, targetLon) => {
  return calculateDistanceBetween(REFERENCE_LATITUDE, REFERENCE_LONGITUDE, targetLat, targetLon);
};

/**
 * Format distance into a friendly display string (e.g. "2.4 km")
 */
export const formatDistance = (distanceKm) => {
  if (distanceKm === null || distanceKm === undefined) return '0.0 km';
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return `${meters} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
};
