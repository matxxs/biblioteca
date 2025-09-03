import React, { useState, useEffect } from 'react';
import { Membro } from '../types';

interface MembroFormProps {
  membro?: Membro | null;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const MembroForm: React.FC<MembroFormProps> = ({ membro, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    dataNascimento: '',
    endereco: '',
    telefone: '',
    email: '',
    statusMembro: 'Ativo' as 'Ativo' | 'Inativo' | 'Bloqueado'
  });

  useEffect(() => {
    if (membro) {
      setFormData({
        nome: membro.nome,
        sobrenome: membro.sobrenome,
        dataNascimento: membro.dataNascimento || '',
        endereco: membro.endereco,
        telefone: membro.telefone || '',
        email: membro.email,
        statusMembro: membro.statusMembro
      });
    }
  }, [membro]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      ...formData,
      dataNascimento: formData.dataNascimento || null,
      telefone: formData.telefone || null
    };

    onSave(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nome *
          </label>
          <input
            type="text"
            required
            value={formData.nome}
            onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Sobrenome *
          </label>
          <input
            type="text"
            required
            value={formData.sobrenome}
            onChange={(e) => setFormData(prev => ({ ...prev, sobrenome: e.target.value }))}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Data de Nascimento
          </label>
          <input
            type="date"
            value={formData.dataNascimento}
            onChange={(e) => setFormData(prev => ({ ...prev, dataNascimento: e.target.value }))}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Telefone
          </label>
          <input
            type="tel"
            value={formData.telefone}
            onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
            className="input-field"
            placeholder="(11) 99999-9999"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Email *
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="input-field"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Endereço *
          </label>
          <input
            type="text"
            required
            value={formData.endereco}
            onChange={(e) => setFormData(prev => ({ ...prev, endereco: e.target.value }))}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            value={formData.statusMembro}
            onChange={(e) => setFormData(prev => ({ ...prev, statusMembro: e.target.value as 'Ativo' | 'Inativo' | 'Bloqueado' }))}
            className="input-field"
          >
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
            <option value="Bloqueado">Bloqueado</option>
          </select>
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
          {membro ? 'Atualizar' : 'Criar'}
        </button>
      </div>
    </form>
  );
};

export default MembroForm;

