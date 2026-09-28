const express = require('express');
const Storage = require('../models/Storage');
const Notification = require('../models/Notification');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const storages = await Storage.find().sort({ createdAt: -1 });

    res.json(storages);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch storage data',
      error: error.message
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const storage = await Storage.create(req.body);

    res.status(201).json({
      message: 'Storage created successfully',
      storage
    });
  } catch (error) {
    res.status(400).json({
      message: 'Failed to create storage',
      error: error.message
    });
  }
});

router.get('/:id/history', async (req, res) => {
  try {
    const storage = await Storage.findById(req.params.id);
    if (!storage) return res.status(404).json({ message: 'Storage not found' });
    const events = [
      { type: 'created', at: storage.createdAt, message: 'Tank record created' },
      ...(storage.lastRefillAt ? [{ type: 'refill', at: storage.lastRefillAt, message: 'Tank refill completed' }] : []),
      ...(storage.refillScheduledAt ? [{ type: 'refill-scheduled', at: storage.refillScheduledAt, message: 'Tank refill scheduled' }] : []),
      ...(storage.lastAlertAt ? [{ type: 'alert', at: storage.lastAlertAt, message: 'Emergency alert raised' }] : []),
      { type: 'updated', at: storage.updatedAt, message: 'Tank record last updated' },
    ];
    res.json(events.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()));
  } catch (error) {
    res.status(400).json({ message: 'Failed to fetch storage history', error: error.message });
  }
});

router.post('/:id/refill', async (req, res) => {
  try {
    const scheduledAt = req.body.scheduledAt ? new Date(req.body.scheduledAt) : new Date();
    const storage = await Storage.findByIdAndUpdate(req.params.id, { refillScheduledAt: scheduledAt }, { new: true });
    if (!storage) return res.status(404).json({ message: 'Storage not found' });
    res.json({ message: 'Refill scheduled successfully', storage });
  } catch (error) {
    res.status(400).json({ message: 'Failed to schedule refill', error: error.message });
  }
});

router.post('/:id/alert', async (req, res) => {
  try {
    const storage = await Storage.findByIdAndUpdate(req.params.id, { lastAlertAt: new Date() }, { new: true });
    if (!storage) return res.status(404).json({ message: 'Storage not found' });
    const notification = await Notification.create({
      userId: req.user.id,
      type: 'critical',
      title: `Emergency alert: ${storage.tankId}`,
      message: req.body.message || `${storage.facilityName} requires immediate attention.`,
    });
    res.status(201).json({ message: 'Emergency alert created', notification, storage });
  } catch (error) {
    res.status(400).json({ message: 'Failed to create emergency alert', error: error.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const storage = await Storage.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!storage) {
      return res.status(404).json({
        message: 'Storage not found'
      });
    }

    res.json({
      message: 'Storage updated successfully',
      storage
    });
  } catch (error) {
    res.status(400).json({
      message: 'Failed to update storage',
      error: error.message
    });
  }
});

module.exports = router;