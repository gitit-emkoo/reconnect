import axiosInstance from './axios';

export interface CreateSupportDto {
  title: string;
  content: string;
  type: 'general' | 'technical' | 'billing' | 'feature_request' | 'bug_report';
  attachmentUrl?: string;
}

export interface SupportInquiry {
  id: number;
  title: string;
  content: string;
  type: 'general' | 'technical' | 'billing' | 'feature_request' | 'bug_report';
  attachmentUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export const supportApi = {
  createInquiry: async (data: CreateSupportDto) => {
    const response = await axiosInstance.post('/support/inquiry', data);
    return response.data;
  },
  
  getMyInquiries: async (): Promise<SupportInquiry[]> => {
    const response = await axiosInstance.get('/support/my-inquiries');
    return response.data;
  },
}; 