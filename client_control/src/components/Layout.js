import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'bg-blue-700' : '';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-xl font-bold">
                Sistema OS
              </Link>
              <div className="flex space-x-4">
                <Link
                  to="/"
                  className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive('/')}`}
                >
                  Home
                </Link>
                <Link
                  to="/clientes"
                  className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive('/clientes')}`}
                >
                  Clientes
                </Link>
                <Link
                  to="/servicos"
                  className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive('/servicos')}`}
                >
                  Serviços
                </Link>
                <Link
                  to="/ordens-servico"
                  className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive('/ordens-servico')}`}
                >
                  Ordens de Serviço
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 px-4">
        {children}
      </main>
    </div>
  );
};

export default Layout;