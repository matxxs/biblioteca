// Tipos para o sistema de biblioteca

export interface Editora {
  editoraID: number;
  nome: string;
  contato?: string;
}

export interface Autor {
  autorID: number;
  nome: string;
  sobrenome: string;
  nacionalidade?: string;
}

export interface Genero {
  generoID: number;
  nome: string;
}

export interface Livro {
  livroID: number;
  titulo: string;
  editoraID: number;
  isbn: string;
  anoPublicacao?: number;
  edicao?: string;
  numeroPaginas?: number;
  sinopse?: string;
  contagem?: Contagem;
  editora?: Editora;
  autores?: Autor[];
  generos?: Genero[];
}

export interface Exemplar {
  exemplarID: number;
  livroID: number;
  codigoLocalizacao: string;
  statusExemplar: 'Disponível' | 'Emprestado' | 'Manutenção' | 'Perdido';
  livro?: Livro;
}

export interface Membro {
  membroID: number;
  nome: string;
  sobrenome: string;
  dataNascimento?: string;
  endereco: string;
  telefone?: string;
  email: string;
  dataCadastro: string;
  statusMembro: 'Ativo' | 'Inativo' | 'Bloqueado';
}

export interface Emprestimo {
  emprestimoID: number;
  exemplarID: number;
  membroID: number;
  dataEmprestimo: string;
  dataDevolucaoPrevista: string;
  dataDevolucaoReal?: string;
  exemplar?: Exemplar;
  membro?: Membro;
}

export interface Multa {
  multaID: number;
  emprestimoID: number;
  valor: number;
  dataGeracao: string;
  statusMulta: 'Pendente' | 'Paga';
  dataPagamento?: string;
  emprestimo?: Emprestimo;
}

export interface Reserva {
  reservaID: number;
  livroID: number;
  membroID: number;
  dataReserva: string;
  statusReserva: 'Ativa' | 'Cancelada' | 'Atendida';
  dataNotificacao?: string;
  livro?: Livro;
  membro?: Membro;
}

// Tipos para relatórios
export interface RelatorioLivrosMaisEmprestados {
  titulo: string;
  totalEmprestimos: number;
}

export interface RelatorioLivrosAtraso {
  titulo: string;
  nomeMembro: string;
  dataDevolucaoPrevista: string;
  diasDeAtraso: number;
}

export interface RelatorioDisponibilidade {
  titulo: string;
  totalExemplares: number;
  exemplaresDisponiveis: number;
  exemplaresEmprestados: number;
}

export interface RelatorioAutoresPopulares {
  nomeAutor: string;
  totalEmprestimos: number;
}

export interface RelatorioGenerosPopulares {
  genero: string;
  totalEmprestimos: number;
}

export interface RelatorioLivrosNuncaEmprestados {
  titulo: string;
  editora: string;
}

export interface RelatorioMultasPendentes {
  nomeMembro: string;
  email: string;
  valorMulta: number;
  dataGeracao: string;
}

export interface RelatorioTopLeitores {
  nomeMembro: string;
  totalEmprestimos: number;
}

export interface RelatorioHistoricoMembro {
  titulo: string;
  dataEmprestimo: string;
  dataDevolucaoPrevista: string;
  dataDevolucaoReal?: string;
  status: string;
  valorMulta: number;
  dataPagamento: Date;
}

export interface RelatorioTotalMultas {
  statusMulta: string;
  valorTotal: number;
  quantidadeMultas: number;
}

// 

export interface Contagem {
  disponiveis: number,
  total: number
}
