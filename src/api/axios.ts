import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://reconnect-backend.onrender.com/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('[axiosInstance] baseURL:', instance.defaults.baseURL); // baseURL 확인 로그 추가

export default instance; 