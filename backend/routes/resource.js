const express = require('express');

function resourceRouter(Model, options = {}) {
  const router = express.Router();
  router.get('/', async (req, res) => {
    try {
      const ownerField = options.ownerField || 'customerId';
      const filter = options.ownerOnly && req.user?.role === 'customer' ? { [ownerField]: req.user.id } : {};
      res.json(await Model.find(filter).sort({ createdAt: -1 }));
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch resource', error: error.message });
    }
  });
  router.post('/', async (req, res) => {
    try {
      const value = await Model.create(options.prepare ? options.prepare(req) : req.body);
      res.status(201).json(value);
    } catch (error) {
      res.status(400).json({ message: 'Failed to create resource', error: error.message });
    }
  });
  router.patch('/:id', async (req, res) => {
    try {
      const value = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!value) return res.status(404).json({ message: 'Resource not found' });
      res.json(value);
    } catch (error) {
      res.status(400).json({ message: 'Failed to update resource', error: error.message });
    }
  });
  return router;
}

module.exports = resourceRouter;
