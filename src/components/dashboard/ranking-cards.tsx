import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RelatorioLivrosMaisEmprestados, RelatorioTopLeitores } from "@/types";
import { BookOpen, Award } from "lucide-react";

interface RankingCardsProps {
  livrosMaisEmprestados: RelatorioLivrosMaisEmprestados[];
  topLeitores: RelatorioTopLeitores[];
}

export function RankingCards({
  livrosMaisEmprestados,
  topLeitores,
}: RankingCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:gap-6 lg:px-6">
      {/* Card: Livros Mais Emprestados */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold">
              Livros Mais Emprestados
            </CardTitle>
            <CardDescription>Ranking dos livros mais populares</CardDescription>
          </div>
          <BookOpen className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 pt-2">
            {livrosMaisEmprestados.slice(0, 5).map((livro) => (
              <div
                key={livro.titulo}
                className="flex items-center justify-between"
              >
                <span className="text-sm font-medium">{livro.titulo}</span>
                <span className="text-sm text-muted-foreground">
                  {livro.totalEmprestimos} empréstimos
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Card: Top Leitores */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold">
              Top Leitores
            </CardTitle>
            <CardDescription>
              Os leitores mais ativos da biblioteca
            </CardDescription>
          </div>
          <Award className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 pt-2">
            {topLeitores.slice(0, 5).map((leitor, index) => (
              <div
                key={leitor.nomeMembro}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-base w-6 text-center">
                    {index + 1}º
                  </span>
                  <span className="text-sm font-medium">
                    {leitor.nomeMembro}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {leitor.totalEmprestimos} livros
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
