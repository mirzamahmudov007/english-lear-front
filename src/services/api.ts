import axios from 'axios';

const api = axios.create({
  baseURL: 'http://64.23.219.188:9090/api',
});

export default api;

api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}); 

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem('token');

    //   window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
