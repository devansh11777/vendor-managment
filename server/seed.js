const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Vendor = require('./models/Vendor');
const Product = require('./models/Product');
const Discount = require('./models/Discount');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/lpukart';

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clean existing
    await User.deleteMany({});
    await Vendor.deleteMany({});
    await Product.deleteMany({});
    await Discount.deleteMany({});
    console.log('Cleared existing collections');

    // Create Vendors
    const vendor1 = await User.create({
      name: 'WH-Smith BH-6',
      email: 'whsmith@lpu.in',
      password: 'password123',
      role: 'vendor',
      shopName: 'bh-6 WH-smith',
      shopLocation: 'BH-6 Ground Floor, Campus'
    });

    const vendor2 = await User.create({
      name: 'LPU Mart Central',
      email: 'lpumart@lpu.in',
      password: 'password123',
      role: 'vendor',
      shopName: 'LPU Mart',
      shopLocation: 'Block 34, Central Mall'
    });

    const vendor3 = await User.create({
      name: 'Your-Care Store',
      email: 'yourcare@lpu.in',
      password: 'password123',
      role: 'vendor',
      shopName: 'Your-Care',
      shopLocation: 'BH-3 Market Complex'
    });

    const vendorFood = await User.create({
      name: 'Kaata Churi Corner',
      email: 'kaatachuri@lpu.in',
      password: 'password123',
      role: 'vendor',
      shopName: 'Kaata Churi BH-6',
      shopLocation: 'Food Street BH-6'
    });

    // Create Demo Student
    await User.create({
      name: 'Aman Kumar',
      email: 'student@lpu.in',
      password: 'password123',
      role: 'student',
      enrollmentId: '12109845'
    });

    // Create Vendor Profiles
    await Vendor.create([
      { user: vendor1._id, shopName: vendor1.shopName, shopLocation: vendor1.shopLocation, isVerified: true },
      { user: vendor2._id, shopName: vendor2.shopName, shopLocation: vendor2.shopLocation, isVerified: true },
      { user: vendor3._id, shopName: vendor3.shopName, shopLocation: vendor3.shopLocation, isVerified: true },
      { user: vendorFood._id, shopName: vendorFood.shopName, shopLocation: vendorFood.shopLocation, isVerified: true }
    ]);

    // Products 
    const productsData = [
      // Personal Care ()
      {
        name: 'Nivea Body Lotion',
        description: 'NIVEA Body Lotion is a deeply moisturizing formula designed to provide 48 hours of hydration. Enriched with Deep Moisture Serum, almond oil, and vitamin E, it nourishes dry skin, leaving it soft, smooth, and healthy-looking.',
        price: 200,
        discountedPrice: 180,
        discountPercent: 10,
        category: 'personal-care',
        images: ['/assets/personalcare/1.png', '/assets/personalcare/2.png', '/assets/personalcare/3.png', '/assets/personalcare/4.png'],
        vendor: vendor1._id,
        shopName: 'bh-6 WH-smith',
        shopLocation: 'BH-6 Ground Floor',
        inStock: true,
        quantity: 35,
        rating: 4.6,
        reviewCount: 42
      },
      {
        name: 'Nivia Soft Light Moisturizer',
        description: 'Light moisturizing cream with Jojoba oil and Vitamin E for face, body and hands. Non-greasy and fast absorbing for refreshed skin.',
        price: 150,
        discountedPrice: null,
        discountPercent: 0,
        category: 'personal-care',
        images: ['/assets/personalcare/2.jpeg'],
        vendor: vendor2._id,
        shopName: 'LPU Mart',
        shopLocation: 'Block 34, Central Mall',
        inStock: true,
        quantity: 20,
        rating: 4.4,
        reviewCount: 19
      },
      {
        name: 'Exotic Plum Body Butter',
        description: 'Ultra rich body butter formulated with shea butter and plum extract for intense 24h nourishment and delightful fruity scent.',
        price: 400,
        discountedPrice: null,
        discountPercent: 0,
        category: 'personal-care',
        images: ['/assets/personalcare/3.jpg'],
        vendor: vendor3._id,
        shopName: 'Your-Care',
        shopLocation: 'BH-3 Market Complex',
        inStock: false,
        quantity: 0,
        rating: 4.8,
        reviewCount: 55
      },
      {
        name: 'Stainless Steel Nailcutter',
        description: 'Ergonomic precision nail clipper made from high grade stainless steel with integrated filer and catcher.',
        price: 100,
        discountedPrice: 90,
        discountPercent: 10,
        category: 'personal-care',
        images: ['/assets/personalcare/4.jpeg'],
        vendor: vendor1._id,
        shopName: 'bh-5 WH-smith',
        shopLocation: 'BH-5 Tuck Shop',
        inStock: true,
        quantity: 50,
        rating: 4.2,
        reviewCount: 12
      },
      {
        name: 'Lux Beauty Soap (Pack of 3)',
        description: 'Infused with floral beauty oil and gentle moisturizers for silky fragrant skin after every shower.',
        price: 200,
        discountedPrice: null,
        discountPercent: 0,
        category: 'personal-care',
        images: ['/assets/personalcare/5.jpeg'],
        vendor: vendor2._id,
        shopName: 'LPU Mart',
        shopLocation: 'Block 34, Central Mall',
        inStock: true,
        quantity: 15,
        rating: 4.3,
        reviewCount: 28
      },
      {
        name: 'Venusia Max Intensive Lotion',
        description: 'Advanced hydrating cream for dry to very dry skin conditions with glycerin, dimethicone and aloe vera.',
        price: 400,
        discountedPrice: null,
        discountPercent: 0,
        category: 'personal-care',
        images: ['/assets/personalcare/6.jpg'],
        vendor: vendor3._id,
        shopName: 'Your-Care',
        shopLocation: 'BH-3 Market Complex',
        inStock: false,
        quantity: 0,
        rating: 4.7,
        reviewCount: 38
      },
      {
        name: 'COCO Elegant Perfume 100ml',
        description: 'Long-lasting signature fragrance with notes of bergamot, jasmine, vanilla and warm amberwood. Perfect for daily campus wear.',
        price: 300,
        discountedPrice: 240,
        discountPercent: 20,
        category: 'personal-care',
        images: ['/assets/personalcare/7.jpeg'],
        vendor: vendor1._id,
        shopName: 'bh-6 WH-smith',
        shopLocation: 'BH-6 Ground Floor',
        inStock: true,
        quantity: 12,
        rating: 4.5,
        reviewCount: 64
      },
      {
        name: 'Garnier SkinActive Micellar Water',
        description: 'All-in-1 micellar cleansing water that lifts away dirt, makeup, and oil without harsh rubbing or rinsing.',
        price: 300,
        discountedPrice: null,
        discountPercent: 0,
        category: 'personal-care',
        images: ['/assets/personalcare/7.jpeg'],
        vendor: vendor2._id,
        shopName: 'LPU Mart',
        shopLocation: 'Block 34, Central Mall',
        inStock: true,
        quantity: 18,
        rating: 4.6,
        reviewCount: 22
      },

      // Food items
      {
        name: 'Kaata Churi Special Roll',
        description: 'Signature crispy kathi roll loaded with smoked paneer chunks, caramelized onions, green mint chutney and chatpata spices.',
        price: 90,
        discountedPrice: 75,
        discountPercent: 16,
        category: 'food',
        images: ['https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop'],
        vendor: vendorFood._id,
        shopName: 'Kaata Churi BH-6',
        shopLocation: 'Food Street BH-6',
        inStock: true,
        quantity: 100,
        rating: 4.8,
        reviewCount: 110
      },
      {
        name: 'Deluxe Campus Thali',
        description: 'Homestyle wholesome North Indian meal with Paneer Butter Masala, Dal Makhani, 4 Butter Rotis, Steamed Jeera Rice, Raita & Gulab Jamun.',
        price: 130,
        discountedPrice: null,
        discountPercent: 0,
        category: 'food',
        images: ['https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=600&auto=format&fit=crop'],
        vendor: vendorFood._id,
        shopName: 'Kaata Churi BH-6',
        shopLocation: 'Food Street BH-6',
        inStock: true,
        quantity: 50,
        rating: 4.5,
        reviewCount: 89
      },
      {
        name: 'Cheese Burst Crispy Burger',
        description: 'Crispy veggie patty with molten cheddar cheese, fresh lettuce, sliced tomatoes and tangy herb mayonnaise in toasted sesame bun.',
        price: 99,
        discountedPrice: 79,
        discountPercent: 20,
        category: 'food',
        images: ['https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop'],
        vendor: vendorFood._id,
        shopName: 'Kaata Churi BH-6',
        shopLocation: 'Food Street BH-6',
        inStock: true,
        quantity: 40,
        rating: 4.6,
        reviewCount: 75
      },
      {
        name: 'Crispy Masala Dosa with Sambar',
        description: 'Golden fermented rice-lentil crepe filled with spiced potato masala, served with freshly grated coconut chutney and piping hot sambar.',
        price: 70,
        discountedPrice: null,
        discountPercent: 0,
        category: 'food',
        images: ['https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop'],
        vendor: vendorFood._id,
        shopName: 'Kaata Churi BH-6',
        shopLocation: 'Food Street BH-6',
        inStock: true,
        quantity: 60,
        rating: 4.4,
        reviewCount: 52
      },

      // Stationary items
      {
        name: 'Engineering Graphics Drawing Kit',
        description: 'Complete engineering student kit: Mini drafter, T-Square, compass set, sheet holder container, roller scale, French curves and clips.',
        price: 499,
        discountedPrice: 420,
        discountPercent: 15,
        category: 'stationary',
        images: ['https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&auto=format&fit=crop'],
        vendor: vendor1._id,
        shopName: 'bh-6 WH-smith',
        shopLocation: 'BH-6 Ground Floor',
        inStock: true,
        quantity: 25,
        rating: 4.7,
        reviewCount: 34
      },
      {
        name: 'Classmate Spiral Notebook (Pack of 4)',
        description: '300 pages each, ruled high quality 70 GSM elemental chlorine free paper with durable polypropylene cover and perforated tear off.',
        price: 280,
        discountedPrice: 240,
        discountPercent: 14,
        category: 'stationary',
        images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop'],
        vendor: vendor2._id,
        shopName: 'LPU Mart',
        shopLocation: 'Block 34, Central Mall',
        inStock: true,
        quantity: 80,
        rating: 4.9,
        reviewCount: 92
      },
      {
        name: 'Casio fx-991EX ClassWiz Calculator',
        description: '552 functions advanced non-programmable engineering calculator approved for university exams with natural textbook display.',
        price: 1350,
        discountedPrice: 1199,
        discountPercent: 11,
        category: 'stationary',
        images: ['https://images.unsplash.com/photo-1611125832047-1d7ad1e8e485?w=600&auto=format&fit=crop'],
        vendor: vendor2._id,
        shopName: 'LPU Mart',
        shopLocation: 'Block 34, Central Mall',
        inStock: true,
        quantity: 15,
        rating: 4.9,
        reviewCount: 140
      },
      {
        name: 'LPU Lab Manual & Experiment Ruled Sheets',
        description: 'Standard university hard-bind lab record file folder with 100 ruled punched sheets for all engineering & science practical courses.',
        price: 150,
        discountedPrice: null,
        discountPercent: 0,
        category: 'stationary',
        images: ['https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=600&auto=format&fit=crop'],
        vendor: vendor1._id,
        shopName: 'bh-6 WH-smith',
        shopLocation: 'BH-6 Ground Floor',
        inStock: true,
        quantity: 120,
        rating: 4.3,
        reviewCount: 45
      }
    ];

    const createdProducts = await Product.insertMany(productsData);
    console.log(`Created ${createdProducts.length} products`);

    // Add active discounts
    const discountedProds = createdProducts.filter(p => p.discountPercent > 0);
    for (const prod of discountedProds) {
      await Discount.create({
        product: prod._id,
        vendor: prod.vendor,
        discountPercent: prod.discountPercent,
        description: `Campus Special: ${prod.discountPercent}% OFF on ${prod.name}!`,
        isActive: true
      });
    }
    console.log(`Created ${discountedProds.length} active discounts`);

    console.log('\n--- SEED COMPLETE ---');
    console.log('Demo Accounts:');
    console.log('Student Login: student@lpu.in / password123');
    console.log('Vendor 1: whsmith@lpu.in / password123 (WH-Smith BH-6)');
    console.log('Vendor 2: lpumart@lpu.in / password123 (LPU Mart)');
    console.log('Vendor Food: kaatachuri@lpu.in / password123 (Kaata Churi BH-6)');

    await mongoose.disconnect();
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
