import type { ProfileUpdateResponse, PasswordChangeResponse, PasswordChangeData } from '../types/user';
import { getAuthToken } from '../utils/auth';

const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:3000';

export const userService = {
  // 프로필 수정
  updateProfile: async (nickname: string): Promise<ProfileUpdateResponse> => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nickname })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'REQUEST_FAILED',
          message: '프로필 수정 요청에 실패했습니다.'
        }
      };
    }
  },

  // 비밀번호 변경
  changePassword: async (passwordData: PasswordChangeData): Promise<PasswordChangeResponse> => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/users/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(passwordData)
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'REQUEST_FAILED',
          message: '비밀번호 변경 요청에 실패했습니다.'
        }
      };
    }
  }
}; 