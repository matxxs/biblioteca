"use client";

import { SectionCards } from "@/components/dashboard/section-cards";
import { RankingCards } from "@/components/dashboard/ranking-cards";
import { TabelaLivrosAtraso } from "@/components/dashboard/data-table";
import { useEffect, useState } from "react";
import {
  RelatorioLivrosAtraso,
  RelatorioLivrosMaisEmprestados,
  RelatorioTopLeitores,
  RelatorioTotalMultas,
} from "@/types";
import { relatorioService } from "@/services/api";

export default function DataTableLivros() {
  const [livrosMaisEmprestados, setLivrosMaisEmprestados] = useState<
    RelatorioLivrosMaisEmprestados[]
  >([]);
  const [livrosAtraso, setLivrosAtraso] = useState<RelatorioLivrosAtraso[]>([]);
  const [totalMultas, setTotalMultas] = useState<RelatorioTotalMultas[]>([]);
  const [topLeitores, setTopLeitores] = useState<RelatorioTopLeitores[]>([]);
  const [loading, setLoading] = useState(true);

  // O useEffect para carregar os dados também fica aqui
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [
          livrosEmprestadosRes,
          livrosAtrasoRes,
          totalMultasRes,
          topLeitoresRes,
        ] = await Promise.all([
          relatorioService.getLivrosMaisEmprestados(),
          relatorioService.getLivrosAtraso(),
          relatorioService.getTotalMultas(),
          relatorioService.getTopLeitores(),
        ]);

        setLivrosMaisEmprestados(livrosEmprestadosRes.data);
        setLivrosAtraso(livrosAtrasoRes.data);
        setTotalMultas(totalMultasRes.data);
        setTopLeitores(topLeitoresRes.data);
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
        // Você pode manter os dados mockados para fallback
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Se estiver carregando, você pode mostrar um esqueleto (skeleton) ou um spinner
  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p>Carregando dados do dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-4 md:gap-6">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Componente de cards de resumo - Total de Livros e empréstimos, Livros em atraso, multas pendentes */}
          <SectionCards
            livrosMaisEmprestados={livrosMaisEmprestados}
            livrosAtraso={livrosAtraso}
            totalMultas={totalMultas}
          />

          {/* Componente de Ranking - Livros mais emprestados e Top Leitores */}
          <RankingCards
            livrosMaisEmprestados={livrosMaisEmprestados}
            topLeitores={topLeitores}
          />

          {/* Componente de tabela - Livros em atraso */}
          <TabelaLivrosAtraso livrosAtraso={livrosAtraso} />
        </div>
      </div>
    </div>
  );
}
