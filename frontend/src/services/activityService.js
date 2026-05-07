import api from './api.js';
import { ENDPOINTS } from '../utils/constants.js';

const E = ENDPOINTS.ACTIVITY;

const activityService = {
  getLogs: (params) => api.get(E, { params }),
};

export default activityService;
