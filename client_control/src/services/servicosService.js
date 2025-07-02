import api from './api';

export const servicoService = {
  listar: () => api.get('/servicos'),
  criar: (servico) => api.post('/servicos', servico),
  atualizar: (id, servico) => api.put(`/servicos/${id}`, servico),
  remover: (id) => api.delete(`/servicos/${id}`),
  buscarPorId: (id) => api.get(`/servicos/${id}`)
};