import axiosInstance from './axios';

export interface CreateAgreementDto {
  title: string;
  content: string;
  condition: string;
  partnerId: string;
  authorSignature?: string;
  coupleId?: string;
}

export interface SignAgreementDto {
  signature: string;
  signedAt: string;
}

export interface UpdateAgreementStatusDto {
  status: 'pending' | 'signed' | 'completed' | 'cancelled';
}

export interface Agreement {
  id: string;
  title: string;
  content: string;
  condition: string;
  authorId: string;
  partnerId: string;
  coupleId?: string;
  authorSignature: string;
  partnerSignature?: string | null;
  status: string;
  agreementHash?: string | null;
  qrCodeData?: string | null;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    nickname: string;
    email: string;
  };
  partner: {
    id: string;
    nickname: string;
    email: string;
  };
}

export const agreementApi = {
  // 합의서 생성
  create: async (data: CreateAgreementDto): Promise<Agreement> => {
    const response = await axiosInstance.post('/agreements', data);
    return response.data;
  },

  // 모든 합의서 조회
  findAll: async (): Promise<Agreement[]> => {
    const response = await axiosInstance.get('/agreements');
    return response.data;
  },

  // 내 합의서 조회
  findMyAgreements: async (): Promise<Agreement[]> => {
    const response = await axiosInstance.get('/agreements/my');
    return response.data;
  },

  // 합의서 상세 조회
  findOne: async (id: string): Promise<Agreement> => {
    const response = await axiosInstance.get(`/agreements/${id}`);
    return response.data;
  },

  // 합의서 서명
  signAgreement: async (id: string, data: SignAgreementDto): Promise<Agreement> => {
    const response = await axiosInstance.put(`/agreements/${id}/sign`, data);
    return response.data;
  },

  // 합의서 상태 변경
  updateStatus: async (id: string, data: UpdateAgreementStatusDto): Promise<Agreement> => {
    const response = await axiosInstance.put(`/agreements/${id}/status`, data);
    return response.data;
  },
}; 