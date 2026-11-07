const express = require('express');
const router = express.Router();
const Discount = require('../models/Discount');
const Product = require('../models/Product');
const { protect, vendorOnly } = require('../middleware/auth');

// GET /api/discounts - Get all active discounts
router.get('/', async (req, res) => {
  try {
    const discounts = await Discount.find({ isActive: true })
      .populate('product')
      .populate('vendor', 'name shopName shopLocation')
      .sort({ createdAt: -1 });
    res.json(discounts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/discounts - Create discount (vendor only)
router.post('/', protect, vendorOnly, async (req, res) => {
  try {
    const { productId, discountPercent, description, endDate } = req.body;

    if (!productId || !discountPercent) {
      return res.status(400).json({ message: 'Product ID and discount percent required' });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized for this product' });
    }

    const percent = Number(discountPercent);
    const discountedPrice = Math.round(product.price * (1 - percent / 100));

    // Update product pricing
    product.discountedPrice = discountedPrice;
    product.discountPercent = percent;
    await product.save();

    const discount = await Discount.create({
      product: productId,
      vendor: req.user._id,
      discountPercent: percent,
      description: description || `${percent}% off on ${product.name}`,
      endDate: endDate || null,
      isActive: true
    });

    res.status(201).json(discount);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/discounts/:id - Deactivate discount (vendor only)
router.delete('/:id', protect, vendorOnly, async (req, res) => {
  try {
    const discount = await Discount.findById(req.params.id);
    if (!discount) return res.status(404).json({ message: 'Discount not found' });

    if (discount.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    discount.isActive = false;
    await discount.save();

    // Reset product discounted price
    await Product.findByIdAndUpdate(discount.product, {
      discountedPrice: null,
      discountPercent: 0
    });

    res.json({ message: 'Discount deactivated and original price restored' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
