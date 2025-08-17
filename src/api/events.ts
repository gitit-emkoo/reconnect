import axiosInstance from './axios';

export const EVENT_KEY = 'event-001'; // 필요 시 변경

export const eventsApi = {
  enter: async (eventKey: string = EVENT_KEY) => {
    const { data } = await axiosInstance.post('/events/entry', { eventKey });
    return data;
  },
  listEntries: async (eventKey: string = EVENT_KEY) => {
    const { data } = await axiosInstance.get('/events/entries', { params: { eventKey } });
    return data as { success: boolean; entries: Array<{ id: string; createdAt: string; user: { id: string; nickname: string; email: string; profileImageUrl?: string } }> };
  }
};


