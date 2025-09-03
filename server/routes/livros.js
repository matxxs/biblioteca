const express = require('express');
const { getPool, sql } = require('../config/database');
const router = express.Router();

// GET /api/livros - Listar todos os livros
router.get('/', async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request()
      .query(`
        SELECT 
          l.LivroID,
          l.Titulo,
          l.EditoraID,
          l.ISBN,
          l.AnoPublicacao,
          l.Edicao,
          l.NumeroPaginas,
          l.Sinopse,
          e.Nome as EditoraNome,
          e.Contato as EditoraContato
        FROM Livros l
        INNER JOIN Editoras e ON l.EditoraID = e.EditoraID
        ORDER BY l.Titulo
      `);

    // Buscar autores para cada livro
    const livros = await Promise.all(result.recordset.map(async (livro) => {
      const autoresResult = await pool.request()
        .input('livroID', sql.Int, livro.LivroID)
        .query(`
          SELECT a.AutorID, a.Nome, a.Sobrenome, a.Nacionalidade
          FROM Autores a
          INNER JOIN Livro_Autor la ON a.AutorID = la.AutorID
          WHERE la.LivroID = @livroID
        `);

      const generosResult = await pool.request()
        .input('livroID', sql.Int, livro.LivroID)
        .query(`
          SELECT g.GeneroID, g.Nome
          FROM Generos g
          INNER JOIN Livro_Genero lg ON g.GeneroID = lg.GeneroID
          WHERE lg.LivroID = @livroID
        `);

      return {
        livroID: livro.LivroID,
        titulo: livro.Titulo,
        editoraID: livro.EditoraID,
        isbn: livro.ISBN,
        anoPublicacao: livro.AnoPublicacao,
        edicao: livro.Edicao,
        numeroPaginas: livro.NumeroPaginas,
        sinopse: livro.Sinopse,
        editora: {
          editoraID: livro.EditoraID,
          nome: livro.EditoraNome,
          contato: livro.EditoraContato
        },
        autores: autoresResult.recordset,
        generos: generosResult.recordset
      };
    }));

    res.json(livros);
  } catch (error) {
    console.error('Erro ao buscar livros:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/livros/:id - Buscar livro por ID
router.get('/:id', async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query(`
        SELECT 
          l.LivroID,
          l.Titulo,
          l.EditoraID,
          l.ISBN,
          l.AnoPublicacao,
          l.Edicao,
          l.NumeroPaginas,
          l.Sinopse,
          e.Nome as EditoraNome,
          e.Contato as EditoraContato
        FROM Livros l
        INNER JOIN Editoras e ON l.EditoraID = e.EditoraID
        WHERE l.LivroID = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Livro não encontrado' });
    }

    const livro = result.recordset[0];

    // Buscar autores e gêneros
    const [autoresResult, generosResult] = await Promise.all([
      pool.request()
        .input('livroID', sql.Int, livro.LivroID)
        .query(`
          SELECT a.AutorID, a.Nome, a.Sobrenome, a.Nacionalidade
          FROM Autores a
          INNER JOIN Livro_Autor la ON a.AutorID = la.AutorID
          WHERE la.LivroID = @livroID
        `),
      pool.request()
        .input('livroID', sql.Int, livro.LivroID)
        .query(`
          SELECT g.GeneroID, g.Nome
          FROM Generos g
          INNER JOIN Livro_Genero lg ON g.GeneroID = lg.GeneroID
          WHERE lg.LivroID = @livroID
        `)
    ]);

    const livroCompleto = {
      livroID: livro.LivroID,
      titulo: livro.Titulo,
      editoraID: livro.EditoraID,
      isbn: livro.ISBN,
      anoPublicacao: livro.AnoPublicacao,
      edicao: livro.Edicao,
      numeroPaginas: livro.NumeroPaginas,
      sinopse: livro.Sinopse,
      editora: {
        editoraID: livro.EditoraID,
        nome: livro.EditoraNome,
        contato: livro.EditoraContato
      },
      autores: autoresResult.recordset,
      generos: generosResult.recordset
    };

    res.json(livroCompleto);
  } catch (error) {
    console.error('Erro ao buscar livro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/livros - Criar novo livro
router.post('/', async (req, res) => {
  const transaction = new sql.Transaction(getPool());
  
  try {
    await transaction.begin();
    
    const { titulo, editoraID, isbn, anoPublicacao, edicao, numeroPaginas, sinopse, autores, generos } = req.body;

    // Inserir livro
    const livroResult = await transaction.request()
      .input('titulo', sql.NVarChar, titulo)
      .input('editoraID', sql.Int, editoraID)
      .input('isbn', sql.VarChar, isbn)
      .input('anoPublicacao', sql.Int, anoPublicacao)
      .input('edicao', sql.NVarChar, edicao)
      .input('numeroPaginas', sql.Int, numeroPaginas)
      .input('sinopse', sql.NVarChar, sinopse)
      .query(`
        INSERT INTO Livros (Titulo, EditoraID, ISBN, AnoPublicacao, Edicao, NumeroPaginas, Sinopse)
        OUTPUT INSERTED.LivroID
        VALUES (@titulo, @editoraID, @isbn, @anoPublicacao, @edicao, @numeroPaginas, @sinopse)
      `);

    const livroID = livroResult.recordset[0].LivroID;

    // Inserir relações com autores
    if (autores && autores.length > 0) {
      for (const autor of autores) {
        await transaction.request()
          .input('livroID', sql.Int, livroID)
          .input('autorID', sql.Int, autor.autorID)
          .query(`
            INSERT INTO Livro_Autor (LivroID, AutorID)
            VALUES (@livroID, @autorID)
          `);
      }
    }

    // Inserir relações com gêneros
    if (generos && generos.length > 0) {
      for (const genero of generos) {
        await transaction.request()
          .input('livroID', sql.Int, livroID)
          .input('generoID', sql.Int, genero.generoID)
          .query(`
            INSERT INTO Livro_Genero (LivroID, GeneroID)
            VALUES (@livroID, @generoID)
          `);
      }
    }

    await transaction.commit();
    res.status(201).json({ livroID, message: 'Livro criado com sucesso' });
  } catch (error) {
    await transaction.rollback();
    console.error('Erro ao criar livro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /api/livros/:id - Atualizar livro
router.put('/:id', async (req, res) => {
  const transaction = new sql.Transaction(getPool());
  
  try {
    await transaction.begin();
    
    const { titulo, editoraID, isbn, anoPublicacao, edicao, numeroPaginas, sinopse, autores, generos } = req.body;
    const livroID = parseInt(req.params.id);

    // Atualizar livro
    await transaction.request()
      .input('livroID', sql.Int, livroID)
      .input('titulo', sql.NVarChar, titulo)
      .input('editoraID', sql.Int, editoraID)
      .input('isbn', sql.VarChar, isbn)
      .input('anoPublicacao', sql.Int, anoPublicacao)
      .input('edicao', sql.NVarChar, edicao)
      .input('numeroPaginas', sql.Int, numeroPaginas)
      .input('sinopse', sql.NVarChar, sinopse)
      .query(`
        UPDATE Livros 
        SET Titulo = @titulo, EditoraID = @editoraID, ISBN = @isbn, 
            AnoPublicacao = @anoPublicacao, Edicao = @edicao, 
            NumeroPaginas = @numeroPaginas, Sinopse = @sinopse
        WHERE LivroID = @livroID
      `);

    // Remover relações existentes
    await transaction.request()
      .input('livroID', sql.Int, livroID)
      .query('DELETE FROM Livro_Autor WHERE LivroID = @livroID');

    await transaction.request()
      .input('livroID', sql.Int, livroID)
      .query('DELETE FROM Livro_Genero WHERE LivroID = @livroID');

    // Inserir novas relações com autores
    if (autores && autores.length > 0) {
      for (const autor of autores) {
        await transaction.request()
          .input('livroID', sql.Int, livroID)
          .input('autorID', sql.Int, autor.autorID)
          .query(`
            INSERT INTO Livro_Autor (LivroID, AutorID)
            VALUES (@livroID, @autorID)
          `);
      }
    }

    // Inserir novas relações com gêneros
    if (generos && generos.length > 0) {
      for (const genero of generos) {
        await transaction.request()
          .input('livroID', sql.Int, livroID)
          .input('generoID', sql.Int, genero.generoID)
          .query(`
            INSERT INTO Livro_Genero (LivroID, GeneroID)
            VALUES (@livroID, @generoID)
          `);
      }
    }

    await transaction.commit();
    res.json({ message: 'Livro atualizado com sucesso' });
  } catch (error) {
    await transaction.rollback();
    console.error('Erro ao atualizar livro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE /api/livros/:id - Excluir livro
router.delete('/:id', async (req, res) => {
  try {
    const pool = getPool();
    await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('DELETE FROM Livros WHERE LivroID = @id');

    res.json({ message: 'Livro excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir livro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;

