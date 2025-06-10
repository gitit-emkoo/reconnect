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
        get().setToken(token, true); 
        set({ isLoggedIn: true, user, isLoading: false });
      },
      logout: () => {
        localStorage.removeItem('accessToken');
        sessionStorage.removeItem('accessToken');
        set({ isLoggedIn: false, user: null, accessToken: null, isLoading: false });
      },
      setUser: (user) => {
        console.log('authStore setUser:', user);
        set((state) => ({ user: { ...state.user, ...user } }));
      },
      setToken: (token, rememberMe) => {
        console.log('authStore setToken:', token, rememberMe);
        if (rememberMe) {
          localStorage.setItem('accessToken', token);
        } else {
          sessionStorage.setItem('accessToken', token);
        }
        set({ accessToken: token, isLoggedIn: !!token });
      },
      checkAuth: async () => {
        const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
        if (token) {
          set({ accessToken: token, isLoggedIn: true, isLoading: true });
          try {
            const response = await axiosInstance.get('/auth/me'); // 사용자 정보 요청
            if (response.data) {
              set({ user: response.data, isLoading: false });
            }
          } catch (error) {
            // 토큰이 유효하지 않은 경우 등
            get().logout(); // 상태를 깨끗하게 초기화
          }
        } else {
          set({ isLoading: false }); // 토큰이 없으면 로딩 종료
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
