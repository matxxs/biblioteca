import { Membro } from '@/types';
import React, { useState, useEffect } from 'react';


interface MembroFormProps {
  membro?: Membro | null;
  onSave: (data: Membro) => void;
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
      nome: formData.nome || null,
      sobrenome: formData.sobrenome || null,
      dataNascimento: formData.dataNascimento || null,
      endereco: formData.endereco || null,
      telefone: formData.telefone || null,
      email: formData.email || null,
      statusMembro: formData.statusMembro || "Ativo",
    };

    onSave(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

    </form>
  );
};

export default MembroForm;

