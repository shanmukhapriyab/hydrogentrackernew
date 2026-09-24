const express = require('express');
const Storage = require('../models/Storage');

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