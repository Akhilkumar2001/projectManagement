import api from './api.js';
import { ENDPOINTS } from '../utils/constants.js';

const E = ENDPOINTS.PROJECTS;

const projectService = {
  getAll:   (params)       => api.get(E, { params }),
  getById:  (id)           => api.get(`${E}/${id}`),
  create:   (data)         => api.post(E, data),
  update:   (id, data)     => api.put(`${E}/${id}`, data),
  delete:   (id)           => api.delete(`${E}/${id}`),
};

export default projectService;
