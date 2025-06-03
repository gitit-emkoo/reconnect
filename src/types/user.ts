export interface User {
  id: number;
  email: string;
  nickname: string;
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