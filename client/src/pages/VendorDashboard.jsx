import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const VendorDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('inventory');
  const [products, setProducts] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Product Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('personal-care');
  const [newQty, setNewQty] = useState('20');
  const [newImageUrl, setNewImageUrl] = useState('/assets/personalcare/1.png');

  // New Discount Form State
  const [discountProductId, setDiscountProductId] = useState('');
  const [discountPercent, setDiscountPercent] = useState('15');
  const [discountDesc, setDiscountDesc] = useState('');

  const loadVendorData = async () => {
    try {
      const [prodRes, discRes, orderRes] = await Promise.all([
        axios.get('/api/products?vendor=' + user._id),
        axios.get('/api/discounts'),
        axios.get('/api/orders/vendor-orders')
      ]);
      setProducts(prodRes.data);
      setDiscounts(discRes.data.filter((d) => d.vendor?._id === user._id));
      setOrders(orderRes.data);
    } catch (err) {
      console.error('Failed to load vendor data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVendorData();
    const interval = setInterval(loadVendorData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleStock = async (product) => {
    try {
      const updatedStock = !product.inStock;
      await axios.put('/api/products/' + product._id, { inStock: updatedStock });
      setProducts((prev) =>
        prev.map((p) => (p._id === product._id ? { ...p, inStock: updatedStock } : p))
      );
      toast.success(product.name + ' marked as ' + (updatedStock ? 'Available' : 'Out of Stock'));
    } catch (err) {
      toast.error('Failed to update stock status');
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/products', {
        name: newName,
        description: newDesc,
        price: Number(newPrice),
        category: newCategory,
        quantity: Number(newQty),
        images: [newImageUrl],
        inStock: true
      });
      setProducts([res.data, ...products]);
      setShowAddModal(false);
      setNewName('');
      setNewDesc('');
      setNewPrice('');
      toast.success('Product added successfully!');
    } catch (err) {
      toast.error('Failed to add product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete('/api/products/' + id);
      setProducts(products.filter((p) => p._id !== id));
      toast.success('Product deleted');
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  const handleCreateDiscount = async (e) => {
    e.preventDefault();
    if (!discountProductId) {
      toast.error('Please choose a product');
      return;
    }
    try {
      const res = await axios.post('/api/discounts', {
        productId: discountProductId,
        discountPercent: Number(discountPercent),
        description: discountDesc
      });
      setDiscounts([res.data, ...discounts]);
      loadVendorData();
      setDiscountDesc('');
      toast.success('Discount created & prices updated across campus in seconds!');
    } catch (err) {
      toast.error('Failed to create discount');
    }
  };

  const handleDeactivateDiscount = async (id) => {
    try {
      await axios.delete('/api/discounts/' + id);
      setDiscounts(discounts.filter((d) => d._id !== id));
      loadVendorData();
      toast.success('Discount deactivated, original price restored');
    } catch (err) {
      toast.error('Failed to deactivate discount');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put('/api/orders/' + orderId + '/status', { status: newStatus });
      setOrders(orders.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)));
      toast.success('Order status updated to ' + newStatus);
    } catch (err) {
      toast.error('Failed to update order status');
    }
  };

  return (
    <div style={{ paddingTop: '62px', minHeight: '100vh', backgroundColor: '#f5f6fa' }}>
      <Navbar />

      <main style={{ maxWidth: '1250px', margin: '0 auto', padding: '30px 20px' }}>
        {/* Vendor Header Card */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '16px',
          padding: '24px 30px',
          boxShadow: '0 4px 18px rgba(0,0,0,0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          marginBottom: '25px',
          borderLeft: '6px solid #f58220'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              
              <h1 style={{ fontSize: '24px', color: '#222', margin: 0 }}>
                {user?.shopName || user?.name}
              </h1>
              <span style={{
                backgroundColor: '#e8f5e9',
                color: '#2e7d32',
                padding: '3px 10px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                Verified Campus Vendor
              </span>
            </div>
            <p style={{ color: '#666', fontSize: '14px', marginTop: '6px' }}>
              Location: <strong>{user?.shopLocation || 'LPU Campus Hostels'}</strong> • Manager: {user?.name} ({user?.email})
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            style={{
              backgroundColor: '#f58220',
              color: '#fff',
              padding: '12px 24px',
              borderRadius: '25px',
              fontWeight: 'bold',
              fontSize: '14px',
              boxShadow: '0 4px 12px rgba(245, 130, 32, 0.4)'
            }}
          >
            + Add New Product
          </button>
        </div>

        {/* Analytics Counter Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '18px',
          marginBottom: '25px'
        }}>
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '13px', color: '#777', fontWeight: '500' }}>TOTAL PRODUCTS</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#222', marginTop: '6px' }}>{products.length}</div>
          </div>
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '13px', color: '#777', fontWeight: '500' }}>IN STOCK ITEMS</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#0db60d', marginTop: '6px' }}>
              {products.filter((p) => p.inStock).length}
            </div>
          </div>
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '13px', color: '#777', fontWeight: '500' }}>ACTIVE DISCOUNTS</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ff4d4d', marginTop: '6px' }}>
              {discounts.length}
            </div>
          </div>
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '13px', color: '#777', fontWeight: '500' }}>INCOMING ORDERS</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#f58220', marginTop: '6px' }}>
              {orders.length}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '10px',
          borderBottom: '2px solid #e5e5e5',
          marginBottom: '25px'
        }}>
          {[
            { id: 'inventory', label: 'Inventory & Availability', count: products.length },
            { id: 'discounts', label: 'Discount Notifications', count: discounts.length },
            { id: 'orders', label: 'Incoming Orders', count: orders.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 22px',
                fontWeight: '600',
                fontSize: '15px',
                background: 'none',
                borderBottom: activeTab === tab.id ? '3px solid #f58220' : 'none',
                color: activeTab === tab.id ? '#f58220' : '#666',
                cursor: 'pointer',
                marginBottom: '-2px'
              }}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Tab 1: Inventory Table */}
        {activeTab === 'inventory' && (
          <div style={{ backgroundColor: '#fff', borderRadius: '14px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f0f0f0', color: '#777' }}>
                    <th style={{ padding: '12px' }}>Product</th>
                    <th style={{ padding: '12px' }}>Category</th>
                    <th style={{ padding: '12px' }}>Price</th>
                    <th style={{ padding: '12px' }}>Stock Status</th>
                    <th style={{ padding: '12px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                      <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={product.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop'}
                          alt={product.name}
                          style={{ width: '45px', height: '45px', borderRadius: '6px', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: '600', color: '#222' }}>{product.name}</div>
                          {product.discountPercent > 0 && (
                            <span style={{ fontSize: '11px', color: '#ff4d4d', fontWeight: 'bold' }}>
                              {product.discountPercent}% OFF Active
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '12px', textTransform: 'capitalize', color: '#555' }}>
                        {product.category}
                      </td>
                      <td style={{ padding: '12px', fontWeight: '600' }}>
                        {product.discountedPrice ? (
                          <>
                            <span style={{ color: '#f58220' }}>{product.discountedPrice}₹</span>{' '}
                            <span style={{ fontSize: '12px', textDecoration: 'line-through', color: '#999' }}>{product.price}₹</span>
                          </>
                        ) : (
                          product.price + '₹'
                        )}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <button
                          onClick={() => handleToggleStock(product)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '20px',
                            fontWeight: '600',
                            fontSize: '12px',
                            backgroundColor: product.inStock ? '#e8f5e9' : '#ffebee',
                            color: product.inStock ? '#2e7d32' : '#c62828',
                            border: '1px solid ' + (product.inStock ? '#a5d6a7' : '#ef9a9a'),
                            cursor: 'pointer'
                          }}
                        >
                          {product.inStock ? 'Available (In Stock)' : 'Out of Stock'}
                        </button>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          style={{
                            background: 'none',
                            color: '#d32f2f',
                            fontSize: '13px',
                            fontWeight: '500',
                            cursor: 'pointer'
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Discounts & Promotions */}
        {activeTab === 'discounts' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px' }}>
            <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '15px', color: '#222' }}>
                Launch Campus Discount Alert
              </h3>
              <p style={{ fontSize: '13px', color: '#666', marginBottom: '18px' }}>
                Discounts automatically update across all student searches and category listings within seconds.
              </p>

              <form onSubmit={handleCreateDiscount} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#444', display: 'block', marginBottom: '6px' }}>
                    Select Product:
                  </label>
                  <select
                    value={discountProductId}
                    onChange={(e) => setDiscountProductId(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
                  >
                    <option value=''>-- Choose Product --</option>
                    {products.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name} (Current: {p.price}₹)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#444', display: 'block', marginBottom: '6px' }}>
                    Discount Percentage (%):
                  </label>
                  <input
                    type='number'
                    min='5'
                    max='90'
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#444', display: 'block', marginBottom: '6px' }}>
                    Notification / Offer Headline:
                  </label>
                  <input
                    type='text'
                    placeholder='e.g. Hostel Fest Special: 20% OFF Today!'
                    value={discountDesc}
                    onChange={(e) => setDiscountDesc(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
                  />
                </div>

                <button
                  type='submit'
                  style={{
                    backgroundColor: '#f58220',
                    color: '#fff',
                    padding: '12px',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    marginTop: '10px'
                  }}
                >
                  Publish Discount Alert
                </button>
              </form>
            </div>

            <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '15px', color: '#222' }}>
                Active Offers ({discounts.length})
              </h3>

              {discounts.length === 0 ? (
                <p style={{ color: '#888', fontSize: '14px' }}>No active discounts running right now.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {discounts.map((discount) => (
                    <div
                      key={discount._id}
                      style={{
                        padding: '14px',
                        border: '1px solid #ffd8a8',
                        backgroundColor: '#fff9db',
                        borderRadius: '10px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 'bold', color: '#d9480f' }}>
                          {discount.discountPercent}% OFF • {discount.product?.name}
                        </div>
                        <div style={{ fontSize: '13px', color: '#555', marginTop: '4px' }}>
                          {discount.description}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeactivateDiscount(discount._id)}
                        style={{
                          backgroundColor: '#ff4d4d',
                          color: '#fff',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}
                      >
                        Deactivate
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Incoming Orders */}
        {activeTab === 'orders' && (
          <div style={{ backgroundColor: '#fff', borderRadius: '14px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '15px', color: '#222' }}>
              Student Pickup Orders
            </h3>

            {orders.length === 0 ? (
              <p style={{ color: '#888', fontSize: '14px', padding: '20px 0' }}>No incoming orders yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {orders.map((order) => (
                  <div
                    key={order._id}
                    style={{
                      border: '1px solid #eee',
                      borderRadius: '10px',
                      padding: '16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#222' }}>
                        Order #{order._id.slice(-6).toUpperCase()} • {order.student?.name} ({order.student?.enrollmentId || 'Student'})
                      </div>
                      <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
                        Items: {order.items?.map((i) => (i.product?.name || 'Item') + ' (x' + i.quantity + ')').join(', ')}
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#f58220', marginTop: '4px' }}>
                        Total: {order.totalAmount}₹/-
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '500', color: '#555' }}>Status:</span>
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: '1px solid #ccc',
                          fontWeight: '600',
                          backgroundColor: order.status === 'ready' ? '#e8f5e9' : '#fff'
                        }}
                      >
                        <option value='pending'>Pending</option>
                        <option value='confirmed'>Confirmed</option>
                        <option value='ready'>Ready for Pickup</option>
                        <option value='completed'>Completed</option>
                        <option value='cancelled'>Cancelled</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add Product Modal */}
        {showAddModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '20px'
          }}>
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '16px',
              padding: '30px',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <h3 style={{ fontSize: '20px', color: '#222', margin: 0 }}>Add New Campus Product</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  style={{ background: 'none', fontSize: '20px', cursor: 'pointer', color: '#888' }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#444' }}>Product Name:</label>
                  <input
                    type='text'
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', marginTop: '4px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#444' }}>Category:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', marginTop: '4px' }}
                  >
                    <option value='personal-care'>Personal Care</option>
                    <option value='food'>Food</option>
                    <option value='stationary'>Stationary</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#444' }}>Price (₹):</label>
                  <input
                    type='number'
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', marginTop: '4px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#444' }}>Initial Stock Quantity:</label>
                  <input
                    type='number'
                    value={newQty}
                    onChange={(e) => setNewQty(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', marginTop: '4px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#444' }}>Image URL or Asset Path:</label>
                  <input
                    type='text'
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', marginTop: '4px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#444' }}>Description:</label>
                  <textarea
                    rows='3'
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', marginTop: '4px' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button
                    type='submit'
                    style={{ flex: 1, backgroundColor: '#f58220', color: '#fff', padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}
                  >
                    Save & Publish
                  </button>
                  <button
                    type='button'
                    onClick={() => setShowAddModal(false)}
                    style={{ flex: 1, backgroundColor: '#eee', color: '#333', padding: '12px', borderRadius: '8px' }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
