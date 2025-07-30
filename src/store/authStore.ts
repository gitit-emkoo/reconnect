import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axiosInstance from '../api/axios';
import { User } from '../types/user';
import axios from 'axios';
import { getAuthToken, setAuthToken, removeAuthToken } from '../utils/cookies';

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
      accessToken: null, // 초기값을 null로 설정하고 checkAuth에서 설정
      isAuthenticated: false, // 초기값을 false로 설정
      isLoading: true,
      
      setAuth: (accessToken, user) => {
        if (accessToken) {
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          setAuthToken(accessToken);
          set({ user, accessToken, partner: user?.partner ?? null, isAuthenticated: true, isLoading: false });
        } else {
          delete axiosInstance.defaults.headers.common['Authorization'];
          removeAuthToken();
          set({ user: null, accessToken: null, partner: null, isAuthenticated: false, isLoading: false });
        }
      },

      logout: () => {
        get().setAuth(null, null);
      },
      
      checkAuth: async () => {
        // 쿠키에서 토큰을 다시 확인
        const accessToken = getAuthToken();
        
        if (!accessToken) {
          set({ isLoading: false, user: null, partner: null, accessToken: null, isAuthenticated: false });
          return;
        }
        
        // axios 헤더에 토큰 설정
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        
        try {
          const response = await Promise.race([
            axiosInstance.get<User>('/users/me', { timeout: 5000 }),
            new Promise<never>((_, reject) => 
              setTimeout(() => reject(new Error('Auth check timeout')), 5000)
            )
          ]) as { data: User };
          
          set({ 
            user: response.data, 
            partner: response.data.partner ?? null, 
            accessToken,
            isLoading: false, 
            isAuthenticated: true 
          });
        } catch (error) {
          console.error('Authentication check failed', error);
          if (axios.isAxiosError(error) && error.response?.status === 401) {
            set({ isLoading: false, user: null, partner: null, accessToken: null, isAuthenticated: false });
            removeAuthToken();
            delete axiosInstance.defaults.headers.common['Authorization'];
          } else {
            set({ isLoading: false });
          }
        }
      },

      setUser: (user) => {
        set({ user, partner: user?.partner ?? null });
      },

      clearAuth: () => {
        removeAuthToken();
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
