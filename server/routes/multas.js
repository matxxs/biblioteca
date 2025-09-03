const express = require('express');
const { getPool, sql } = require('../config/database');
const router = express.Router();

// GET /api/multas - Listar todas as multas
router.get('/', async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query(`
      SELECT 
        m.MultaID as multaID,
        m.EmprestimoID as emprestimoID,
        m.Valor as valor,
        m.DataGeracao as dataGeracao,
        m.StatusMulta as statusMulta,
        m.DataPagamento as dataPagamento,
        e.DataEmprestimo as dataEmprestimo,
        e.DataDevolucaoPrevista as dataDevolucaoPrevista,
        e.DataDevolucaoReal as dataDevolucaoReal,
        l.Titulo as livroTitulo,
        mb.Nome as membroNome,
        mb.Sobrenome as membroSobrenome
      FROM Multas m
      JOIN Emprestimos e ON m.EmprestimoID = e.EmprestimoID
      JOIN Exemplares ex ON e.ExemplarID = ex.ExemplarID
      JOIN Livros l ON ex.LivroID = l.LivroID
      JOIN Membros mb ON e.MembroID = mb.MembroID
      ORDER BY m.DataGeracao DESC
    `);

    const multas = result.recordset.map(row => ({
      multaID: row.multaID,
      emprestimoID: row.emprestimoID,
      valor: row.valor,
      dataGeracao: row.dataGeracao,
      statusMulta: row.statusMulta,
      dataPagamento: row.dataPagamento,
      emprestimo: {
        emprestimoID: row.emprestimoID,
        dataEmprestimo: row.dataEmprestimo,
        dataDevolucaoPrevista: row.dataDevolucaoPrevista,
        dataDevolucaoReal: row.dataDevolucaoReal,
        exemplar: {
          livro: {
            titulo: row.livroTitulo
          }
        },
        membro: {
          nome: row.membroNome,
          sobrenome: row.membroSobrenome
        }
      }
    }));

    res.json(multas);
  } catch (error) {
    console.error('Erro ao buscar multas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/multas/:id - Buscar multa por ID
router.get('/:id', async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query(`
        SELECT 
          m.MultaID as multaID,
          m.EmprestimoID as emprestimoID,
          m.Valor as valor,
          m.DataGeracao as dataGeracao,
          m.StatusMulta as statusMulta,
          m.DataPagamento as dataPagamento,
          e.DataEmprestimo as dataEmprestimo,
          e.DataDevolucaoPrevista as dataDevolucaoPrevista,
          e.DataDevolucaoReal as dataDevolucaoReal,
          l.Titulo as livroTitulo,
          mb.Nome as membroNome,
          mb.Sobrenome as membroSobrenome
        FROM Multas m
        JOIN Emprestimos e ON m.EmprestimoID = e.EmprestimoID
        JOIN Exemplares ex ON e.ExemplarID = ex.ExemplarID
        JOIN Livros l ON ex.LivroID = l.LivroID
        JOIN Membros mb ON e.MembroID = mb.MembroID
        WHERE m.MultaID = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Multa não encontrada' });
    }

    const row = result.recordset[0];
    const multa = {
      multaID: row.multaID,
      emprestimoID: row.emprestimoID,
      valor: row.valor,
      dataGeracao: row.dataGeracao,
      statusMulta: row.statusMulta,
      dataPagamento: row.dataPagamento,
      emprestimo: {
        emprestimoID: row.emprestimoID,
        dataEmprestimo: row.dataEmprestimo,
        dataDevolucaoPrevista: row.dataDevolucaoPrevista,
        dataDevolucaoReal: row.dataDevolucaoReal,
        exemplar: {
          livro: {
            titulo: row.livroTitulo
          }
        },
        membro: {
          nome: row.membroNome,
          sobrenome: row.membroSobrenome
        }
      }
    };

    res.json(multa);
  } catch (error) {
    console.error('Erro ao buscar multa:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/multas/:id/pagar - Marcar multa como paga
router.post('/:id/pagar', async (req, res) => {
  try {
    const pool = getPool();
    const multaID = parseInt(req.params.id);

    await pool.request()
      .input('multaID', sql.Int, multaID)
      .query(`
        UPDATE Multas 
        SET StatusMulta = 'Paga', DataPagamento = GETDATE()
        WHERE MultaID = @multaID
      `);

    res.json({ message: 'Multa marcada como paga' });
  } catch (error) {
    console.error('Erro ao pagar multa:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;

