"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  PlusCircle,
} from "lucide-react";
import { emprestimoService } from "@/services/api";
import { Emprestimo } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { StatusEmprestimosBadge } from "@/components/badge-status";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function PageEmprestimos() {
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([]);
  const [filteredEmprestimos, setFilteredEmprestimos] = useState<Emprestimo[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "todos" | "ativos" | "atrasados" | "devolvidos"
  >("todos");

  useEffect(() => {
    loadEmprestimos();
  }, []);

  useEffect(() => {
    let filtered = emprestimos;

    // Filtro por status
    switch (filterStatus) {
      case "ativos":
        filtered = filtered.filter((e) => !e.dataDevolucaoReal);
        break;
      case "atrasados":
        filtered = filtered.filter(
          (e) =>
            !e.dataDevolucaoReal &&
            new Date(e.dataDevolucaoPrevista) < new Date()
        );
        break;
      case "devolvidos":
        filtered = filtered.filter((e) => e.dataDevolucaoReal);
        break;
    }

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(
        (emprestimo) =>
          emprestimo.exemplar?.livro?.titulo
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          emprestimo.membro?.nome
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          emprestimo.membro?.sobrenome
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
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
      console.error("Erro ao carregar empréstimos:", error);
      // Dados mockados para demonstração
      setEmprestimos([]);
    } finally {
      setLoading(false);
    }
  };


  const handleDevolucao = async (emprestimo: Emprestimo) => {
    try {
      await emprestimoService.devolver(emprestimo.emprestimoID);
      await loadEmprestimos();
    } catch (error) {
      console.error("Erro ao devolver empréstimo:", error);
    }
  };



  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("pt-BR", {
      timeZone: "UTC",
    });
  };

  const getStats = () => {
    const ativos = emprestimos.filter((e) => !e.dataDevolucaoReal).length;
    const atrasados = emprestimos.filter(
      (e) =>
        !e.dataDevolucaoReal && new Date(e.dataDevolucaoPrevista) < new Date()
    ).length;
    const devolvidos = emprestimos.filter((e) => e.dataDevolucaoReal).length;

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
    <main className="grid grid-cols-1 gap-4 px-4 lg:gap-6 lg:px-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Empréstimos</h1>
          <p className="text-muted-foreground">
            Gerencie os empréstimos da biblioteca
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
          {/* Card: Empréstimos Ativos */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1.5">
                <CardDescription>Empréstimos Ativos</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {stats.ativos}
                </CardTitle>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-500/15 text-green-500">
                <CheckCircle className="h-6 w-6" />
              </div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-0.5 text-sm">
              <p className="font-medium">Total de empréstimos ativos</p>
              <p className="text-muted-foreground">Disponíveis no acervo</p>
            </CardFooter>
          </Card>

          {/* Card: Empréstimos Atrasados */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1.5">
                <CardDescription>Em Atraso</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {stats.atrasados}
                </CardTitle>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-destructive/15 text-destructive">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-0.5 text-sm">
              <p className="font-medium">Total de empréstimos em atraso</p>
              <p className="text-muted-foreground">
                Com pendências de devolução
              </p>
            </CardFooter>
          </Card>

          {/* Card: Total de Membros */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1.5">
                <CardDescription>Devolvidos</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {stats.devolvidos}
                </CardTitle>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/15 text-primary">
                <RotateCcw className="h-6 w-6" />
              </div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-0.5 text-sm">
              <p className="font-medium">Total de empréstimos devolvidos</p>
              <p className="text-muted-foreground">Completados com sucesso</p>
            </CardFooter>
          </Card>
        </div>

        {/* Tabela e Filtro */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative flex w-full items-center justify-start gap-2 md:w-auto md:justify-end">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar por livro ou membro..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-full md:w-80"
                />
                <Select
                  value={filterStatus}
                  onValueChange={(value) =>
                    setFilterStatus(
                      value as "todos" | "ativos" | "atrasados" | "devolvidos"
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="ativos">Ativos</SelectItem>
                    <SelectItem value="atrasados">Em Atraso</SelectItem>
                    <SelectItem value="devolvidos">Devolvidos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Novo Empréstimo
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Livro</TableHead>
                  <TableHead className="hidden md:table-cell">Membro</TableHead>
                  <TableHead className="hidden lg:table-cell">Status</TableHead>
                  <TableHead>Data Empréstimo</TableHead>
                  <TableHead>Previsão Devolução</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emprestimos.length > 0 ? (
                  filteredEmprestimos.map((emprestimo) => (
                    <TableRow key={emprestimo.emprestimoID}>
                      <TableCell className="font-medium">
                        <div>{emprestimo.exemplar?.livro?.titulo}</div>
                        <div className="text-xs text-muted-foreground">
                          {emprestimo.exemplar?.codigoLocalizacao}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="font-medium">{`${emprestimo.membro?.nome} ${emprestimo.membro?.sobrenome}`}</div>
                        <div className="text-sm text-muted-foreground">
                          {emprestimo.membro?.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusEmprestimosBadge
                          dataDevolucaoReal={emprestimo.dataDevolucaoReal}
                          dataDevolucaoPrevista={
                            emprestimo.dataDevolucaoPrevista
                          }
                        />
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatDate(emprestimo.dataEmprestimo)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {formatDate(emprestimo.dataDevolucaoPrevista)}
                      </TableCell>
                      <TableCell className="text-right">
                        {!emprestimo.dataDevolucaoReal && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                onSelect={(e) => e.preventDefault()}
                                className="btn-primary text-sm"
                              >
                                <RotateCcw className="mr-2 h-4 w-4" /> Devolver
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Você tem certeza?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Essa ação não pode ser desfeita. Isso excluirá
                                  devolverá o empréstimo .
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDevolucao(emprestimo)}
                                >
                                  Sim, devolver
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Nenhum empréstimo encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
