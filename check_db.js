const mongoose = require('./server/node_modules/mongoose');

async function viewDatabase() {
  try {
    await mongoose.connect('mongodb://localhost:27017/lpukart');
    console.log('\x1b[32m%s\x1b[0m', '✔ Connected to MongoDB (Database: lpukart)\n');

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\x1b[36m%s\x1b[0m', '📁 Collections in lpukart:');
    collections.forEach(c => console.log('  • ' + c.name));
    console.log('');

    // 1. Users
    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    console.log('\x1b[33m%s\x1b[0m', `👥 Users & Accounts (${users.length}):`);
    users.forEach(u => console.log(`  - [${u.role.toUpperCase()}] ${u.name} | Email: ${u.email} | ${u.shopName ? 'Shop: ' + u.shopName : 'Reg: ' + u.enrollmentId}`));
    console.log('');

    // 2. Products
    const products = await mongoose.connection.db.collection('products').find({}).toArray();
    console.log('\x1b[33m%s\x1b[0m', `📦 Products (${products.length}):`);
    products.forEach((p, idx) => console.log(`  ${idx + 1}. ${p.name} | ${p.price}₹ (Discounted: ${p.discountedPrice || 'None'}) | Stock: ${p.inStock ? 'Available' : 'Out of Stock'} | Shop: ${p.shopName}`));
    console.log('');

    // 3. Active Discounts
    const discounts = await mongoose.connection.db.collection('discounts').find({}).toArray();
    console.log('\x1b[33m%s\x1b[0m', `🎯 Active Discounts (${discounts.length}):`);
    discounts.forEach(d => console.log(`  - ${d.discountPercent}% OFF | ${d.description}`));
    console.log('');

    // 4. Orders
    const orders = await mongoose.connection.db.collection('orders').find({}).toArray();
    console.log('\x1b[33m%s\x1b[0m', `🛒 Saved Orders (${orders.length}):`);
    if (orders.length === 0) {
      console.log('  (No orders placed yet. Place an order on http://localhost:5173/cart)');
    } else {
      orders.forEach(o => console.log(`  - Order #${o._id.toString().slice(-6).toUpperCase()} | Total: ${o.totalAmount}₹ | Status: ${o.status}`));
    }
    console.log('');

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error connecting to database:', err.message);
  }
}

viewDatabase();
