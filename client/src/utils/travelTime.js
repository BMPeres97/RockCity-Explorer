import { DEFAULT_AVERAGE_SPEED_KMH } from '../config/constants';

/**
 * Estimate travel time in minutes based on distance and average speed
 */
export const estimateTravelTimeMinutes = (distanceKm, speedKmh = DEFAULT_AVERAGE_SPEED_KMH) => {
  if (!distanceKm || distanceKm <= 0) return 0;
  const speed = speedKmh > 0 ? speedKmh : DEFAULT_AVERAGE_SPEED_KMH;
  const minutes = (distanceKm / speed) * 60;
  return Math.max(1, Math.round(minutes));
};

/**
 * Format travel time in minutes to friendly human-readable format
 * e.g., "15 mins", "1 hr 10 mins"
 */
export const formatTravelTime = (minutes) => {
  if (!minutes || minutes <= 0) return '< 1 min';
  if (minutes < 60) return `${minutes} min${minutes === 1 ? '' : 's'}`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} hr${hours === 1 ? '' : 's'}`;
  }
  return `${hours} hr${hours === 1 ? '' : 's'} ${remainingMinutes} min${remainingMinutes === 1 ? '' : 's'}`;
};
