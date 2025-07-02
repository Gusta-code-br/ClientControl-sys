import { OrdemServico } from '../models/OrdemServico.js';

export const listar = async (req, res, next) => {
  try {
    const { status, cliente_id } = req.query;
    const filters = {};
    
    if (status) filters.status = status;
    if (cliente_id) filters.cliente_id = cliente_id;
    
    const ordens = await OrdemServico.findAll(filters);
    
    res.json({
      success: true,
      data: ordens,
      total: ordens.length
    });
  } catch (error) {
    next(error);
  }
};

export const obterPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ordem = await OrdemServico.findById(id);
    
    if (!ordem) {
      return res.status(404).json({
        success: false,
        error: 'Ordem de serviço não encontrada'
      });
    }
    
    res.json({
      success: true,
      data: ordem
    });
  } catch (error) {
    next(error);
  }
};

export const criar = async (req, res, next) => {
  try {
    const ordem = await OrdemServico.create(req.body);
    
    res.status(201).json({
      success: true,
      data: ordem,
      message: 'Ordem de serviço criada com sucesso'
    });
  } catch (error) {
    next(error);
  }
};

export const atualizar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ordem = await OrdemServico.update(id, req.body);
    
    if (!ordem) {
      return res.status(404).json({
        success: false,
        error: 'Ordem de serviço não encontrada'
      });
    }
    
    res.json({
      success: true,
      data: ordem,
      message: 'Ordem de serviço atualizada com sucesso'
    });
  } catch (error) {
    next(error);
  }
};

export const atualizarStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const data_conclusao = (status === 'concluida' || status === 'cancelada') 
      ? new Date().toISOString() 
      : null;
    
    const ordem = await OrdemServico.updateStatus(id, status, data_conclusao);
    
    if (!ordem) {
      return res.status(404).json({
        success: false,
        error: 'Ordem de serviço não encontrada'
      });
    }
    
    res.json({
      success: true,
      data: ordem,
      message: `Status atualizado para ${status}`
    });
  } catch (error) {
    next(error);
  }
};

export const remover = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ordem = await OrdemServico.delete(id);
    
    if (!ordem) {
      return res.status(404).json({
        success: false,
        error: 'Ordem de serviço não encontrada'
      });
    }
    
    res.json({
      success: true,
      message: 'Ordem de serviço removida com sucesso'
    });
  } catch (error) {
    next(error);
  }
};

export const obterEstatisticas = async (req, res, next) => {
  try {
    const stats = await OrdemServico.getStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};