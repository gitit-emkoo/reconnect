import React from 'react';
import { Navigate } from 'react-router-dom';
import { ProfileEdit } from '../components/Profile/ProfileEdit';
import useAuthStore from '../store/authStore';
import type { User } from '../types/user';

export const ProfileEditPage: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleUpdateSuccess = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileEdit user={user as User} onUpdateSuccess={handleUpdateSuccess} />
    </div>
  );
}; 