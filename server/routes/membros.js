const express = require('express');
const { getPool, sql } = require('../config/database');
const router = express.Router();

// GET /api/membros - Listar todos os membros
router.get('/', async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query(`
      SELECT 
        MembroID as membroID,
        Nome as nome,
        Sobrenome as sobrenome,
        DataNascimento as dataNascimento,
        Endereco as endereco,
        Telefone as telefone,
        Email as email,
        DataCadastro as dataCadastro,
        StatusMembro as statusMembro
      FROM Membros
      ORDER BY Nome, Sobrenome
    `);

    res.json(result.recordset);
  } catch (error) {
    console.error('Erro ao buscar membros:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/membros/:id - Buscar membro por ID
router.get('/:id', async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query(`
        SELECT 
          MembroID as membroID,
          Nome as nome,
          Sobrenome as sobrenome,
          DataNascimento as dataNascimento,
          Endereco as endereco,
          Telefone as telefone,
          Email as email,
          DataCadastro as dataCadastro,
          StatusMembro as statusMembro
        FROM Membros
        WHERE MembroID = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Membro não encontrado' });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Erro ao buscar membro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/membros - Criar novo membro
router.post('/', async (req, res) => {
  try {
    const pool = getPool();
    const { nome, sobrenome, dataNascimento, endereco, telefone, email, statusMembro } = req.body;

    const result = await pool.request()
      .input('nome', sql.NVarChar, nome)
      .input('sobrenome', sql.NVarChar, sobrenome)
      .input('dataNascimento', sql.Date, dataNascimento)
      .input('endereco', sql.NVarChar, endereco)
      .input('telefone', sql.VarChar, telefone)
      .input('email', sql.VarChar, email)
      .input('statusMembro', sql.NVarChar, statusMembro || 'Ativo')
      .query(`
        INSERT INTO Membros (Nome, Sobrenome, DataNascimento, Endereco, Telefone, Email, StatusMembro)
        OUTPUT INSERTED.MembroID
        VALUES (@nome, @sobrenome, @dataNascimento, @endereco, @telefone, @email, @statusMembro)
      `);

    const membroID = result.recordset[0].MembroID;
    res.status(201).json({ membroID, message: 'Membro criado com sucesso' });
  } catch (error) {
    console.error('Erro ao criar membro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /api/membros/:id - Atualizar membro
router.put('/:id', async (req, res) => {
  try {
    const pool = getPool();
    const { nome, sobrenome, dataNascimento, endereco, telefone, email, statusMembro } = req.body;

    await pool.request()
      .input('id', sql.Int, req.params.id)
      .input('nome', sql.NVarChar, nome)
      .input('sobrenome', sql.NVarChar, sobrenome)
      .input('dataNascimento', sql.Date, dataNascimento)
      .input('endereco', sql.NVarChar, endereco)
      .input('telefone', sql.VarChar, telefone)
      .input('email', sql.VarChar, email)
      .input('statusMembro', sql.NVarChar, statusMembro)
      .query(`
        UPDATE Membros 
        SET Nome = @nome, Sobrenome = @sobrenome, DataNascimento = @dataNascimento,
            Endereco = @endereco, Telefone = @telefone, Email = @email, StatusMembro = @statusMembro
        WHERE MembroID = @id
      `);

    res.json({ message: 'Membro atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar membro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PATCH /api/membros/:id/status - Atualizar status do membro
router.patch('/:id/status', async (req, res) => {
  try {
    const pool = getPool();
    const { statusMembro } = req.body;

    await pool.request()
      .input('id', sql.Int, req.params.id)
      .input('statusMembro', sql.NVarChar, statusMembro)
      .query(`
        UPDATE Membros 
        SET StatusMembro = @statusMembro
        WHERE MembroID = @id
      `);

    res.json({ message: 'Status do Membro atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar membro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE /api/membros/:id - Excluir membro
router.delete('/:id', async (req, res) => {
  try {
    const pool = getPool();
    await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('DELETE FROM Membros WHERE MembroID = @id');

    res.json({ message: 'Membro excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir membro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;

