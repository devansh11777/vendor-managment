const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// GET /api/cart - Get current user's cart
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'cart.product',
      model: 'Product'
    });
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/cart/add - Add item to cart
router.post('/add', protect, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const user = await User.findById(req.user._id);
    const existingItem = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }

    await user.save();
    await user.populate({ path: 'cart.product', model: 'Product' });

    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/cart/update - Update quantity
router.put('/update', protect, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const user = await User.findById(req.user._id);
    const item = user.cart.find((i) => i.product.toString() === productId);

    if (!item) return res.status(404).json({ message: 'Item not in cart' });

    if (quantity <= 0) {
      user.cart = user.cart.filter((i) => i.product.toString() !== productId);
    } else {
      item.quantity = quantity;
    }

    await user.save();
    await user.populate({ path: 'cart.product', model: 'Product' });

    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/cart/remove - Remove item
router.delete('/remove', protect, async (req, res) => {
  try {
    const { productId } = req.body;

    const user = await User.findById(req.user._id);
    user.cart = user.cart.filter((i) => i.product.toString() !== productId);

    await user.save();
    await user.populate({ path: 'cart.product', model: 'Product' });

    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/cart/clear - Clear cart
router.delete('/clear', protect, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { cart: [] });
    res.json([]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
