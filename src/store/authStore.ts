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
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user, 
        token: get().token 
      }),

      setToken: (token) => {
        if (token) {
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          set({ token, isAuthenticated: true });
        } else {
          delete axiosInstance.defaults.headers.common['Authorization'];
          set({ token: null, user: null, isAuthenticated: false });
        }
      },

      logout: () => {
        get().setToken(null);
      },
      
      checkAuth: async () => {
        try {
          const storedState = JSON.parse(localStorage.getItem('reconnect-auth-storage') || '{}');
          const token = storedState?.state?.token;
          if (token) {
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const response = await axiosInstance.get('/users/me');
            set({ user: response.data, token, isAuthenticated: true, isLoading: false });
          } else {
            set({ user: null, token: null, isAuthenticated: false, isLoading: false });
          }
        } catch (error) {
          console.error("Authentication check failed", error);
          get().logout();
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'reconnect-auth-storage',
      partialize: (state) => ({ token: state.token }),
    }
  )
);

export default useAuthStore; 
