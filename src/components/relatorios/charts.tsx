"use client"; // Necessário para hooks como useState e useEffect

import React, { useState, useEffect } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import type { ChartConfig } from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, BookOpen, DollarSign, Loader2 } from "lucide-react";
import { relatorioService } from "@/services/api";
import {
  RelatorioLivrosMaisEmprestados,
  RelatorioAutoresPopulares,
  RelatorioGenerosPopulares,
  RelatorioDisponibilidade,
  RelatorioTotalMultas,
} from "@/types";

const chartConfig = {
  emprestimos: {
    label: "Empréstimos",
    color: "var(--chart-1)",
  },
  disponiveis: {
    label: "Disponíveis",
    color: "var(--chart-2)",
  },
  emprestados: {
    label: "Emprestados",
    color: "var(--chart-3)",
  },
  fantasia: { label: "Fantasia", color: "var(--chart-1)" },
  ficcao: { label: "Ficção Científica", color: "var(--chart-2)" },
  romance: { label: "Romance", color: "var(--chart-3)" },
  brasileira: { label: "Lit. Brasileira", color: "var(--chart-4)" },
  drama: { label: "Drama", color: "var(--chart-5)" },
} satisfies ChartConfig;

export default function RelatoriosDashboard() {
  const [livrosMaisEmprestados, setLivrosMaisEmprestados] = useState<
    RelatorioLivrosMaisEmprestados[]
  >([]);
  const [autoresPopulares, setAutoresPopulares] = useState<
    RelatorioAutoresPopulares[]
  >([]);
  const [generosPopulares, setGenerosPopulares] = useState<
    RelatorioGenerosPopulares[]
  >([]);
  const [disponibilidade, setDisponibilidade] = useState<
    RelatorioDisponibilidade[]
  >([]);
  const [totalMultas, setTotalMultas] = useState<RelatorioTotalMultas[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRelatorios = async () => {
      try {
        setLoading(true);
        const [
          livrosRes,
          autoresRes,
          generosRes,
          disponibilidadeRes,
          multasRes,
        ] = await Promise.all([
          relatorioService.getLivrosMaisEmprestados(),
          relatorioService.getAutoresPopulares(),
          relatorioService.getGenerosPopulares(),
          relatorioService.getDisponibilidade(),
          relatorioService.getTotalMultas(),
        ]);

        setLivrosMaisEmprestados(livrosRes.data);
        setAutoresPopulares(autoresRes.data);
        setGenerosPopulares(generosRes.data);
        setDisponibilidade(disponibilidadeRes.data);
        setTotalMultas(multasRes.data);
      } catch (error) {
        console.error("Erro ao carregar relatórios:", error);
        // Dados mockados para demonstração
        setLivrosMaisEmprestados([
          { titulo: "O Senhor dos Anéis", totalEmprestimos: 45 },
          { titulo: "Harry Potter", totalEmprestimos: 38 },
          { titulo: "1984", totalEmprestimos: 32 },
          { titulo: "Dom Casmurro", totalEmprestimos: 28 },
          { titulo: "A Revolução dos Bichos", totalEmprestimos: 25 },
          { titulo: "O Hobbit", totalEmprestimos: 22 },
          { titulo: "Cem Anos de Solidão", totalEmprestimos: 20 },
          { titulo: "O Pequeno Príncipe", totalEmprestimos: 18 },
        ]);
        setAutoresPopulares([
          { nomeAutor: "J.R.R. Tolkien", totalEmprestimos: 67 },
          { nomeAutor: "J.K. Rowling", totalEmprestimos: 38 },
          { nomeAutor: "George Orwell", totalEmprestimos: 32 },
          { nomeAutor: "Machado de Assis", totalEmprestimos: 28 },
          { nomeAutor: "Gabriel García Márquez", totalEmprestimos: 20 },
        ]);
        setGenerosPopulares([
          { genero: "Fantasia", totalEmprestimos: 120 },
          { genero: "Ficção Científica", totalEmprestimos: 85 },
          { genero: "Romance", totalEmprestimos: 75 },
          { genero: "Literatura Brasileira", totalEmprestimos: 60 },
          { genero: "Drama", totalEmprestimos: 45 },
        ]);
        setDisponibilidade([
          {
            titulo: "O Senhor dos Anéis",
            totalExemplares: 3,
            exemplaresDisponiveis: 1,
            exemplaresEmprestados: 2,
          },
          {
            titulo: "Harry Potter",
            totalExemplares: 2,
            exemplaresDisponiveis: 0,
            exemplaresEmprestados: 2,
          },
          {
            titulo: "1984",
            totalExemplares: 2,
            exemplaresDisponiveis: 1,
            exemplaresEmprestados: 1,
          },
          {
            titulo: "Dom Casmurro",
            totalExemplares: 1,
            exemplaresDisponiveis: 1,
            exemplaresEmprestados: 0,
          },
        ]);
        setTotalMultas([
          { statusMulta: "Pendente", valorTotal: 45.5, quantidadeMultas: 12 },
          { statusMulta: "Paga", valorTotal: 120.0, quantidadeMultas: 24 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadRelatorios();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <main className="grid grid-cols-1 gap-4 px-4 lg:gap-6 lg:px-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Relatórios da Biblioteca
          </h1>
          <p className="text-muted-foreground">
            Análises detalhadas sobre o acervo e empréstimos.
          </p>
        </div>

        {/* Gráfico de Livros Mais Emprestados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Livros Mais Emprestados
            </CardTitle>
            <CardDescription>
              Top 8 livros mais populares por número de empréstimos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[350px] w-full">
              {/* <BarChart
                data={livrosMaisEmprestados.slice(0, 8)}
                margin={{ top: 20, right: 20, left: 0, bottom: 60 }}
              >
                <XAxis
                  dataKey="titulo"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  angle={-45}
                  textAnchor="end"
                  fontSize={12}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={10} />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  cursor={false}
                />
                <Bar
                  dataKey="totalEmprestimos"
                  fill="var(--color-emprestimos)"
                  radius={4}
                  name="Empréstimos"
                />
              </BarChart> */}
              <BarChart
                accessibilityLayer
                data={livrosMaisEmprestados.slice(0, 8)}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="titulo"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tickFormatter={(value) => value.slice(0, 13)}
                />

                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar
                  dataKey="totalEmprestimos"
                  fill="var(--color-emprestimos)"
                  radius={8}
                  name="Empréstimos"
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Gráfico de Autores Populares */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Autores Mais Populares
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <BarChart
                  data={autoresPopulares}
                  layout="vertical"
                  margin={{ left: 30 }}
                >
                  <YAxis
                    dataKey="nomeAutor"
                    type="category"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    fontSize={12}
                    width={120}
                  />
                  <XAxis type="number" hide />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    cursor={false}
                  />
                  <Bar
                    dataKey="totalEmprestimos"
                    layout="vertical"
                    fill="var(--color-emprestimos)"
                    radius={4}
                    name="Empréstimos"
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Gráfico de Gêneros Populares */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Gêneros Mais Emprestados
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Pie
                    data={generosPopulares}
                    dataKey="totalEmprestimos"
                    nameKey="genero"
                    innerRadius={60}
                    strokeWidth={5}
                  >
                    {generosPopulares.map((entry) => (
                      <Cell
                        key={entry.genero}
                        fill={`var(--color-${entry.genero
                          .split(" ")[0]
                          .toLowerCase()})`}
                      />
                    ))}
                  </Pie>
                  <ChartLegend
                    content={<ChartLegendContent nameKey="genero" />}
                  />
                </PieChart>
              </ChartContainer> */}
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={generosPopulares}
                    dataKey="totalEmprestimos"
                    nameKey="genero"
                    label
                  />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de Disponibilidade */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Disponibilidade de Livros
            </CardTitle>
            <CardDescription>
              Comparativo entre exemplares disponíveis e emprestados.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={disponibilidade}>
                <XAxis
                  dataKey="titulo"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  fontSize={12}
                />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey="exemplaresDisponiveis"
                  stackId="a"
                  fill="var(--color-disponiveis)"
                  radius={[4, 4, 0, 0]}
                  name="Disponíveis"
                />
                <Bar
                  dataKey="exemplaresEmprestados"
                  stackId="a"
                  fill="var(--color-emprestados)"
                  radius={[0, 0, 0, 0]}
                  name="Emprestados"
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Resumo de Multas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {totalMultas.map((multa) => (
                <div
                  key={multa.statusMulta}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">
                      {multa.statusMulta === "Pendente" ? "Pendentes" : "Pagas"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {multa.quantidadeMultas} multas
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">
                      R$ {multa.valorTotal.toFixed(2)}
                    </p>
                    <Badge
                      variant={
                        multa.statusMulta === "Pendente"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {multa.statusMulta}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Ranking Completo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Pos.</TableHead>
                    <TableHead>Livro</TableHead>
                    <TableHead className="text-right">Empréstimos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {livrosMaisEmprestados.map((livro, index) => (
                    <TableRow key={livro.titulo}>
                      <TableCell>
                        <Badge variant={index < 3 ? "default" : "secondary"}>
                          {index + 1}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {livro.titulo}
                      </TableCell>
                      <TableCell className="text-right">
                        {livro.totalEmprestimos}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
