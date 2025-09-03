const sql = require('mssql');

const config = {
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_DATABASE || 'BibliotecaDB',
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'M@ximus@2023#',
  port: parseInt(process.env.DB_PORT) || 3739,
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true'
  }
};

let pool;

const connectDB = async () => {
  try {
    if (!pool) {
      pool = await sql.connect(config);
      console.log('Conectado ao SQL Server');
    }
    return pool;
  } catch (error) {
    console.error('Erro ao conectar com o banco de dados:', error);
    throw error;
  }
};

const getPool = () => {
  if (!pool) {
    throw new Error('Pool de conexão não inicializado');
  }
  return pool;
};

module.exports = {
  connectDB,
  getPool,
  sql
};

