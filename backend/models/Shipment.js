const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
  shipmentId: { type: String, required: true, unique: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  customer: { type: String, required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  driver: { type: String, default: 'Pending' },
  truck: String,
  quantity: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['pending', 'transit', 'delayed', 'delivered'], default: 'pending' },
  eta: String,
  progress: { type: Number, min: 0, max: 100, default: 0 },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  priority: { type: String, enum: ['low', 'normal', 'high'], default: 'normal' },
}, { timestamps: true });

module.exports = mongoose.model('Shipment', shipmentSchema);
