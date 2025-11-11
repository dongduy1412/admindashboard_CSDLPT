import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

export const khutroAPI = {
  getAll: () => api.get('/khutro'),
  getById: (id) => api.get(`/khutro/${id}`),
  create: (data) => api.post('/khutro', data),
  update: (id, data) => api.put(`/khutro/${id}`, data),
  delete: (id) => api.delete(`/khutro/${id}`),
};

export const phongtroAPI = {
  getAll: () => api.get('/phongtro'),
  getById: (id) => api.get(`/phongtro/${id}`),
  create: (data) => api.post('/phongtro', data),
  update: (id, data) => api.put(`/phongtro/${id}`, data),
  delete: (id) => api.delete(`/phongtro/${id}`),
};

export const khachthueAPI = {
  getAll: () => api.get('/khachthue'),
  getById: (id) => api.get(`/khachthue/${id}`),
  create: (data) => api.post('/khachthue', data),
  update: (id, data) => api.put(`/khachthue/${id}`, data),
  delete: (id) => api.delete(`/khachthue/${id}`),
};

export const hopdongAPI = {
  getAll: () => api.get('/hopdong'),
  getById: (id) => api.get(`/hopdong/${id}`),
  getWithKhachthue: (id) => api.get(`/hopdong/${id}/khachthue`),
  create: (data) => api.post('/hopdong', data),
  update: (id, data) => api.put(`/hopdong/${id}`, data),
  delete: (id) => api.delete(`/hopdong/${id}`),
  addKhachthue: (data) => api.post('/hopdong/khachthue', data),
  removeKhachthue: (mahopdong, makhachthue) => 
    api.delete(`/hopdong/${mahopdong}/khachthue/${makhachthue}`),
};

export const hoadonAPI = {
  getAll: () => api.get('/hoadon'),
  getById: (id) => api.get(`/hoadon/${id}`),
  getByHopdong: (mahopdong) => api.get(`/hoadon/hopdong/${mahopdong}`),
  create: (data) => api.post('/hoadon', data),
  update: (id, data) => api.put(`/hoadon/${id}`, data),
  delete: (id) => api.delete(`/hoadon/${id}`),
};

export const nguoidungAPI = {
  getAll: () => api.get('/nguoidung'),
  getById: (id) => api.get(`/nguoidung/${id}`),
  create: (data) => api.post('/nguoidung', data),
  update: (id, data) => api.put(`/nguoidung/${id}`, data),
  delete: (id) => api.delete(`/nguoidung/${id}`),
};

export default api;
