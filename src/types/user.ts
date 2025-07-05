export interface User {
  id: string;
  email: string;
  nickname: string;
  profileImageUrl?: string;
  anniversary?: string;
  birthdate?: string;
  partnerId?: string | null;
  partner?: User;
  coupleId?: string | null;
  couple?: {
    id: string;
    createdAt: string;
  } | null;
  temperature?: number;
  provider?: 'EMAIL' | 'KAKAO' | 'GOOGLE';
  socialId?: string;
  createdAt?: string;
  updatedAt?: string;
  role?: 'USER' | 'ADMIN';
  socialProvider: string | null;
  subscriptionStatus?: 'FREE' | 'SUBSCRIBED';
  subscriptionStartedAt?: string;
}

export interface ProfileUpdateResponse {
  success: boolean;
  data?: User;
  error?: {
    code: string;
    message: string;
  };
}

export interface PasswordChangeResponse {
  success: boolean;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

export interface UserProfile {
  // ... existing code ...
} 