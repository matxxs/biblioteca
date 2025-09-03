import React, { useState, useEffect } from 'react';
import { Livro } from '../types';

interface LivroFormProps {
  livro?: Livro | null;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const LivroForm: React.FC<LivroFormProps> = ({ livro, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    editoraID: '',
    isbn: '',
    anoPublicacao: '',
    edicao: '',
    numeroPaginas: '',
    sinopse: '',
    autores: [] as string[],
    generos: [] as string[]
  });

  const [editoras] = useState([
    { editoraID: 1, nome: 'Martins Fontes' },
    { editoraID: 2, nome: 'Rocco' },
    { editoraID: 3, nome: 'Companhia das Letras' },
    { editoraID: 4, nome: 'Globo' }
  ]);

  const [autores] = useState([
    { autorID: 1, nome: 'J.R.R.', sobrenome: 'Tolkien' },
    { autorID: 2, nome: 'J.K.', sobrenome: 'Rowling' },
    { autorID: 3, nome: 'George', sobrenome: 'Orwell' },
    { autorID: 4, nome: 'Machado', sobrenome: 'de Assis' }
  ]);

  const [generos] = useState([
    { generoID: 1, nome: 'Fantasia' },
    { generoID: 2, nome: 'Ficção Científica' },
    { generoID: 3, nome: 'Romance' },
    { generoID: 4, nome: 'Literatura Brasileira' }
  ]);

  useEffect(() => {
    if (livro) {
      setFormData({
        titulo: livro.titulo,
        editoraID: livro.editoraID.toString(),
        isbn: livro.isbn,
        anoPublicacao: livro.anoPublicacao?.toString() || '',
        edicao: livro.edicao || '',
        numeroPaginas: livro.numeroPaginas?.toString() || '',
        sinopse: livro.sinopse || '',
        autores: livro.autores?.map(a => a.autorID.toString()) || [],
        generos: livro.generos?.map(g => g.generoID.toString()) || []
      });
    }
  }, [livro]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      ...formData,
      editoraID: parseInt(formData.editoraID),
      anoPublicacao: formData.anoPublicacao ? parseInt(formData.anoPublicacao) : null,
      numeroPaginas: formData.numeroPaginas ? parseInt(formData.numeroPaginas) : null,
      autores: formData.autores.map(id => ({ autorID: parseInt(id) })),
      generos: formData.generos.map(id => ({ generoID: parseInt(id) }))
    };

    onSave(data);
  };

  const handleAutorChange = (autorId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      autores: checked 
        ? [...prev.autores, autorId]
        : prev.autores.filter(id => id !== autorId)
    }));
  };

  const handleGeneroChange = (generoId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      generos: checked 
        ? [...prev.generos, generoId]
        : prev.generos.filter(id => id !== generoId)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Título *
          </label>
          <input
            type="text"
            required
            value={formData.titulo}
            onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            ISBN *
          </label>
          <input
            type="text"
            required
            value={formData.isbn}
            onChange={(e) => setFormData(prev => ({ ...prev, isbn: e.target.value }))}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Editora *
          </label>
          <select
            required
            value={formData.editoraID}
            onChange={(e) => setFormData(prev => ({ ...prev, editoraID: e.target.value }))}
            className="input-field"
          >
            <option value="">Selecione uma editora</option>
            {editoras.map(editora => (
              <option key={editora.editoraID} value={editora.editoraID}>
                {editora.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ano de Publicação
          </label>
          <input
            type="number"
            value={formData.anoPublicacao}
            onChange={(e) => setFormData(prev => ({ ...prev, anoPublicacao: e.target.value }))}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Edição
          </label>
          <input
            type="text"
            value={formData.edicao}
            onChange={(e) => setFormData(prev => ({ ...prev, edicao: e.target.value }))}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Número de Páginas
          </label>
          <input
            type="number"
            value={formData.numeroPaginas}
            onChange={(e) => setFormData(prev => ({ ...prev, numeroPaginas: e.target.value }))}
            className="input-field"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Sinopse
        </label>
        <textarea
          rows={3}
          value={formData.sinopse}
          onChange={(e) => setFormData(prev => ({ ...prev, sinopse: e.target.value }))}
          className="input-field"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Autores
        </label>
        <div className="grid grid-cols-2 gap-2">
          {autores.map(autor => (
            <label key={autor.autorID} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.autores.includes(autor.autorID.toString())}
                onChange={(e) => handleAutorChange(autor.autorID.toString(), e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                {autor.nome} {autor.sobrenome}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Gêneros
        </label>
        <div className="grid grid-cols-2 gap-2">
          {generos.map(genero => (
            <label key={genero.generoID} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.generos.includes(genero.generoID.toString())}
                onChange={(e) => handleGeneroChange(genero.generoID.toString(), e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                {genero.nome}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn-primary"
        >
          {livro ? 'Atualizar' : 'Criar'}
        </button>
      </div>
    </form>
  );
};

export default LivroForm;

