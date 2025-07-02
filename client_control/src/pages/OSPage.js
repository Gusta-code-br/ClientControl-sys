import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { osService } from '../services/osService';
import { clienteService } from '../services/clientService';
import { servicoService } from '../services/servicosService';
import Modal from '../components/Modal';
import Button from '../components/Button';

const schema = yup.object({
  cliente_id: yup.string().required('Cliente é obrigatório'),
  servico_id: yup.string().required('Serviço é obrigatório'),
  anotacoes: yup.string()
});

const statusColors = {
  aberta: 'bg-blue-100 text-blue-800',
  em_andamento: 'bg-yellow-100 text-yellow-800',
  concluida: 'bg-green-100 text-green-800',
  cancelada: 'bg-red-100 text-red-800'
};

const statusLabels = {
  aberta: 'Aberta',
  em_andamento: 'Em Andamento',
  concluida: 'Concluída',
  cancelada: 'Cancelada'
};

const OSPage = () => {
  const [ordens, setOrdens] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ordemEditando, setOrdemEditando] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [ordensRes, clientesRes, servicosRes] = await Promise.all([
        osService.listar(),
        clienteService.listar(),
        servicoService.listar()
      ]);
      setOrdens(ordensRes.data);
      setClientes(clientesRes.data);
      setServicos(servicosRes.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (ordem = null) => {
    setOrdemEditando(ordem);
    if (ordem) {
      reset(ordem);
    } else {
      reset({ cliente_id: '', servico_id: '', anotacoes: '' });
    }
    setIsModalOpen(true);
  };

  const fecharModal = () => {
    setIsModalOpen(false);
    setOrdemEditando(null);
    reset();
  };

  const onSubmit = async (data) => {
    try {
      if (ordemEditando) {
        await osService.atualizar(ordemEditando.id, data);
      } else {
        await osService.criar(data);
      }
      fecharModal();
      carregarDados();
    } catch (error) {
      console.error('Erro ao salvar ordem:', error);
    }
  };

  const atualizarStatus = async (id, novoStatus) => {
    try {
      await osService.atualizarStatus(id, novoStatus);
      carregarDados();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const excluirOrdem = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta ordem de serviço?')) {
      try {
        await osService.remover(id);
        carregarDados();
      } catch (error) {
        console.error('Erro ao excluir ordem:', error);
      }
    }
  };

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const getClienteNome = (clienteId) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente ? cliente.nome : 'Cliente não encontrado';
  };

  const getServicoDescricao = (servicoId) => {
    const servico = servicos.find(s => s.id === servicoId);
    return servico ? servico.descricao : 'Serviço não encontrado';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Ordens de Serviço</h1>
        <Button onClick={() => abrirModal()}>
          Nova OS
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-4">Carregando...</div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Serviço
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Abertura
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ordens.map((ordem) => (
                <tr key={ordem.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {getClienteNome(ordem.cliente_id)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getServicoDescricao(ordem.servico_id)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[ordem.status]}`}>
                      {statusLabels[ordem.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatarData(ordem.data_abertura)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <select
                        value={ordem.status}
                        onChange={(e) => atualizarStatus(ordem.id, e.target.value)}
                        className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="aberta">Aberta</option>
                        <option value="em_andamento">Em Andamento</option>
                        <option value="concluida">Concluída</option>
                        <option value="cancelada">Cancelada</option>
                      </select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => abrirModal(ordem)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => excluirOrdem(ordem.id)}
                      >
                        Excluir
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {ordens.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhuma ordem de serviço cadastrada
            </div>
          )}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={fecharModal}
        title={ordemEditando ? 'Editar Ordem de Serviço' : 'Nova Ordem de Serviço'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Cliente *</label>
            <select
              {...register('cliente_id')}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Selecione um cliente</option>
              {clientes.map(cliente => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nome}
                </option>
              ))}
            </select>
            {errors.cliente_id && (
              <p className="text-red-500 text-sm mt-1">{errors.cliente_id.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Serviço *</label>
            <select
              {...register('servico_id')}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Selecione um serviço</option>
              {servicos.map(servico => (
                <option key={servico.id} value={servico.id}>
                  {servico.descricao}
                </option>
              ))}
            </select>
            {errors.servico_id && (
              <p className="text-red-500 text-sm mt-1">{errors.servico_id.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Anotações</label>
            <textarea
              {...register('anotacoes')}
              rows="3"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={fecharModal}>
              Cancelar
            </Button>
            <Button type="submit">
              {ordemEditando ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default OSPage;