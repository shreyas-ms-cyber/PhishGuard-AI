import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Skip interceptor for auth endpoints to avoid loops
    const authEndpoints = ['/auth/refresh', '/auth/login', '/auth/register', '/auth/logout'];
    if (authEndpoints.some((endpoint) => originalRequest.url?.startsWith(endpoint))) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        await new Promise((resolve) => {
          const check = setInterval(() => {
            if (!isRefreshing) {
              clearInterval(check);
              resolve();
            }
          }, 100);
        });
        return api(originalRequest);
      }
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post('/auth/refresh');
        isRefreshing = false;
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        try {
          await api.post('/auth/logout');
        } catch (e) {}
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
