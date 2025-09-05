const express = require('express');
const { getPool, sql } = require('../config/database');
const router = express.Router();

// GET /api/emprestimos - Listar todos os empréstimos
router.get('/', async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query(`
      SELECT 
        e.EmprestimoID as emprestimoID,
        e.ExemplarID as exemplarID,
        e.MembroID as membroID,
        e.DataEmprestimo as dataEmprestimo,
        e.DataDevolucaoPrevista as dataDevolucaoPrevista,
        e.DataDevolucaoReal as dataDevolucaoReal,
        ex.CodigoLocalizacao as exemplarCodigo,
        ex.StatusExemplar as exemplarStatus,
        l.LivroID as livroID,
        l.Titulo as livroTitulo,
        l.ISBN as livroISBN,
        m.Nome as membroNome,
        m.Sobrenome as membroSobrenome,
        m.Email as membroEmail
      FROM Emprestimos e
      JOIN Exemplares ex ON e.ExemplarID = ex.ExemplarID
      JOIN Livros l ON ex.LivroID = l.LivroID
      JOIN Membros m ON e.MembroID = m.MembroID
      ORDER BY e.DataEmprestimo DESC
    `);

    const emprestimos = result.recordset.map(row => ({
      emprestimoID: row.emprestimoID,
      exemplarID: row.exemplarID,
      membroID: row.membroID,
      dataEmprestimo: row.dataEmprestimo,
      dataDevolucaoPrevista: row.dataDevolucaoPrevista,
      dataDevolucaoReal: row.dataDevolucaoReal,
      exemplar: {
        exemplarID: row.exemplarID,
        livroID: row.livroID,
        codigoLocalizacao: row.exemplarCodigo,
        statusExemplar: row.exemplarStatus,
        livro: {
          livroID: row.livroID,
          titulo: row.livroTitulo,
          isbn: row.livroISBN
        }
      },
      membro: {
        membroID: row.membroID,
        nome: row.membroNome,
        sobrenome: row.membroSobrenome,
        email: row.membroEmail
      }
    }));

    res.json(emprestimos);
  } catch (error) {
    console.error('Erro ao buscar empréstimos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/emprestimos/:id - Buscar empréstimo por ID
router.get('/:id', async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query(`
        SELECT 
          e.EmprestimoID as emprestimoID,
          e.ExemplarID as exemplarID,
          e.MembroID as membroID,
          e.DataEmprestimo as dataEmprestimo,
          e.DataDevolucaoPrevista as dataDevolucaoPrevista,
          e.DataDevolucaoReal as dataDevolucaoReal,
          ex.CodigoLocalizacao as exemplarCodigo,
          ex.StatusExemplar as exemplarStatus,
          l.LivroID as livroID,
          l.Titulo as livroTitulo,
          l.ISBN as livroISBN,
          m.Nome as membroNome,
          m.Sobrenome as membroSobrenome,
          m.Email as membroEmail
        FROM Emprestimos e
        JOIN Exemplares ex ON e.ExemplarID = ex.ExemplarID
        JOIN Livros l ON ex.LivroID = l.LivroID
        JOIN Membros m ON e.MembroID = m.MembroID
        WHERE e.EmprestimoID = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Empréstimo não encontrado' });
    }

    const row = result.recordset[0];
    const emprestimo = {
      emprestimoID: row.emprestimoID,
      exemplarID: row.exemplarID,
      membroID: row.membroID,
      dataEmprestimo: row.dataEmprestimo,
      dataDevolucaoPrevista: row.dataDevolucaoPrevista,
      dataDevolucaoReal: row.dataDevolucaoReal,
      exemplar: {
        exemplarID: row.exemplarID,
        livroID: row.livroID,
        codigoLocalizacao: row.exemplarCodigo,
        statusExemplar: row.exemplarStatus,
        livro: {
          livroID: row.livroID,
          titulo: row.livroTitulo,
          isbn: row.livroISBN
        }
      },
      membro: {
        membroID: row.membroID,
        nome: row.membroNome,
        sobrenome: row.membroSobrenome,
        email: row.membroEmail
      }
    };

    res.json(emprestimo);
  } catch (error) {
    console.error('Erro ao buscar empréstimo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/emprestimos - Criar novo empréstimo
router.post('/', async (req, res) => {
  const transaction = new sql.Transaction(getPool());
  
  try {
    await transaction.begin();
    
    const { exemplarID, membroID, dataDevolucaoPrevista } = req.body;

    // Verificar se o exemplar está disponível
    const exemplarResult = await transaction.request()
      .input('exemplarID', sql.Int, exemplarID)
      .query('SELECT StatusExemplar FROM Exemplares WHERE ExemplarID = @exemplarID');

    if (exemplarResult.recordset.length === 0) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Exemplar não encontrado' });
    }

    if (exemplarResult.recordset[0].StatusExemplar !== 'Disponível') {
      await transaction.rollback();
      return res.status(400).json({ error: 'Exemplar não está disponível para empréstimo' });
    }

    // Criar empréstimo
    const emprestimoResult = await transaction.request()
      .input('exemplarID', sql.Int, exemplarID)
      .input('membroID', sql.Int, membroID)
      .input('dataDevolucaoPrevista', sql.Date, dataDevolucaoPrevista)
      .query(`
        INSERT INTO Emprestimos (ExemplarID, MembroID, DataDevolucaoPrevista)
        OUTPUT INSERTED.EmprestimoID
        VALUES (@exemplarID, @membroID, @dataDevolucaoPrevista)
      `);

     const emprestimoID = emprestimoResult.recordset[0].EmprestimoID;

    // Atualizar status do exemplar - via trigger
    // await transaction.request()
    //   .input('exemplarID', sql.Int, exemplarID)
    //   .query('UPDATE Exemplares SET StatusExemplar = \'Emprestado\' WHERE ExemplarID = @exemplarID');

    await transaction.commit();
    res.status(201).json({ emprestimoID, message: 'Empréstimo realizado com sucesso' });
  } catch (error) {
    await transaction.rollback();
    console.error('Erro ao criar empréstimo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/emprestimos/:id/devolver - Devolver livro
router.post('/:id/devolver', async (req, res) => {
  const transaction = new sql.Transaction(getPool());
  
  try {
    await transaction.begin();
    
    const emprestimoID = parseInt(req.params.id);

    // Buscar empréstimo
    const emprestimoResult = await transaction.request()
      .input('emprestimoID', sql.Int, emprestimoID)
      .query(`
        SELECT e.ExemplarID, e.DataDevolucaoReal
        FROM Emprestimos e
        WHERE e.EmprestimoID = @emprestimoID
      `);

    if (emprestimoResult.recordset.length === 0) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Empréstimo não encontrado' });
    }

    const emprestimo = emprestimoResult.recordset[0];

    if (emprestimo.DataDevolucaoReal) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Livro já foi devolvido' });
    }

    // Atualizar empréstimo com data de devolução
    await transaction.request()
      .input('emprestimoID', sql.Int, emprestimoID)
      .query('UPDATE Emprestimos SET DataDevolucaoReal = GETDATE() WHERE EmprestimoID = @emprestimoID');

    // Atualizar status do exemplar


    await transaction.commit();
    res.json({ message: 'Livro devolvido com sucesso' });
  } catch (error) {
    await transaction.rollback();
    console.error('Erro ao devolver livro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /api/emprestimos/:id - Atualizar empréstimo
router.put('/:id', async (req, res) => {
  try {
    const pool = getPool();
    const { exemplarID, membroID, dataDevolucaoPrevista, dataDevolucaoReal } = req.body;

    await pool.request()
      .input('id', sql.Int, req.params.id)
      .input('exemplarID', sql.Int, exemplarID)
      .input('membroID', sql.Int, membroID)
      .input('dataDevolucaoPrevista', sql.Date, dataDevolucaoPrevista)
      .input('dataDevolucaoReal', sql.Date, dataDevolucaoReal)
      .query(`
        UPDATE Emprestimos 
        SET ExemplarID = @exemplarID, MembroID = @membroID, 
            DataDevolucaoPrevista = @dataDevolucaoPrevista, DataDevolucaoReal = @dataDevolucaoReal
        WHERE EmprestimoID = @id
      `);

    res.json({ message: 'Empréstimo atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar empréstimo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE /api/emprestimos/:id - Excluir empréstimo
router.delete('/:id', async (req, res) => {
  try {
    const pool = getPool();
    await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('DELETE FROM Emprestimos WHERE EmprestimoID = @id');

    res.json({ message: 'Empréstimo excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir empréstimo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;

