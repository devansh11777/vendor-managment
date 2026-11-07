import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TagIcon } from './Icons';

export const DiscountTicker = () => {
  const navigate = useNavigate();
  const [discounts, setDiscounts] = useState([]);

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const res = await axios.get('/api/discounts');
        setDiscounts(res.data.filter((d) => d.isActive));
      } catch (err) {
        // quiet fallback
      }
    };

    fetchDiscounts();
    const interval = setInterval(fetchDiscounts, 15000); // Live poll for real-time sync
    return () => clearInterval(interval);
  }, []);

  if (!discounts || discounts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '62px',
      left: 0,
      width: '100%',
      backgroundColor: '#2d3436',
      color: '#fff',
      fontSize: '12px',
      fontWeight: '500',
      padding: '6px 20px',
      zIndex: 9998,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      overflow: 'hidden'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, paddingRight: '15px' }}>
        <span style={{
          backgroundColor: '#ff4d4d',
          color: '#fff',
          padding: '2px 8px',
          borderRadius: '4px',
          fontSize: '10px',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><TagIcon size={12} color="#fff" /> LIVE DEALS</span>
        </span>
        <span style={{ color: '#dfe6e9', fontSize: '11px' }}>Syncs in seconds:</span>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '25px',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}>
        {discounts.map((d) => (
          <div
            key={d._id}
            onClick={() => d.product?._id && navigate('/product/' + d.product._id)}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#f58220'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#fff'}
          >
            <span style={{ color: '#0db60d', fontWeight: 'bold' }}>{d.discountPercent}% OFF</span>
            <span>{d.product?.name || 'Item'}</span>
            <span style={{ color: '#aaa', fontSize: '11px' }}>({d.vendor?.shopName || 'Hostel Shop'})</span>
          </div>
        ))}
      </div>
    </div>
  );
};
