import api from './api.js';
import { ENDPOINTS } from '../utils/constants.js';

const E = ENDPOINTS.TASKS;

const taskService = {
  getByProject:  (projectId, params)       => api.get(`${E}/project/${projectId}`, { params }),
  getById:       (id)                      => api.get(`${E}/${id}`),
  create:        (formData)                 => api.post(E, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update:        (id, data)               => api.put(`${E}/${id}`, data),
  delete:        (id)                      => api.delete(`${E}/${id}`),
  approve:       (id)                      => api.put(`${E}/${id}/approve`),
  reject:        (id, rejectionReason)     => api.put(`${E}/${id}/reject`, { rejectionReason }),
  uploadImages:  (id, formData)           => api.post(`${E}/${id}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export default taskService;
