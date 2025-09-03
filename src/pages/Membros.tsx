import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, UserCheck, UserX } from 'lucide-react';
import { membroService } from '../services/api';
import { Membro } from '../types';
import Modal from '../components/Modal';
import MembroForm from '../components/MembroForm';

const Membros: React.FC = () => {
  const [membros, setMembros] = useState<Membro[]>([]);
  const [filteredMembros, setFilteredMembros] = useState<Membro[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMembro, setEditingMembro] = useState<Membro | null>(null);
  const [viewingMembro, setViewingMembro] = useState<Membro | null>(null);

  useEffect(() => {
    loadMembros();
  }, []);

  useEffect(() => {
    const filtered = membros.filter(membro =>
      membro.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      membro.sobrenome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      membro.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMembros(filtered);
  }, [membros, searchTerm]);

  const loadMembros = async () => {
    try {
      setLoading(true);
      const response = await membroService.getAll();
      setMembros(response.data);
    } catch (error) {
      console.error('Erro ao carregar membros:', error);
      // Dados mockados para demonstração
      setMembros([
        {
          membroID: 1,
          nome: 'João',
          sobrenome: 'Silva',
          dataNascimento: '1990-05-15',
          endereco: 'Rua das Flores, 123',
          telefone: '(11) 99999-9999',
          email: 'joao.silva@email.com',
          dataCadastro: '2023-01-15T10:00:00Z',
          statusMembro: 'Ativo'
        },
        {
          membroID: 2,
          nome: 'Maria',
          sobrenome: 'Santos',
          dataNascimento: '1985-08-22',
          endereco: 'Av. Paulista, 456',
          telefone: '(11) 88888-8888',
          email: 'maria.santos@email.com',
          dataCadastro: '2023-02-20T14:30:00Z',
          statusMembro: 'Ativo'
        },
        {
          membroID: 3,
          nome: 'Pedro',
          sobrenome: 'Oliveira',
          dataNascimento: '1992-12-10',
          endereco: 'Rua da Paz, 789',
          telefone: '(11) 77777-7777',
          email: 'pedro.oliveira@email.com',
          dataCadastro: '2023-03-10T09:15:00Z',
          statusMembro: 'Bloqueado'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingMembro(null);
    setShowModal(true);
  };

  const handleEdit = (membro: Membro) => {
    setEditingMembro(membro);
    setShowModal(true);
  };

  const handleView = (membro: Membro) => {
    setViewingMembro(membro);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este membro?')) {
      try {
        await membroService.delete(id);
        await loadMembros();
      } catch (error) {
        console.error('Erro ao excluir membro:', error);
        alert('Erro ao excluir membro');
      }
    }
  };

  const handleToggleStatus = async (membro: Membro) => {
    const newStatus = membro.statusMembro === 'Ativo' ? 'Bloqueado' : 'Ativo';
    try {
      await membroService.patchStatus(membro.membroID, { statusMembro: newStatus });
      await loadMembros();
    } catch (error) {
      console.error('Erro ao alterar status do membro:', error);
      alert('Erro ao alterar status do membro');
    }
  };

  const handleSave = async (membroData: any) => {
    try {
      if (editingMembro) {
        await membroService.update(editingMembro.membroID, membroData);
      } else {
        await membroService.create(membroData);
      }
      setShowModal(false);
      await loadMembros();
    } catch (error) {
      console.error('Erro ao salvar membro:', error);
      alert('Erro ao salvar membro');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      'Ativo': 'bg-green-100 text-green-800',
      'Inativo': 'bg-gray-100 text-gray-800',
      'Bloqueado': 'bg-red-100 text-red-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status as keyof typeof statusClasses]}`}>
        {status}
      </span>
    );
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
          <h1 className="text-2xl font-bold text-gray-900">Membros</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie os membros da biblioteca
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Membro
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por nome ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="card">
          <div className="flex items-center">
            <UserCheck className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Membros Ativos</p>
              <p className="text-2xl font-semibold text-gray-900">
                {membros.filter(m => m.statusMembro === 'Ativo').length}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <UserX className="h-8 w-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Membros Bloqueados</p>
              <p className="text-2xl font-semibold text-gray-900">
                {membros.filter(m => m.statusMembro === 'Bloqueado').length}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <UserCheck className="h-8 w-8 text-gray-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total de Membros</p>
              <p className="text-2xl font-semibold text-gray-900">{membros.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>Data de Cadastro</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembros.map((membro) => (
                <tr key={membro.membroID}>
                  <td>
                    <div>
                      <div className="font-medium text-gray-900">
                        {membro.nome} {membro.sobrenome}
                      </div>
                      <div className="text-sm text-gray-500">{membro.endereco}</div>
                    </div>
                  </td>
                  <td>{membro.email}</td>
                  <td>{membro.telefone}</td>
                  <td>{new Date(membro.dataCadastro).toLocaleDateString('pt-BR')}</td>
                  <td>{getStatusBadge(membro.statusMembro)}</td>
                  <td>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleView(membro)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Visualizar"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(membro)}
                        className="text-yellow-600 hover:text-yellow-900"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(membro)}
                        className={membro.statusMembro === 'Ativo' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}
                        title={membro.statusMembro === 'Ativo' ? 'Bloquear' : 'Ativar'}
                      >
                        {membro.statusMembro === 'Ativo' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => handleDelete(membro.membroID)}
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
        title={viewingMembro ? 'Detalhes do Membro' : editingMembro ? 'Editar Membro' : 'Novo Membro'}
      >
        {viewingMembro ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
              <p className="mt-1 text-sm text-gray-900">{viewingMembro.nome} {viewingMembro.sobrenome}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-sm text-gray-900">{viewingMembro.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Telefone</label>
              <p className="mt-1 text-sm text-gray-900">{viewingMembro.telefone}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Endereço</label>
              <p className="mt-1 text-sm text-gray-900">{viewingMembro.endereco}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
              <p className="mt-1 text-sm text-gray-900">
                {viewingMembro.dataNascimento ? new Date(viewingMembro.dataNascimento).toLocaleDateString('pt-BR') : 'Não informado'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Data de Cadastro</label>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(viewingMembro.dataCadastro).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <div className="mt-1">
                {getStatusBadge(viewingMembro.statusMembro)}
              </div>
            </div>
          </div>
        ) : (
          <MembroForm
            membro={editingMembro}
            onSave={handleSave}
            onCancel={() => setShowModal(false)}
          />
        )}
      </Modal>
    </div>
  );
};

export default Membros;

