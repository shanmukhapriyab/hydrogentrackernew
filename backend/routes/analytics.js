const express = require('express');
const Production = require('../models/Production');
const Storage = require('../models/Storage');
const Shipment = require('../models/Shipment');
const Order = require('../models/Order');
const Delivery = require('../models/Delivery');

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
  const productionTrend = production.map((item, index) => ({
    month: item.plantId || `Batch ${index + 1}`,
    actual: Math.round(item.quantityKg / 1000),
    target: Math.round((item.capacityKg || item.quantityKg) / 1000),
    renewable: item.energySource === 'grid' ? 0 : Math.round(item.quantityKg / 1000),
  }));
  const revenueTrend = orders.map((item, index) => ({
    month: item.orderId || `Order ${index + 1}`,
    revenue: item.total || 0,
    cost: Math.round((item.total || 0) * 0.58),
  }));
  const consumption = orders.map((item, index) => ({
    month: item.orderId || `Order ${index + 1}`,
    ordered: item.quantity,
    delivered: item.status === 'delivered' ? item.quantity : 0,
  }));
  const regions = shipments.reduce((result, shipment) => {
    const region = (shipment.origin || 'Unknown').split(' ')[0];
    result[region] = (result[region] || 0) + shipment.quantity;
    return result;
  }, {});
  const regionData = Object.entries(regions).map(([region, volume]) => ({ region, volume }));
  const efficiency = production.map((item, index) => ({
    week: `Batch ${index + 1}`,
    pem: item.technology === 'PEM' ? item.purity : 0,
    alkaline: item.technology === 'Alkaline' ? item.purity : 0,
    soec: item.technology === 'SOEC' ? item.purity : 0,
  }));
  const productTotals = production.reduce((result, item) => {
    const label = item.energySource === 'grid' ? 'Grid H2' : 'Green H2';
    result[label] = (result[label] || 0) + item.quantityKg;
    return result;
  }, {});
  const productTotal = Object.values(productTotals).reduce((sum, value) => sum + value, 0);
  const productMix = Object.entries(productTotals).map(([name, value]) => ({ name, value: productTotal ? Math.round((value / productTotal) * 1000) / 10 : 0 }));
  res.json({
    totals: { outputKg, capacityKg, currentKg, productionCount: production.length, shipmentCount: shipments.length, orderCount: orders.length },
    status: {
      inTransit: shipments.filter(item => item.status === 'transit').length,
      delayed: shipments.filter(item => item.status === 'delayed').length,
      delivered: shipments.filter(item => item.status === 'delivered').length,
    },
    forecast,
    productionTrend,
    revenueTrend,
    consumption,
    efficiency,
    regionData,
    productMix,
  });
});

module.exports = router;
