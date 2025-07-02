export const errorHandler = (err, req, res, next) => {
  console.error('❌ Erro:', err);

  if (err.code === '23505') { // Violação de unique constraint
    return res.status(409).json({
      error: 'Recurso já existe',
      details: 'Este registro já foi cadastrado'
    });
  }

  if (err.code === '23503') { // Violação de foreign key
    return res.status(400).json({
      error: 'Referência inválida',
      details: 'Um dos recursos referenciados não existe'
    });
  }

  if (err.code === '23502') { // Violação de not null
    return res.status(400).json({
      error: 'Campo obrigatório',
      details: 'Alguns campos obrigatórios não foram preenchidos'
    });
  }

  const status = err.status || 500;
  const message = err.message || 'Erro interno do servidor';

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};