const VisitPlan = require('../models/VisitPlan');
const Place = require('../models/Place');
const {
  REFERENCE_LATITUDE,
  REFERENCE_LONGITUDE,
  REFERENCE_LOCATION_NAME,
  DEFAULT_AVERAGE_SPEED_KMH
} = require('../config/constants');
const { calculateDistanceBetween, formatDistance } = require('../utils/geoDistance');
const { estimateTravelTimeMinutes, formatTravelTime } = require('../utils/travelTime');

/**
 * Generate a random short alphanumeric code
 */
const generatePlanCode = () => {
  return 'RC-' + Math.random().toString(36).substring(2, 8).toUpperCase();
};

/**
 * @desc   Calculate full itinerary metrics (legs, total distance, total travel time)
 * @route  POST /api/plans/calculate
 * @access Public (Tourist)
 */
const calculatePlanMetrics = async (req, res, next) => {
  try {
    const { placeIds, includeReturn = false } = req.body;

    if (!Array.isArray(placeIds) || placeIds.length === 0) {
      return res.json({
        success: true,
        referencePoint: {
          latitude: REFERENCE_LATITUDE,
          longitude: REFERENCE_LONGITUDE,
          name: REFERENCE_LOCATION_NAME
        },
        placesCount: 0,
        totalDistanceKm: 0,
        totalDistanceFormatted: '0.0 km',
        totalTravelMinutes: 0,
        totalTravelTimeFormatted: '0 mins',
        legs: []
      });
    }

    // Retrieve places in the exact ordered sequence requested
    const places = await Place.find({ _id: { $in: placeIds } }).lean();
    const placeMap = {};
    places.forEach((p) => {
      placeMap[p._id.toString()] = p;
    });

    const orderedPlaces = placeIds
      .map((id) => placeMap[id.toString()])
      .filter(Boolean);

    // Build the itinerary route starting from the fixed reference point
    // Reference Point (7.4692807, 80.4424776) -> Place 1 -> Place 2 -> ... -> (optional Return)
    let currentLat = REFERENCE_LATITUDE;
    let currentLon = REFERENCE_LONGITUDE;
    let currentName = REFERENCE_LOCATION_NAME;

    const legs = [];
    let totalDistanceKm = 0;
    let totalTravelMinutes = 0;

    orderedPlaces.forEach((place, index) => {
      const legDistance = calculateDistanceBetween(currentLat, currentLon, place.latitude, place.longitude);
      const legTravelMins = estimateTravelTimeMinutes(legDistance, DEFAULT_AVERAGE_SPEED_KMH);

      totalDistanceKm += legDistance;
      totalTravelMinutes += legTravelMins;

      legs.push({
        legIndex: index + 1,
        from: currentName,
        to: place.name,
        fromCoordinates: { latitude: currentLat, longitude: currentLon },
        toCoordinates: { latitude: place.latitude, longitude: place.longitude },
        placeId: place._id,
        place,
        distanceKm: legDistance,
        distanceFormatted: formatDistance(legDistance),
        travelMinutes: legTravelMins,
        travelTimeFormatted: formatTravelTime(legTravelMins)
      });

      currentLat = place.latitude;
      currentLon = place.longitude;
      currentName = place.name;
    });

    // Optional return leg to fixed reference location
    if (includeReturn && orderedPlaces.length > 0) {
      const returnDistance = calculateDistanceBetween(currentLat, currentLon, REFERENCE_LATITUDE, REFERENCE_LONGITUDE);
      const returnMins = estimateTravelTimeMinutes(returnDistance, DEFAULT_AVERAGE_SPEED_KMH);

      totalDistanceKm += returnDistance;
      totalTravelMinutes += returnMins;

      legs.push({
        legIndex: legs.length + 1,
        from: currentName,
        to: REFERENCE_LOCATION_NAME + ' (Return)',
        fromCoordinates: { latitude: currentLat, longitude: currentLon },
        toCoordinates: { latitude: REFERENCE_LATITUDE, longitude: REFERENCE_LONGITUDE },
        isReturnLeg: true,
        distanceKm: returnDistance,
        distanceFormatted: formatDistance(returnDistance),
        travelMinutes: returnMins,
        travelTimeFormatted: formatTravelTime(returnMins)
      });
    }

    // Google Maps multi-stop route
    const waypoints = [
      `${REFERENCE_LATITUDE},${REFERENCE_LONGITUDE}`,
      ...orderedPlaces.map((p) => `${p.latitude},${p.longitude}`)
    ];
    if (includeReturn) {
      waypoints.push(`${REFERENCE_LATITUDE},${REFERENCE_LONGITUDE}`);
    }
    const googleMapsRouteUrl = `https://www.google.com/maps/dir/${waypoints.join('/')}`;

    res.json({
      success: true,
      referencePoint: {
        latitude: REFERENCE_LATITUDE,
        longitude: REFERENCE_LONGITUDE,
        name: REFERENCE_LOCATION_NAME
      },
      placesCount: orderedPlaces.length,
      orderedPlaces,
      totalDistanceKm: Math.round(totalDistanceKm * 100) / 100,
      totalDistanceFormatted: formatDistance(totalDistanceKm),
      totalTravelMinutes,
      totalTravelTimeFormatted: formatTravelTime(totalTravelMinutes),
      googleMapsRouteUrl,
      legs
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Save / Share an itinerary plan
 * @route  POST /api/plans
 * @access Public (Tourist)
 */
const savePlan = async (req, res, next) => {
  try {
    const { title, items, notes } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'A plan must contain at least one place'
      });
    }

    const placeIds = items.map((i) => i.place || i);
    const places = await Place.find({ _id: { $in: placeIds } });
    const placeMap = {};
    places.forEach((p) => {
      placeMap[p._id.toString()] = p;
    });

    let currentLat = REFERENCE_LATITUDE;
    let currentLon = REFERENCE_LONGITUDE;
    let totalDist = 0;
    let totalMins = 0;

    const formattedItems = [];
    items.forEach((item, index) => {
      const pId = (item.place || item).toString();
      const place = placeMap[pId];
      if (place) {
        const d = calculateDistanceBetween(currentLat, currentLon, place.latitude, place.longitude);
        const m = estimateTravelTimeMinutes(d, DEFAULT_AVERAGE_SPEED_KMH);
        totalDist += d;
        totalMins += m;
        currentLat = place.latitude;
        currentLon = place.longitude;

        formattedItems.push({
          place: place._id,
          order: item.order !== undefined ? item.order : index + 1,
          notes: item.notes || ''
        });
      }
    });

    let planCode = generatePlanCode();
    // Ensure code is unique
    while (await VisitPlan.findOne({ planCode })) {
      planCode = generatePlanCode();
    }

    const plan = await VisitPlan.create({
      planCode,
      title: title || 'Kurunegala One-Day Explorer Itinerary',
      items: formattedItems,
      totalDistanceKm: Math.round(totalDist * 100) / 100,
      totalTravelMinutes: totalMins,
      notes: notes || ''
    });

    const populatedPlan = await VisitPlan.findById(plan._id).populate('items.place');

    res.status(201).json({
      success: true,
      message: 'Itinerary saved successfully',
      data: populatedPlan
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get saved plan by code
 * @route  GET /api/plans/:planCode
 * @access Public (Tourist)
 */
const getPlanByCode = async (req, res, next) => {
  try {
    const plan = await VisitPlan.findOne({ planCode: req.params.planCode.toUpperCase() }).populate('items.place');

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found with the provided code'
      });
    }

    res.json({
      success: true,
      data: plan
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  calculatePlanMetrics,
  savePlan,
  getPlanByCode
};
