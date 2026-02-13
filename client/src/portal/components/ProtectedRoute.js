import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="portal-loading">
        <div className="portal-loading__spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/portal/login" replace />;

  if (requiredRole && profile?.role !== requiredRole) {
    return <Navigate to="/portal/dashboard" replace />;
  }

  return children;
}
