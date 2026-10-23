const Place = require('../models/Place');
const {
  REFERENCE_LATITUDE,
  REFERENCE_LONGITUDE,
  REFERENCE_LOCATION_NAME,
  DEFAULT_AVERAGE_SPEED_KMH
} = require('../config/constants');
const { calculateDistanceFromReference, formatDistance } = require('../utils/geoDistance');
const { estimateTravelTimeMinutes, formatTravelTime } = require('../utils/travelTime');
const { checkIsOpenNow, SL_TIMEZONE } = require('../utils/openStatus');

/**
 * @desc   Get all active places with server-side filtering, search, and sorting
 * @route  GET /api/places
 * @access Public (Tourist)
 * 
 * Query parameters supported (SRS Section 24):
 * - category: e.g. "nature", "heritage", "religious", "cultural"
 * - categories: comma-separated categories
 * - openNow: "true" to filter for places currently open in Asia/Colombo timezone
 * - sort / sortBy: "distance" | "nearest" | "rating" | "popularity" | "farthest" | "name_asc" | "name_desc"
 * - search: keyword search in name, description, address, category
 */
const getPlaces = async (req, res, next) => {
  try {
    const { category, categories, openNow, search, sort, sortBy } = req.query;

    // Requirement: Archived places must never appear in tourist-facing pages
    let filter = { isArchived: { $ne: true } };

    // Category filtering (single or comma-separated)
    const categoryFilterList = [];
    if (categories) {
      categoryFilterList.push(...categories.split(',').map((c) => c.trim()).filter(Boolean));
    }
    if (category) {
      categoryFilterList.push(...category.split(',').map((c) => c.trim()).filter(Boolean));
    }

    if (categoryFilterList.length > 0) {
      // Case-insensitive exact match per category name
      filter.category = {
        $in: categoryFilterList.map((c) => new RegExp(`^${c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'))
      };
    }

    // Name / keyword search
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { address: searchRegex },
        { category: searchRegex }
      ];
    }

    // Fetch active places
    let places = await Place.find(filter).lean({ virtuals: true });

    // Process computed fields (Distance from fixed reference point & Open Now evaluation)
    places = places.map((place) => {
      const distance = calculateDistanceFromReference(place.latitude, place.longitude);
      const travelMins = estimateTravelTimeMinutes(distance, DEFAULT_AVERAGE_SPEED_KMH);

      // Section 25: Authoritative Open Now calculation in Asia/Colombo timezone
      // Returns true (Open Now), false (Closed), or null (Hours Unknown)
      const isOpen = checkIsOpenNow(place.openingHours);

      return {
        ...place,
        distanceFromReference: distance,
        distanceFormatted: formatDistance(distance),
        estimatedTravelMinutes: travelMins,
        travelTimeFormatted: formatTravelTime(travelMins),
        isOpenNow: isOpen, // true, false, or null (unknown)
        googleMapsDirectionsUrl: `https://www.google.com/maps/dir/?api=1&origin=${REFERENCE_LATITUDE},${REFERENCE_LONGITUDE}&destination=${place.latitude},${place.longitude}`
      };
    });

    // Server-side filter by Open Now if requested (?openNow=true)
    // Unknown schedules (null) must NOT be marked as open
    if (openNow === 'true' || openNow === true) {
      places = places.filter((p) => p.isOpenNow === true);
    }

    // Server-side sorting (supports ?sort=distance, ?sort=rating, etc. as well as ?sortBy=...)
    const activeSort = (sort || sortBy || 'nearest').toLowerCase().trim();

    if (activeSort === 'nearest' || activeSort === 'distance') {
      places.sort((a, b) => a.distanceFromReference - b.distanceFromReference);
    } else if (activeSort === 'farthest') {
      places.sort((a, b) => b.distanceFromReference - a.distanceFromReference);
    } else if (activeSort === 'rating' || activeSort === 'popularity') {
      places.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (activeSort === 'name_asc') {
      places.sort((a, b) => a.name.localeCompare(b.name));
    } else if (activeSort === 'name_desc') {
      places.sort((a, b) => b.name.localeCompare(a.name));
    } else {
      places.sort((a, b) => a.distanceFromReference - b.distanceFromReference);
    }

    res.json({
      success: true,
      count: places.length,
      referencePoint: {
        latitude: REFERENCE_LATITUDE,
        longitude: REFERENCE_LONGITUDE,
        name: REFERENCE_LOCATION_NAME
      },
      timezone: SL_TIMEZONE,
      averageSpeedKmh: DEFAULT_AVERAGE_SPEED_KMH,
      data: places
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get single place by ID
 * @route  GET /api/places/:id
 * @access Public (Tourist)
 */
const getPlaceById = async (req, res, next) => {
  try {
    // Exclude archived records from public detail view
    const place = await Place.findOne({ _id: req.params.id, isArchived: { $ne: true } });

    if (!place) {
      return res.status(404).json({
        success: false,
        message: 'Place not found'
      });
    }

    const distance = calculateDistanceFromReference(place.latitude, place.longitude);
    const travelMins = estimateTravelTimeMinutes(distance, DEFAULT_AVERAGE_SPEED_KMH);
    const isOpen = checkIsOpenNow(place.openingHours);

    const placeObj = place.toJSON();
    placeObj.distanceFromReference = distance;
    placeObj.distanceFormatted = formatDistance(distance);
    placeObj.estimatedTravelMinutes = travelMins;
    placeObj.travelTimeFormatted = formatTravelTime(travelMins);
    placeObj.isOpenNow = isOpen;
    placeObj.referencePoint = {
      latitude: REFERENCE_LATITUDE,
      longitude: REFERENCE_LONGITUDE,
      name: REFERENCE_LOCATION_NAME
    };
    placeObj.timezone = SL_TIMEZONE;
    placeObj.googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${REFERENCE_LATITUDE},${REFERENCE_LONGITUDE}&destination=${place.latitude},${place.longitude}`;

    res.json({
      success: true,
      data: placeObj
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPlaces,
  getPlaceById
};
