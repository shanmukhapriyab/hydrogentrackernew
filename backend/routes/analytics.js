const express = require('express');
const Production = require('../models/Production');
const Storage = require('../models/Storage');
const Shipment = require('../models/Shipment');
const Order = require('../models/Order');

const router = express.Router();

router.get('/summary', async (req, res) => {
  const [production, storage, shipments, orders] = await Promise.all([
    Production.find().lean(),
    Storage.find().lean(),
    Shipment.find().lean(),
    Order.find().lean(),
  ]);
  const outputKg = production.reduce((sum, item) => sum + item.quantityKg, 0);
  const capacityKg = storage.reduce((sum, item) => sum + item.capacityKg, 0);
  const currentKg = storage.reduce((sum, item) => sum + item.currentLevelKg, 0);
  const forecast = Array.from({ length: 6 }, (_, index) => ({
    month: `M${index + 1}`,
    production: Math.round((outputKg / 1000) * (1 + index * 0.04)),
    demand: Math.round((orders.reduce((sum, item) => sum + item.quantity, 0) / 1000) * (1 + index * 0.03)),
  }));
  res.json({
    totals: { outputKg, capacityKg, currentKg, productionCount: production.length, shipmentCount: shipments.length, orderCount: orders.length },
    status: {
      inTransit: shipments.filter(item => item.status === 'transit').length,
      delayed: shipments.filter(item => item.status === 'delayed').length,
      delivered: shipments.filter(item => item.status === 'delivered').length,
    },
    forecast,
  });
});

module.exports = router;
