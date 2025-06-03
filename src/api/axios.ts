import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://reconnect-backend.onrender.com',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance; 