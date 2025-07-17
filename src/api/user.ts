import axiosInstance from './axios';

// 관리자용 API 함수들
export const adminApi = {
  // 모든 유저 조회
  getAllUsers: async (params: { page?: number; limit?: number; search?: string }) => {
    const response = await axiosInstance.get('/users/admin/all', { params });
    return response.data;
  },

  // 유저 상세 정보 조회
  getUserById: async (id: string) => {
    const response = await axiosInstance.get(`/users/admin/${id}`);
    return response.data;
  },

  // 유저 역할 변경
  updateUserRole: async (id: string, role: string) => {
    const response = await axiosInstance.patch(`/users/admin/${id}/role`, { role });
    return response.data;
  },

  // 유저 계정 상태 변경
  updateUserStatus: async (id: string, isActive: boolean) => {
    const response = await axiosInstance.patch(`/users/admin/${id}/status`, { isActive });
    return response.data;
  },
}; 