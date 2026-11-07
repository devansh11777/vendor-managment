import { PickupPassModal } from '../components/PickupPassModal';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderForPass, setSelectedOrderForPass] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('/api/orders/my-orders');
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'ready':
        return { bg: '#e8f5e9', text: '#2e7d32', label: 'Ready for Pickup at Shop' };
      case 'confirmed':
        return { bg: '#e3f2fd', text: '#1565c0', label: 'Confirmed by Vendor' };
      case 'completed':
        return { bg: '#f5f5f5', text: '#616161', label: 'Completed' };
      case 'cancelled':
        return { bg: '#ffebee', text: '#c62828', label: 'Cancelled' };
      default:
        return { bg: '#fff8e1', text: '#f57f17', label: 'Pending Confirmation' };
    }
  };

  return (
    <div style={{ paddingTop: '62px', minHeight: '100vh', backgroundColor: '#f9f9fc' }}>
      <Navbar />

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '30px 20px' }}>
        {/* Profile Card */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 18px rgba(0,0,0,0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px',
          marginBottom: '30px',
          borderLeft: '6px solid #f58220'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              
              <h1 style={{ fontSize: '24px', color: '#222', margin: 0 }}>{user?.name}</h1>
            </div>
            <p style={{ color: '#666', fontSize: '14px', marginTop: '6px' }}>
              Registration ID: <strong>{user?.enrollmentId || 'LPU Student'}</strong> • Email: {user?.email}
            </p>
          </div>

          <Link
            to='/category/all'
            style={{
              backgroundColor: '#f58220',
              color: '#fff',
              padding: '10px 22px',
              borderRadius: '25px',
              fontWeight: '600',
              fontSize: '14px',
              textDecoration: 'none'
            }}
          >
            Order Essentials
          </Link>
        </div>

        {/* My Orders Section */}
        <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 18px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', color: '#222' }}>
            My Orders & Campus Pickups
          </h2>

          {loading ? (
            <p style={{ color: '#888' }}>Loading orders...</p>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              
              <h3 style={{ color: '#444' }}>No orders yet</h3>
              <p style={{ color: '#777', fontSize: '14px', marginTop: '4px' }}>
                You haven't placed any campus orders yet.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {orders.map((order) => {
                const statusInfo = getStatusColor(order.status);
                return (
                  <div
                    key={order._id}
                    style={{
                      border: '1px solid #eee',
                      borderRadius: '12px',
                      padding: '18px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '15px' }}>
                          Order #{order._id.slice(-6).toUpperCase()}
                        </span>
                        <span style={{ fontSize: '12px', color: '#888' }}>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div style={{ fontSize: '14px', color: '#444', marginBottom: '8px' }}>
                        {order.items?.map((item, idx) => (
                          <div key={idx}>
                            • {item.product?.name || 'Item'} (Qty: {item.quantity}) - {item.price * item.quantity}₹
                          </div>
                        ))}
                      </div>

                      <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#f58220' }}>
                        Total: {order.totalAmount}₹/-
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                      <span style={{
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontWeight: '600',
                        fontSize: '13px',
                        backgroundColor: statusInfo.bg,
                        color: statusInfo.text,
                        display: 'inline-block'
                      }}>
                        {statusInfo.label}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedOrderForPass(order)}
                        style={{
                          backgroundColor: '#f58220',
                          color: '#fff',
                          border: 'none',
                          padding: '5px 12px',
                          borderRadius: '15px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        View Pickup Slip
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {/* Digital Campus Pickup Pass Modal */}
      <PickupPassModal
        order={selectedOrderForPass}
        isOpen={!!selectedOrderForPass}
        onClose={() => setSelectedOrderForPass(null)}
      />
      </main>
    </div>
  );
};
