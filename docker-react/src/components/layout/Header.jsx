import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../common/Logo';

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Logo />
          </div>
          <nav className="hidden md:flex space-x-8">
            <button className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              Come funziona
            </button>
            <button className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              Per i professionisti
            </button>
            <button className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              Assistenza
            </button>
          </nav>
          <div className="flex items-center">
            <Link 
              to="/login" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
            >
              Accedi
            </Link>
            <Link
              to="/register"
              className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Registrati
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;