import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { ProfileEdit } from '../components/Profile/ProfileEdit';
import { AuthContext } from '../contexts/AuthContext';
import type { User } from '../types/user';

export const ProfileEditPage: React.FC = () => {
  const { user, setUser } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleUpdateSuccess = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileEdit user={user} onUpdateSuccess={handleUpdateSuccess} />
    </div>
  );
}; 