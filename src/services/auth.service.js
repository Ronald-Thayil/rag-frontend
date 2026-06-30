import api from './api';

export const authService = {
  loginUser: (credentials) =>
    api.post('/auth/login/user', credentials),

  loginAdmin: (credentials) =>
    api.post('/auth/login/admin', credentials),

  refresh: (refreshToken) =>
    api.post('/auth/refresh', { refreshToken }),

  logout: (refreshToken) =>
    api.post('/auth/logout', { refreshToken }),
};
