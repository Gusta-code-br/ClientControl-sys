import pool from '../config/database.js';

export class Cliente {
  static async findAll() {
    const query = `
      SELECT id, nome, telefone, email, criado_em, atualizado_em 
      FROM clientes 
      ORDER BY nome
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM clientes WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async create(clienteData) {
    const { nome, telefone, email } = clienteData;
    const query = `
      INSERT INTO clientes (nome, telefone, email, atualizado_em) 
      VALUES ($1, $2, $3, now()) 
      RETURNING *
    `;
    const result = await pool.query(query, [nome, telefone, email]);
    return result.rows[0];
  }

  static async update(id, clienteData) {
    const { nome, telefone, email } = clienteData;
    const query = `
      UPDATE clientes 
      SET nome = $1, telefone = $2, email = $3, atualizado_em = now() 
      WHERE id = $4 
      RETURNING *
    `;
    const result = await pool.query(query, [nome, telefone, email, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM clientes WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async search(termo) {
    const query = `
      SELECT * FROM clientes 
      WHERE nome ILIKE $1 OR email ILIKE $1 OR telefone ILIKE $1
      ORDER BY nome
    `;
    const result = await pool.query(query, [`%${termo}%`]);
    return result.rows;
  }
}