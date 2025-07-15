import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axiosInstance from '../api/axios';
import { User } from '../types/user';

// 파트너 정보를 위한 타입
export interface Partner {
  id: string;
  nickname: string;
  imageUrl?: string;
}

export interface AuthState {
  user: User | null;
  partner: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, accessToken: string) => void;
  logout: () => void;
  setAuth: (accessToken: string | null, user: User | null) => void;
  checkAuth: (options?: { silent?: boolean }) => Promise<void>;
  setUser: (user: User | null) => void;
  clearAuth: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      partner: null,
      accessToken: localStorage.getItem('accessToken'),
      isAuthenticated: false,
      isLoading: true,
      
      setAuth: (accessToken, user) => {
        if (accessToken) {
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          localStorage.setItem('accessToken', accessToken);
          set({ user, accessToken, partner: user?.partner ?? null, isAuthenticated: true, isLoading: false });
          console.log('[AuthStore] 로그인 성공 - user:', user);
        } else {
          delete axiosInstance.defaults.headers.common['Authorization'];
          localStorage.removeItem('accessToken');
          set({ user: null, accessToken: null, partner: null, isAuthenticated: false, isLoading: false });
        }
      },

      logout: () => {
        get().setAuth(null, null);
      },
      
      checkAuth: async () => {
        const accessToken = get().accessToken;
        if (!accessToken) {
          set({ isLoading: false, user: null, partner: null });
          return;
        }
        try {
          const { data: user } = await axiosInstance.get<User>('/users/me');
          set({ user, partner: user.partner ?? null, isLoading: false });
        } catch (error) {
          console.error('Authentication check failed', error);
          set({ isLoading: false, user: null, partner: null, accessToken: null });
          localStorage.removeItem('accessToken');
        }
      },

      setUser: (user) => {
        set({ user, partner: user?.partner ?? null });
        console.log('[AuthStore] 유저 정보 업데이트 - user:', user);
      },

      clearAuth: () => {
        localStorage.removeItem('accessToken');
        set({ user: null, accessToken: null, partner: null });
      },

      login: (user, accessToken) => {
        set({ user, accessToken, isAuthenticated: true });
      },
    }),
    {
      name: 'reconnect-auth-storage',
      partialize: (state) => ({ accessToken: state.accessToken }),
    }
  )
);

export default useAuthStore; 
