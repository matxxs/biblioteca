"use client";

import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Users,
  Landmark,
  Loader2, // Ícone de carregamento
} from "lucide-react";
import { membroService, relatorioService } from "@/services/api";
import { Membro, RelatorioHistoricoMembro } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { StatusMembrosBadge } from "@/components/badge-status";
import Modal from "../ui/modal";
import MembroForm from "./membro-form";

export default function MembrosComponent() {
  const [membros, setMembros] = useState<Membro[]>([]);
  const [filteredMembros, setFilteredMembros] = useState<Membro[]>([]);
  const [relatorioHistoricoMembro, setRelatorioHistoricoMembro] = useState<
    RelatorioHistoricoMembro[]
  >([]);

  // Estados de controle
  const [loading, setLoading] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Estados para os Modais
  const [showModal, setShowModal] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [editingMembro, setEditingMembro] = useState<Membro | null>(null);
  const [viewingMembro, setViewingMembro] = useState<Membro | null>(null);
  const [selectedMembroForHistory, setSelectedMembroForHistory] =
    useState<Membro | null>(null);

  useEffect(() => {
    loadMembros();
  }, []);

  useEffect(() => {
    const filtered = membros.filter(
      (membro) =>
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
      console.error("Erro ao carregar membros:", error);
      setMembros([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await membroService.delete(id);
      await loadMembros();
    } catch (error) {
      console.error("Erro ao excluir membro:", error);
      alert("Erro ao excluir membro");
    }
  };

  const handleToggleStatus = async (membro: Membro) => {
    const newStatus = membro.statusMembro === "Ativo" ? "Bloqueado" : "Ativo";
    try {
      // Supondo que você tenha um método de serviço para atualizar apenas o status
      await membroService.update(membro.membroID, { ...membro, statusMembro: newStatus });
      await loadMembros();
    } catch (error) {
      console.error(`Erro ao ${newStatus === 'Ativo' ? 'ativar' : 'bloquear'} membro:`, error);
      alert(`Erro ao ${newStatus === 'Ativo' ? 'ativar' : 'bloquear'} membro`);
    }
  };

  const handleCreate = () => {
    setEditingMembro(null);
    setViewingMembro(null);
    setShowModal(true);
  };

  const handleEdit = (membro: Membro) => {
    setEditingMembro(membro);
    setViewingMembro(null);
    setShowModal(true);
  };

  const handleView = (membro: Membro) => {
    setViewingMembro(membro);
    setEditingMembro(null);
    setShowModal(true);
  };

  const handleViewHistory = async (membro: Membro) => {
    setSelectedMembroForHistory(membro);
    setIsHistoryModalOpen(true);
    setLoadingHistory(true);
    try {
      const response = await relatorioService.getHistoricoMembro(membro.membroID);
      setRelatorioHistoricoMembro(response.data);
    } catch (error) {
      console.error("Erro ao buscar histórico do membro:", error);
      setRelatorioHistoricoMembro([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsHistoryModalOpen(false);
    setEditingMembro(null);
    setViewingMembro(null);
    setSelectedMembroForHistory(null);
  };

  const handleSave = async (membroData: Membro) => {
    try {
      if (editingMembro) {
        await membroService.update(editingMembro.membroID, membroData);
      } else {
        await membroService.create(membroData);
      }
      setShowModal(false);
      await loadMembros();
    } catch (error) {
      console.error("Erro ao salvar membro:", error);
      alert("Erro ao salvar membro");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }


  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Gerenciamento de Membros
        </h1>
        <p className="text-muted-foreground">
          Visualize, adicione, edite e remova membros.
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Card: Membros Ativos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Membros Ativos</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {membros.filter((m) => m.statusMembro === "Ativo").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Membros com cadastro regular
            </p>
          </CardContent>
        </Card>
        {/* Card: Membros Bloqueados */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Membros Bloqueados</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {membros.filter((m) => m.statusMembro === "Bloqueado").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Membros com pendências
            </p>
          </CardContent>
        </Card>
        {/* Card: Total de Membros */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Membros</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{membros.length}</div>
            <p className="text-xs text-muted-foreground">
              Total de membros cadastrados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela e Filtro */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-full md:w-80"
              />
            </div>
            <Button onClick={handleCreate}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Novo Membro
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden lg:table-cell">
                  Telefone
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembros.map((membro) => (
                <TableRow key={membro.membroID}>
                  <TableCell className="font-medium">
                    <div>{`${membro.nome} ${membro.sobrenome}`}</div>
                    <div className="text-xs text-muted-foreground md:hidden">
                      {membro.email}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {membro.email}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {membro.telefone}
                  </TableCell>
                  <TableCell>
                    <StatusMembrosBadge status={membro.statusMembro} />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleView(membro)}>
                          <Eye className="mr-2 h-4 w-4" /> Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewHistory(membro)}>
                          <Landmark className="mr-2 h-4 w-4" /> Histórico de Multas
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(membro)}>
                          <Edit className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleStatus(membro)}>
                          {membro.statusMembro === "Ativo" ? (
                            <>
                              <UserX className="mr-2 h-4 w-4" /> Bloquear
                            </>
                          ) : (
                            <>
                              <UserCheck className="mr-2 h-4 w-4" /> Ativar
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Excluir
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Essa ação não pode ser desfeita. Isso excluirá permanentemente o membro{" "}
                                <span className="font-bold">{`${membro.nome} ${membro.sobrenome}`}</span>.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(membro.membroID!)}>
                                Sim, excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal para Criar/Editar/Visualizar Membro */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={
          viewingMembro
            ? "Detalhes do Membro"
            : editingMembro
              ? "Editar Membro"
              : "Novo Membro"
        }
      >
        {viewingMembro ? (
          <div className="space-y-4">
            {/* Detalhes do Membro */}
          </div>
        ) : (
          <MembroForm
            membro={editingMembro}
            onSave={handleSave}
            onCancel={handleCloseModal}
          />
        )}
      </Modal>

      {/* Modal para Histórico de Multas */}
      <Modal
        isOpen={isHistoryModalOpen}
        onClose={handleCloseModal}
        title={`Histórico de Multas de ${selectedMembroForHistory?.nome || ''}`}
      >
        {loadingHistory ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : relatorioHistoricoMembro.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Livro</TableHead>
                <TableHead>Data Empréstimo</TableHead>
                <TableHead>Valor da Multa</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Dt. Pagamento</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {relatorioHistoricoMembro.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.titulo}</TableCell>
                  <TableCell>{new Date(item.dataEmprestimo).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>R$ {item.valorMulta}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>
                    {item.dataPagamento ? new Date(item.dataPagamento).toLocaleDateString('pt-BR') : ''}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            Nenhum histórico de multas encontrado para este membro.
          </p>
        )}
      </Modal>

    </main>
  );
}

