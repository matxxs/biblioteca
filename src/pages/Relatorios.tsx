import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { relatorioService } from '../services/api';
import {
  RelatorioLivrosMaisEmprestados,
  RelatorioAutoresPopulares,
  RelatorioGenerosPopulares,
  RelatorioDisponibilidade,
  RelatorioTotalMultas
} from '../types';
import ChartCard from '../components/ChartCard';
import { TrendingUp, Users, BookOpen, DollarSign } from 'lucide-react';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

const Relatorios: React.FC = () => {
  const [livrosMaisEmprestados, setLivrosMaisEmprestados] = useState<RelatorioLivrosMaisEmprestados[]>([]);
  const [autoresPopulares, setAutoresPopulares] = useState<RelatorioAutoresPopulares[]>([]);
  const [generosPopulares, setGenerosPopulares] = useState<RelatorioGenerosPopulares[]>([]);
  const [disponibilidade, setDisponibilidade] = useState<RelatorioDisponibilidade[]>([]);
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
          multasRes
        ] = await Promise.all([
          relatorioService.getLivrosMaisEmprestados(),
          relatorioService.getAutoresPopulares(),
          relatorioService.getGenerosPopulares(),
          relatorioService.getDisponibilidade(),
          relatorioService.getTotalMultas()
        ]);

        setLivrosMaisEmprestados(livrosRes.data);
        setAutoresPopulares(autoresRes.data);
        setGenerosPopulares(generosRes.data);
        setDisponibilidade(disponibilidadeRes.data);
        setTotalMultas(multasRes.data);
      } catch (error) {
        console.error('Erro ao carregar relatórios:', error);
        // Dados mockados para demonstração
        setLivrosMaisEmprestados([
          { titulo: 'O Senhor dos Anéis', totalEmprestimos: 45 },
          { titulo: 'Harry Potter', totalEmprestimos: 38 },
          { titulo: '1984', totalEmprestimos: 32 },
          { titulo: 'Dom Casmurro', totalEmprestimos: 28 },
          { titulo: 'A Revolução dos Bichos', totalEmprestimos: 25 },
          { titulo: 'O Hobbit', totalEmprestimos: 22 },
          { titulo: 'Cem Anos de Solidão', totalEmprestimos: 20 },
          { titulo: 'O Pequeno Príncipe', totalEmprestimos: 18 }
        ]);
        setAutoresPopulares([
          { nomeAutor: 'J.R.R. Tolkien', totalEmprestimos: 67 },
          { nomeAutor: 'J.K. Rowling', totalEmprestimos: 38 },
          { nomeAutor: 'George Orwell', totalEmprestimos: 32 },
          { nomeAutor: 'Machado de Assis', totalEmprestimos: 28 },
          { nomeAutor: 'Gabriel García Márquez', totalEmprestimos: 20 }
        ]);
        setGenerosPopulares([
          { genero: 'Fantasia', totalEmprestimos: 120 },
          { genero: 'Ficção Científica', totalEmprestimos: 85 },
          { genero: 'Romance', totalEmprestimos: 75 },
          { genero: 'Literatura Brasileira', totalEmprestimos: 60 },
          { genero: 'Drama', totalEmprestimos: 45 }
        ]);
        setDisponibilidade([
          { titulo: 'O Senhor dos Anéis', totalExemplares: 3, exemplaresDisponiveis: 1, exemplaresEmprestados: 2 },
          { titulo: 'Harry Potter', totalExemplares: 2, exemplaresDisponiveis: 0, exemplaresEmprestados: 2 },
          { titulo: '1984', totalExemplares: 2, exemplaresDisponiveis: 1, exemplaresEmprestados: 1 },
          { titulo: 'Dom Casmurro', totalExemplares: 1, exemplaresDisponiveis: 1, exemplaresEmprestados: 0 }
        ]);
        setTotalMultas([
          { statusMulta: 'Pendente', valorTotal: 45.50, quantidadeMultas: 12 },
          { statusMulta: 'Paga', valorTotal: 120.00, quantidadeMultas: 24 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadRelatorios();
  }, []);

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
        <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
        <p className="mt-1 text-sm text-gray-500">
          Análises detalhadas do sistema de biblioteca
        </p>
      </div>

      {/* Gráfico de Livros Mais Emprestados */}
      <ChartCard title="Livros Mais Emprestados" icon={TrendingUp}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={livrosMaisEmprestados.slice(0, 8)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="titulo" 
              angle={-45}
              textAnchor="end"
              height={100}
              fontSize={12}
            />
            <YAxis />
            <Tooltip 
              formatter={(value: number) => [value, 'Empréstimos']}
              labelStyle={{ color: '#374151' }}
            />
            <Bar dataKey="totalEmprestimos" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Gráfico de Autores Populares */}
        <ChartCard title="Autores Mais Populares" icon={Users}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={autoresPopulares}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="nomeAutor" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [value, 'Empréstimos']}
                labelStyle={{ color: '#374151' }}
              />
              <Bar dataKey="totalEmprestimos" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Gráfico de Gêneros Populares */}
        <ChartCard title="Gêneros Mais Emprestados" icon={BookOpen}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={generosPopulares}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ genero, percent }) => `${genero} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="totalEmprestimos"
              >
                {generosPopulares.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [value, 'Empréstimos']} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Gráfico de Disponibilidade */}
      <ChartCard title="Disponibilidade de Livros" icon={BookOpen}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={disponibilidade}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="titulo" 
              angle={-45}
              textAnchor="end"
              height={100}
              fontSize={12}
            />
            <YAxis />
            <Tooltip 
              formatter={(value: number, name: string) => [
                value, 
                name === 'exemplaresDisponiveis' ? 'Disponíveis' : 
                name === 'exemplaresEmprestados' ? 'Emprestados' : 'Total'
              ]}
              labelStyle={{ color: '#374151' }}
            />
            <Bar dataKey="exemplaresDisponiveis" stackId="a" fill="#10B981" name="Disponíveis" />
            <Bar dataKey="exemplaresEmprestados" stackId="a" fill="#EF4444" name="Emprestados" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Resumo de Multas */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Resumo de Multas" icon={DollarSign}>
          <div className="space-y-4">
            {totalMultas.map((multa, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">
                    {multa.statusMulta === 'Pendente' ? 'Multas Pendentes' : 'Multas Pagas'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {multa.quantidadeMultas} multas
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">
                    R$ {multa.valorTotal.toFixed(2)}
                  </p>
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    multa.statusMulta === 'Pendente' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {multa.statusMulta}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Tabela de Livros Mais Emprestados */}
        <div className="card">
          <div className="flex items-center mb-4">
            <TrendingUp className="h-5 w-5 text-primary-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Ranking de Livros</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Posição</th>
                  <th>Livro</th>
                  <th>Empréstimos</th>
                </tr>
              </thead>
              <tbody>
                {livrosMaisEmprestados.slice(0, 10).map((livro, index) => (
                  <tr key={index}>
                    <td>
                      <div className="flex items-center">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                          index < 3 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {index + 1}
                        </span>
                      </div>
                    </td>
                    <td className="font-medium">{livro.titulo}</td>
                    <td>{livro.totalEmprestimos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Relatorios;

