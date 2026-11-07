const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    discountedPrice: { type: Number, default: null },
    discountPercent: { type: Number, default: 0 },
    category: {
      type: String,
      enum: ['food', 'stationary', 'personal-care', 'electronics', 'clothing'],
      required: true
    },
    images: [{ type: String }],
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    shopName: { type: String, default: '' },
    shopLocation: { type: String, default: '' },
    inStock: { type: Boolean, default: true },
    quantity: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
