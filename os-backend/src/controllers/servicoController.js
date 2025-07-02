import { Servico } from '../models/Servico.js';

export const listar = async (req, res, next) => {
  try {
    const servicos = await Servico.findAll();
    
    res.json({
      success: true,
      data: servicos,
      total: servicos.length
    });
  } catch (error) {
    next(error);
  }
};

export const obterPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const servico = await Servico.findById(id);
    
    if (!servico) {
      return res.status(404).json({
        success: false,
        error: 'Serviço não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: servico
    });
  } catch (error) {
    next(error);
  }
};

export const criar = async (req, res, next) => {
  try {
    const servico = await Servico.create(req.body);
    
    res.status(201).json({
      success: true,
      data: servico,
      message: 'Serviço criado com sucesso'
    });
  } catch (error) {
    next(error);
  }
};

export const atualizar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const servico = await Servico.update(id, req.body);
    
    if (!servico) {
      return res.status(404).json({
        success: false,
        error: 'Serviço não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: servico,
      message: 'Serviço atualizado com sucesso'
    });
  } catch (error) {
    next(error);
  }
};

export const remover = async (req, res, next) => {
  try {
    const { id } = req.params;
    const servico = await Servico.delete(id);
    
    if (!servico) {
      return res.status(404).json({
        success: false,
        error: 'Serviço não encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Serviço removido com sucesso'
    });
  } catch (error) {
    next(error);
  }
};