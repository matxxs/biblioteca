import axios from 'axios';
import {
  Livro,
  Membro,
  Emprestimo,
  Exemplar,
  Multa,
  Reserva,
  RelatorioLivrosMaisEmprestados,
  RelatorioLivrosAtraso,
  RelatorioDisponibilidade,
  RelatorioAutoresPopulares,
  RelatorioGenerosPopulares,
  RelatorioLivrosNuncaEmprestados,
  RelatorioMultasPendentes,
  RelatorioTopLeitores,
  RelatorioHistoricoMembro,
  RelatorioTotalMultas
} from '../types';

// Configuração base da API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Serviços para Livros
export const livroService = {
  getAll: () => api.get<Livro[]>('/livros'),
  getById: (id: number) => api.get<Livro>(`/livros/${id}`),
  create: (livro: Omit<Livro, 'livroID'>) => api.post<Livro>('/livros', livro),
  update: (id: number, livro: Partial<Livro>) => api.put<Livro>(`/livros/${id}`, livro),
  delete: (id: number) => api.delete(`/livros/${id}`),

  getEditoras: () => api.get<{ editoraID: number; nome: string; contato?: string }[]>('/livros/editoras'),
  getAutores: () => api.get<{ autorID: number; nome: string; sobrenome: string; nacionalidade?: string }[]>('/livros/autores'),
  getGeneros: () => api.get<{ generoID: number; nome: string }[]>('/livros/generos'),
};

// Serviços para Membros
export const membroService = {
  getAll: () => api.get<Membro[]>('/membros'),
  getById: (id: number) => api.get<Membro>(`/membros/${id}`),
  create: (membro: Omit<Membro, 'membroID'>) => api.post<Membro>('/membros', membro),
  update: (id: number, membro: Partial<Membro>) => api.put<Membro>(`/membros/${id}`, membro),
  delete: (id: number) => api.delete(`/membros/${id}`),
  patchStatus: (id: number, membro: Partial<Membro>) => api.patch<Membro>(`/membros/${id}/status`, membro),
};

// Serviços para Empréstimos
export const emprestimoService = {
  getAll: () => api.get<Emprestimo[]>('/emprestimos'),
  getById: (id: number) => api.get<Emprestimo>(`/emprestimos/${id}`),
  create: (emprestimo: Omit<Emprestimo, 'emprestimoID'>) => api.post<Emprestimo>('/emprestimos', emprestimo),
  update: (id: number, emprestimo: Partial<Emprestimo>) => api.put<Emprestimo>(`/emprestimos/${id}`, emprestimo),
  delete: (id: number) => api.delete(`/emprestimos/${id}`),
  devolver: (id: number) => api.post(`/emprestimos/${id}/devolver`),
};

// Serviços para Exemplares
export const exemplarService = {
  getAll: () => api.get<Exemplar[]>('/exemplares'),
  getById: (id: number) => api.get<Exemplar>(`/exemplares/${id}`),
  getByLivroId: (id: number) => api.get<Exemplar>(`/exemplares/livro/${id}`),
  patchUpdateStatus: (id: number, status: string) =>
    api.patch(`/exemplares/${id}/status`, { statusExemplar: status }),
  create: (exemplar: Omit<Exemplar, 'exemplarID'>) => api.post<Exemplar>('/exemplares', exemplar),
  update: (id: number, exemplar: Partial<Exemplar>) => api.put<Exemplar>(`/exemplares/${id}`, exemplar),
  delete: (id: number) => api.delete(`/exemplares/${id}`),
};

// Serviços para Multas
export const multaService = {
  getAll: () => api.get<Multa[]>('/multas'),
  getById: (id: number) => api.get<Multa>(`/multas/${id}`),
  pagar: (id: number) => api.post(`/multas/${id}/pagar`),
};

// Serviços para Reservas
export const reservaService = {
  getAll: () => api.get<Reserva[]>('/reservas'),
  getById: (id: number) => api.get<Reserva>(`/reservas/${id}`),
  create: (reserva: Omit<Reserva, 'reservaID'>) => api.post<Reserva>('/reservas', reserva),
  update: (id: number, reserva: Partial<Reserva>) => api.put<Reserva>(`/reservas/${id}`, reserva),
  delete: (id: number) => api.delete(`/reservas/${id}`),
};

// Serviços para Relatórios
export const relatorioService = {
  getLivrosMaisEmprestados: () => api.get<RelatorioLivrosMaisEmprestados[]>('/relatorios/livros-mais-emprestados'),
  getLivrosAtraso: () => api.get<RelatorioLivrosAtraso[]>('/relatorios/livros-atraso'),
  getDisponibilidade: () => api.get<RelatorioDisponibilidade[]>('/relatorios/disponibilidade'),
  getAutoresPopulares: () => api.get<RelatorioAutoresPopulares[]>('/relatorios/autores-populares'),
  getGenerosPopulares: () => api.get<RelatorioGenerosPopulares[]>('/relatorios/generos-populares'),
  getLivrosNuncaEmprestados: () => api.get<RelatorioLivrosNuncaEmprestados[]>('/relatorios/livros-nunca-emprestados'),
  getMultasPendentes: () => api.get<RelatorioMultasPendentes[]>('/relatorios/multas-pendentes'),
  getTopLeitores: () => api.get<RelatorioTopLeitores[]>('/relatorios/top-leitores'),
  getHistoricoMembro: (membroId: number) => api.get<RelatorioHistoricoMembro[]>(`/relatorios/historico-membro/${membroId}`),
  getTotalMultas: () => api.get<RelatorioTotalMultas[]>('/relatorios/total-multas'),
};

export default api;

