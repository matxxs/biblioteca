const express = require('express');
const { getPool, sql } = require('../config/database');
const router = express.Router();

// GET /api/reservas - Listar todas as reservas
router.get('/', async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query(`
      SELECT 
        r.ReservaID as reservaID,
        r.LivroID as livroID,
        r.MembroID as membroID,
        r.DataReserva as dataReserva,
        r.StatusReserva as statusReserva,
        r.DataNotificacao as dataNotificacao,
        l.Titulo as livroTitulo,
        l.ISBN as livroISBN,
        m.Nome as membroNome,
        m.Sobrenome as membroSobrenome,
        m.Email as membroEmail
      FROM Reservas r
      JOIN Livros l ON r.LivroID = l.LivroID
      JOIN Membros m ON r.MembroID = m.MembroID
      ORDER BY r.DataReserva DESC
    `);

    const reservas = result.recordset.map(row => ({
      reservaID: row.reservaID,
      livroID: row.livroID,
      membroID: row.membroID,
      dataReserva: row.dataReserva,
      statusReserva: row.statusReserva,
      dataNotificacao: row.dataNotificacao,
      livro: {
        livroID: row.livroID,
        titulo: row.livroTitulo,
        isbn: row.livroISBN
      },
      membro: {
        membroID: row.membroID,
        nome: row.membroNome,
        sobrenome: row.membroSobrenome,
        email: row.membroEmail
      }
    }));

    res.json(reservas);
  } catch (error) {
    console.error('Erro ao buscar reservas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/reservas/:id - Buscar reserva por ID
router.get('/:id', async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query(`
        SELECT 
          r.ReservaID as reservaID,
          r.LivroID as livroID,
          r.MembroID as membroID,
          r.DataReserva as dataReserva,
          r.StatusReserva as statusReserva,
          r.DataNotificacao as dataNotificacao,
          l.Titulo as livroTitulo,
          l.ISBN as livroISBN,
          m.Nome as membroNome,
          m.Sobrenome as membroSobrenome,
          m.Email as membroEmail
        FROM Reservas r
        JOIN Livros l ON r.LivroID = l.LivroID
        JOIN Membros m ON r.MembroID = m.MembroID
        WHERE r.ReservaID = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Reserva não encontrada' });
    }

    const row = result.recordset[0];
    const reserva = {
      reservaID: row.reservaID,
      livroID: row.livroID,
      membroID: row.membroID,
      dataReserva: row.dataReserva,
      statusReserva: row.statusReserva,
      dataNotificacao: row.dataNotificacao,
      livro: {
        livroID: row.livroID,
        titulo: row.livroTitulo,
        isbn: row.livroISBN
      },
      membro: {
        membroID: row.membroID,
        nome: row.membroNome,
        sobrenome: row.membroSobrenome,
        email: row.membroEmail
      }
    };

    res.json(reserva);
  } catch (error) {
    console.error('Erro ao buscar reserva:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/reservas - Criar nova reserva
router.post('/', async (req, res) => {
  try {
    const pool = getPool();
    const { livroID, membroID, statusReserva } = req.body;

    const result = await pool.request()
      .input('livroID', sql.Int, livroID)
      .input('membroID', sql.Int, membroID)
      .input('statusReserva', sql.NVarChar, statusReserva || 'Ativa')
      .query(`
        INSERT INTO Reservas (LivroID, MembroID, StatusReserva)
        OUTPUT INSERTED.ReservaID
        VALUES (@livroID, @membroID, @statusReserva)
      `);

    const reservaID = result.recordset[0].ReservaID;
    res.status(201).json({ reservaID, message: 'Reserva criada com sucesso' });
  } catch (error) {
    console.error('Erro ao criar reserva:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /api/reservas/:id - Atualizar reserva
router.put('/:id', async (req, res) => {
  try {
    const pool = getPool();
    const { livroID, membroID, statusReserva, dataNotificacao } = req.body;

    await pool.request()
      .input('id', sql.Int, req.params.id)
      .input('livroID', sql.Int, livroID)
      .input('membroID', sql.Int, membroID)
      .input('statusReserva', sql.NVarChar, statusReserva)
      .input('dataNotificacao', sql.Date, dataNotificacao)
      .query(`
        UPDATE Reservas 
        SET LivroID = @livroID, MembroID = @membroID, 
            StatusReserva = @statusReserva, DataNotificacao = @dataNotificacao
        WHERE ReservaID = @id
      `);

    res.json({ message: 'Reserva atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar reserva:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE /api/reservas/:id - Excluir reserva
router.delete('/:id', async (req, res) => {
  try {
    const pool = getPool();
    await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('DELETE FROM Reservas WHERE ReservaID = @id');

    res.json({ message: 'Reserva excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir reserva:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;

