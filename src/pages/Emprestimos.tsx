import React, { useState, useEffect } from 'react';
import { Plus, Search, RotateCcw, AlertTriangle, CheckCircle } from 'lucide-react';
import { emprestimoService } from '../services/api';
import { Emprestimo } from '../types';
import Modal from '../components/Modal';
import EmprestimoForm from '../components/EmprestimoForm';

const Emprestimos: React.FC = () => {
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([]);
  const [filteredEmprestimos, setFilteredEmprestimos] = useState<Emprestimo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'todos' | 'ativos' | 'atrasados' | 'devolvidos'>('todos');

  useEffect(() => {
    loadEmprestimos();
  }, []);

  useEffect(() => {
    let filtered = emprestimos;

    // Filtro por status
    switch (filterStatus) {
      case 'ativos':
        filtered = filtered.filter(e => !e.dataDevolucaoReal);
        break;
      case 'atrasados':
        filtered = filtered.filter(e =>
          !e.dataDevolucaoReal &&
          new Date(e.dataDevolucaoPrevista) < new Date()
        );
        break;
      case 'devolvidos':
        filtered = filtered.filter(e => e.dataDevolucaoReal);
        break;
    }

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(emprestimo =>
        emprestimo.exemplar?.livro?.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emprestimo.membro?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emprestimo.membro?.sobrenome.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEmprestimos(filtered);
  }, [emprestimos, searchTerm, filterStatus]);

  const loadEmprestimos = async () => {
    try {
      setLoading(true);
      const response = await emprestimoService.getAll();
      setEmprestimos(response.data);
    } catch (error) {
      console.error('Erro ao carregar empréstimos:', error);
      // Dados mockados para demonstração
      setEmprestimos([
        {
          emprestimoID: 1,
          exemplarID: 1,
          membroID: 1,
          dataEmprestimo: '2024-01-10T10:00:00Z',
          dataDevolucaoPrevista: '2024-01-24',
          dataDevolucaoReal: undefined,
          exemplar: {
            exemplarID: 1,
            livroID: 1,
            codigoLocalizacao: 'SEC-A, PRAT-3',
            statusExemplar: 'Emprestado',
            livro: {
              livroID: 1,
              titulo: 'O Senhor dos Anéis',
              editoraID: 1,
              isbn: '9788533613379',
              anoPublicacao: 1954,
              edicao: '1ª Edição',
              numeroPaginas: 1216,
              sinopse: 'A história de Frodo e sua jornada para destruir o Um Anel.'
            }
          },
          membro: {
            membroID: 1,
            nome: 'João',
            sobrenome: 'Silva',
            dataNascimento: '1990-05-15',
            endereco: 'Rua das Flores, 123',
            telefone: '(11) 99999-9999',
            email: 'joao.silva@email.com',
            dataCadastro: '2023-01-15T10:00:00Z',
            statusMembro: 'Ativo'
          }
        },
        {
          emprestimoID: 2,
          exemplarID: 2,
          membroID: 2,
          dataEmprestimo: '2024-01-05T14:30:00Z',
          dataDevolucaoPrevista: '2024-01-19',
          dataDevolucaoReal: '2024-01-18T16:00:00Z',
          exemplar: {
            exemplarID: 2,
            livroID: 2,
            codigoLocalizacao: 'SEC-B, PRAT-1',
            statusExemplar: 'Disponível',
            livro: {
              livroID: 2,
              titulo: 'Harry Potter e a Pedra Filosofal',
              editoraID: 2,
              isbn: '9788532511010',
              anoPublicacao: 1997,
              edicao: '1ª Edição',
              numeroPaginas: 264,
              sinopse: 'A história de um jovem bruxo e sua jornada em Hogwarts.'
            }
          },
          membro: {
            membroID: 2,
            nome: 'Maria',
            sobrenome: 'Santos',
            dataNascimento: '1985-08-22',
            endereco: 'Av. Paulista, 456',
            telefone: '(11) 88888-8888',
            email: 'maria.santos@email.com',
            dataCadastro: '2023-02-20T14:30:00Z',
            statusMembro: 'Ativo'
          }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setShowModal(true);
  };

  const handleDevolver = async (emprestimo: Emprestimo) => {
    if (window.confirm(`Confirmar devolução do livro "${emprestimo.exemplar?.livro?.titulo}"?`)) {
      try {
        await emprestimoService.devolver(emprestimo.emprestimoID);
        await loadEmprestimos();
      } catch (error) {
        console.error('Erro ao devolver livro:', error);
        alert('Erro ao devolver livro');
      }
    }
  };

  const getStatusBadge = (emprestimo: Emprestimo) => {
    if (emprestimo.dataDevolucaoReal) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Devolvido
        </span>
      );
    }

    const isAtrasado = new Date(emprestimo.dataDevolucaoPrevista) < new Date();
    if (isAtrasado) {

      const hoje = new Date();
      const hojeUTC = Date.UTC(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());

      const dataPrevistaObj = new Date(emprestimo.dataDevolucaoPrevista);
      const dataPrevistaUTC = Date.UTC(dataPrevistaObj.getUTCFullYear(), dataPrevistaObj.getUTCMonth(), dataPrevistaObj.getUTCDate());

      const diffTime = hojeUTC - dataPrevistaUTC;

      const diasAtraso = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Atrasado ({diasAtraso} dias)
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        Emprestado
      </span>
    );
  };

  const getStats = () => {
    const ativos = emprestimos.filter(e => !e.dataDevolucaoReal).length;
    const atrasados = emprestimos.filter(e =>
      !e.dataDevolucaoReal &&
      new Date(e.dataDevolucaoPrevista) < new Date()
    ).length;
    const devolvidos = emprestimos.filter(e => e.dataDevolucaoReal).length;

    return { ativos, atrasados, devolvidos };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Empréstimos</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie os empréstimos da biblioteca
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Empréstimo
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-500">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Empréstimos Ativos</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.ativos}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-500">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Em Atraso</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.atrasados}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-500">
              <RotateCcw className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Devolvidos</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.devolvidos}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por livro ou membro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <label htmlFor="filterStatus" className="sr-only">Filtrar por status</label>
        <select
          id="filterStatus"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="input-field sm:w-48"
        >
          <option value="todos">Todos</option>
          <option value="ativos">Ativos</option>
          <option value="atrasados">Em Atraso</option>
          <option value="devolvidos">Devolvidos</option>
        </select>
      </div>

      {/* Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Livro</th>
                <th>Membro</th>
                <th>Data Empréstimo</th>
                <th>Data Prevista</th>
                <th>Data Devolução</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmprestimos.map((emprestimo) => (
                <tr key={emprestimo.emprestimoID}>
                  <td>
                    <div>
                      <div className="font-medium text-gray-900">
                        {emprestimo.exemplar?.livro?.titulo}
                      </div>
                      <div className="text-sm text-gray-500">
                        {emprestimo.exemplar?.codigoLocalizacao}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div className="font-medium text-gray-900">
                        {emprestimo.membro?.nome} {emprestimo.membro?.sobrenome}
                      </div>
                      <div className="text-sm text-gray-500">
                        {emprestimo.membro?.email}
                      </div>
                    </div>
                  </td>
                  <td>{new Date(emprestimo.dataEmprestimo).toLocaleDateString('pt-BR')}</td>
                  <td>{new Date(emprestimo.dataDevolucaoPrevista).toLocaleDateString('pt-BR')}</td>
                  <td>
                    {emprestimo.dataDevolucaoReal
                      ? new Date(emprestimo.dataDevolucaoReal).toLocaleDateString('pt-BR')
                      : '-'
                    }
                  </td>
                  <td>{getStatusBadge(emprestimo)}</td>
                  <td>
                    {!emprestimo.dataDevolucaoReal && (
                      <button
                        onClick={() => handleDevolver(emprestimo)}
                        className="btn-primary text-sm flex items-center"
                      >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Devolver
                      </button>
                    )}
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
        title="Novo Empréstimo"
      >
        <EmprestimoForm
          onSave={async () => {
            setShowModal(false);
            await loadEmprestimos();
          }}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
};

export default Emprestimos;

