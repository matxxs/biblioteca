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
          l.LivroID, l.Titulo, l.EditoraID, l.ISBN, l.AnoPublicacao, l.Edicao,
          l.NumeroPaginas, l.Sinopse, e.Nome as EditoraNome, e.Contato as EditoraContato
        FROM Livros l
        INNER JOIN Editoras e ON l.EditoraID = e.EditoraID
        ORDER BY l.Titulo
      `);

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
      
      const autores = autoresResult.recordset.map(autor => ({
        autorID: autor.AutorID,
        nome: autor.Nome,
        sobrenome: autor.Sobrenome,
        nacionalidade: autor.Nacionalidade
      }));

      const generos = generosResult.recordset.map(genero => ({
        generoID: genero.GeneroID,
        nome: genero.Nome
      }));

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
        autores: autores, 
        generos: generos 
      };
    }));

    res.json(livros);
  } catch (error) {
    console.error('Erro ao buscar livros:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/livros/editoras - Listar todas as editoras
router.get('/editoras', async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request()
      .query('SELECT EditoraID, Nome, Contato FROM Editoras ORDER BY Nome');

    const editoras = result.recordset.map(editora => ({
      editoraID: editora.EditoraID,
      nome: editora.Nome,
      contato: editora.Contato
    }));

    res.json(editoras);
  } catch (error) {
    console.error('Erro ao buscar editoras:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/livros/autores - Listar todos os autores
router.get('/autores', async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request()
      .query('SELECT AutorID, Nome, Sobrenome, Nacionalidade FROM Autores ORDER BY Nome, Sobrenome');

    const autores = result.recordset.map(autor => ({
      autorID: autor.AutorID,
      nome: autor.Nome,
      sobrenome: autor.Sobrenome,
      nacionalidade: autor.Nacionalidade
    }));

    res.json(autores);
  } catch (error) {
    console.error('Erro ao buscar autores:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/livros/generos - Listar todos os gêneros
router.get('/generos', async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request()
      .query('SELECT GeneroID, Nome FROM Generos ORDER BY Nome');

    const generos = result.recordset.map(genero => ({
      generoID: genero.GeneroID,
      nome: genero.Nome
    }));

    res.json(generos);
  } catch (error) {
    console.error('Erro ao buscar gêneros:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/livros/:id - Buscar livro por ID
router.get('/:id', async (req, res) => {
  // MELHORIA: Validação do ID
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'O ID fornecido é inválido.' });
  }

  try {
    const pool = getPool();
    const result = await pool.request()
      .input('id', sql.Int, id) // Usar o ID validado
      .query(`
        SELECT 
          l.LivroID, l.Titulo, l.EditoraID, l.ISBN, l.AnoPublicacao, l.Edicao,
          l.NumeroPaginas, l.Sinopse, e.Nome as EditoraNome, e.Contato as EditoraContato
        FROM Livros l
        INNER JOIN Editoras e ON l.EditoraID = e.EditoraID
        WHERE l.LivroID = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Livro não encontrado' });
    }

    const livro = result.recordset[0];

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

    // AJUSTE: Mapear autores e gêneros para camelCase
    const autores = autoresResult.recordset.map(autor => ({
      autorID: autor.AutorID,
      nome: autor.Nome,
      sobrenome: autor.Sobrenome,
      nacionalidade: autor.Nacionalidade
    }));

    const generos = generosResult.recordset.map(genero => ({
        generoID: genero.GeneroID,
        nome: genero.Nome
    }));

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
      autores: autores, // Usa o array mapeado
      generos: generos  // Usa o array mapeado
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

    if (autores && autores.length > 0) {
      for (const autor of autores) {
        await transaction.request()
          .input('livroID', sql.Int, livroID)
          .input('autorID', sql.Int, autor.autorID)
          .query('INSERT INTO Livro_Autor (LivroID, AutorID) VALUES (@livroID, @autorID)');
      }
    }

    if (generos && generos.length > 0) {
      for (const genero of generos) {
        await transaction.request()
          .input('livroID', sql.Int, livroID)
          .input('generoID', sql.Int, genero.generoID)
          .query('INSERT INTO Livro_Genero (LivroID, GeneroID) VALUES (@livroID, @generoID)');
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
  // MELHORIA: Validação do ID
  const livroID = parseInt(req.params.id, 10);
  if (isNaN(livroID)) {
    return res.status(400).json({ error: 'O ID fornecido é inválido.' });
  }

  const transaction = new sql.Transaction(getPool());
  
  try {
    await transaction.begin();
    
    const { titulo, editoraID, isbn, anoPublicacao, edicao, numeroPaginas, sinopse, autores, generos } = req.body;
    
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

    await transaction.request()
      .input('livroID', sql.Int, livroID)
      .query('DELETE FROM Livro_Autor WHERE LivroID = @livroID');

    await transaction.request()
      .input('livroID', sql.Int, livroID)
      .query('DELETE FROM Livro_Genero WHERE LivroID = @livroID');

    if (autores && autores.length > 0) {
      for (const autor of autores) {
        await transaction.request()
          .input('livroID', sql.Int, livroID)
          .input('autorID', sql.Int, autor.autorID)
          .query('INSERT INTO Livro_Autor (LivroID, AutorID) VALUES (@livroID, @autorID)');
      }
    }

    if (generos && generos.length > 0) {
      for (const genero of generos) {
        await transaction.request()
          .input('livroID', sql.Int, livroID)
          .input('generoID', sql.Int, genero.generoID)
          .query('INSERT INTO Livro_Genero (LivroID, GeneroID) VALUES (@livroID, @generoID)');
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
  // MELHORIA: Validação do ID
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
      return res.status(400).json({ error: 'O ID fornecido é inválido.' });
  }

  try {
    const pool = getPool();
    const result = await pool.request()
      .input('id', sql.Int, id) // Usar o ID validado
      .query('DELETE FROM Livros WHERE LivroID = @id');

    if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ error: 'Livro não encontrado.' });
    }

    res.json({ message: 'Livro excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir livro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});



module.exports = router;