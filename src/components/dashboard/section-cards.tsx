"use client";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  RelatorioLivrosMaisEmprestados,
  RelatorioLivrosAtraso,
  RelatorioTotalMultas,
} from "@/types";

interface SectionCardsProps {
  livrosMaisEmprestados: RelatorioLivrosMaisEmprestados[];
  livrosAtraso: RelatorioLivrosAtraso[];
  totalMultas: RelatorioTotalMultas[];
}

export function SectionCards({
  livrosMaisEmprestados,
  livrosAtraso,
  totalMultas,
}: SectionCardsProps) {
  const totalLivros = livrosMaisEmprestados.length;
  const totalEmprestimos = livrosMaisEmprestados.reduce(
    (sum, livro) => sum + livro.totalEmprestimos,
    0
  );
  const totalAtrasos = livrosAtraso.length;
  const multasPendentes =
    totalMultas.find((m) => m.statusMulta === "Pendente")?.valorTotal || 0;

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Card Total de Livros */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total de Livros</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalLivros}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total de títulos únicos
          </div>
          <div className="text-muted-foreground">Disponíveis no acervo</div>
        </CardFooter>
      </Card>

      {/* Card Total de Empréstimos */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total de Empréstimos</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalEmprestimos}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Movimentação geral
          </div>
          <div className="text-muted-foreground">Desde o início do sistema</div>
        </CardFooter>
      </Card>

      {/* Card Livros em Atraso */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Livros em Atraso</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalAtrasos}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Devoluções pendentes
          </div>
          <div className="text-muted-foreground">Atualmente em atraso</div>
        </CardFooter>
      </Card>

      {/* Card Multas Pendentes */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Multas Pendentes</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            R$ {multasPendentes.toFixed(2)}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Valor a receber
          </div>
          <div className="text-muted-foreground">Soma de todas as multas</div>
        </CardFooter>
      </Card>
    </div>
  );
}
