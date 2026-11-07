import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { DiscountBadge } from './DiscountBadge';
import { PriceComparisonModal } from './PriceComparisonModal';
import { CompareIcon, MapPinIcon } from './Icons';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [showCompare, setShowCompare] = useState(false);

  const isDiscounted = product.discountedPrice && product.discountedPrice < product.price;
  const currentPrice = isDiscounted ? product.discountedPrice : product.price;

  const imageUrl = product.images && product.images.length > 0
    ? product.images[0]
    : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop';

  return (
    <>
      <div style={{
        backgroundColor: '#fff',
        padding: '1.2rem',
        borderRadius: '16px',
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        border: '1px solid rgba(0,0,0,0.04)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.08)';
      }}
      >
        {/* Discount Badge top left */}
        {isDiscounted && (
          <div style={{ position: 'absolute', top: '14px', left: '14px', zIndex: 2 }}>
            <DiscountBadge percent={product.discountPercent} />
          </div>
        )}

        {/* Product Image */}
        <Link to={'/product/' + product._id} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <div style={{
            backgroundColor: '#f5f5f7',
            width: '100%',
            maxWidth: '250px',
            height: '280px',
            borderRadius: '1rem',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}>
            <img
              src={imageUrl}
              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop';
              }}
            />
          </div>
        </Link>

        {/* Product Information */}
        <div style={{ textAlign: 'center', width: '100%', marginBottom: '0.8rem' }}>
          <Link to={'/product/' + product._id} style={{ textDecoration: 'none', color: '#222' }}>
            <div style={{
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '6px',
              height: '42px',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}>
              {product.name}
            </div>
          </Link>

          {/* Pricing */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', margin: '6px 0' }}>
            <span style={{ fontSize: '18px', fontWeight: '700', color: '#f58220' }}>
              {currentPrice}₹/-
            </span>
            {isDiscounted && (
              <span style={{ fontSize: '14px', textDecoration: 'line-through', color: '#999' }}>
                {product.price}₹
              </span>
            )}
          </div>

          {/* Stock status indicator */}
          <div style={{
            fontSize: '13px',
            fontWeight: '600',
            color: product.inStock ? '#0db60d' : '#f31e1e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
            marginTop: '4px'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: product.inStock ? '#0db60d' : '#f31e1e',
              display: 'inline-block'
            }}></span>
            {product.inStock ? 'Available' : 'Out Of Stock'}
          </div>
        </div>

        {/* Shop name & Price Compare Link */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '12px',
          color: '#666',
          width: '100%',
          marginBottom: '10px',
          borderTop: '1px dashed #eee',
          paddingTop: '6px'
        }}>
          <button
            type="button"
            onClick={() => setShowCompare(true)}
            style={{
              background: 'none',
              border: 'none',
              color: '#1565c0',
              fontSize: '11px',
              fontWeight: '600',
              cursor: 'pointer',
              padding: '2px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '3px'
            }}
          >
            <CompareIcon size={13} color="#1565c0" /> Compare
          </button>
          <span><span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}><MapPinIcon size={12} color="#888" /> {product.shopName || 'Campus Shop'}</span></span>
        </div>

        {/* Action Button */}
        <button
          onClick={() => addToCart(product, 1)}
          disabled={!product.inStock}
          style={{
            width: '100%',
            padding: '10px 0',
            borderRadius: '8px',
            backgroundColor: product.inStock ? '#f58220' : '#ccc',
            color: '#fff',
            fontWeight: '600',
            fontSize: '14px',
            cursor: product.inStock ? 'pointer' : 'not-allowed',
            boxShadow: product.inStock ? '0 4px 10px rgba(245, 130, 32, 0.3)' : 'none',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => {
            if (product.inStock) e.target.style.backgroundColor = '#e67313';
          }}
          onMouseLeave={(e) => {
            if (product.inStock) e.target.style.backgroundColor = '#f58220';
          }}
        >
          {product.inStock ? 'Add To Cart' : 'Out of Stock'}
        </button>
      </div>

      {/* Interactive Price Comparison Modal */}
      <PriceComparisonModal
        product={product}
        isOpen={showCompare}
        onClose={() => setShowCompare(false)}
      />
    </>
  );
};
