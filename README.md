# Sistema de Gerenciamento de Biblioteca

Uma aplicação completa de gerenciamento de biblioteca com frontend em React/TypeScript e backend em Node.js conectado ao SQL Server.

## 🚀 Funcionalidades

### Dashboard
- Visão geral do sistema com estatísticas
- Gráficos interativos dos relatórios
- Livros mais emprestados
- Top leitores
- Livros em atraso

### Gerenciamento de Livros
- CRUD completo de livros
- Associação com autores e gêneros
- Controle de exemplares
- Busca por título, ISBN ou editora

### Gerenciamento de Membros
- CRUD completo de membros
- Controle de status (Ativo, Inativo, Bloqueado)
- Histórico de empréstimos

### Gerenciamento de Empréstimos
- Realização de empréstimos
- Devolução de livros
- Controle de atrasos
- Cálculo automático de multas

### Relatórios
- Livros mais emprestados
- Autores mais populares
- Gêneros mais emprestados
- Disponibilidade de livros
- Multas pendentes e pagas
- Top leitores
- Livros em atraso

## 🛠️ Tecnologias

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Recharts (gráficos)
- Lucide React (ícones)
- Axios (HTTP client)

### Backend
- Node.js
- Express.js
- SQL Server (mssql)
- CORS
- Helmet (segurança)
- Morgan (logs)

## 📋 Pré-requisitos

- Node.js 16+
- SQL Server
- Banco de dados `BibliotecaDB` criado

## 🚀 Instalação e Execução

### 1. Configurar o Banco de Dados

Execute o script SQL fornecido para criar o banco de dados e as tabelas:

```sql
-- Execute o script de criação do banco de dados
-- BibliotecaDB.sql
```

### 2. Configurar o Backend

```bash
cd server
npm install
```

Crie um arquivo `.env` na pasta `server` com as configurações do banco:

```env
DB_SERVER=localhost
DB_DATABASE=BibliotecaDB
DB_USER=sa
DB_PASSWORD=sua_senha_aqui
DB_PORT=1433
DB_ENCRYPT=true
DB_TRUST_SERVER_CERTIFICATE=true
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

Inicie o servidor:

```bash
npm start
# ou para desenvolvimento
npm run dev
```

### 3. Configurar o Frontend

```bash
npm install
```

Inicie a aplicação:

```bash
npm start
```

A aplicação estará disponível em `http://localhost:3000`

## 📊 Estrutura do Banco de Dados

### Tabelas Principais
- **Livros**: Informações dos livros
- **Autores**: Dados dos autores
- **Editoras**: Informações das editoras
- **Gêneros**: Categorias literárias
- **Exemplares**: Cópias físicas dos livros
- **Membros**: Usuários da biblioteca
- **Empréstimos**: Registro de empréstimos
- **Multas**: Controle de multas por atraso
- **Reservas**: Sistema de reservas

### Relacionamentos
- Livros ↔ Autores (N:N)
- Livros ↔ Gêneros (N:N)
- Livros → Exemplares (1:N)
- Exemplares → Empréstimos (1:N)
- Membros → Empréstimos (1:N)
- Empréstimos → Multas (1:N)

## 🔧 API Endpoints

### Livros
- `GET /api/livros` - Listar livros
- `GET /api/livros/:id` - Buscar livro
- `POST /api/livros` - Criar livro
- `PUT /api/livros/:id` - Atualizar livro
- `DELETE /api/livros/:id` - Excluir livro

### Membros
- `GET /api/membros` - Listar membros
- `GET /api/membros/:id` - Buscar membro
- `POST /api/membros` - Criar membro
- `PUT /api/membros/:id` - Atualizar membro
- `DELETE /api/membros/:id` - Excluir membro

### Empréstimos
- `GET /api/emprestimos` - Listar empréstimos
- `POST /api/emprestimos` - Realizar empréstimo
- `POST /api/emprestimos/:id/devolver` - Devolver livro

### Relatórios
- `GET /api/relatorios/livros-mais-emprestados`
- `GET /api/relatorios/livros-atraso`
- `GET /api/relatorios/disponibilidade`
- `GET /api/relatorios/autores-populares`
- `GET /api/relatorios/generos-populares`
- `GET /api/relatorios/multas-pendentes`
- `GET /api/relatorios/top-leitores`
- `GET /api/relatorios/total-multas`

## 📱 Interface

A interface é responsiva e moderna, com:
- Dashboard com gráficos interativos
- Tabelas com busca e filtros
- Modais para formulários
- Design system consistente
- Navegação intuitiva

## 🔒 Segurança

- Validação de dados no backend
- Sanitização de inputs
- Headers de segurança (Helmet)
- CORS configurado
- Transações de banco de dados

## 📈 Relatórios Disponíveis

1. **Livros Mais Emprestados**: Ranking dos livros mais populares
2. **Livros em Atraso**: Controle de devoluções atrasadas
3. **Disponibilidade**: Status dos exemplares
4. **Autores Populares**: Ranking por empréstimos
5. **Gêneros Populares**: Preferências dos leitores
6. **Multas**: Controle financeiro
7. **Top Leitores**: Membros mais ativos
8. **Histórico**: Empréstimos por membro

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 📞 Suporte

Para dúvidas ou suporte, entre em contato através dos issues do GitHub.

