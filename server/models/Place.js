const mongoose = require('mongoose');
const { calculateDistanceFromReference, formatDistance } = require('../utils/geoDistance');
const { estimateTravelTimeMinutes, formatTravelTime } = require('../utils/travelTime');
const { REFERENCE_LATITUDE, REFERENCE_LONGITUDE } = require('../config/constants');

const placeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Place name is required'],
      trim: true,
      unique: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      index: true
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    shortDescription: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true
    },
    latitude: {
      type: Number,
      required: [true, 'Latitude is required'],
      min: -90,
      max: 90
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude is required'],
      min: -180,
      max: 180
    },
    imageUrl: {
      type: String,
      default: ''
    },
    thumbnail: {
      type: String,
      default: ''
    },
    images: {
      type: [String],
      default: []
    },
    openingHours: {
      type: mongoose.Schema.Types.Mixed,
      default: {
        open: '06:00',
        close: '18:00',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        alwaysOpen: false
      }
    },
    entryFee: {
      type: mongoose.Schema.Types.Mixed,
      default: 'Free admission'
    },
    dressCode: {
      type: String,
      default: 'Casual and comfortable footwear recommended'
    },
    peakHours: {
      type: String,
      default: 'Late afternoon (16:00 - 18:00)'
    },
    travelTips: {
      type: String,
      default: ''
    },
    localTravelTips: {
      type: [String],
      default: []
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 1,
      max: 5
    },
    popularity: {
      type: Number,
      default: 85
    },
    reviewsCount: {
      type: Number,
      default: 120
    },
    featured: {
      type: Boolean,
      default: false
    },
    isArchived: {
      type: Boolean,
      default: false,
      index: true
    },
    updatedBy: {
      type: String,
      default: 'System / Admin'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for distance from the critical fixed Kurunegala reference point (7.4692807, 80.4424776)
placeSchema.virtual('distanceFromReference').get(function () {
  return calculateDistanceFromReference(this.latitude, this.longitude);
});

// Virtual for formatted distance string (e.g. "2.4 km")
placeSchema.virtual('distanceFormatted').get(function () {
  const dist = calculateDistanceFromReference(this.latitude, this.longitude);
  return formatDistance(dist);
});

// Virtual for estimated travel time in minutes based on fixed reference location
placeSchema.virtual('estimatedTravelMinutes').get(function () {
  const dist = calculateDistanceFromReference(this.latitude, this.longitude);
  return estimateTravelTimeMinutes(dist);
});

// Virtual for formatted travel time string (e.g. "12 mins")
placeSchema.virtual('travelTimeFormatted').get(function () {
  const dist = calculateDistanceFromReference(this.latitude, this.longitude);
  const minutes = estimateTravelTimeMinutes(dist);
  return formatTravelTime(minutes);
});

// Virtual for checking current Open/Closed status
placeSchema.virtual('isOpenNow').get(function () {
  if (!this.openingHours) return true;
  if (typeof this.openingHours === 'string') return true;

  if (this.openingHours.alwaysOpen) return true;

  if (!this.openingHours.open || !this.openingHours.close) return true;

  try {
    const now = new Date();
    const slTimeStr = now.toLocaleTimeString('en-US', {
      timeZone: 'Asia/Colombo',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const [currentHour, currentMinute] = slTimeStr.split(':').map(Number);
    const currentMins = currentHour * 60 + currentMinute;

    const [openH, openM] = this.openingHours.open.split(':').map(Number);
    const [closeH, closeM] = this.openingHours.close.split(':').map(Number);
    const openMins = openH * 60 + openM;
    const closeMins = closeH * 60 + closeM;

    const currentDay = now.toLocaleDateString('en-US', { timeZone: 'Asia/Colombo', weekday: 'long' });
    if (this.openingHours.days && Array.isArray(this.openingHours.days) && this.openingHours.days.length > 0) {
      if (!this.openingHours.days.includes(currentDay)) {
        return false;
      }
    }

    if (closeMins < openMins) {
      return currentMins >= openMins || currentMins <= closeMins;
    }
    return currentMins >= openMins && currentMins <= closeMins;
  } catch (err) {
    return true;
  }
});

// Virtual for Google Maps directions link
placeSchema.virtual('googleMapsDirectionsUrl').get(function () {
  return `https://www.google.com/maps/dir/?api=1&origin=${REFERENCE_LATITUDE},${REFERENCE_LONGITUDE}&destination=${this.latitude},${this.longitude}`;
});

// Pre-save to sync thumbnail and imageUrl
placeSchema.pre('save', function (next) {
  if (this.imageUrl && !this.thumbnail) {
    this.thumbnail = this.imageUrl;
  }
  if (this.thumbnail && !this.imageUrl) {
    this.imageUrl = this.thumbnail;
  }
  if (this.travelTips && (!this.localTravelTips || this.localTravelTips.length === 0)) {
    this.localTravelTips = this.travelTips.split('\n').filter(Boolean);
  }
  next();
});

// Indexes
placeSchema.index({ name: 'text', description: 'text', address: 'text' });
placeSchema.index({ isArchived: 1, category: 1 });
placeSchema.index({ rating: -1 });

module.exports = mongoose.model('Place', placeSchema);
