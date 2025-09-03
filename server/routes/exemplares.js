const express = require('express');
const { getPool, sql } = require('../config/database');
const router = express.Router();

// GET /api/exemplares - Listar todos os exemplares
router.get('/', async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query(`
      SELECT 
        ex.ExemplarID as exemplarID,
        ex.LivroID as livroID,
        ex.CodigoLocalizacao as codigoLocalizacao,
        ex.StatusExemplar as statusExemplar,
        l.Titulo as livroTitulo,
        l.ISBN as livroISBN,
        e.Nome as editoraNome
      FROM Exemplares ex
      JOIN Livros l ON ex.LivroID = l.LivroID
      JOIN Editoras e ON l.EditoraID = e.EditoraID
      ORDER BY l.Titulo, ex.CodigoLocalizacao
    `);

    const exemplares = result.recordset.map(row => ({
      exemplarID: row.exemplarID,
      livroID: row.livroID,
      codigoLocalizacao: row.codigoLocalizacao,
      statusExemplar: row.statusExemplar,
      livro: {
        livroID: row.livroID,
        titulo: row.livroTitulo,
        isbn: row.livroISBN,
        editora: {
          nome: row.editoraNome
        }
      }
    }));

    res.json(exemplares);
  } catch (error) {
    console.error('Erro ao buscar exemplares:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/exemplares/:id - Buscar exemplar por ID
router.get('/:id', async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query(`
        SELECT 
          ex.ExemplarID as exemplarID,
          ex.LivroID as livroID,
          ex.CodigoLocalizacao as codigoLocalizacao,
          ex.StatusExemplar as statusExemplar,
          l.Titulo as livroTitulo,
          l.ISBN as livroISBN,
          e.Nome as editoraNome
        FROM Exemplares ex
        JOIN Livros l ON ex.LivroID = l.LivroID
        JOIN Editoras e ON l.EditoraID = e.EditoraID
        WHERE ex.ExemplarID = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Exemplar não encontrado' });
    }

    const row = result.recordset[0];
    const exemplar = {
      exemplarID: row.exemplarID,
      livroID: row.livroID,
      codigoLocalizacao: row.codigoLocalizacao,
      statusExemplar: row.statusExemplar,
      livro: {
        livroID: row.livroID,
        titulo: row.livroTitulo,
        isbn: row.livroISBN,
        editora: {
          nome: row.editoraNome
        }
      }
    };

    res.json(exemplar);
  } catch (error) {
    console.error('Erro ao buscar exemplar:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/exemplares - Criar novo exemplar
router.post('/', async (req, res) => {
  try {
    const pool = getPool();
    const { livroID, codigoLocalizacao, statusExemplar } = req.body;

    const result = await pool.request()
      .input('livroID', sql.Int, livroID)
      .input('codigoLocalizacao', sql.NVarChar, codigoLocalizacao)
      .input('statusExemplar', sql.NVarChar, statusExemplar || 'Disponível')
      .query(`
        INSERT INTO Exemplares (LivroID, CodigoLocalizacao, StatusExemplar)
        OUTPUT INSERTED.ExemplarID
        VALUES (@livroID, @codigoLocalizacao, @statusExemplar)
      `);

    const exemplarID = result.recordset[0].ExemplarID;
    res.status(201).json({ exemplarID, message: 'Exemplar criado com sucesso' });
  } catch (error) {
    console.error('Erro ao criar exemplar:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /api/exemplares/:id - Atualizar exemplar
router.put('/:id', async (req, res) => {
  try {
    const pool = getPool();
    const { livroID, codigoLocalizacao, statusExemplar } = req.body;

    await pool.request()
      .input('id', sql.Int, req.params.id)
      .input('livroID', sql.Int, livroID)
      .input('codigoLocalizacao', sql.NVarChar, codigoLocalizacao)
      .input('statusExemplar', sql.NVarChar, statusExemplar)
      .query(`
        UPDATE Exemplares 
        SET LivroID = @livroID, CodigoLocalizacao = @codigoLocalizacao, StatusExemplar = @statusExemplar
        WHERE ExemplarID = @id
      `);

    res.json({ message: 'Exemplar atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar exemplar:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE /api/exemplares/:id - Excluir exemplar
router.delete('/:id', async (req, res) => {
  try {
    const pool = getPool();
    await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('DELETE FROM Exemplares WHERE ExemplarID = @id');

    res.json({ message: 'Exemplar excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir exemplar:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;

