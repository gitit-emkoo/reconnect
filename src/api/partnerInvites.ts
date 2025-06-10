import axiosInstance from './axios';
import useAuthStore from '../store/authStore';

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
    console.log('[partnerInvitesApi.createInviteCode] accessToken:', accessToken);
    console.log('[partnerInvitesApi.createInviteCode] axiosInstance default headers:', axiosInstance.defaults.headers);
    try {
      const response = await axiosInstance.post<PartnerInvite>('/partner-invites');
      console.log('[partnerInvitesApi.createInviteCode] response:', response.data);
      return response.data;
    } catch (err) {
      console.error('[partnerInvitesApi.createInviteCode] error:', err);
      throw err;
    }
  },

  // 초대 코드로 응답
  respondToInvite: async (code: string): Promise<{ couple: any; invite: PartnerInvite }> => {
    const accessToken = useAuthStore.getState().accessToken;
    console.log('[partnerInvitesApi.respondToInvite] accessToken:', accessToken);
    console.log('[partnerInvitesApi.respondToInvite] axiosInstance default headers:', axiosInstance.defaults.headers);
    try {
      const response = await axiosInstance.post<{ couple: any; invite: PartnerInvite }>('/partner-invites/respond', { code });
      console.log('[partnerInvitesApi.respondToInvite] response:', response.data);
      return response.data;
    } catch (err) {
      console.error('[partnerInvitesApi.respondToInvite] error:', err);
      throw err;
    }
  },

  // 초대 수락
  acceptInvite: async (inviteId: string): Promise<{ couple: any; invite: PartnerInvite }> => {
    const response = await axiosInstance.post<{ couple: any; invite: PartnerInvite }>(
      `/partner-invites/${inviteId}/accept`
    );
    return response.data;
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
    console.log('[partnerInvitesApi.getMyInvites] accessToken:', accessToken);
    // axiosInstance의 Authorization 헤더 확인
    console.log('[partnerInvitesApi.getMyInvites] axiosInstance default headers:', axiosInstance.defaults.headers);
    try {
      const response = await axiosInstance.get<PartnerInvite[]>('/partner-invites/me');
      console.log('[partnerInvitesApi.getMyInvites] response:', response.data);
      return response.data;
    } catch (err) {
      console.error('[partnerInvitesApi.getMyInvites] error:', err);
      throw err;
    }
  }
}; 