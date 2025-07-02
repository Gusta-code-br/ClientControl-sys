import pool from '../config/database.js';

export class Servico {
  static async findAll() {
    const query = `
      SELECT id, descricao, preco_base, criado_em, atualizado_em 
      FROM servicos 
      ORDER BY descricao
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM servicos WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async create(servicoData) {
    const { descricao, preco_base } = servicoData;
    const query = `
      INSERT INTO servicos (descricao, preco_base, atualizado_em) 
      VALUES ($1, $2, now()) 
      RETURNING *
    `;
    const result = await pool.query(query, [descricao, preco_base]);
    return result.rows[0];
  }

  static async update(id, servicoData) {
    const { descricao, preco_base } = servicoData;
    const query = `
      UPDATE servicos 
      SET descricao = $1, preco_base = $2, atualizado_em = now() 
      WHERE id = $3 
      RETURNING *
    `;
    const result = await pool.query(query, [descricao, preco_base, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM servicos WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}