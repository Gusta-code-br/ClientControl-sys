import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { servicoService } from '../services/servicosService';
import Modal from '../components/Modal';
import Button from '../components/Button';

const schema = yup.object({
  descricao: yup.string().required('Descrição é obrigatória'),
  preco_base: yup.number().required('Preço base é obrigatório').min(0, 'Preço deve ser positivo')
});

const ServicosPage = () => {
  const [servicos, setServicos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [servicoEditando, setServicoEditando] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    carregarServicos();
  }, []);

  const carregarServicos = async () => {
    try {
      setLoading(true);
      const response = await servicoService.listar();
      setServicos(response.data);
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (servico = null) => {
    setServicoEditando(servico);
    if (servico) {
      reset(servico);
    } else {
      reset({ descricao: '', preco_base: '' });
    }
    setIsModalOpen(true);
  };

  const fecharModal = () => {
    setIsModalOpen(false);
    setServicoEditando(null);
    reset();
  };

  const onSubmit = async (data) => {
    try {
      if (servicoEditando) {
        await servicoService.atualizar(servicoEditando.id, data);
      } else {
        await servicoService.criar(data);
      }
      fecharModal();
      carregarServicos();
    } catch (error) {
      console.error('Erro ao salvar serviço:', error);
    }
  };

  const excluirServico = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
      try {
        await servicoService.remover(id);
        carregarServicos();
      } catch (error) {
        console.error('Erro ao excluir serviço:', error);
      }
    }
  };

  const formatarPreco = (preco) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(preco);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Serviços</h1>
        <Button onClick={() => abrirModal()}>
          Novo Serviço
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
                  Descrição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preço Base
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {servicos.map((servico) => (
                <tr key={servico.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {servico.descricao}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatarPreco(servico.preco_base)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => abrirModal(servico)}
                      className="mr-2"
                    >
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => excluirServico(servico.id)}
                    >
                      Excluir
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {servicos.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhum serviço cadastrado
            </div>
          )}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={fecharModal}
        title={servicoEditando ? 'Editar Serviço' : 'Novo Serviço'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Descrição *</label>
            <textarea
              {...register('descricao')}
              rows="3"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.descricao && (
              <p className="text-red-500 text-sm mt-1">{errors.descricao.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Preço Base *</label>
            <input
              type="number"
              step="0.01"
              {...register('preco_base')}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.preco_base && (
              <p className="text-red-500 text-sm mt-1">{errors.preco_base.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={fecharModal}>
              Cancelar
            </Button>
            <Button type="submit">
              {servicoEditando ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ServicosPage;
