import React, { useState, useEffect } from 'react';
import { exemplarService, membroService } from '../services/api';
import { Exemplar, Membro } from '../types';

interface EmprestimoFormProps {
  onSave: (data: any) => void;
  onCancel: () => void;
}

const EmprestimoForm: React.FC<EmprestimoFormProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    exemplarID: '',
    membroID: '',
    dataDevolucaoPrevista: ''
  });

  const [exemplares, setExemplares] = useState<Exemplar[]>([]);
  const [membros, setMembros] = useState<Membro[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (formData.exemplarID) {
      // Calcular data de devolução prevista (14 dias a partir de hoje)
      const hoje = new Date();
      const dataDevolucao = new Date(hoje);
      dataDevolucao.setDate(hoje.getDate() + 14);
      
      setFormData(prev => ({
        ...prev,
        dataDevolucaoPrevista: dataDevolucao.toISOString().split('T')[0]
      }));
    }
  }, [formData.exemplarID]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [exemplaresRes, membrosRes] = await Promise.all([
        exemplarService.getAll(),
        membroService.getAll()
      ]);

      // Filtrar apenas exemplares disponíveis
      const exemplaresDisponiveis = exemplaresRes.data.filter(e => e.statusExemplar === 'Disponível');
      // Filtrar apenas membros ativos
      const membrosAtivos = membrosRes.data.filter(m => m.statusMembro === 'Ativo');

      setExemplares(exemplaresDisponiveis);
      setMembros(membrosAtivos);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      // Dados mockados para demonstração
      setExemplares([
        {
          exemplarID: 1,
          livroID: 1,
          codigoLocalizacao: 'SEC-A, PRAT-3',
          statusExemplar: 'Disponível',
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
        {
          exemplarID: 3,
          livroID: 3,
          codigoLocalizacao: 'SEC-B, PRAT-2',
          statusExemplar: 'Disponível',
          livro: {
            livroID: 3,
            titulo: '1984',
            editoraID: 3,
            isbn: '9788535914849',
            anoPublicacao: 1949,
            edicao: '1ª Edição',
            numeroPaginas: 416,
            sinopse: 'Uma distopia sobre vigilância e controle totalitário.'
          }
        }
      ]);
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
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      exemplarID: parseInt(formData.exemplarID),
      membroID: parseInt(formData.membroID),
      dataDevolucaoPrevista: formData.dataDevolucaoPrevista
    };

    onSave(data);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Exemplar *
        </label>
        <select
          required
          value={formData.exemplarID}
          onChange={(e) => setFormData(prev => ({ ...prev, exemplarID: e.target.value }))}
          className="input-field"
        >
          <option value="">Selecione um exemplar</option>
          {exemplares.map(exemplar => (
            <option key={exemplar.exemplarID} value={exemplar.exemplarID}>
              {exemplar.livro?.titulo} - {exemplar.codigoLocalizacao}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Membro *
        </label>
        <select
          required
          value={formData.membroID}
          onChange={(e) => setFormData(prev => ({ ...prev, membroID: e.target.value }))}
          className="input-field"
        >
          <option value="">Selecione um membro</option>
          {membros.map(membro => (
            <option key={membro.membroID} value={membro.membroID}>
              {membro.nome} {membro.sobrenome} - {membro.email}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Data de Devolução Prevista *
        </label>
        <input
          type="date"
          required
          value={formData.dataDevolucaoPrevista}
          onChange={(e) => setFormData(prev => ({ ...prev, dataDevolucaoPrevista: e.target.value }))}
          className="input-field"
        />
        <p className="mt-1 text-sm text-gray-500">
          Prazo padrão: 14 dias a partir da data do empréstimo
        </p>
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
          Realizar Empréstimo
        </button>
      </div>
    </form>
  );
};

export default EmprestimoForm;

