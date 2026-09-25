const express = require('express');
const Shipment = require('../models/Shipment');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const shipments = await Shipment.find().sort({
      createdAt: -1
    });

    res.json(shipments);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch shipment data',
      error: error.message
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const shipment = await Shipment.create(req.body);

    res.status(201).json({
      message: 'Shipment created successfully',
      shipment
    });
  } catch (error) {
    res.status(400).json({
      message: 'Failed to create shipment',
      error: error.message
    });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const shipment = await Shipment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!shipment) {
      return res.status(404).json({
        message: 'Shipment not found'
      });
    }

    res.json({
      message: 'Shipment updated successfully',
      shipment
    });
  } catch (error) {
    res.status(400).json({
      message: 'Failed to update shipment',
      error: error.message
    });
  }
});

module.exports = router;