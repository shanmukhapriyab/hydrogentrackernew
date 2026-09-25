const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  customer: { type: String, required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  quantity: { type: Number, required: true, min: 0 },
  deliveryDate: { type: Date, required: true },
  origin: String,
  status: { type: String, enum: ['pending', 'processing', 'confirmed', 'delivered', 'cancelled'], default: 'pending' },
  priority: { type: String, enum: ['low', 'normal', 'high'], default: 'normal' },
  price: { type: Number, min: 0 },
  total: { type: Number, min: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
