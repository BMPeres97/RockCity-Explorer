const Place = require('../models/Place');
const Category = require('../models/Category');

/**
 * @desc   Get summary metrics for Admin Dashboard
 * @route  GET /api/admin/places/summary
 * @access Private (Admin only)
 */
const getAdminSummary = async (req, res, next) => {
  try {
    const totalActive = await Place.countDocuments({ isArchived: { $ne: true } });
    const totalArchived = await Place.countDocuments({ isArchived: true });

    // Category breakdown
    const categoryStats = await Place.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          activeCount: {
            $sum: { $cond: [{ $eq: ['$isArchived', true] }, 0, 1] }
          }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Recently updated places
    const recentlyUpdated = await Place.find()
      .sort({ updatedAt: -1 })
      .limit(5)
      .select('name category isArchived updatedAt updatedBy rating');

    res.json({
      success: true,
      data: {
        totalActive,
        totalArchived,
        totalPlaces: totalActive + totalArchived,
        categoryStats,
        recentlyUpdated
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get all places (including archived) for management table
 * @route  GET /api/admin/places
 * @access Private (Admin only)
 */
const getAdminPlaces = async (req, res, next) => {
  try {
    const { status, search, category } = req.query;
    let filter = {};

    if (status === 'active') {
      filter.isArchived = { $ne: true };
    } else if (status === 'archived') {
      filter.isArchived = true;
    }

    if (category) {
      filter.category = new RegExp(`^${category.trim()}$`, 'i');
    }

    if (search && search.trim()) {
      filter.$or = [
        { name: new RegExp(search.trim(), 'i') },
        { address: new RegExp(search.trim(), 'i') },
        { category: new RegExp(search.trim(), 'i') }
      ];
    }

    const places = await Place.find(filter)
      .sort({ updatedAt: -1 })
      .lean({ virtuals: true });

    res.json({
      success: true,
      count: places.length,
      data: places
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Create new place with authoritative duplicate check
 * @route  POST /api/admin/places
 * @access Private (Admin only)
 */
const createAdminPlace = async (req, res, next) => {
  try {
    const {
      name,
      category,
      description,
      shortDescription,
      address,
      latitude,
      longitude,
      imageUrl,
      thumbnail,
      images,
      openingHours,
      entryFee,
      dressCode,
      peakHours,
      travelTips,
      localTravelTips,
      rating,
      popularity,
      featured
    } = req.body;

    // 1. Required fields validation
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Place name is required.' });
    }
    if (!category || !category.trim()) {
      return res.status(400).json({ success: false, message: 'Category is required.' });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ success: false, message: 'Description is required.' });
    }
    if (!address || !address.trim()) {
      return res.status(400).json({ success: false, message: 'Address is required.' });
    }
    if (latitude === undefined || latitude === null || isNaN(latitude)) {
      return res.status(400).json({ success: false, message: 'Valid latitude coordinate is required.' });
    }
    if (longitude === undefined || longitude === null || isNaN(longitude)) {
      return res.status(400).json({ success: false, message: 'Valid longitude coordinate is required.' });
    }

    const lat = Number(latitude);
    const lon = Number(longitude);
    if (lat < -90 || lat > 90) {
      return res.status(400).json({ success: false, message: 'Latitude must be between -90 and 90 degrees.' });
    }
    if (lon < -180 || lon > 180) {
      return res.status(400).json({ success: false, message: 'Longitude must be between -180 and 180 degrees.' });
    }

    // 2. Authoritative duplicate check (case-insensitive)
    const existing = await Place.findOne({
      name: { $regex: new RegExp(`^${name.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A place with this name already exists.'
      });
    }

    const adminIdentifier = req.admin?.username || req.admin?.email || 'Admin';

    const finalImage = imageUrl || thumbnail || (Array.isArray(images) && images[0]) || '';
    const tipsList = Array.isArray(localTravelTips) && localTravelTips.length > 0
      ? localTravelTips
      : (travelTips ? travelTips.split('\n').filter(Boolean) : []);

    const place = await Place.create({
      name: name.trim(),
      category: category.trim(),
      description: description.trim(),
      shortDescription: shortDescription || description.slice(0, 140) + '...',
      address: address.trim(),
      latitude: lat,
      longitude: lon,
      imageUrl: finalImage,
      thumbnail: finalImage,
      images: Array.isArray(images) && images.length ? images : (finalImage ? [finalImage] : []),
      openingHours: openingHours || { open: '06:00', close: '18:00', days: [], alwaysOpen: false },
      entryFee: entryFee || 'Free admission',
      dressCode: dressCode || 'Comfortable attire recommended',
      peakHours: peakHours || 'Late afternoon (16:00 - 18:00)',
      travelTips: travelTips || (tipsList.join('\n')),
      localTravelTips: tipsList,
      rating: rating ? Number(rating) : 4.5,
      popularity: popularity ? Number(popularity) : 85,
      featured: Boolean(featured),
      isArchived: false,
      updatedBy: adminIdentifier
    });

    res.status(201).json({
      success: true,
      message: 'Place created successfully',
      data: place
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Update place with authoritative duplicate check
 * @route  PUT /api/admin/places/:id
 * @access Private (Admin only)
 */
const updateAdminPlace = async (req, res, next) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ success: false, message: 'Place not found.' });
    }

    const {
      name,
      category,
      description,
      shortDescription,
      address,
      latitude,
      longitude,
      imageUrl,
      thumbnail,
      images,
      openingHours,
      entryFee,
      dressCode,
      peakHours,
      travelTips,
      localTravelTips,
      rating,
      popularity,
      featured
    } = req.body;

    // Check duplicate name if changed
    if (name && name.trim().toLowerCase() !== place.name.toLowerCase()) {
      const existing = await Place.findOne({
        name: { $regex: new RegExp(`^${name.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
        _id: { $ne: req.params.id }
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'A place with this name already exists.'
        });
      }
      place.name = name.trim();
    }

    if (category) place.category = category.trim();
    if (description) place.description = description.trim();
    if (shortDescription !== undefined) place.shortDescription = shortDescription;
    if (address) place.address = address.trim();

    if (latitude !== undefined && !isNaN(latitude)) {
      const lat = Number(latitude);
      if (lat < -90 || lat > 90) {
        return res.status(400).json({ success: false, message: 'Latitude must be between -90 and 90.' });
      }
      place.latitude = lat;
    }

    if (longitude !== undefined && !isNaN(longitude)) {
      const lon = Number(longitude);
      if (lon < -180 || lon > 180) {
        return res.status(400).json({ success: false, message: 'Longitude must be between -180 and 180.' });
      }
      place.longitude = lon;
    }

    const finalImage = imageUrl || thumbnail;
    if (finalImage) {
      place.imageUrl = finalImage;
      place.thumbnail = finalImage;
      if (!place.images || place.images.length === 0) {
        place.images = [finalImage];
      }
    }
    if (Array.isArray(images) && images.length > 0) {
      place.images = images;
    }

    if (openingHours !== undefined) place.openingHours = openingHours;
    if (entryFee !== undefined) place.entryFee = entryFee;
    if (dressCode !== undefined) place.dressCode = dressCode;
    if (peakHours !== undefined) place.peakHours = peakHours;

    if (travelTips !== undefined) {
      place.travelTips = travelTips;
      place.localTravelTips = travelTips.split('\n').filter(Boolean);
    } else if (Array.isArray(localTravelTips)) {
      place.localTravelTips = localTravelTips;
      place.travelTips = localTravelTips.join('\n');
    }

    if (rating !== undefined && !isNaN(rating)) place.rating = Number(rating);
    if (popularity !== undefined && !isNaN(popularity)) place.popularity = Number(popularity);
    if (featured !== undefined) place.featured = Boolean(featured);

    place.updatedBy = req.admin?.username || req.admin?.email || 'Admin';

    await place.save();

    res.json({
      success: true,
      message: 'Place updated successfully',
      data: place
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Soft-delete (Archive) a place
 * @route  PATCH /api/admin/places/:id/archive
 * @access Private (Admin only)
 */
const archiveAdminPlace = async (req, res, next) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ success: false, message: 'Place not found.' });
    }

    place.isArchived = true;
    place.updatedBy = req.admin?.username || req.admin?.email || 'Admin';
    await place.save();

    res.json({
      success: true,
      message: `Place "${place.name}" archived successfully.`,
      data: place
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Restore an archived place
 * @route  PATCH /api/admin/places/:id/restore
 * @access Private (Admin only)
 */
const restoreAdminPlace = async (req, res, next) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ success: false, message: 'Place not found.' });
    }

    place.isArchived = false;
    place.updatedBy = req.admin?.username || req.admin?.email || 'Admin';
    await place.save();

    res.json({
      success: true,
      message: `Place "${place.name}" restored successfully.`,
      data: place
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminSummary,
  getAdminPlaces,
  createAdminPlace,
  updateAdminPlace,
  archiveAdminPlace,
  restoreAdminPlace
};
