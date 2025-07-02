import api from './api';

export const clienteService = {
  listar: () => api.get('/clientes'),
  criar: (cliente) => api.post('/clientes', cliente),
  atualizar: (id, cliente) => api.put(`/clientes/${id}`, cliente),
  remover: (id) => api.delete(`/clientes/${id}`),
  buscarPorId: (id) => api.get(`/clientes/${id}`)
};