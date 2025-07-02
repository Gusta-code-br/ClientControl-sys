import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ClientesPage from './pages/ClientesPage';
import ServicosPage from './pages/ServicosPage';
import OSPage from './pages/OSPage';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/clientes" element={<ClientesPage />} />
          <Route path="/servicos" element={<ServicosPage />} />
          <Route path="/ordens-servico" element={<OSPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;