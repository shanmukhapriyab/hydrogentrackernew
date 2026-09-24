const mongoose = require('mongoose');

const productionSchema = new mongoose.Schema(
  {
    plantId: {
      type: String,
      required: true
    },

    batchId: {
      type: String,
      required: true,
      unique: true
    },

    quantityKg: {
      type: Number,
      required: true,
      min: 0
    },

    purity: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },

    energySource: {
      type: String,
      enum: ['solar', 'wind', 'grid', 'hydro', 'other'],
      required: true
    },

    costPerKg: {
      type: Number,
      required: true,
      min: 0
    },

    status: {
      type: String,
      enum: ['active', 'completed', 'pending'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Production', productionSchema);