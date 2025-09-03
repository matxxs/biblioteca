const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const { connectDB } = require('./config/database');

// Importar rotas
const livrosRoutes = require('./routes/livros');
const membrosRoutes = require('./routes/membros');
const emprestimosRoutes = require('./routes/emprestimos');
const exemplaresRoutes = require('./routes/exemplares');
const multasRoutes = require('./routes/multas');
const reservasRoutes = require('./routes/reservas');
const relatoriosRoutes = require('./routes/relatorios');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar ao banco de dados
connectDB().catch(console.error);

// Rotas da API
app.use('/api/livros', livrosRoutes);
app.use('/api/membros', membrosRoutes);
app.use('/api/emprestimos', emprestimosRoutes);
app.use('/api/exemplares', exemplaresRoutes);
app.use('/api/multas', multasRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/relatorios', relatoriosRoutes);

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo deu errado'
  });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 API disponível em http://localhost:${PORT}/api`);
  console.log(`🏥 Health check em http://localhost:${PORT}/api/health`);
});

module.exports = app;

