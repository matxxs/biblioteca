import React, { useState, useEffect, useMemo } from 'react';
import { Autor, Editora, Genero, Livro } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

interface LivroFormProps {
  livro?: Livro | null;
  editoras: Editora[]; 
  autores: Autor[];   
  generos: Genero[];  
  onSave: (data: Livro) => void;
  onCancel: () => void;
}

export const LivroForm: React.FC<LivroFormProps> = ({ 
  livro, 
  onSave, 
  onCancel,
  editoras, 
  autores,  
  generos   
}) => {
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

  useEffect(() => {
    if (livro && editoras.length > 0) {
      setFormData({
        titulo: livro.titulo,
        editoraID: livro.editoraID.toString(),
        isbn: livro.isbn,
        anoPublicacao: livro.anoPublicacao?.toString() || '',
        edicao: livro.edicao || '',
        numeroPaginas: livro.numeroPaginas?.toString() || '',
        sinopse: livro.sinopse || '',
        autores: livro.autores?.map((a: Autor) => a.autorID.toString()) || [],
        generos: livro.generos?.map((g: Genero) => g.generoID.toString()) || []
      });
    } else if (!livro) {
        setFormData({
            titulo: '', editoraID: '', isbn: '', anoPublicacao: '', edicao: '',
            numeroPaginas: '', sinopse: '', autores: [], generos: []
        });
    }
  }, [livro, editoras, autores, generos]);

  const allEditoras = useMemo(() => {
    const combined = [...editoras];
    if (livro?.editora && !combined.some(e => e.editoraID === livro.editora?.editoraID)) {
      combined.push(livro.editora);
    }
    return combined;
  }, [editoras, livro]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data: Livro = {
      livroID: livro?.livroID || 0,
      titulo: formData.titulo,
      editoraID: formData.editoraID ? parseInt(formData.editoraID) : 0,
      isbn: formData.isbn,
      anoPublicacao: formData.anoPublicacao ? parseInt(formData.anoPublicacao) : undefined,
      edicao: formData.edicao,
      numeroPaginas: formData.numeroPaginas ? parseInt(formData.numeroPaginas) : undefined,
      sinopse: formData.sinopse,
      autores: formData.autores.map(id => ({ autorID: parseInt(id) })) as Autor[],
      generos: formData.generos.map(id => ({ generoID: parseInt(id) })) as Genero[]
    };
    onSave(data);
  };
  
  const handleCheckboxChange = (
    id: string,
    checked: boolean | 'indeterminate',
    field: 'autores' | 'generos'
  ) => {
    if (checked === 'indeterminate') return;

    setFormData(prev => ({
      ...prev,
      [field]: checked
        ? [...prev[field], id]
        : prev[field].filter(currentId => currentId !== id)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="titulo">Título</Label>
        <Input id="titulo" value={formData.titulo} onChange={e => setFormData({ ...formData, titulo: e.target.value })} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="edicao">Edição</Label>
        <Input id="edicao" value={formData.edicao} onChange={e => setFormData({ ...formData, edicao: e.target.value })} placeholder="Ex: 1ª, 2ª..." />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="isbn">ISBN</Label>
          <Input id="isbn" value={formData.isbn} onChange={e => setFormData({ ...formData, isbn: e.target.value })} required placeholder="Ex: 978-3-16-148410-0" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="anoPublicacao">Ano</Label>
          <Input id="anoPublicacao" type="number" value={formData.anoPublicacao} onChange={e => setFormData({ ...formData, anoPublicacao: e.target.value })} placeholder="Ex: 2023" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="numeroPaginas">Páginas</Label>
          <Input id="numeroPaginas" type="number" value={formData.numeroPaginas} onChange={e => setFormData({ ...formData, numeroPaginas: e.target.value })} placeholder="Ex: 350" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="editora">Editora</Label>
        <Select value={formData.editoraID} onValueChange={(value) => setFormData({ ...formData, editoraID: value })}>
          <SelectTrigger id="editora" className="w-full">
            <SelectValue placeholder="Selecione uma editora" />
          </SelectTrigger>
          <SelectContent>
            {allEditoras.map(editora => (
              <SelectItem key={editora.editoraID} value={editora.editoraID.toString()}>
                {editora.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Autores</Label>
          <div className="border rounded-md p-3 max-h-40 overflow-y-auto space-y-2">
            {autores.length > 0 ? autores.map(autor => (
              <div key={autor.autorID} className="flex items-center space-x-2">
                <Checkbox id={`autor-${autor.autorID}`} checked={formData.autores.includes(autor.autorID.toString())} onCheckedChange={(checked) => handleCheckboxChange(autor.autorID.toString(), checked, 'autores')} />
                <Label htmlFor={`autor-${autor.autorID}`} className="font-normal cursor-pointer">{autor.nome} {autor.sobrenome}</Label>
              </div>
            )) : <p className="text-sm text-muted-foreground">Carregando autores...</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Gêneros</Label>
          <div className="border rounded-md p-3 max-h-40 overflow-y-auto space-y-2">
            {generos.length > 0 ? generos.map(genero => (
              <div key={genero.generoID} className="flex items-center space-x-2">
                <Checkbox id={`genero-${genero.generoID}`} checked={formData.generos.includes(genero.generoID.toString())} onCheckedChange={(checked) => handleCheckboxChange(genero.generoID.toString(), checked, 'generos')} />
                <Label htmlFor={`genero-${genero.generoID}`} className="font-normal cursor-pointer">{genero.nome}</Label>
              </div>
            )) : <p className="text-sm text-muted-foreground">Carregando gêneros...</p>}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="sinopse">Sinopse</Label>
        <Textarea id="sinopse" value={formData.sinopse} onChange={e => setFormData({ ...formData, sinopse: e.target.value })} placeholder="Escreva a sinopse do livro aqui..." rows={4} />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">Salvar</Button>
      </div>
    </form>
  );
};

