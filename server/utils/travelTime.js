const { DEFAULT_AVERAGE_SPEED_KMH } = require('../config/constants');

/**
 * Estimate travel time in minutes based on distance and average speed
 * @param {number} distanceKm - Distance in kilometers
 * @param {number} speedKmh - Average travel speed in km/h (defaults to configured 30 km/h)
 * @returns {number} Estimated travel time in minutes
 */
const estimateTravelTimeMinutes = (distanceKm, speedKmh = DEFAULT_AVERAGE_SPEED_KMH) => {
  if (!distanceKm || distanceKm <= 0) return 0;
  const speed = speedKmh > 0 ? speedKmh : DEFAULT_AVERAGE_SPEED_KMH;
  const minutes = (distanceKm / speed) * 60;
  return Math.max(1, Math.round(minutes)); // Minimum 1 minute for non-zero distance
};

/**
 * Format travel time in minutes to friendly human-readable format
 * e.g., "15 mins", "1 hr 10 mins"
 * @param {number} minutes 
 * @returns {string}
 */
const formatTravelTime = (minutes) => {
  if (!minutes || minutes <= 0) return '< 1 min';
  if (minutes < 60) return `${minutes} min${minutes === 1 ? '' : 's'}`;
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} hr${hours === 1 ? '' : 's'}`;
  }
  return `${hours} hr${hours === 1 ? '' : 's'} ${remainingMinutes} min${remainingMinutes === 1 ? '' : 's'}`;
};

module.exports = {
  estimateTravelTimeMinutes,
  formatTravelTime,
  DEFAULT_AVERAGE_SPEED_KMH
};
