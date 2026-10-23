const mongoose = require('mongoose');

const visitPlanSchema = new mongoose.Schema(
  {
    planCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    sessionId: {
      type: String,
      index: true
    },
    title: {
      type: String,
      default: 'Kurunegala One-Day Explorer Itinerary'
    },
    places: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place'
      }
    ],
    items: [
      {
        place: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Place',
          required: true
        },
        order: {
          type: Number,
          required: true
        },
        notes: {
          type: String,
          default: ''
        }
      }
    ],
    totalDistanceKm: {
      type: Number,
      default: 0
    },
    totalTravelMinutes: {
      type: Number,
      default: 0
    },
    notes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('VisitPlan', visitPlanSchema);
