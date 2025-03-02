import React from 'react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">HealthMatch</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">Come funziona</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">Per i professionisti</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">Assistenza</a>
          </nav>
          <div className="flex items-center">
            <button className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              Accedi
            </button>
            <button className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
              Registrati
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;