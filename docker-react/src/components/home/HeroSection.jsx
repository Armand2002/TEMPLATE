import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';

const HeroSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  
  const handleSearch = (e) => {
    e.preventDefault();
    alert(`Ricerca: ${searchTerm} a ${location}`);
  };

  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-500 py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Trova il tuo specialista e prenota una visita
          </h1>
          <p className="text-xl text-white mb-8">
            Più di 5.000 professionisti disponibili per la tua salute
          </p>
          
          {/* Search Form */}
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-3xl mx-auto">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={20} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Specialista o prestazione"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin size={20} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Dove?"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Cerca
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;