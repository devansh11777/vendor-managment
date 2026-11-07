import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BrandLogo, ShieldCheckIcon, ClockIcon, CompareIcon, TagIcon } from '../components/Icons';

export const LandingPage = () => {
  const { user } = useAuth();

  return (
    <div style={{
      fontFamily: "'Roboto', sans-serif",
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #1e272e, #009473)',
      position: 'relative',
      overflow: 'hidden',
      padding: '20px'
    }}>
      {/* Top Bar with Branding & Navigation */}
      <header style={{
        position: 'absolute',
        top: '20px',
        left: '40px',
        right: '40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <BrandLogo size={36} />
          <div>
            <h1 style={{ fontFamily: 'Bangers, cursive', color: '#fff', fontSize: '30px', letterSpacing: '1.5px', margin: 0, textShadow: '2px 2px 8px rgba(0,0,0,0.4)' }}>
              LPU KART
            </h1>
            <p style={{ color: '#d2dae2', fontSize: '11px', margin: 0, letterSpacing: '1px', textTransform: 'uppercase', fontWeight: '500' }}>
              Centralized Campus Marketplace
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link
            to="/category/personal-care"
            style={{
              color: '#fff',
              backgroundColor: 'rgba(255,255,255,0.12)',
              padding: '8px 18px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.2)',
              transition: 'all 0.2s'
            }}
          >
            Personal Care
          </Link>
          <Link
            to="/category/all"
            style={{
              color: '#fff',
              backgroundColor: 'rgba(255,255,255,0.12)',
              padding: '8px 18px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.2)',
              transition: 'all 0.2s'
            }}
          >
            All Products
          </Link>
          {user ? (
            <Link
              to={user.role === 'vendor' ? '/vendor/dashboard' : '/student/dashboard'}
              style={{
                backgroundColor: '#f58220',
                color: '#fff',
                padding: '8px 22px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(245, 130, 32, 0.4)'
              }}
            >
              {user.role === 'vendor' ? 'Vendor Portal' : 'My Dashboard'}
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  color: '#fff',
                  backgroundColor: 'rgba(255,255,255,0.18)',
                  padding: '8px 20px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  border: '1px solid rgba(255,255,255,0.3)'
                }}
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                style={{
                  backgroundColor: '#f58220',
                  color: '#fff',
                  padding: '8px 22px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  boxShadow: '0 4px 14px rgba(245, 130, 32, 0.45)'
                }}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Main Glassmorphic Container  */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '94%',
        maxWidth: '1250px',
        height: '75vh',
        padding: '30px',
        boxShadow: '0 12px 50px rgba(0, 0, 0, 0.5)',
        borderRadius: '35px',
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(20px)',
        position: 'relative',
        marginTop: '60px',
        border: '1px solid rgba(255,255,255,0.15)'
      }}>
        {/* Left Box: FOOD */}
        <Link
          to="/category/food"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '46%',
            height: '92%',
            background: 'linear-gradient(145deg, #dfe6e9, #b2bec3)',
            borderRadius: '28px',
            border: '2px solid rgba(255,255,255,0.4)',
            boxShadow: '0 12px 35px rgba(0, 0, 0, 0.4)',
            position: 'relative',
            overflow: 'hidden',
            textDecoration: 'none',
            cursor: 'pointer',
            transition: 'transform 0.4s ease-in-out, box-shadow 0.4s ease-in-out'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.04) rotate(2deg)';
            e.currentTarget.style.boxShadow = '0 18px 50px rgba(0,0,0,0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
            e.currentTarget.style.boxShadow = '0 12px 35px rgba(0,0,0,0.4)';
          }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            src="/assets/videos/khana.webm"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.35,
              zIndex: 1
            }}
          />

          <div style={{ zIndex: 2, textAlign: 'center' }}>
            <h2 style={{
              fontFamily: "'Bangers', cursive",
              color: '#0e7e68',
              fontSize: '85px',
              letterSpacing: '0.15cm',
              textShadow: '2px 2px 12px rgba(0, 0, 0, 0.5)',
              margin: 0
            }}>
              FOOD
            </h2>
            <div style={{
              color: '#1e272e',
              fontWeight: '600',
              fontSize: '14px',
              backgroundColor: 'rgba(255,255,255,0.85)',
              padding: '6px 20px',
              borderRadius: '20px',
              display: 'inline-block',
              marginTop: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              Hostel Canteens • Food Courts • Daily Meals
            </div>
          </div>
        </Link>

        {/* Right Box: STATIONARY */}
        <Link
          to="/category/stationary"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '46%',
            height: '92%',
            background: 'linear-gradient(145deg, #2d3436, #485460)',
            borderRadius: '28px',
            border: '2px solid rgba(255,255,255,0.2)',
            boxShadow: '0 12px 35px rgba(0, 0, 0, 0.5)',
            position: 'relative',
            overflow: 'hidden',
            textDecoration: 'none',
            cursor: 'pointer',
            transition: 'transform 0.4s ease-in-out, box-shadow 0.4s ease-in-out'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.04) rotate(2deg)';
            e.currentTarget.style.boxShadow = '0 18px 50px rgba(0,0,0,0.7)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
            e.currentTarget.style.boxShadow = '0 12px 35px rgba(0,0,0,0.5)';
          }}
        >
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: "url('https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=900&auto=format&fit=crop')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.22,
            zIndex: 1
          }} />

          <div style={{ zIndex: 2, textAlign: 'center' }}>
            <h2 style={{
              fontFamily: "'Bangers', cursive",
              color: '#ff5e57',
              fontSize: '85px',
              letterSpacing: '0.15cm',
              textShadow: '2px 2px 12px rgba(0, 0, 0, 0.6)',
              margin: 0
            }}>
              STATIONARY
            </h2>
            <div style={{
              color: '#fff',
              fontWeight: '600',
              fontSize: '14px',
              backgroundColor: 'rgba(0,0,0,0.55)',
              padding: '6px 20px',
              borderRadius: '20px',
              display: 'inline-block',
              marginTop: '12px',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              Lab Manuals • Drawing Kits • Books • WH-Smith
            </div>
          </div>
        </Link>
      </div>

      {/* Feature Highlights Footer with clean SVGs */}
      <footer style={{
        marginTop: '25px',
        display: 'flex',
        gap: '30px',
        color: '#d2dae2',
        fontSize: '13px',
        zIndex: 10,
        fontWeight: '500'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheckIcon size={16} color="#00d8d6" />
          <span>Live Stock Availability Tracking</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TagIcon size={16} color="#ff5e57" />
          <span>Instant Discount Notifications</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CompareIcon size={16} color="#ffd32a" />
          <span>Campus Price Comparison</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ClockIcon size={16} color="#0be881" />
          <span>Synchronized in Seconds</span>
        </div>
      </footer>
    </div>
  );
};
