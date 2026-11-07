const express = require('express');
const router = express.Router();
const Vendor = require('../models/Vendor');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// GET /api/vendors - Get all vendors
router.get('/', async (req, res) => {
  try {
    const vendors = await Vendor.find()
      .populate('user', 'name email shopName shopLocation')
      .populate('products');
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/vendors/:id - Get vendor with products
router.get('/:id', async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.params.id })
      .populate('user', 'name email shopName shopLocation')
      .populate('products');

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.json(vendor);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/vendors/register - Register as vendor
router.post('/register', protect, async (req, res) => {
  try {
    const { shopName, shopLocation, description } = req.body;

    const existing = await Vendor.findOne({ user: req.user._id });
    if (existing) {
      return res.status(400).json({ message: 'Already registered as vendor' });
    }

    const vendor = await Vendor.create({
      user: req.user._id,
      shopName,
      shopLocation,
      description
    });

    // Update user role and shop info
    await User.findByIdAndUpdate(req.user._id, {
      role: 'vendor',
      shopName,
      shopLocation
    });

    res.status(201).json(vendor);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
