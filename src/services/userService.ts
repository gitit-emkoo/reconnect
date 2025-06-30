import type { User, ProfileUpdateResponse, PasswordChangeResponse, PasswordChangeData } from '../types/user';
import { getAuthToken } from '../utils/auth';
import axiosInstance from '../api/axios';

const API_URL = import.meta.env.VITE_APP_API_URL || 'https://reconnect-backend.onrender.com';

export const userService = {
  // 프로필 수정
  updateProfile: async (nickname: string): Promise<ProfileUpdateResponse> => {
    try {
      const { data } = await axiosInstance.put('/users/profile', { nickname });
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
  },

  async getMyProfile(): Promise<User> {
    const { data } = await axiosInstance.get('/users/me');
    return data;
  },

  async getMyTemperature(): Promise<{ temperature: number }> {
    const { data } = await axiosInstance.get('/users/me/temperature');
    return data;
  },

  updateFcmToken: async (fcmToken: string) => {
    try {
      await axiosInstance.post('/users/fcm-token', { fcmToken });
    } catch (error) {
      console.error('FCM 토큰 업데이트에 실패했습니다:', error);
    }
  }
}; 