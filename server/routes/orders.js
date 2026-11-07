const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { protect, vendorOnly } = require('../middleware/auth');

// POST /api/orders - Create new order (student checkout)
router.post('/', protect, async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    // Verify stock and update inventory
    for (const item of items) {
      const prod = await Product.findById(item.product);
      if (!prod) {
        return res.status(404).json({ message: `Product ${item.name || ''} not found` });
      }
      if (!prod.inStock) {
        return res.status(400).json({ message: `Product ${prod.name} is currently out of stock` });
      }
      if (prod.quantity > 0 && prod.quantity < item.quantity) {
        return res.status(400).json({ message: `Only ${prod.quantity} units left for ${prod.name}` });
      }
      // Deduct inventory if tracked
      if (prod.quantity > 0) {
        prod.quantity -= item.quantity;
        if (prod.quantity === 0) prod.inStock = false;
        await prod.save();
      }
    }

    const order = await Order.create({
      student: req.user._id,
      items: items.map(i => ({
        product: i.product,
        quantity: i.quantity,
        price: i.price
      })),
      totalAmount,
      status: 'pending'
    });

    // Clear student cart
    await User.findByIdAndUpdate(req.user._id, { cart: [] });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating order', error: error.message });
  }
});

// GET /api/orders/my-orders - Get logged-in student's orders
router.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ student: req.user._id })
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/orders/vendor-orders - Get orders for vendor's products
router.get('/vendor-orders', protect, vendorOnly, async (req, res) => {
  try {
    // Find all products owned by vendor
    const vendorProducts = await Product.find({ vendor: req.user._id }).select('_id');
    const productIds = vendorProducts.map(p => p._id.toString());

    // Find orders that contain at least one of vendor's products
    const orders = await Order.find({ 'items.product': { $in: productIds } })
      .populate('student', 'name email enrollmentId')
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/orders/:id/status - Update order status (vendor only)
router.put('/:id/status', protect, vendorOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('items.product');

    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
