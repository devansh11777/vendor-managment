import React, { useState } from 'react';
import { BrandLogo } from '../components/Icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const loggedUser = await login(email, password);
      const destination = location.state?.from?.pathname || (loggedUser.role === 'vendor' ? '/vendor/dashboard' : '/category/personal-care');
      navigate(destination, { replace: true });
    } catch (err) {
      // toast in AuthContext handles message
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (role) => {
    if (role === 'student') {
      setEmail('student@lpu.in');
      setPassword('password123');
    } else {
      setEmail('whsmith@lpu.in');
      setPassword('password123');
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFE5B4, #ff4b2b)',
      fontFamily: "'Poppins', sans-serif",
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.22)',
        backdropFilter: 'blur(12px)',
        padding: '40px 35px',
        borderRadius: '20px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center',
        border: '2px solid rgba(255, 255, 255, 0.35)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{ fontSize: '38px', marginBottom: '8px' }}></div>
        <h2 style={{
          marginBottom: '20px',
          color: '#fff',
          fontSize: '26px',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          textShadow: '1px 1px 4px rgba(0,0,0,0.2)'
        }}>
          Welcome Back!
        </h2>

        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <input
            type="email"
            placeholder="Email (e.g. student@lpu.in)"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '92%',
              padding: '13px 18px',
              margin: '10px 0',
              border: 'none',
              borderRadius: '30px',
              fontSize: '15px',
              textAlign: 'center',
              outline: 'none',
              background: 'rgba(255, 255, 255, 0.35)',
              color: '#222',
              fontWeight: '500',
              transition: 'all 0.3s'
            }}
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '92%',
              padding: '13px 18px',
              margin: '10px 0',
              border: 'none',
              borderRadius: '30px',
              fontSize: '15px',
              textAlign: 'center',
              outline: 'none',
              background: 'rgba(255, 255, 255, 0.35)',
              color: '#222',
              fontWeight: '500',
              transition: 'all 0.3s'
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '92%',
              marginTop: '18px',
              padding: '13px',
              border: 'none',
              background: 'linear-gradient(45deg, #ff512f, #dd2476)',
              color: 'white',
              borderRadius: '30px',
              fontSize: '17px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              transition: 'all 0.3s',
              boxShadow: '0 4px 15px rgba(255, 81, 47, 0.5)'
            }}
          >
            {loading ? 'Logging In...' : 'Login'}
          </button>
        </form>

        <div style={{ marginTop: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Link to="/signup" style={{ color: '#fff', fontSize: '14px', textDecoration: 'none', fontWeight: '500' }}>
            Don't have an account? <span style={{ textDecoration: 'underline', fontWeight: '600' }}>Create an Account</span>
          </Link>
          <Link to="/" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', textDecoration: 'none' }}>
            �  Back to Home
          </Link>
        </div>

        {/* Demo Fast Fill Buttons */}
        <div style={{ marginTop: '22px', borderTop: '1px solid rgba(255,255,255,0.3)', paddingTop: '15px', width: '100%' }}>
          <div style={{ color: '#fff', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>Quick Demo Login:</div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={() => handleQuickLogin('student')}
              style={{
                backgroundColor: 'rgba(255,255,255,0.3)',
                color: '#fff',
                padding: '6px 14px',
                borderRadius: '15px',
                fontSize: '12px',
                fontWeight: '600'
              }}
            >
               Student Demo
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('vendor')}
              style={{
                backgroundColor: 'rgba(255,255,255,0.3)',
                color: '#fff',
                padding: '6px 14px',
                borderRadius: '15px',
                fontSize: '12px',
                fontWeight: '600'
              }}
            >
              � � Vendor Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
