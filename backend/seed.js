const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/User');
const Production = require('./models/Production');
const Storage = require('./models/Storage');
const Shipment = require('./models/Shipment');
const Order = require('./models/Order');
const Delivery = require('./models/Delivery');
const Notification = require('./models/Notification');

const users = [
  ['Administrator', 'admin@hydrogen.com', 'admin'],
  ['Green Valley Producer', 'producer@hydrogen.com', 'producer'],
  ['Fleet Logistics', 'logistics@hydrogen.com', 'logistics'],
  ['NorthEast Power', 'customer@hydrogen.com', 'customer'],
];

const shipmentData = [
  ['SHP-2026-0841', 'Houston Hub', 'Austin Fuel Depot', 'Apex Energy Corp', 'Marcus Johnson', 'TRK-224', 4200, 'transit', '2026-09-23 16:30', 68, 29.8, -96.1, 'high'],
  ['SHP-2026-0842', 'LA Port Facility', 'San Diego FC Station', 'CleanFleet Solutions', 'Elena Rodriguez', 'TRK-118', 3100, 'delivered', '2026-09-23 11:00', 100, 32.7, -117.1, 'normal'],
  ['SHP-2026-0843', 'Newark Terminal', 'Boston H2 Hub', 'NorthEast Power', 'David Kim', 'TRK-307', 5800, 'transit', '2026-09-23 20:00', 32, 41.2, -73.8, 'normal'],
  ['SHP-2026-0844', 'Dallas Hub', 'San Antonio Plant', 'TXH2 Industries', 'Sarah Chen', 'TRK-415', 2900, 'delayed', '2026-09-23 15:00', 45, 29.4, -98.0, 'high'],
  ['SHP-2026-0845', 'Phoenix Terminal', 'Tucson Facility', 'Desert H2 LLC', 'James Wilson', 'TRK-521', 1800, 'pending', '2026-09-24 09:00', 0, 33.4, -112.0, 'low'],
  ['SHP-2026-0846', 'Chicago Depot', 'Detroit Hub', 'Great Lakes Energy', 'Pending', 'TRK-632', 4500, 'pending', '2026-09-24 14:00', 0, 41.8, -87.6, 'normal'],
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hydrogen-tracker-new');
  const password = await bcrypt.hash('admin123', 10);
  const userDocs = {};
  for (const [name, email, role] of users) {
    userDocs[role] = await User.findOneAndUpdate({ email }, { name, email, password, role }, { upsert: true, new: true, setDefaultsOnInsert: true });
  }

  await Production.deleteMany({});
  await Production.insertMany([
    { plantId: 'PLT-001', plantName: 'Green Valley Electrolyzer', location: 'Houston, TX', technology: 'PEM', capacityKg: 120000, uptime: 99.1, batchId: 'BATCH-2026-0901', quantityKg: 98400, purity: 99.97, energySource: 'solar', costPerKg: 4.8, status: 'active' },
    { plantId: 'PLT-002', plantName: 'Sunrise H2 Facility', location: 'Phoenix, AZ', technology: 'Alkaline', capacityKg: 85000, uptime: 97.6, batchId: 'BATCH-2026-0902', quantityKg: 71200, purity: 99.94, energySource: 'wind', costPerKg: 4.4, status: 'active' },
    { plantId: 'PLT-003', plantName: 'Pacific Hydrogen Works', location: 'Los Angeles, CA', technology: 'PEM', capacityKg: 200000, uptime: 98.2, batchId: 'BATCH-2026-0903', quantityKg: 168500, purity: 99.99, energySource: 'solar', costPerKg: 4.2, status: 'completed' },
  ]);
  await Storage.deleteMany({});
  await Storage.insertMany([
    { facilityName: 'Houston Hub', tankId: 'TNK-001', capacityKg: 500000, currentLevelKg: 387000, pressureBar: 350, temperatureC: -253, safetyThresholdPct: 20, location: { lat: 29.76, lng: -95.37 }, status: 'normal' },
    { facilityName: 'Dallas Hub', tankId: 'TNK-006', capacityKg: 600000, currentLevelKg: 89000, pressureBar: 350, temperatureC: -253, safetyThresholdPct: 20, location: { lat: 32.78, lng: -96.8 }, status: 'critical' },
  ]);
  await Shipment.deleteMany({});
  const shipments = await Shipment.insertMany(shipmentData.map(([shipmentId, origin, destination, customer, driver, truck, quantity, status, eta, progress, lat, lng, priority]) => ({ shipmentId, origin, destination, customer, customerId: userDocs.customer._id, driver, truck, quantity, status, eta, progress, lat, lng, priority })));
  await Order.deleteMany({});
  await Order.insertMany([
    { orderId: 'ORD-2026-1204', customer: 'NorthEast Power', customerId: userDocs.customer._id, quantity: 4200, deliveryDate: new Date('2026-09-25'), origin: 'Houston Hub', status: 'confirmed', priority: 'high', price: 8.4, total: 35280 },
    { orderId: 'ORD-2026-1205', customer: 'NorthEast Power', customerId: userDocs.customer._id, quantity: 3100, deliveryDate: new Date('2026-09-26'), origin: 'LA Port Facility', status: 'processing', priority: 'normal', price: 8.65, total: 26815 },
  ]);
  await Delivery.deleteMany({});
  await Delivery.insertMany(shipments.slice(0, 4).map(shipment => ({ shipmentId: shipment._id, driver: shipment.driver, truck: shipment.truck, scheduledAt: new Date(), status: shipment.status })));
  await Notification.deleteMany({});
  await Notification.insertMany([
    { userId: userDocs.admin._id, type: 'critical', title: 'Tank TNK-006 Low Level', message: 'Dallas Hub tank requires immediate refill.' },
    { userId: userDocs.logistics._id, type: 'warning', title: 'Shipment SHP-2026-0844 Delayed', message: 'Driver reported a traffic incident.' },
  ]);
  console.log('Seed complete. Demo password: admin123');
  await mongoose.disconnect();
}

seed().catch(error => { console.error(error); process.exitCode = 1; });
