import axiosInstance from './axios';

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
    const response = await axiosInstance.post<PartnerInvite>('/partner-invites');
    return response.data;
  },

  // 초대 코드로 응답
  respondToInvite: async (code: string): Promise<PartnerInvite> => {
    const response = await axiosInstance.post<PartnerInvite>('/partner-invites/respond', { code });
    return response.data;
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
    const response = await axiosInstance.get<PartnerInvite[]>('/partner-invites/me');
    return response.data;
  }
}; 