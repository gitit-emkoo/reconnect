import { ADMIN_CONFIG } from '../config/admin';

export const isUserAdmin = (email?: string): boolean => {
  if (!email) return false;
  return ADMIN_CONFIG.isAdmin(email);
}; 