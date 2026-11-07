import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, vendorOnly = false, studentOnly = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (vendorOnly && user.role !== 'vendor') {
    return <Navigate to="/" replace />;
  }

  if (studentOnly && user.role !== 'student') {
    return <Navigate to="/" replace />;
  }

  return children;
};
