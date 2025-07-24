/**
 * [프론트엔드] userService.ts
 * - 이 파일은 "백엔드 API에 요청을 보내는 함수"들을 모아둔 서비스입니다.
 * - 실제 데이터 처리(비밀번호 변경, DB 저장 등)는 백엔드에서 이루어집니다.
 * - 예: 비밀번호 변경, 내 정보 조회, 닉네임 변경 등 API 호출 함수 제공
 */
import type { User, ProfileUpdateResponse, PasswordChangeResponse, PasswordChangeData } from '../types/user';
import { getAuthToken } from '../utils/auth';
import axiosInstance from '../api/axios';

const API_URL = import.meta.env.VITE_APP_API_URL || 'https://reconnect-backend.onrender.com';

export const userService = {
  // 프로필 수정
  updateProfile: async (nickname: string): Promise<ProfileUpdateResponse> => {
    try {
      const { data } = await axiosInstance.patch('/users/me', { nickname }); // ⚠️ 이 API 경로는 백엔드와 반드시 맞춰야 하므로, 절대 임의로 수정하지 마세요!
      return {
        success: true,
        data: data
      };
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

  // 프로필 이미지 업데이트
  updateProfileImage: async (profileImageUrl: string): Promise<ProfileUpdateResponse> => {
    try {
      const { data } = await axiosInstance.patch('/users/me/profile-image', { profileImageUrl });
      return {
        success: true,
        data: data
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'REQUEST_FAILED',
          message: '프로필 이미지 업데이트에 실패했습니다.'
        }
      };
    }
  },

  // 랜덤 아바타 생성 (클라이언트에서 직접 처리하므로 제거)
  // generateRandomAvatar: async (): Promise<ProfileUpdateResponse> => {
  //   try {
  //     const { data } = await axiosInstance.post('/users/me/generate-avatar');
  //     return {
  //       success: true,
  //       data: data
  //     };
  //   } catch (error) {
  //     return {
  //       success: false,
  //       error: {
  //         code: 'REQUEST_FAILED',
  //         message: '랜덤 아바타 생성에 실패했습니다.'
  //       }
  //     };
  //   }
  // },

  // 비밀번호 변경
  changePassword: async (passwordData: PasswordChangeData): Promise<PasswordChangeResponse> => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/api/users/me/password`, {
        method: 'PATCH',
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
  },

  // 구독 시작
  startSubscription: async () => {
    try {
      const { data } = await axiosInstance.post('/users/me/subscribe');
      return data;
    } catch (error) {
      throw new Error('구독 시작에 실패했습니다.');
    }
  },

  // 구독 취소
  cancelSubscription: async () => {
    try {
      const { data } = await axiosInstance.delete('/users/me/subscribe');
      return data;
    } catch (error) {
      throw new Error('구독 취소에 실패했습니다.');
    }
  }
}; 