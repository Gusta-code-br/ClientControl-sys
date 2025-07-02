import pool from '../config/database.js';

export class OrdemServico {
  static async findAll(filters = {}) {
    let query = `
      SELECT 
        os.id, os.status, os.data_abertura, os.data_conclusao, os.anotacoes,
        c.nome as cliente_nome, c.telefone as cliente_telefone,
        s.descricao as servico_descricao, s.preco_base as servico_preco
      FROM ordens_servico os
      JOIN clientes c ON os.cliente_id = c.id
      JOIN servicos s ON os.servico_id = s.id
    `;
    
    const conditions = [];
    const values = [];
    let paramCount = 0;

    if (filters.status) {
      paramCount++;
      conditions.push(`os.status = $${paramCount}`);
      values.push(filters.status);
    }

    if (filters.cliente_id) {
      paramCount++;
      conditions.push(`os.cliente_id = $${paramCount}`);
      values.push(filters.cliente_id);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY os.data_abertura DESC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT 
        os.*,
        c.nome as cliente_nome, c.telefone as cliente_telefone, c.email as cliente_email,
        s.descricao as servico_descricao, s.preco_base as servico_preco
      FROM ordens_servico os
      JOIN clientes c ON os.cliente_id = c.id
      JOIN servicos s ON os.servico_id = s.id
      WHERE os.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async create(osData) {
    const { cliente_id, servico_id, anotacoes } = osData;
    const query = `
      INSERT INTO ordens_servico (cliente_id, servico_id, anotacoes) 
      VALUES ($1, $2, $3) 
      RETURNING *
    `;
    const result = await pool.query(query, [cliente_id, servico_id, anotacoes]);
    return result.rows[0];
  }

  static async updateStatus(id, status, data_conclusao = null) {
    const query = `
      UPDATE ordens_servico 
      SET status = $1, data_conclusao = $2
      WHERE id = $3 
      RETURNING *
    `;
    const result = await pool.query(query, [status, data_conclusao, id]);
    return result.rows[0];
  }

  static async update(id, osData) {
    const { cliente_id, servico_id, status, anotacoes, data_conclusao } = osData;
    const query = `
      UPDATE ordens_servico 
      SET cliente_id = $1, servico_id = $2, status = $3, anotacoes = $4, data_conclusao = $5
      WHERE id = $6 
      RETURNING *
    `;
    const result = await pool.query(query, [cliente_id, servico_id, status, anotacoes, data_conclusao, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM ordens_servico WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async getStats() {
    const query = `
      SELECT 
        status,
        COUNT(*) as quantidade,
        COALESCE(SUM(s.preco_base), 0) as valor_total
      FROM ordens_servico os
      JOIN servicos s ON os.servico_id = s.id
      GROUP BY status
    `;
    const result = await pool.query(query);
    return result.rows;
  }
}