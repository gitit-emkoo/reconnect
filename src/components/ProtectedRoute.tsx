import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import LoadingSpinner from './common/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  const isLoading = false;

  if (isLoading) {
    return <LoadingSpinner size={48} />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 