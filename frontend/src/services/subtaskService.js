import api from './api.js';
import { ENDPOINTS } from '../utils/constants.js';

const E = ENDPOINTS.SUBTASKS;

const subtaskService = {
  getByTask:    (taskId)         => api.get(`${E}/task/${taskId}`),
  update:       (id, data)       => api.put(`${E}/${id}`, data),
  uploadImages: (id, formData)   => api.post(`${E}/${id}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export default subtaskService;
