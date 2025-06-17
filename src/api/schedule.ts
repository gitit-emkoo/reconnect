import axios from './axios';

export interface Schedule {
  id: string;
  userId: string;
  date: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateScheduleRequest {
  date: string;
  content: string;
}

export interface UpdateScheduleRequest {
  date?: string;
  content?: string;
}

export const scheduleApi = {
  // 일정 생성
  create: async (data: CreateScheduleRequest): Promise<Schedule> => {
    const response = await axios.post('/schedules', data);
    return response.data;
  },

  // 사용자의 모든 일정 조회
  findAll: async (): Promise<Schedule[]> => {
    const response = await axios.get('/schedules');
    return response.data;
  },

  // 특정 일정 조회
  findOne: async (id: string): Promise<Schedule> => {
    const response = await axios.get(`/schedules/${id}`);
    return response.data;
  },

  // 일정 수정
  update: async (id: string, data: UpdateScheduleRequest): Promise<Schedule> => {
    const response = await axios.put(`/schedules/${id}`, data);
    return response.data;
  },

  // 일정 삭제
  remove: async (id: string): Promise<void> => {
    await axios.delete(`/schedules/${id}`);
  },

  // 특정 날짜의 일정 조회
  findByDate: async (date: string): Promise<Schedule[]> => {
    const response = await axios.get(`/schedules/date/${date}`);
    return response.data;
  },
}; 