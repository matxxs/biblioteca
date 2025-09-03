import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Users, 
  ClipboardList, 
  AlertTriangle,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { relatorioService } from '../services/api';
import {
  RelatorioLivrosMaisEmprestados,
  RelatorioLivrosAtraso,
  RelatorioTotalMultas,
  RelatorioTopLeitores
} from '../types';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';

const Dashboard: React.FC = () => {
  const [livrosMaisEmprestados, setLivrosMaisEmprestados] = useState<RelatorioLivrosMaisEmprestados[]>([]);
  const [livrosAtraso, setLivrosAtraso] = useState<RelatorioLivrosAtraso[]>([]);
  const [totalMultas, setTotalMultas] = useState<RelatorioTotalMultas[]>([]);
  const [topLeitores, setTopLeitores] = useState<RelatorioTopLeitores[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [
          livrosEmprestadosRes,
          livrosAtrasoRes,
          totalMultasRes,
          topLeitoresRes
        ] = await Promise.all([
          relatorioService.getLivrosMaisEmprestados(),
          relatorioService.getLivrosAtraso(),
          relatorioService.getTotalMultas(),
          relatorioService.getTopLeitores()
        ]);

        setLivrosMaisEmprestados(livrosEmprestadosRes.data);
        setLivrosAtraso(livrosAtrasoRes.data);
        setTotalMultas(totalMultasRes.data);
        setTopLeitores(topLeitoresRes.data);
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
        // Dados mockados para demonstração
        setLivrosMaisEmprestados([
          { titulo: 'O Senhor dos Anéis', totalEmprestimos: 45 },
          { titulo: 'Harry Potter', totalEmprestimos: 38 },
          { titulo: '1984', totalEmprestimos: 32 },
          { titulo: 'Dom Casmurro', totalEmprestimos: 28 },
          { titulo: 'A Revolução dos Bichos', totalEmprestimos: 25 }
        ]);
        setLivrosAtraso([
          { titulo: 'O Hobbit', nomeMembro: 'João Silva', dataDevolucaoPrevista: '2024-01-15', diasDeAtraso: 5 },
          { titulo: 'Cem Anos de Solidão', nomeMembro: 'Maria Santos', dataDevolucaoPrevista: '2024-01-12', diasDeAtraso: 8 }
        ]);
        setTotalMultas([
          { statusMulta: 'Pendente', valorTotal: 45.50, quantidadeMultas: 12 },
          { statusMulta: 'Paga', valorTotal: 120.00, quantidadeMultas: 24 }
        ]);
        setTopLeitores([
          { nomeMembro: 'Ana Costa', totalEmprestimos: 15 },
          { nomeMembro: 'Pedro Oliveira', totalEmprestimos: 12 },
          { nomeMembro: 'Carla Mendes', totalEmprestimos: 10 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const totalLivros = livrosMaisEmprestados.length;
  const totalEmprestimos = livrosMaisEmprestados.reduce((sum, livro) => sum + livro.totalEmprestimos, 0);
  const totalAtrasos = livrosAtraso.length;
  const multasPendentes = totalMultas.find(m => m.statusMulta === 'Pendente')?.valorTotal || 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Visão geral do sistema de biblioteca
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total de Livros"
          value={totalLivros.toString()}
          icon={BookOpen}
          color="blue"
        />
        <StatCard
          title="Total de Empréstimos"
          value={totalEmprestimos.toString()}
          icon={ClipboardList}
          color="green"
        />
        <StatCard
          title="Livros em Atraso"
          value={totalAtrasos.toString()}
          icon={AlertTriangle}
          color="red"
        />
        <StatCard
          title="Multas Pendentes"
          value={`R$ ${multasPendentes.toFixed(2)}`}
          icon={DollarSign}
          color="yellow"
        />
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Livros Mais Emprestados */}
        <ChartCard
          title="Livros Mais Emprestados"
          icon={TrendingUp}
        >
          <div className="space-y-3">
            {livrosMaisEmprestados.slice(0, 5).map((livro, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {livro.titulo}
                  </p>
                </div>
                <div className="flex items-center">
                  <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full" 
                      style={{ 
                        width: `${(livro.totalEmprestimos / Math.max(...livrosMaisEmprestados.map(l => l.totalEmprestimos))) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500 w-8 text-right">
                    {livro.totalEmprestimos}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Top Leitores */}
        <ChartCard
          title="Top Leitores"
          icon={Users}
        >
          <div className="space-y-3">
            {topLeitores.map((leitor, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-600">
                      {index + 1}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {leitor.nomeMembro}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {leitor.totalEmprestimos} empréstimos
                </span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Livros em Atraso */}
      <div className="card">
        <div className="flex items-center mb-4">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Livros em Atraso</h3>
        </div>
        {livrosAtraso.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Livro</th>
                  <th>Membro</th>
                  <th>Data Prevista</th>
                  <th>Dias de Atraso</th>
                </tr>
              </thead>
              <tbody>
                {livrosAtraso.map((atraso, index) => (
                  <tr key={index}>
                    <td className="font-medium">{atraso.titulo}</td>
                    <td>{atraso.nomeMembro}</td>
                    <td>{new Date(atraso.dataDevolucaoPrevista).toLocaleDateString('pt-BR')}</td>
                    <td>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {atraso.diasDeAtraso} dias
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            Nenhum livro em atraso no momento.
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

