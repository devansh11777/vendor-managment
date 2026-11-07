import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { DiscountTicker } from './DiscountTicker';
import { BrandLogo, SearchIcon, CartIcon, UserIcon, ChevronDown, PackageIcon, LogoutIcon } from './Icons';

export const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, isVendor } = useAuth();
  const { cartCount } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      if (searchTerm.trim()) {
        navigate(`/category/all?search=${encodeURIComponent(searchTerm.trim())}`);
      }
    }
  };

  return (
    <>
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '62px',
        backgroundColor: '#f58220',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 25px',
        zIndex: 9999,
        boxShadow: '0 2px 10px rgba(0,0,0,0.12)',
        color: '#fff'
      }}>
        {/* Left section: Logo & Nav Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: '#fff' }}>
            <BrandLogo size={32} />
            <div>
              <span style={{ fontFamily: 'Bangers, cursive', fontSize: '24px', letterSpacing: '1px', textShadow: '1px 1px 3px rgba(0,0,0,0.2)' }}>
                LPU KART
              </span>
              <div style={{ fontSize: '9px', fontWeight: '600', opacity: 0.95, marginTop: '-4px', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                Campus Vendor Hub
              </div>
            </div>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '6px' }}>
            <Link to="/" style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
              padding: '6px 14px',
              borderRadius: '20px',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={(e) => e.target.style.background = 'none'}
            >
              Home
            </Link>

            {/* Category Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                style={{
                  background: showCategoryMenu ? 'rgba(255,255,255,0.25)' : 'none',
                  border: 'none',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '600',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>Categories</span>
                <ChevronDown size={13} color="#fff" />
              </button>

              {showCategoryMenu && (
                <div
                  style={{
                    position: 'absolute',
                    top: '40px',
                    left: 0,
                    backgroundColor: '#fff',
                    borderRadius: '10px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                    minWidth: '200px',
                    overflow: 'hidden',
                    zIndex: 1000,
                    border: '1px solid #eaeaea'
                  }}
                  onMouseLeave={() => setShowCategoryMenu(false)}
                >
                  {[
                    { name: 'Food & Meals', path: '/category/food' },
                    { name: 'Stationary & Books', path: '/category/stationary' },
                    { name: 'Personal Care', path: '/category/personal-care' },
                    { name: 'All Campus Products', path: '/category/all' }
                  ].map((cat) => (
                    <Link
                      key={cat.path}
                      to={cat.path}
                      onClick={() => setShowCategoryMenu(false)}
                      style={{
                        display: 'block',
                        padding: '12px 18px',
                        color: '#333',
                        fontSize: '14px',
                        fontWeight: '500',
                        borderBottom: '1px solid #f2f2f2',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#fff7ed';
                        e.currentTarget.style.color = '#f58220';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#fff';
                        e.currentTarget.style.color = '#333';
                      }}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Middle search input */}
        <div style={{ flex: '1', maxWidth: '480px', margin: '0 20px', position: 'relative' }}>
          <input
            type="text"
            placeholder="Search food, stationary, lotions, hostel shops..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
            style={{
              width: '100%',
              padding: '10px 42px 10px 18px',
              borderRadius: '25px',
              border: 'none',
              fontSize: '14px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
              outline: 'none',
              backgroundColor: '#fff',
              color: '#333'
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f58220'
            }}
            title="Search"
          >
            <SearchIcon size={18} color="#f58220" />
          </button>
        </div>

        {/* Right navigation options */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Cart Icon with Counter */}
          <Link
            to="/cart"
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: '#fff',
              textDecoration: 'none',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.32)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
            title="Shopping Cart"
          >
            <CartIcon size={20} color="#fff" />
            {cartCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-3px',
                  right: '-3px',
                  backgroundColor: '#f31e1e',
                  color: '#fff',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  border: '2px solid #f58220',
                  minWidth: '18px',
                  textAlign: 'center'
                }}
              >
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Account / Auth Section */}
          <div style={{ position: 'relative' }}>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    padding: '7px 14px',
                    borderRadius: '25px',
                    color: '#fff',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}
                >
                  <UserIcon size={16} color="#fff" />
                  <span style={{ maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown size={12} color="#fff" />
                </button>

                {showUserMenu && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '45px',
                      right: 0,
                      backgroundColor: '#fff',
                      borderRadius: '12px',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.18)',
                      minWidth: '210px',
                      overflow: 'hidden',
                      zIndex: 1000,
                      border: '1px solid #eee'
                    }}
                    onMouseLeave={() => setShowUserMenu(false)}
                  >
                    <div style={{ padding: '14px 16px', borderBottom: '1px solid #f0f0f0', backgroundColor: '#fafafa' }}>
                      <div style={{ fontWeight: '600', color: '#333', fontSize: '14px' }}>{user.name}</div>
                      <div style={{ fontSize: '12px', color: '#777' }}>{user.email}</div>
                      <span style={{
                        display: 'inline-block',
                        marginTop: '5px',
                        fontSize: '10px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        backgroundColor: isVendor ? '#e8f5e9' : '#e3f2fd',
                        color: isVendor ? '#2e7d32' : '#1565c0'
                      }}>
                        {user.role} {user.shopName ? `• ${user.shopName}` : ''}
                      </span>
                    </div>

                    {isVendor ? (
                      <Link
                        to="/vendor/dashboard"
                        onClick={() => setShowUserMenu(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '12px 16px',
                          color: '#333',
                          fontSize: '14px',
                          fontWeight: '500',
                          borderBottom: '1px solid #f0f0f0'
                        }}
                      >
                        <PackageIcon size={16} color="#555" />
                        <span>Vendor Dashboard</span>
                      </Link>
                    ) : (
                      <Link
                        to="/student/dashboard"
                        onClick={() => setShowUserMenu(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '12px 16px',
                          color: '#333',
                          fontSize: '14px',
                          fontWeight: '500',
                          borderBottom: '1px solid #f0f0f0'
                        }}
                      >
                        <PackageIcon size={16} color="#555" />
                        <span>My Orders & Profile</span>
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                        navigate('/');
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '12px 16px',
                        color: '#d32f2f',
                        fontSize: '14px',
                        fontWeight: '500',
                        background: 'none',
                        textAlign: 'left',
                        cursor: 'pointer'
                      }}
                    >
                      <LogoutIcon size={16} color="#d32f2f" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link
                  to="/login"
                  style={{
                    backgroundColor: '#fff',
                    color: '#f58220',
                    padding: '7px 18px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '600',
                    textDecoration: 'none',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                  }}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: '#fff',
                    padding: '7px 16px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '600',
                    textDecoration: 'none',
                    border: '1px solid rgba(255,255,255,0.5)'
                  }}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
      <DiscountTicker />
    </>
  );
};
