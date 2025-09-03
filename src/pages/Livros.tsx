import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { livroService } from '../services/api';
import { Livro } from '../types';
import Modal from '../components/Modal';
import LivroForm from '../components/LivroForm';

const Livros: React.FC = () => {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [filteredLivros, setFilteredLivros] = useState<Livro[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingLivro, setEditingLivro] = useState<Livro | null>(null);
  const [viewingLivro, setViewingLivro] = useState<Livro | null>(null);

  useEffect(() => {
    loadLivros();
  }, []);

  useEffect(() => {
    const filtered = livros.filter(livro =>
      livro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      livro.isbn.includes(searchTerm) ||
      livro.editora?.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLivros(filtered);
  }, [livros, searchTerm]);

  const loadLivros = async () => {
    try {
      setLoading(true);
      const response = await livroService.getAll();
      setLivros(response.data);
    } catch (error) {
      console.error('Erro ao carregar livros:', error);
      // Dados mockados para demonstração
      setLivros([
        {
          livroID: 1,
          titulo: 'O Senhor dos Anéis',
          editoraID: 1,
          isbn: '9788533613379',
          anoPublicacao: 1954,
          edicao: '1ª Edição',
          numeroPaginas: 1216,
          sinopse: 'A história de Frodo e sua jornada para destruir o Um Anel.',
          editora: { editoraID: 1, nome: 'Martins Fontes', contato: 'contato@martinsfontes.com.br' },
          autores: [
            { autorID: 1, nome: 'J.R.R.', sobrenome: 'Tolkien', nacionalidade: 'Inglês' }
          ],
          generos: [
            { generoID: 1, nome: 'Fantasia' }
          ]
        },
        {
          livroID: 2,
          titulo: 'Harry Potter e a Pedra Filosofal',
          editoraID: 2,
          isbn: '9788532511010',
          anoPublicacao: 1997,
          edicao: '1ª Edição',
          numeroPaginas: 264,
          sinopse: 'A história de um jovem bruxo e sua jornada em Hogwarts.',
          editora: { editoraID: 2, nome: 'Rocco', contato: 'contato@rocco.com.br' },
          autores: [
            { autorID: 2, nome: 'J.K.', sobrenome: 'Rowling', nacionalidade: 'Inglesa' }
          ],
          generos: [
            { generoID: 1, nome: 'Fantasia' }
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingLivro(null);
    setShowModal(true);
  };

  const handleEdit = (livro: Livro) => {
    setEditingLivro(livro);
    setShowModal(true);
  };

  const handleView = (livro: Livro) => {
    setViewingLivro(livro);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este livro?')) {
      try {
        await livroService.delete(id);
        await loadLivros();
      } catch (error) {
        console.error('Erro ao excluir livro:', error);
        alert('Erro ao excluir livro');
      }
    }
  };

  const handleSave = async (livroData: any) => {
    try {
      if (editingLivro) {
        await livroService.update(editingLivro.livroID, livroData);
      } else {
        await livroService.create(livroData);
      }
      setShowModal(false);
      await loadLivros();
    } catch (error) {
      console.error('Erro ao salvar livro:', error);
      alert('Erro ao salvar livro');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Livros</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie o acervo da biblioteca
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Livro
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por título, ISBN ou editora..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Título</th>
                <th>ISBN</th>
                <th>Editora</th>
                <th>Ano</th>
                <th>Autores</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredLivros.map((livro) => (
                <tr key={livro.livroID}>
                  <td>
                    <div>
                      <div className="font-medium text-gray-900">{livro.titulo}</div>
                      {livro.edicao && (
                        <div className="text-sm text-gray-500">{livro.edicao}</div>
                      )}
                    </div>
                  </td>
                  <td className="font-mono text-sm">{livro.isbn}</td>
                  <td>{livro.editora?.nome}</td>
                  <td>{livro.anoPublicacao}</td>
                  <td>

                    {livro.autores?.map(autor => 
                      `${autor.nome} ${autor.sobrenome}` 
                    ).join(', ')}
                  </td>
                  <td>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleView(livro)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Visualizar"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(livro)}
                        className="text-yellow-600 hover:text-yellow-900"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(livro.livroID)}
                        className="text-red-600 hover:text-red-900"
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={viewingLivro ? 'Detalhes do Livro' : editingLivro ? 'Editar Livro' : 'Novo Livro'}
      >
        {viewingLivro ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Título</label>
              <p className="mt-1 text-sm text-gray-900">{viewingLivro.titulo}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">ISBN</label>
              <p className="mt-1 text-sm text-gray-900 font-mono">{viewingLivro.isbn}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Editora</label>
              <p className="mt-1 text-sm text-gray-900">{viewingLivro.editora?.nome}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Ano de Publicação</label>
              <p className="mt-1 text-sm text-gray-900">{viewingLivro.anoPublicacao}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Autores</label>
              <p className="mt-1 text-sm text-gray-900">
                {viewingLivro.autores?.map(autor => 
                  `${autor.nome} ${autor.sobrenome}`
                ).join(', ')}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Gêneros</label>
              <p className="mt-1 text-sm text-gray-900">
                {viewingLivro.generos?.map(genero => genero.nome).join(', ')}
              </p>
            </div>
            {viewingLivro.sinopse && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Sinopse</label>
                <p className="mt-1 text-sm text-gray-900">{viewingLivro.sinopse}</p>
              </div>
            )}
          </div>
        ) : (
          <LivroForm
            livro={editingLivro}
            onSave={handleSave}
            onCancel={() => setShowModal(false)}
          />
        )}
      </Modal>
    </div>
  );
};

export default Livros;

