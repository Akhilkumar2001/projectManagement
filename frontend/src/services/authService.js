import api from './api.js';
import { ENDPOINTS } from '../utils/constants.js';

const E = ENDPOINTS.AUTH;

const authService = {
  login:          (credentials)           => api.post(`${E}/login`, credentials),
  register:       (userData)              => api.post(`${E}/register`, userData),
  getMe:          ()                      => api.get(`${E}/me`),
  changePassword: (data)                  => api.put(`${E}/change-password`, data),
};

export default authService;
