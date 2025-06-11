import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/user'; // 여기서 User 타입을 가져옵니다.
import axiosInstance from '../api/axios'; // axios 인스턴스 import

// 파트너 정보를 위한 타입
export interface Partner {
  id: string;
  nickname: string;
  imageUrl?: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  user: Partial<User> | null;
  accessToken: string | null;
  isLoading: boolean; // 로딩 상태 추가
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: Partial<User> | null) => void;
  setToken: (token: string, rememberMe: boolean) => void;
  checkAuth: () => Promise<void>; // restoreToken을 대체할 함수
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,
      accessToken: null,
      isLoading: true, // 초기 로딩 상태는 true
      login: (user, token) => {
        console.log('[authStore.login] token:', token, 'user:', user);
        get().setToken(token, true); 
        set({ isLoggedIn: true, user, isLoading: false });
        console.log('[authStore.login] after set:', get());
      },
      logout: () => {
        localStorage.removeItem('accessToken');
        sessionStorage.removeItem('accessToken');
        set({ isLoggedIn: false, user: null, accessToken: null, isLoading: false });
        console.log('[authStore.logout] after set:', get());
      },
      setUser: (user) => {
        console.log('[authStore.setUser]', user);
        set((state) => ({ user: { ...state.user, ...user } }));
        console.log('[authStore.setUser] after set:', get());
      },
      setToken: (token, rememberMe) => {
        console.log('[authStore.setToken] token:', token, 'rememberMe:', rememberMe);
        if (rememberMe) {
          localStorage.setItem('accessToken', token);
        } else {
          sessionStorage.setItem('accessToken', token);
        }
        set({ accessToken: token, isLoggedIn: !!token });
        console.log('[authStore.setToken] after set:', get());
      },
      checkAuth: async () => {
        const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
        console.log('[authStore.checkAuth] token:', token);
        if (token) {
          set({ accessToken: token, isLoggedIn: true });
          try {
            const response = await axiosInstance.get('/users/me');
            if (response.data) {
              set({ user: response.data });
              console.log('[authStore.checkAuth] user set:', response.data);
            }
          } catch (error) {
            get().logout();
            console.log('[authStore.checkAuth] token invalid, logout');
          }
        } else {
          set({ isLoading: false });
          console.log('[authStore.checkAuth] no token');
        }
      },
    }),
    {
      name: 'auth-storage', // localStorage에 저장될 key
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        user: state.user,
        accessToken: state.accessToken,
      }),
    }
  )
);

export default useAuthStore; 
