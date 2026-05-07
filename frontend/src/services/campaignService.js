import api from './api.js';

const E = '/campaigns';

const campaignService = {
  // Campaign CRUD
  getAll:        ()            => api.get(E),
  getById:       (id)          => api.get(`${E}/${id}`),
  create:        (data)        => api.post(E, data),
  update:        (id, data)    => api.put(`${E}/${id}`, data),
  delete:        (id)          => api.delete(`${E}/${id}`),
  getDashboard:  (id)          => api.get(`${E}/${id}/dashboard`),

  // Influencer Roster
  getInfluencers:    (cId, params) => api.get(`${E}/${cId}/influencers`, { params }),
  createInfluencer:  (cId, data)   => api.post(`${E}/${cId}/influencers`, data),
  updateInfluencer:  (id, data)    => api.put(`${E}/influencers/${id}`, data),
  deleteInfluencer:  (id)          => api.delete(`${E}/influencers/${id}`),

  // Deliverables
  getDeliverables:   (cId, params) => api.get(`${E}/${cId}/deliverables`, { params }),
  createDeliverable: (cId, data)   => api.post(`${E}/${cId}/deliverables`, data),
  updateDeliverable: (id, data)    => api.put(`${E}/deliverables/${id}`, data),
  deleteDeliverable: (id)          => api.delete(`${E}/deliverables/${id}`),

  // Budget & Performance
  getBudgets:        (cId)         => api.get(`${E}/${cId}/budgets`),
  createBudget:      (cId, data)   => api.post(`${E}/${cId}/budgets`, data),
  updateBudget:      (id, data)    => api.put(`${E}/budgets/${id}`, data),
  deleteBudget:      (id)          => api.delete(`${E}/budgets/${id}`),
};

export default campaignService;
