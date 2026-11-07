import { PickupPassModal } from '../components/PickupPassModal';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Navbar } from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const CartPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    items,
    selectedItems,
    updateQuantity,
    toggleSelect,
    removeSelected,
    clearCart,
    cartTotal
  } = useCart();

  const [orderPlaced, setOrderPlaced] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showPickupPass, setShowPickupPass] = useState(false);

  const handleCheckout = async () => {
    if (selectedItems.length === 0) {
      toast.error('Please select at least one item to checkout');
      return;
    }

    if (!user) {
      toast('Please login to place your order', { icon: '' });
      navigate('/login', { state: { from: { pathname: '/cart' } } });
      return;
    }

    setIsPlacingOrder(true);
    try {
      const orderPayload = {
        items: selectedItems.map((item) => ({
          product: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.discountedPrice || item.product.price
        })),
        totalAmount: cartTotal
      };

      const res = await axios.post('/api/orders', orderPayload);
      setOrderPlaced(res.data);
      clearCart();
      toast.success('Order placed successfully! Pickup ready at vendor shop.');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to place order';
      toast.error(msg);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div style={{ paddingTop: '62px', minHeight: '100vh', backgroundColor: '#fcfcfc' }}>
      <Navbar />

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
        {orderPlaced ? (
          <div style={{
            maxWidth: '550px',
            margin: '40px auto',
            backgroundColor: '#fff',
            padding: '40px 30px',
            borderRadius: '16px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '50px', marginBottom: '15px' }}></div>
            <h2 style={{ color: '#0db60d', marginBottom: '10px' }}>Order Confirmed!</h2>
            <p style={{ color: '#555', fontSize: '14px', marginBottom: '20px' }}>
              Your order ID is <strong>#{orderPlaced._id.slice(-6).toUpperCase()}</strong>
            </p>

            <div style={{
              backgroundColor: '#f9f9f9',
              padding: '16px',
              borderRadius: '10px',
              textAlign: 'left',
              marginBottom: '25px',
              fontSize: '14px'
            }}>
              <div style={{ marginBottom: '8px' }}>
                <strong>Campus Pickup:</strong> Within 15 minutes from vendor shop
              </div>
              <div style={{ marginBottom: '8px' }}>
                <strong>Items:</strong> {orderPlaced.items?.length} items
              </div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#f58220' }}>
                Total Paid: {orderPlaced.totalAmount}₹/-
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => setShowPickupPass(true)}
                style={{
                  backgroundColor: '#0db60d',
                  color: '#fff',
                  padding: '10px 22px',
                  borderRadius: '25px',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(13, 182, 13, 0.3)'
                }}
              >
                View Campus Pickup Slip
              </button>
              <button
                onClick={() => navigate('/student/dashboard')}
                style={{
                  backgroundColor: '#f58220',
                  color: '#fff',
                  padding: '10px 24px',
                  borderRadius: '25px',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                View in Dashboard
              </button>
              <button
                onClick={() => navigate('/category/all')}
                style={{
                  backgroundColor: '#eee',
                  color: '#333',
                  padding: '10px 24px',
                  borderRadius: '25px',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            {/* Left Cart Section  */}
            <div style={{ flex: '2', minWidth: '320px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '26px', fontWeight: '700', textTransform: 'capitalize', color: '#222' }}>
                  Shopping Cart ({items.length})
                </h2>
                {items.length > 0 && (
                  <button
                    onClick={clearCart}
                    style={{ background: 'none', color: '#d32f2f', fontSize: '13px', cursor: 'pointer' }}
                  >
                    Clear All
                  </button>
                )}
              </div>

              {items.length === 0 ? (
                <div style={{
                  backgroundColor: '#fff',
                  padding: '50px 20px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
                }}>
                  <div style={{ fontSize: '42px', marginBottom: '10px' }}></div>
                  <h3 style={{ color: '#444', marginBottom: '8px' }}>Your cart is empty</h3>
                  <p style={{ color: '#888', fontSize: '14px', marginBottom: '20px' }}>
                    Explore hostel shops and campus vendors to add items.
                  </p>
                  <Link
                    to="/category/all"
                    style={{
                      backgroundColor: '#f58220',
                      color: '#fff',
                      padding: '10px 24px',
                      borderRadius: '25px',
                      fontWeight: 'bold',
                      textDecoration: 'none',
                      display: 'inline-block'
                    }}
                  >
                    Explore Campus Stores
                  </Link>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {items.map((item) => {
                      const effectivePrice = item.product.discountedPrice || item.product.price;
                      return (
                        <div
                          key={item.product._id}
                          style={{
                            display: 'flex',
                            backgroundColor: '#fff',
                            border: '1px solid #e5e5e5',
                            borderRadius: '12px',
                            padding: '16px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                            gap: '16px',
                            alignItems: 'center'
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={item.selected}
                            onChange={() => toggleSelect(item.product._id)}
                            style={{ width: '18px', height: '18px', accentColor: '#f58220', cursor: 'pointer' }}
                          />

                          <div style={{
                            width: '110px',
                            height: '110px',
                            backgroundColor: '#f5f5f7',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            flexShrink: 0
                          }}>
                            <img
                              src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop'}
                              alt={item.product.name}
                              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            />
                          </div>

                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '600', fontSize: '16px', color: '#222', marginBottom: '4px' }}>
                              {item.product.name}
                            </div>
                            <div style={{ fontSize: '12px', color: '#777', marginBottom: '6px' }}>
                              Shop: {item.product.shopName || 'Campus Vendor'}
                            </div>
                            <div style={{ fontSize: '16px', fontWeight: '700', color: '#f58220', marginBottom: '10px' }}>
                              {effectivePrice}₹/-
                              {item.product.discountedPrice && (
                                <span style={{ fontSize: '13px', textDecoration: 'line-through', color: '#999', marginLeft: '6px' }}>
                                  {item.product.price}₹
                                </span>
                              )}
                            </div>

                            {/* Quantity controls  */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontSize: '13px', color: '#555' }}>Quantity:</span>
                              <button
                                onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                                style={{
                                  width: '28px',
                                  height: '28px',
                                  borderRadius: '4px',
                                  backgroundColor: '#eee',
                                  fontWeight: 'bold',
                                  cursor: 'pointer'
                                }}
                              >
                                -
                              </button>
                              <span style={{
                                width: '32px',
                                textAlign: 'center',
                                fontWeight: '600',
                                fontSize: '14px'
                              }}>
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                                style={{
                                  width: '28px',
                                  height: '28px',
                                  borderRadius: '4px',
                                  backgroundColor: '#eee',
                                  fontWeight: 'bold',
                                  cursor: 'pointer'
                                }}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Buttons  .buttons */}
                  <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                    <button
                      onClick={() => navigate('/category/all')}
                      style={{
                        backgroundColor: '#ffc107',
                        color: '#000',
                        padding: '11px 28px',
                        borderRadius: '6px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      + Add More
                    </button>
                    <button
                      onClick={removeSelected}
                      style={{
                        backgroundColor: '#ff4d4d',
                        color: '#fff',
                        padding: '11px 28px',
                        borderRadius: '6px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      Remove Selected
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Right Payout Section  .payout-section */}
            <div style={{
              flex: '1',
              minWidth: '290px',
              backgroundColor: '#ffffff',
              padding: '24px',
              borderRadius: '14px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              position: 'sticky',
              top: '80px',
              border: '1px solid #f0f0f0'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '18px', color: '#222', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                Total Payout
              </h2>

              {selectedItems.length === 0 ? (
                <p style={{ color: '#999', fontSize: '14px', textAlign: 'center', margin: '20px 0' }}>
                  No items selected to display.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                  {selectedItems.map((item, index) => {
                    const price = (item.product.discountedPrice || item.product.price) * item.quantity;
                    return (
                      <div key={item.product._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                        <span style={{ color: '#444' }}>
                          {index + 1}) {item.product.name} (x{item.quantity})
                        </span>
                        <span style={{ fontWeight: '600', color: '#222' }}>
                          {price}₹/-
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              <div style={{
                borderTop: '2px dashed #eee',
                paddingTop: '15px',
                marginTop: '15px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '16px', fontWeight: '600', color: '#333' }}>Total Payout:</span>
                <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#f58220' }}>
                  {cartTotal}₹/-
                </span>
              </div>

              <div style={{ fontSize: '12px', color: '#777', marginTop: '10px', marginBottom: '20px', lineHeight: '1.4' }}>
                ✅ Campus delivery/pickup available across all boy's and girl's hostels.
              </div>

              <button
                disabled={selectedItems.length === 0 || isPlacingOrder}
                onClick={handleCheckout}
                style={{
                  width: '100%',
                  padding: '13px',
                  backgroundColor: selectedItems.length > 0 ? '#f58220' : '#ccc',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: selectedItems.length > 0 ? 'pointer' : 'not-allowed',
                  boxShadow: selectedItems.length > 0 ? '0 4px 15px rgba(245, 130, 32, 0.4)' : 'none',
                  transition: 'background 0.2s'
                }}
              >
                {isPlacingOrder ? 'Processing...' : 'Confirm & Place Order'}
              </button>
            </div>
          </div>
        )}
        {/* Campus Pickup Pass Modal */}
      <PickupPassModal
        order={orderPlaced}
        isOpen={showPickupPass}
        onClose={() => setShowPickupPass(false)}
      />
      </main>
    </div>
  );
};
