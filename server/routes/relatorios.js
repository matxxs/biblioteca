const express = require('express');
const { getPool, sql } = require('../config/database');
const router = express.Router();

// GET /api/relatorios/livros-mais-emprestados
router.get('/livros-mais-emprestados', async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query(`
      SELECT
        L.Titulo as titulo,
        COUNT(E.EmprestimoID) AS totalEmprestimos
      FROM Livros AS L
      JOIN Exemplares AS EX ON L.LivroID = EX.LivroID
      JOIN Emprestimos AS E ON EX.ExemplarID = E.ExemplarID
      GROUP BY L.Titulo
      ORDER BY TotalEmprestimos DESC
    `);

    res.json(result.recordset);
  } catch (error) {
    console.error('Erro ao buscar livros mais emprestados:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/relatorios/livros-atraso
router.get('/livros-atraso', async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query(`
      SELECT
        L.Titulo as titulo,
        M.Nome + ' ' + M.Sobrenome AS nomeMembro,
        E.DataDevolucaoPrevista as dataDevolucaoPrevista,
        DATEDIFF(day, E.DataDevolucaoPrevista, GETDATE()) AS diasDeAtraso
      FROM Emprestimos AS E
      JOIN Exemplares AS EX ON E.ExemplarID = EX.ExemplarID
      JOIN Livros AS L ON EX.LivroID = L.LivroID
      JOIN Membros AS M ON E.MembroID = M.MembroID
      WHERE E.DataDevolucaoReal IS NULL AND E.DataDevolucaoPrevista < GETDATE()
      ORDER BY DiasDeAtraso DESC
    `);

    res.json(result.recordset);
  } catch (error) {
    console.error('Erro ao buscar livros em atraso:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/relatorios/disponibilidade
router.get('/disponibilidade', async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query(`
      SELECT
        L.Titulo as titulo,
        (SELECT COUNT(*) FROM Exemplares WHERE LivroID = L.LivroID) AS totalExemplares,
        (SELECT COUNT(*) FROM Exemplares WHERE LivroID = L.LivroID AND StatusExemplar = 'Disponível') AS exemplaresDisponiveis,
        (SELECT COUNT(*) FROM Exemplares WHERE LivroID = L.LivroID AND StatusExemplar = 'Emprestado') AS exemplaresEmprestados
      FROM Livros AS L
      ORDER BY L.Titulo
    `);

    res.json(result.recordset);
  } catch (error) {
    console.error('Erro ao buscar disponibilidade:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/relatorios/autores-populares
router.get('/autores-populares', async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query(`
      SELECT
        A.Nome + ' ' + A.Sobrenome AS nomeAutor,
        COUNT(E.EmprestimoID) AS totalEmprestimos
      FROM Autores AS A
      JOIN Livro_Autor AS LA ON A.AutorID = LA.AutorID
      JOIN Exemplares AS EX ON LA.LivroID = EX.LivroID
      JOIN Emprestimos AS E ON EX.ExemplarID = E.ExemplarID
      GROUP BY A.Nome, A.Sobrenome
      ORDER BY TotalEmprestimos DESC
    `);

    res.json(result.recordset);
  } catch (error) {
    console.error('Erro ao buscar autores populares:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/relatorios/generos-populares
router.get('/generos-populares', async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query(`
      SELECT
        G.Nome AS genero,
        COUNT(E.EmprestimoID) AS totalEmprestimos
      FROM Generos AS G
      JOIN Livro_Genero AS LG ON G.GeneroID = LG.GeneroID
      JOIN Exemplares AS EX ON LG.LivroID = EX.LivroID
      JOIN Emprestimos AS E ON EX.ExemplarID = E.ExemplarID
      GROUP BY G.Nome
      ORDER BY TotalEmprestimos DESC
    `);

    res.json(result.recordset);
  } catch (error) {
    console.error('Erro ao buscar gêneros populares:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/relatorios/livros-nunca-emprestados
router.get('/livros-nunca-emprestados', async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query(`
      SELECT
        L.Titulo as titulo,
        E.Nome AS editora
      FROM Livros AS L
      JOIN Editoras AS E ON L.EditoraID = E.EditoraID
      WHERE L.LivroID NOT IN (
        SELECT DISTINCT EX.LivroID
        FROM Emprestimos AS EM
        JOIN Exemplares AS EX ON EM.ExemplarID = EX.ExemplarID
      )
      ORDER BY L.Titulo
    `);

    res.json(result.recordset);
  } catch (error) {
    console.error('Erro ao buscar livros nunca emprestados:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/relatorios/multas-pendentes
router.get('/multas-pendentes', async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query(`
      SELECT
        M.Nome + ' ' + M.Sobrenome AS nomeMembro,
        M.Email as email,
        MU.Valor AS valorMulta,
        MU.DataGeracao as dataGeracao
      FROM Membros AS M
      JOIN Emprestimos AS E ON M.MembroID = E.MembroID
      JOIN Multas AS MU ON E.EmprestimoID = MU.EmprestimoID
      WHERE MU.StatusMulta = 'Pendente'
      ORDER BY ValorMulta DESC
    `);

    res.json(result.recordset);
  } catch (error) {
    console.error('Erro ao buscar multas pendentes:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/relatorios/top-leitores
router.get('/top-leitores', async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query(`
      SELECT TOP 5
        M.Nome + ' ' + M.Sobrenome AS nomeMembro,
        COUNT(E.EmprestimoID) as totalEmprestimos
      FROM Membros AS M
      JOIN Emprestimos AS E ON M.MembroID = E.MembroID
      GROUP BY M.Nome, M.Sobrenome
      ORDER BY TotalEmprestimos DESC
    `);

    res.json(result.recordset);
  } catch (error) {
    console.error('Erro ao buscar top leitores:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/relatorios/historico-membro/:id
router.get('/historico-membro/:id', async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request()
      .input('membroID', sql.Int, req.params.id)
      .query(`
        SELECT
          L.Titulo as titulo,
          E.DataEmprestimo as dataEmprestimo,
          E.DataDevolucaoPrevista as dataDevolucaoPrevista,
          E.DataDevolucaoReal as dataDevolucaoReal,
          CASE
            WHEN E.DataDevolucaoReal IS NULL AND E.DataDevolucaoPrevista < GETDATE() THEN 'Em Atraso'
            WHEN E.DataDevolucaoReal IS NULL THEN 'Emprestado'
            ELSE 'Devolvido'
          END AS status,
          M.Valor AS valorMulta,
          M.DataPagamento AS dataPagamento
        FROM Emprestimos AS E
        JOIN Exemplares AS EX ON E.ExemplarID = EX.ExemplarID
        JOIN Livros AS L ON EX.LivroID = L.LivroID
        LEFT JOIN Multas AS M ON M.EmprestimoID = E.EmprestimoID
        WHERE E.MembroID = @membroID
        ORDER BY E.DataEmprestimo DESC
      `);

    res.json(result.recordset);
  } catch (error) {
    console.error('Erro ao buscar histórico do membro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});


// GET /api/relatorios/total-multas
router.get('/total-multas', async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query(`
      SELECT
        StatusMulta as statusMulta,
        SUM(Valor) AS valorTotal,
        COUNT(MultaID) AS quantidadeMultas
      FROM Multas
      GROUP BY StatusMulta
    `);

    res.json(result.recordset);
  } catch (error) {
    console.error('Erro ao buscar total de multas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;

