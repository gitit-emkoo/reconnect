import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://reconnect-backend.onrender.com', // 항상 배포된 백엔드 사용
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance; 