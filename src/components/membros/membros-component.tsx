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
} from "lucide-react";
import { membroService } from "@/services/api";
import { Membro } from "@/types";
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

export default function MembrosComponent() {
  const [membros, setMembros] = useState<Membro[]>([]);
  const [filteredMembros, setFilteredMembros] = useState<Membro[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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
      // Dados mockados para demonstração
      setMembros([
        {
          membroID: 1,
          nome: "João",
          sobrenome: "Silva",
          dataNascimento: "1990-05-15",
          endereco: "Rua das Flores, 123",
          telefone: "(11) 99999-9999",
          email: "joao.silva@email.com",
          dataCadastro: "2023-01-15T10:00:00Z",
          statusMembro: "Ativo",
        },
        {
          membroID: 2,
          nome: "Maria",
          sobrenome: "Santos",
          dataNascimento: "1985-08-22",
          endereco: "Av. Paulista, 456",
          telefone: "(11) 88888-8888",
          email: "maria.santos@email.com",
          dataCadastro: "2023-02-20T14:30:00Z",
          statusMembro: "Ativo",
        },
        {
          membroID: 3,
          nome: "Pedro",
          sobrenome: "Oliveira",
          dataNascimento: "1992-12-10",
          endereco: "Rua da Paz, 789",
          telefone: "(11) 77777-7777",
          email: "pedro.oliveira@email.com",
          dataCadastro: "2023-03-10T09:15:00Z",
          statusMembro: "Bloqueado",
        },
      ]);
    } finally {
      setLoading(false);
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
    <main className="grid grid-cols-1 gap-4 px-4 lg:gap-6 lg:px-6">
      <div className="space-y-6">
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
        <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
          {/* Card: Membros Ativos */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1.5">
                <CardDescription>Membros Ativos</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {membros.filter((m) => m.statusMembro === "Ativo").length}
                </CardTitle>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-500/15 text-green-500">
                <UserCheck className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-0.5 text-sm">
              <p className="font-medium">Total de membros ativos</p>
              <p className="text-muted-foreground">Disponíveis no acervo</p>
            </CardFooter>
          </Card>

          {/* Card: Membros Bloqueados */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1.5">
                <CardDescription>Membros Bloqueados</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {membros.filter((m) => m.statusMembro === "Bloqueado").length}
                </CardTitle>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-destructive/15 text-destructive">
                <UserX className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-0.5 text-sm">
              <p className="font-medium">Total de membros bloqueados</p>
              <p className="text-muted-foreground">
                Com pendências na biblioteca
              </p>
            </CardFooter>
          </Card>

          {/* Card: Total de Membros */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1.5">
                <CardDescription>Total de Membros</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {membros.length}
                </CardTitle>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/15 text-primary">
                <Users className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-0.5 text-sm">
              <p className="font-medium">Total de membros cadastrados</p>
              <p className="text-muted-foreground">Registrados no sistema</p>
            </CardFooter>
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
              <Button>
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
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" /> Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
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
                                <AlertDialogTitle>
                                  Você tem certeza?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Essa ação não pode ser desfeita. Isso excluirá
                                  permanentemente o membro
                                  <span className="font-bold">
                                    {" "}
                                    {membro.nome} {membro.sobrenome}
                                  </span>
                                  .
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction>
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
      </div>
    </main>
  );
}
