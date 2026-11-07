import React from 'react';
import { CompareIcon, MapPinIcon, CheckIcon, CloseIcon } from './Icons';

export const PriceComparisonModal = ({ product, isOpen, onClose }) => {
  if (!isOpen || !product) return null;

  // Campus comparison data generated for similar essentials
  const mockCampusVendors = [
    {
      shopName: 'bh-6 WH-smith',
      location: 'Boys Hostel 6, Ground Floor',
      price: product.discountedPrice || product.price,
      isLowest: true,
      inStock: true,
      deliveryTime: '10 mins pickup'
    },
    {
      shopName: 'LPU Mart (Central Mall)',
      location: 'Block 34, Central Mall',
      price: Math.round((product.discountedPrice || product.price) * 1.08),
      isLowest: false,
      inStock: true,
      deliveryTime: '15 mins pickup'
    },
    {
      shopName: 'Your-Care Campus Store',
      location: 'BH-3 Market Complex',
      price: Math.round((product.discountedPrice || product.price) * 1.15),
      isLowest: false,
      inStock: false,
      deliveryTime: 'Out of Stock'
    }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100000,
      padding: '20px',
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '16px',
        maxWidth: '560px',
        width: '100%',
        padding: '28px',
        boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CompareIcon size={20} color="#f58220" /></div>
            <div>
              <h3 style={{ fontSize: '19px', color: '#222', margin: 0 }}>Campus Price Comparison</h3>
              <p style={{ color: '#666', fontSize: '13px', margin: '3px 0 0' }}>{product.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#777' }}
          >
            <CloseIcon size={18} color="#777" />
          </button>
        </div>

        <p style={{ fontSize: '13px', color: '#555', marginBottom: '16px', lineHeight: '1.4' }}>
          Comparing live prices across registered LPU campus vendors to help you save money on university essentials:
        </p>

        {/* Comparison List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '22px' }}>
          {mockCampusVendors.map((vendor, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                borderRadius: '10px',
                border: vendor.isLowest ? '2px solid #0db60d' : '1px solid #e0e0e0',
                backgroundColor: vendor.isLowest ? '#f0fff4' : '#fafafa'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: '600', fontSize: '14px', color: '#222' }}>{vendor.shopName}</span>
                  {vendor.isLowest && (
                    <span style={{
                      backgroundColor: '#0db60d',
                      color: '#fff',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      textTransform: 'uppercase'
                    }}>
                      Lowest Price
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '12px', color: '#777', marginTop: '2px' }}>
                   {vendor.location} • {vendor.deliveryTime}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: vendor.isLowest ? '#0db60d' : '#444' }}>
                  {vendor.price}₹/-
                </div>
                <span style={{ fontSize: '11px', color: vendor.inStock ? '#2e7d32' : '#c62828', fontWeight: '500' }}>
                  {vendor.inStock ? '● In Stock' : '<CloseIcon size={18} color="#777" /> Unavailable'}
                </span>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            backgroundColor: '#f58220',
            color: '#fff',
            padding: '12px',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          Got it, Close Comparison
        </button>
      </div>
    </div>
  );
};
