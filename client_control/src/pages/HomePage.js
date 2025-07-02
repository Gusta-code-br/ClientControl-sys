import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Sistema de Ordens de Serviço
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Gerencie suas ordens de serviço de forma simples e eficiente. 
          Cadastre clientes, registre serviços e acompanhe o andamento das suas OS.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <Link to="/clientes" className="block">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Clientes</h3>
              <p className="text-gray-600">
                Gerencie seus clientes, adicione novos contatos e mantenha os dados atualizados.
              </p>
            </div>
          </div>
        </Link>

        <Link to="/servicos" className="block">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="text-4xl mb-4">🔧</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Serviços</h3>
              <p className="text-gray-600">
                Cadastre os serviços oferecidos e defina preços base para suas OS.
              </p>
            </div>
          </div>
        </Link>

        <Link to="/ordens-servico" className="block">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ordens de Serviço</h3>
              <p className="text-gray-600">
                Crie e acompanhe suas ordens de serviço do início ao fim.
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;