const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { allowRoles } = require('../middleware/auth');

const router = express.Router();
router.use(allowRoles('admin'));

router.get('/', async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
});

router.post('/', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await User.create({ name, email, password: await bcrypt.hash(password, 10), role });
    res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (error) {
    res.status(400).json({ message: 'Failed to create user', error: error.message });
  }
});

router.patch('/:id', async (req, res) => {
  const updates = { ...req.body };
  if (updates.password) updates.password = await bcrypt.hash(updates.password, 10);
  delete updates._id;
  delete updates.__v;
  const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

module.exports = router;
