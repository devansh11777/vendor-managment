import React from 'react';
import { PackageIcon, PrinterIcon, CloseIcon, ShieldCheckIcon, ClockIcon } from './Icons';

export const PickupPassModal = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const orderId = order._id ? order._id.slice(-6).toUpperCase() : '8492';
  const pickupToken = 'LPU-' + orderId;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100000,
      padding: '20px',
      backdropFilter: 'blur(5px)'
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '18px',
        maxWidth: '480px',
        width: '100%',
        padding: '28px',
        boxShadow: '0 16px 50px rgba(0,0,0,0.3)',
        position: 'relative',
        border: '2px dashed #f58220'
      }}>
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><PackageIcon size={20} color="#f58220" /></div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#222', margin: 0 }}>LPU Campus Pickup Pass</h3>
              <span style={{ fontSize: '11px', color: '#777' }}>Official University Vendor Slip</span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#888' }}
          >
            <CloseIcon size={18} color="#888" />
          </button>
        </div>

        {/* Verification Token Banner */}
        <div style={{
          backgroundColor: '#fff8f0',
          border: '1px solid #ffd8a8',
          borderRadius: '12px',
          padding: '14px',
          textAlign: 'center',
          marginBottom: '18px'
        }}>
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#d9480f', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Show this token at the hostel vendor counter
          </div>
          <div style={{ fontSize: '30px', fontWeight: 'bold', color: '#f58220', letterSpacing: '2px', margin: '4px 0' }}>
            #{pickupToken}
          </div>
          <div style={{ fontSize: '11px', color: '#888' }}>
            Order ID: {order._id}
          </div>
        </div>

        {/* Pickup Details */}
        <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', paddingBottom: '6px' }}>
            <span style={{ color: '#666' }}>Student:</span>
            <span style={{ fontWeight: '600', color: '#222' }}>{order.student?.name || 'Aman Kumar'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', paddingBottom: '6px' }}>
            <span style={{ color: '#666' }}>Hostel Pickup:</span>
            <span style={{ fontWeight: '600', color: '#2e7d32' }}>BH-6 Ground Floor / Central Mart</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', paddingBottom: '6px' }}>
            <span style={{ color: '#666' }}>Status:</span>
            <span style={{
              fontWeight: 'bold',
              color: order.status === 'ready' ? '#2e7d32' : '#f57f17',
              textTransform: 'uppercase'
            }}>
              {order.status === 'ready' ? 'Ready for Pickup' : 'Preparing at Vendor'}
            </span>
          </div>
        </div>

        {/* Items Summary */}
        <div style={{
          backgroundColor: '#fafafa',
          borderRadius: '10px',
          padding: '12px',
          marginBottom: '20px',
          maxHeight: '140px',
          overflowY: 'auto'
        }}>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#555', marginBottom: '6px' }}>Ordered Items:</div>
          {order.items?.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#444', marginBottom: '4px' }}>
              <span>• {item.product?.name || item.name || 'Campus Item'} (x{item.quantity})</span>
              <span style={{ fontWeight: '600' }}>{item.price * item.quantity}₹</span>
            </div>
          ))}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderTop: '1px dashed #ccc',
            paddingTop: '6px',
            marginTop: '6px',
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#222'
          }}>
            <span>Total Paid:</span>
            <span style={{ color: '#f58220' }}>{order.totalAmount}₹/-</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => window.print()}
            style={{
              flex: 1,
              backgroundColor: '#eee',
              color: '#333',
              padding: '11px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><PrinterIcon size={15} color="#333" /> Print Slip</span>
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              backgroundColor: '#f58220',
              color: '#fff',
              padding: '11px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
