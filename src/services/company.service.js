import api from './api';

export const companyService = {
  list: (params = {}) =>
    api.get('/companies', { params }),

  getById: (id) =>
    api.get(`/companies/${id}`),

  create: (data) =>
    api.post('/companies', data),

  update: (id, data) =>
    api.put(`/companies/${id}`, data),

  delete: (id) =>
    api.delete(`/companies/${id}`),
};
