const mongoose = require('mongoose');

const storageSchema = new mongoose.Schema(
  {
    facilityName: {
      type: String,
      required: true,
      trim: true
    },

    tankId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    capacityKg: {
      type: Number,
      required: true,
      min: 0
    },

    currentLevelKg: {
      type: Number,
      required: true,
      min: 0
    },

    pressureBar: {
      type: Number,
      required: true,
      min: 0
    },

    temperatureC: {
      type: Number,
      required: true
    },

    safetyThresholdPct: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 20
    },

    location: {
      lat: {
        type: Number,
        required: true
      },
      lng: {
        type: Number,
        required: true
      }
    },

    status: {
      type: String,
      enum: ['normal', 'warning', 'critical'],
      default: 'normal'
    }
  },
  {
    timestamps: true
  }
);

storageSchema.virtual('fillPercent').get(function () {
  if (!this.capacityKg) return 0;

  return Math.round(
    (this.currentLevelKg / this.capacityKg) * 100
  );
});

storageSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Storage', storageSchema);