import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axiosInstance from '../api/axios';
import { User } from '../types/user';
import axios from 'axios';

// 쿠키 관련 유틸리티 함수
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

const setCookie = (name: string, value: string, days: number = 90) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

const removeCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

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
      accessToken: getCookie('accessToken'),
      isAuthenticated: false,
      isLoading: true,
      
      setAuth: (accessToken, user) => {
        if (accessToken) {
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          setCookie('accessToken', accessToken);
          set({ user, accessToken, partner: user?.partner ?? null, isAuthenticated: true, isLoading: false });
        } else {
          delete axiosInstance.defaults.headers.common['Authorization'];
          removeCookie('accessToken');
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
          const response = await Promise.race([
            axiosInstance.get<User>('/users/me', { timeout: 5000 }),
            new Promise<never>((_, reject) => 
              setTimeout(() => reject(new Error('Auth check timeout')), 5000)
            )
          ]) as { data: User };
          set({ user: response.data, partner: response.data.partner ?? null, isLoading: false });
        } catch (error) {
          console.error('Authentication check failed', error);
          // 토큰이 만료된 경우에만 삭제, 네트워크 에러는 유지
          if (axios.isAxiosError(error) && error.response?.status === 401) {
            set({ isLoading: false, user: null, partner: null, accessToken: null });
            removeCookie('accessToken');
          } else {
            // 네트워크 에러 등은 토큰을 유지하고 로딩만 false로
            set({ isLoading: false });
          }
        }
      },

      setUser: (user) => {
        set({ user, partner: user?.partner ?? null });
      },

      clearAuth: () => {
        removeCookie('accessToken');
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
