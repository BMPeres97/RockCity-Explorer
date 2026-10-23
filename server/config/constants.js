/**
 * RockCity Explorer - System Constants
 * 
 * CRITICAL REFERENCE LOCATION:
 * Latitude:  7.4692807
 * Longitude: 80.4424776
 * 
 * This coordinate represents the single fixed Kurunegala reference point.
 * Used for all distance calculations, proximity sorting, travel-time estimations,
 * initial map center, and place detail metrics.
 */

const REFERENCE_LATITUDE = parseFloat(process.env.REFERENCE_LATITUDE) || 7.4692807;
const REFERENCE_LONGITUDE = parseFloat(process.env.REFERENCE_LONGITUDE) || 80.4424776;
const REFERENCE_LOCATION_NAME = process.env.REFERENCE_LOCATION_NAME || 'Kurunegala Central Reference Point';

// Default average tourist travel speed on Kurunegala local & suburban roads in km/h
const DEFAULT_AVERAGE_SPEED_KMH = parseFloat(process.env.DEFAULT_AVERAGE_SPEED_KMH) || 30;

module.exports = {
  REFERENCE_LATITUDE,
  REFERENCE_LONGITUDE,
  REFERENCE_LOCATION_NAME,
  DEFAULT_AVERAGE_SPEED_KMH,
  EARTH_RADIUS_KM: 6371 // Mean radius of the Earth in km for Haversine
};
