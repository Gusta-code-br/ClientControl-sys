import api from './api';

export const osService = {
  listar: () => api.get('/os'),
  criar: (os) => api.post('/os', os),
  atualizar: (id, os) => api.put(`/os/${id}`, os),
  remover: (id) => api.delete(`/os/${id}`),
  buscarPorId: (id) => api.get(`/os/${id}`),
  atualizarStatus: (id, status) => api.patch(`/os/${id}/status`, { status })
};