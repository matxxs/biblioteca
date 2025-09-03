import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Livros from './pages/Livros';
import Membros from './pages/Membros';
import Emprestimos from './pages/Emprestimos';
import Relatorios from './pages/Relatorios';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/livros" element={<Livros />} />
          <Route path="/membros" element={<Membros />} />
          <Route path="/emprestimos" element={<Emprestimos />} />
          <Route path="/relatorios" element={<Relatorios />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

