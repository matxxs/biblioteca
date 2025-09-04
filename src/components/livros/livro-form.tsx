"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Autor, Editora, Exemplar, Genero, Livro } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { exemplarService } from "@/services/api";
import { MoreHorizontal, PlusCircle } from "lucide-react";

interface LivroFormProps {
  livro?: Livro | null;
  editoras: Editora[];
  autores: Autor[];
  generos: Genero[];
  onSave: (data: Livro) => void;
  onCancel: () => void;
}

export function LivroForm({
  livro,
  onSave,
  onCancel,
  editoras,
  autores,
  generos,
}: LivroFormProps) {
  const [formData, setFormData] = useState({
    titulo: "",
    editoraID: "",
    isbn: "",
    anoPublicacao: "",
    edicao: "",
    numeroPaginas: "",
    sinopse: "",
    autores: [] as string[],
    generos: [] as string[],
  });

  const [exemplares, setExemplares] = useState<Exemplar[]>([]);
  const [isLoadingExemplares, setIsLoadingExemplares] = useState(false);
  const [isAddingExemplar, setIsAddingExemplar] = useState(false);
  const [novoCodigoLocalizacao, setNovoCodigoLocalizacao] = useState("");
  const [activeTab, setActiveTab] = useState<'detalhes' | 'exemplares'>('detalhes');

  const fetchExemplares = useCallback(async () => {
    if (!livro?.livroID) {
      setExemplares([]);
      return;
    }
    setIsLoadingExemplares(true);
    try {
      const response = await exemplarService.getByLivroId(livro.livroID);
      const data = response.data;
      setExemplares(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao buscar exemplares:", error);
      setExemplares([]);
    } finally {
      setIsLoadingExemplares(false);
    }
  }, [livro?.livroID]);

  useEffect(() => {
    if (livro) {
      setActiveTab('detalhes'); // Sempre volta para a aba de detalhes ao abrir
      setFormData({
        titulo: livro.titulo,
        editoraID: livro.editoraID.toString(),
        isbn: livro.isbn,
        anoPublicacao: livro.anoPublicacao?.toString() || "",
        edicao: livro.edicao || "",
        numeroPaginas: livro.numeroPaginas?.toString() || "",
        sinopse: livro.sinopse || "",
        autores: livro.autores?.map((a: Autor) => a.autorID.toString()) || [],
        generos: livro.generos?.map((g: Genero) => g.generoID.toString()) || [],
      });
      fetchExemplares();
    } else {
      setFormData({
        titulo: "", editoraID: "", isbn: "", anoPublicacao: "", edicao: "",
        numeroPaginas: "", sinopse: "", autores: [], generos: [],
      });
      setExemplares([]);
    }
  }, [livro, fetchExemplares]);

  const allEditoras = useMemo(() => {
    const combined = [...editoras];
    if (livro?.editora && !combined.some((e) => e.editoraID === livro.editora?.editoraID)) {
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
      autores: formData.autores.map((id) => ({ autorID: parseInt(id) })) as Autor[],
      generos: formData.generos.map((id) => ({ generoID: parseInt(id) })) as Genero[],
    };
    onSave(data);
  };

  const handleCheckboxChange = (id: string, checked: boolean | "indeterminate", field: "autores" | "generos") => {
    if (checked === "indeterminate") return;
    setFormData((prev) => ({
      ...prev,
      [field]: checked ? [...prev[field], id] : prev[field].filter((currentId) => currentId !== id),
    }));
  };

  const handleStatusChange = async (exemplarID: number, novoStatus: string) => {
    try {
      await exemplarService.patchUpdateStatus(exemplarID, novoStatus);
      alert("Status do exemplar atualizado com sucesso!");
      fetchExemplares();
    } catch (error) {
      console.error("Erro ao atualizar status do exemplar:", error);
      alert("Falha ao atualizar o status.");
    }
  };

  const handleSaveNewExemplar = async () => {
    if (!novoCodigoLocalizacao.trim() || !livro?.livroID) {
      alert("Por favor, informe o Código de Localização.");
      return;
    }
    try {
      await exemplarService.create({
        livroID: livro.livroID,
        codigoLocalizacao: novoCodigoLocalizacao,
        statusExemplar: "Disponível",
      });
      alert("Exemplar adicionado com sucesso!");
      setNovoCodigoLocalizacao("");
      setIsAddingExemplar(false);
      await fetchExemplares();
    } catch (error) {
      console.error("Erro ao criar exemplar:", error);
      alert("Falha ao adicionar exemplar.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full max-h-[85vh]">
      {livro && (
        <div className="flex-shrink-0 border-b mb-4">
          <div className="flex space-x-2">
            <Button
              type="button"
              variant={activeTab === 'detalhes' ? 'secondary' : 'ghost'}
              onClick={() => setActiveTab('detalhes')}
              className="rounded-b-none"
            >
              Detalhes
            </Button>
            <Button
              type="button"
              variant={activeTab === 'exemplares' ? 'secondary' : 'ghost'}
              onClick={() => setActiveTab('exemplares')}
              className="rounded-b-none"
            >
              Exemplares
            </Button>
          </div>
        </div>
      )}

      <div className="flex-grow overflow-y-auto pr-4">
        {/* Seção de Detalhes do Livro (condicional) */}
        <div className={`${activeTab === 'detalhes' || !livro ? 'block' : 'hidden'} space-y-6`}>
          <div className="space-y-2">
            <Label htmlFor="titulo">Título</Label>
            <Input id="titulo" value={formData.titulo} onChange={(e) => setFormData({ ...formData, titulo: e.target.value })} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edicao">Edição</Label>
            <Input id="edicao" value={formData.edicao} onChange={(e) => setFormData({ ...formData, edicao: e.target.value })} placeholder="Ex: 1ª, 2ª..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="isbn">ISBN</Label>
              <Input id="isbn" value={formData.isbn} onChange={(e) => setFormData({ ...formData, isbn: e.target.value })} required placeholder="Ex: 978-3-16-148410-0" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="anoPublicacao">Ano</Label>
              <Input id="anoPublicacao" type="number" value={formData.anoPublicacao} onChange={(e) => setFormData({ ...formData, anoPublicacao: e.target.value })} placeholder="Ex: 2023" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numeroPaginas">Páginas</Label>
              <Input id="numeroPaginas" type="number" value={formData.numeroPaginas} onChange={(e) => setFormData({ ...formData, numeroPaginas: e.target.value })} placeholder="Ex: 350" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="editora">Editora</Label>
            <Select key={formData.editoraID} value={formData.editoraID} onValueChange={(value) => setFormData({ ...formData, editoraID: value })}>
              <SelectTrigger id="editora" className="w-full">
                <SelectValue placeholder="Selecione uma editora" />
              </SelectTrigger>
              <SelectContent>
                {allEditoras.map((editora) => (
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
                {autores.map((autor) => (
                  <div key={autor.autorID} className="flex items-center space-x-2">
                    <Checkbox id={`autor-${autor.autorID}`} checked={formData.autores.includes(autor.autorID.toString())} onCheckedChange={(checked) => handleCheckboxChange(autor.autorID.toString(), checked, "autores")} />
                    <Label htmlFor={`autor-${autor.autorID}`} className="font-normal cursor-pointer">{autor.nome} {autor.sobrenome}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Gêneros</Label>
              <div className="border rounded-md p-3 max-h-40 overflow-y-auto space-y-2">
                {generos.map((genero) => (
                  <div key={genero.generoID} className="flex items-center space-x-2">
                    <Checkbox id={`genero-${genero.generoID}`} checked={formData.generos.includes(genero.generoID.toString())} onCheckedChange={(checked) => handleCheckboxChange(genero.generoID.toString(), checked, "generos")} />
                    <Label htmlFor={`genero-${genero.generoID}`} className="font-normal cursor-pointer">{genero.nome}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sinopse">Sinopse</Label>
            <Textarea id="sinopse" value={formData.sinopse} onChange={(e) => setFormData({ ...formData, sinopse: e.target.value })} placeholder="Escreva a sinopse do livro aqui..." rows={4} />
          </div>
        </div>

        {/* Seção de Exemplares (condicional) */}
        {livro && (
          <div className={`${activeTab === 'exemplares' ? 'block' : 'hidden'} space-y-4`}>
            <div className="flex flex-row items-center justify-end">
              <Button size="sm" variant="outline" type="button" onClick={() => setIsAddingExemplar(true)} disabled={isAddingExemplar}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Adicionar Exemplar
              </Button>
            </div>
            
            <div>
              {isAddingExemplar && (
                <div className="flex items-center gap-2 p-4 border rounded-lg mb-4 bg-slate-50">
                  <Input placeholder="Código de Localização (ex: P3-E2-L1)" value={novoCodigoLocalizacao} onChange={(e) => setNovoCodigoLocalizacao(e.target.value)} className="flex-grow" />
                  <Button size="sm" type="button" onClick={handleSaveNewExemplar}>Salvar Exemplar</Button>
                  <Button size="sm" type="button" variant="ghost" onClick={() => setIsAddingExemplar(false)}>Cancelar</Button>
                </div>
              )}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingExemplares ? (
                    <TableRow><TableCell colSpan={4} className="h-24 text-center">A carregar exemplares...</TableCell></TableRow>
                  ) : exemplares.length > 0 ? (
                    exemplares.map((exemplar) => (
                      <TableRow key={exemplar.exemplarID}>
                        <TableCell className="font-medium">{exemplar.exemplarID}</TableCell>
                        <TableCell>{exemplar.codigoLocalizacao}</TableCell>
                        <TableCell>{exemplar.statusExemplar}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Alterar Estado</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleStatusChange(exemplar.exemplarID, 'Disponivel')}>Disponível</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(exemplar.exemplarID, 'Emprestado')}>Emprestado</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(exemplar.exemplarID, 'Manutencao')}>Manutenção</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600" onClick={() => handleStatusChange(exemplar.exemplarID, 'Perdido')}>Perdido</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan={4} className="h-24 text-center">Nenhum exemplar registado para este livro.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>

      <div className="flex-shrink-0 flex justify-end space-x-2 pt-4 border-t mt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        {/* O botão de salvar só aparece na aba de detalhes ou se for um livro novo */}
        {(activeTab === 'detalhes' || !livro) && (
          <Button type="submit">Salvar Livro</Button>
        )}
      </div>
    </form>
  );
}

