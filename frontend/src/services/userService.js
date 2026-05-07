import api from './api.js';
import { ENDPOINTS } from '../utils/constants.js';

const E = ENDPOINTS.USERS;

const userService = {
  getAll:        (params)        => api.get(E, { params }),
  getById:       (id)            => api.get(`${E}/${id}`),
  create:        (data)          => api.post(E, data),
  update:        (id, data)      => api.put(`${E}/${id}`, data),
  delete:        (id)            => api.delete(`${E}/${id}`),
  updateProfile: (data)          => api.put(`${E}/profile`, data),
};

export default userService;
