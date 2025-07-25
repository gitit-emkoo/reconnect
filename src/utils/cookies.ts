// 쿠키 관련 유틸리티 함수들
export const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

export const setCookie = (name: string, value: string, days: number = 90) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

export const removeCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

// 인증 토큰 관련 편의 함수들
export const getAuthToken = (): string | null => {
  return getCookie('accessToken');
};

export const setAuthToken = (token: string) => {
  setCookie('accessToken', token);
};

export const removeAuthToken = () => {
  removeCookie('accessToken');
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
}; 