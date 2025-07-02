import { Cliente } from '../models/Cliente.js';

export const listar = async (req, res, next) => {
  try {
    const { busca } = req.query;
    
    let clientes;
    if (busca) {
      clientes = await Cliente.search(busca);
    } else {
      clientes = await Cliente.findAll();
    }
    
    res.json({
      success: true,
      data: clientes,
      total: clientes.length
    });
  } catch (error) {
    next(error);
  }
};

export const obterPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cliente = await Cliente.findById(id);
    
    if (!cliente) {
      return res.status(404).json({
        success: false,
        error: 'Cliente não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: cliente
    });
  } catch (error) {
    next(error);
  }
};

export const criar = async (req, res, next) => {
  try {
    const cliente = await Cliente.create(req.body);
    
    res.status(201).json({
      success: true,
      data: cliente,
      message: 'Cliente criado com sucesso'
    });
  } catch (error) {
    next(error);
  }
};

export const atualizar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cliente = await Cliente.update(id, req.body);
    
    if (!cliente) {
      return res.status(404).json({
        success: false,
        error: 'Cliente não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: cliente,
      message: 'Cliente atualizado com sucesso'
    });
  } catch (error) {
    next(error);
  }
};

export const remover = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cliente = await Cliente.delete(id);
    
    if (!cliente) {
      return res.status(404).json({
        success: false,
        error: 'Cliente não encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Cliente removido com sucesso'
    });
  } catch (error) {
    next(error);
  }
};