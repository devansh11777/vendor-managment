const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Vendor = require('../models/Vendor');
const { protect, vendorOnly } = require('../middleware/auth');

// GET /api/products - Get all products with filters
router.get('/', async (req, res) => {
  try {
    const { category, search, vendor, inStock, sortBy } = req.query;
    let query = {};

    if (category) query.category = category;
    if (vendor) query.vendor = vendor;
    if (inStock !== undefined) query.inStock = inStock === 'true';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { shopName: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sortBy === 'price_asc') sortOption = { price: 1 };
    if (sortBy === 'price_desc') sortOption = { price: -1 };
    if (sortBy === 'rating') sortOption = { rating: -1 };

    const products = await Product.find(query)
      .populate('vendor', 'name shopName shopLocation')
      .sort(sortOption);

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/products/category/:category
router.get('/category/:category', async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category })
      .populate('vendor', 'name shopName shopLocation')
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/products/:id - Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('vendor', 'name shopName shopLocation email');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/products - Create product (vendor only)
router.post('/', protect, vendorOnly, async (req, res) => {
  try {
    const { name, description, price, category, images, inStock, quantity } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      category,
      images: images || [],
      vendor: req.user._id,
      shopName: req.user.shopName,
      shopLocation: req.user.shopLocation,
      inStock: inStock !== undefined ? inStock : true,
      quantity: quantity || 0
    });

    // Add to vendor's products list
    await Vendor.findOneAndUpdate(
      { user: req.user._id },
      { $push: { products: product._id } }
    );

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/products/:id - Update product (vendor only)
router.put('/:id', protect, vendorOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/products/:id - Delete product (vendor only)
router.delete('/:id', protect, vendorOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    await Product.findByIdAndDelete(req.params.id);
    await Vendor.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { products: req.params.id } }
    );

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
