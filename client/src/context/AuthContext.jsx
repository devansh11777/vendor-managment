import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('lpukart_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('lpukart_token') || null);
  const [loading, setLoading] = useState(true);

  // Set default axios authorization header whenever token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('lpukart_token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('lpukart_token');
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem('lpukart_user', JSON.stringify(res.data.user));
      toast.success(`Welcome back, ${res.data.user.name}!`);
      return res.data.user;
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check credentials.';
      toast.error(msg);
      throw new Error(msg);
    }
  };

  const register = async (userData) => {
    try {
      const res = await axios.post('/api/auth/register', userData);
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem('lpukart_user', JSON.stringify(res.data.user));
      toast.success('Registration successful!');
      return res.data.user;
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      toast.error(msg);
      throw new Error(msg);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('lpukart_user');
    localStorage.removeItem('lpukart_token');
    toast.success('Logged out successfully');
  };

  const isVendor = user?.role === 'vendor';
  const isStudent = user?.role === 'student';

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isVendor, isStudent }}>
      {children}
    </AuthContext.Provider>
  );
};
