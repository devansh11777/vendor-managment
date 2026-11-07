import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const SignupPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [role, setRole] = useState('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [enrollmentId, setEnrollmentId] = useState('');
  const [shopName, setShopName] = useState('');
  const [shopLocation, setShopLocation] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name,
        email,
        password,
        role,
        enrollmentId: role === 'student' ? enrollmentId : '',
        shopName: role === 'vendor' ? shopName : '',
        shopLocation: role === 'vendor' ? shopLocation : ''
      };

      const newUser = await register(payload);
      if (newUser.role === 'vendor') {
        navigate('/vendor/dashboard');
      } else {
        navigate('/category/personal-care');
      }
    } catch (err) {
      // toast in AuthContext handles
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFB6C1, #928dab)',
      fontFamily: "'Poppins', sans-serif",
      padding: '30px 20px'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.22)',
        backdropFilter: 'blur(12px)',
        padding: '35px 30px',
        borderRadius: '20px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
        width: '100%',
        maxWidth: '430px',
        textAlign: 'center',
        border: '2px solid rgba(255, 255, 255, 0.35)'
      }}>
        <h2 style={{
          marginBottom: '15px',
          color: '#fff',
          fontSize: '26px',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          Create Account
        </h2>

        {/* Role toggle tabs */}
        <div style={{
          display: 'flex',
          background: 'rgba(255,255,255,0.3)',
          borderRadius: '25px',
          padding: '4px',
          marginBottom: '18px',
          width: '92%'
        }}>
          <button
            type="button"
            onClick={() => setRole('student')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: '600',
              backgroundColor: role === 'student' ? '#fff' : 'transparent',
              color: role === 'student' ? '#f58220' : '#fff'
            }}
          >
             Student
          </button>
          <button
            type="button"
            onClick={() => setRole('vendor')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: '600',
              backgroundColor: role === 'vendor' ? '#fff' : 'transparent',
              color: role === 'vendor' ? '#f58220' : '#fff'
            }}
          >
            � � Campus Vendor
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <input
            type="text"
            placeholder="Full Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: '92%',
              padding: '11px 16px',
              margin: '7px 0',
              border: 'none',
              borderRadius: '30px',
              fontSize: '14px',
              textAlign: 'center',
              outline: 'none',
              background: 'rgba(255, 255, 255, 0.35)',
              color: '#222',
              fontWeight: '500'
            }}
          />

          <input
            type="email"
            placeholder="Email Address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '92%',
              padding: '11px 16px',
              margin: '7px 0',
              border: 'none',
              borderRadius: '30px',
              fontSize: '14px',
              textAlign: 'center',
              outline: 'none',
              background: 'rgba(255, 255, 255, 0.35)',
              color: '#222',
              fontWeight: '500'
            }}
          />

          {role === 'student' ? (
            <input
              type="text"
              placeholder="Registration / Enrollment ID (e.g. 12109845)"
              value={enrollmentId}
              onChange={(e) => setEnrollmentId(e.target.value)}
              style={{
                width: '92%',
                padding: '11px 16px',
                margin: '7px 0',
                border: 'none',
                borderRadius: '30px',
                fontSize: '14px',
                textAlign: 'center',
                outline: 'none',
                background: 'rgba(255, 255, 255, 0.35)',
                color: '#222',
                fontWeight: '500'
              }}
            />
          ) : (
            <>
              <input
                type="text"
                placeholder="Shop Name (e.g. BH-6 WH-Smith)"
                required
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                style={{
                  width: '92%',
                  padding: '11px 16px',
                  margin: '7px 0',
                  border: 'none',
                  borderRadius: '30px',
                  fontSize: '14px',
                  textAlign: 'center',
                  outline: 'none',
                  background: 'rgba(255, 255, 255, 0.35)',
                  color: '#222',
                  fontWeight: '500'
                }}
              />
              <input
                type="text"
                placeholder="Shop Location (e.g. Block 34, BH-6)"
                required
                value={shopLocation}
                onChange={(e) => setShopLocation(e.target.value)}
                style={{
                  width: '92%',
                  padding: '11px 16px',
                  margin: '7px 0',
                  border: 'none',
                  borderRadius: '30px',
                  fontSize: '14px',
                  textAlign: 'center',
                  outline: 'none',
                  background: 'rgba(255, 255, 255, 0.35)',
                  color: '#222',
                  fontWeight: '500'
                }}
              />
            </>
          )}

          <input
            type="password"
            placeholder="Password (min 6 chars)"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '92%',
              padding: '11px 16px',
              margin: '7px 0',
              border: 'none',
              borderRadius: '30px',
              fontSize: '14px',
              textAlign: 'center',
              outline: 'none',
              background: 'rgba(255, 255, 255, 0.35)',
              color: '#222',
              fontWeight: '500'
            }}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{
              width: '92%',
              padding: '11px 16px',
              margin: '7px 0',
              border: 'none',
              borderRadius: '30px',
              fontSize: '14px',
              textAlign: 'center',
              outline: 'none',
              background: 'rgba(255, 255, 255, 0.35)',
              color: '#222',
              fontWeight: '500'
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '92%',
              padding: '12px',
              marginTop: '15px',
              border: 'none',
              background: 'linear-gradient(45deg, #ff512f, #dd2476)',
              color: 'white',
              borderRadius: '30px',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              boxShadow: '0 4px 12px rgba(255, 81, 47, 0.5)'
            }}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div style={{ marginTop: '16px' }}>
          <Link to="/login" style={{ color: '#fff', fontSize: '14px', textDecoration: 'none' }}>
            Already have an account? <span style={{ textDecoration: 'underline', fontWeight: '600' }}>Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
