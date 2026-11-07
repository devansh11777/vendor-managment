import React from 'react';

export const DiscountBadge = ({ percent, className = '' }) => {
  if (!percent || percent <= 0) return null;
  return (
    <span
      className={className}
      style={{
        backgroundColor: '#ff4d4d',
        color: '#fff',
        fontSize: '11px',
        fontWeight: '700',
        padding: '3px 8px',
        borderRadius: '12px',
        textTransform: 'uppercase',
        boxShadow: '0 2px 6px rgba(255, 77, 77, 0.4)',
        letterSpacing: '0.5px'
      }}
    >
      {percent}% OFF
    </span>
  );
};
