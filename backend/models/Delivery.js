const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  shipmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shipment', required: true },
  driver: String,
  truck: String,
  scheduledAt: Date,
  status: { type: String, enum: ['pending', 'transit', 'delayed', 'delivered'], default: 'pending' },
  notes: String,
}, { timestamps: true });

module.exports = mongoose.model('Delivery', deliverySchema);
