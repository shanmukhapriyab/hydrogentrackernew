const express = require('express');
const Production = require('../models/Production');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const productions = await Production.find().sort({ createdAt: -1 });

    res.json(productions);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch production data',
      error: error.message
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const production = await Production.create(req.body);

    res.status(201).json({
      message: 'Production created successfully',
      production
    });
  } catch (error) {
    res.status(400).json({
      message: 'Failed to create production',
      error: error.message
    });
  }
});

module.exports = router;