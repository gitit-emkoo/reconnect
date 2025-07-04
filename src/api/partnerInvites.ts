import axiosInstance from './axios';
import useAuthStore from '../store/authStore';
import { User } from '../types/user';

// 린트 에러를 해결하기 위해 타입을 다시 파일 내에 정의합니다.
export interface PartnerInvite {
  id: string;
  code: string;
  status: 'PENDING' | 'RESPONDED' | 'CONFIRMED' | 'REJECTED' | 'EXPIRED';
  createdAt: string;
  updatedAt: string;
  inviter: {
    id: string;
    nickname: string;
    profileImageUrl?: string;
  };
  invitee?: {
    id: string;
    nickname: string;
    profileImageUrl?: string;
  };
}

export const partnerInvitesApi = {
  // 초대 코드 생성
  createInviteCode: async (): Promise<PartnerInvite> => {
    const accessToken = useAuthStore.getState().accessToken;
    if (!accessToken) {
      throw new Error('No token found');
    }
    console.log('[partnerInvitesApi.createInviteCode] accessToken:', accessToken);
    console.log('[partnerInvitesApi.createInviteCode] axiosInstance default headers:', axiosInstance.defaults.headers);
    const { data } = await axiosInstance.post<PartnerInvite>('/partner-invites');
    console.log('[partnerInvitesApi.createInviteCode] response:', data);
    return data;
  },

  // 초대 코드로 응답
  respondToInvite: async (code: string): Promise<{ inviter: User; invitee: User; inviterToken: string; inviteeToken: string }> => {
    const { data } = await axiosInstance.post('/partner-invites/respond', { code });
    return data;
  },

  // 초대 거절
  rejectInvite: async (inviteId: string): Promise<PartnerInvite> => {
    const response = await axiosInstance.post<PartnerInvite>(
      `/partner-invites/${inviteId}/reject`
    );
    return response.data;
  },

  // 내 초대 현황 조회
  getMyInvites: async (): Promise<PartnerInvite[]> => {
    const accessToken = useAuthStore.getState().accessToken;
    if (!accessToken) {
      throw new Error('No token found');
    }
    console.log('[partnerInvitesApi.getMyInvites] accessToken:', accessToken);
    // axiosInstance의 Authorization 헤더 확인
    console.log('[partnerInvitesApi.getMyInvites] axiosInstance default headers:', axiosInstance.defaults.headers);
    try {
      const { data } = await axiosInstance.get<PartnerInvite[]>('/partner-invites/me');
      console.log('[partnerInvitesApi.getMyInvites] response:', data);
      return data;
    } catch (err) {
      console.error('[partnerInvitesApi.getMyInvites] error:', err);
      throw err;
    }
  }
}; 