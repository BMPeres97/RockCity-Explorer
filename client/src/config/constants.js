/**
 * RockCity Explorer - Frontend Configuration & Constants
 * 
 * CRITICAL FIXED REFERENCE LOCATION:
 * Latitude:  7.4692807
 * Longitude: 80.4424776
 * 
 * This exact coordinate is the application's fixed Kurunegala reference point.
 * Used for all client-side distance calculations, proximity sorting,
 * card badges, itinerary route legs, and initial map center.
 */

export const REFERENCE_LATITUDE = 7.4692807;
export const REFERENCE_LONGITUDE = 80.4424776;
export const REFERENCE_LOCATION_NAME = 'Kurunegala Central Reference Point';

// Default average travel speed in km/h on Kurunegala roads
export const DEFAULT_AVERAGE_SPEED_KMH = 30;

// Haversine earth radius
export const EARTH_RADIUS_KM = 6371;

// Application Branding
export const APP_NAME = 'RockCity Explorer';
export const APP_TAGLINE = 'Kurunegala Day-Visit Planner & Tourism Guide';
export const SRI_LANKA_REGION = 'North Western Province, Sri Lanka';
