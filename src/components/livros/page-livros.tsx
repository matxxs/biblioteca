"use client";

import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  MoreHorizontal,
  Search,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Autor, Editora, Genero, Livro } from "@/types";
import { livroService } from "@/services/api";
import { LivroForm } from "./livro-form";
import Modal from "../ui/modal";

export default function PageLivros() {
  const [filteredLivros, setFilteredLivros] = useState<Livro[]>([]);
  const [livros, setLivros] = useState<Livro[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingLivro, setEditingLivro] = useState<Livro | null>(null);
  const [viewingLivro, setViewingLivro] = useState<Livro | null>(null);
  const [editoras, setEditoras] = useState<Editora[]>([]);
  const [autores, setAutores] = useState<Autor[]>([]);
  const [generos, setGeneros] = useState<Genero[]>([]);

  useEffect(() => {
    loadLivros();
    fetchEditoras();
    fetchAutores();
    fetchGeneros();
  }, []);

  useEffect(() => {
    const filtered = livros.filter(
      (livro) =>
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
      console.error("Erro ao carregar livros:", error);
      setLivros([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingLivro(null);
    setViewingLivro(null);
    setShowModal(true);
  };

  const handleEdit = (livro: Livro) => {
    setEditingLivro(livro);
    setViewingLivro(null);
    setShowModal(true);
  };

  const handleView = (livro: Livro) => {
    setViewingLivro(livro);
    setEditingLivro(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingLivro(null);
    setViewingLivro(null);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este livro?")) {
      try {
        await livroService.delete(id);
        await loadLivros();
      } catch (error) {
        console.error("Erro ao excluir livro:", error);
        alert("Erro ao excluir livro");
      }
    }
  };

  const handleSave = async (livroData: Livro) => {
    try {
      if (editingLivro) {
        await livroService.update(editingLivro.livroID!, livroData);
      } else {
        await livroService.create(livroData);
      }
      handleCloseModal(); 
      await loadLivros();
    } catch (error) {
      console.error("Erro ao salvar livro:", error);
      alert("Erro ao salvar livro");
    }
  };

  const fetchEditoras = async () => {
    try {
      const response = await livroService.getEditoras();
      setEditoras(response.data);
    } catch (error) {
      console.error('Erro ao buscar editoras:', error);
      setEditoras([]);
    }
  };

  const fetchAutores = async () => {
    try {
      const response = await livroService.getAutores();
      setAutores(response.data);
    } catch (error) {
      console.error('Erro ao buscar autores:', error);
      setAutores([]);
    }
  };

  const fetchGeneros = async () => {
    try {
      const response = await livroService.getGeneros();
      setGeneros(response.data);
    } catch (error) {
      console.error('Erro ao buscar gêneros:', error);
      setGeneros([]);
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
    <div className="grid grid-cols-1 gap-4 px-4 lg:gap-6 lg:px-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Acervo de Livros</h1>
          <p className="text-muted-foreground">
            Gerencie, adicione e visualize os livros da biblioteca.
          </p>
        </div>
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar por título, ISBN ou editora..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-full md:w-80"
                />
              </div>
              <Button onClick={handleCreate} className="whitespace-nowrap">
                <PlusCircle className="h-4 w-4 mr-2" />
                Novo Livro
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead className="hidden md:table-cell">ISBN</TableHead>
                  <TableHead>Editora</TableHead>
                  <TableHead className="hidden sm:table-cell">Ano</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLivros.length > 0 ? (
                  filteredLivros.map((livro) => (
                    <TableRow key={livro.livroID}>
                      <TableCell>
                        <div >
                          <span className="font-medium"> {livro.titulo}</span> 
                          <span className="text-sm text-muted-foreground"> - disponíveis: {livro.contagem?.disponiveis} de {livro.contagem?.total}</span> </div>
                        <div className="text-sm text-muted-foreground">
                          {livro.edicao} 
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell font-mono text-sm">
                        {livro.isbn}
                      </TableCell>
                      <TableCell>{livro.editora?.nome}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {livro.anoPublicacao}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleView(livro)}>
                              <Eye className="mr-2 h-4 w-4" /> Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(livro)}>
                              <Edit className="mr-2 h-4 w-4" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-700 focus:bg-red-50"
                              onClick={() => handleDelete(livro.livroID!)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Nenhum livro encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Modal */}
        {showModal && (
          <Modal
            isOpen={showModal}
            onClose={handleCloseModal}
            title={
              viewingLivro
                ? "Detalhes do Livro"
                : editingLivro
                  ? "Editar Livro"
                  : "Novo Livro"
            }
            size={editingLivro ? "xl" : "sm"}
          >
            {viewingLivro ? (
              <div className="space-y-4 text-sm">
                <div>
                  <label className="font-semibold text-gray-700">Título</label>
                  <p className="mt-1 text-gray-900">{viewingLivro.titulo}</p>
                </div>
                <div>
                  <label className="font-semibold text-gray-700">ISBN</label>
                  <p className="mt-1 text-gray-900 font-mono">
                    {viewingLivro.isbn}
                  </p>
                </div>
                <div>
                  <label className="font-semibold text-gray-700">Editora</label>
                  <p className="mt-1 text-gray-900">
                    {viewingLivro.editora?.nome}
                  </p>
                </div>
                <div>
                  <label className="font-semibold text-gray-700">Autores</label>
                  <p className="mt-1 text-gray-900">
                    {viewingLivro.autores
                      ?.map((autor) => `${autor.nome} ${autor.sobrenome}`)
                      .join(", ")}
                  </p>
                </div>
                {viewingLivro.sinopse && (
                  <div>
                    <label className="font-semibold text-gray-700">Sinopse</label>
                    <p className="mt-1 text-gray-900 text-justify">
                      {viewingLivro.sinopse}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <LivroForm
                livro={editingLivro}
                editoras={editoras}
                autores={autores}
                generos={generos}
                onSave={handleSave}
                onCancel={handleCloseModal}
              />
            )}
          </Modal>
        )}
      </div>
    </div>
  );
}