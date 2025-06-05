export interface User {
  id: string;
  email: string;
  nickname: string;
  profileImageUrl?: string;
  anniversary?: string;
  birthdate?: string;
  partner?: {
    id: string;
    nickname: string;
    email: string;
    imageUrl?: string;
  };
  provider: 'EMAIL' | 'KAKAO' | 'GOOGLE';
  socialId?: string;
  createdAt: string;
  updatedAt: string;
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