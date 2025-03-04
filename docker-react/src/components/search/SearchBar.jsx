import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar } from 'lucide-react';

const SearchBar = ({ onSearch, initialFilters = {} }) => {
  const [searchFilters, setSearchFilters] = useState({
    specialty: initialFilters.specialty || '',
    location: initialFilters.location || '',
    date: initialFilters.date || '',
    availability: initialFilters.availability || 'any'
    // Rimosso insurances
  });

  // Aggiorna i filtri quando cambiano quelli iniziali
  useEffect(() => {
    setSearchFilters({
      specialty: initialFilters.specialty || '',
      location: initialFilters.location || '',
      date: initialFilters.date || '',
      availability: initialFilters.availability || 'any'
      // Rimosso insurances
    });
  }, [initialFilters]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Ricerca specialità o prestazione */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              name="specialty"
              placeholder="Specialista o prestazione (es. Cardiologo, Visita pediatrica)"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={searchFilters.specialty}
              onChange={handleChange}
            />
          </div>

          {/* Ricerca località */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              name="location"
              placeholder="Città o indirizzo"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={searchFilters.location}
              onChange={handleChange}
            />
          </div>

          {/* Pulsante di ricerca */}
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center"
          >
            <Search size={20} className="mr-2" />
            <span>Cerca</span>
          </button>
        </div>

        {/* Filtri aggiuntivi (opzionali) */}
        <div className="flex flex-wrap gap-4 mt-4">
          {/* Selezione data */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar size={16} className="text-gray-400" />
            </div>
            <input
              type="date"
              name="date"
              className="pl-10 pr-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={searchFilters.date}
              onChange={handleChange}
            />
          </div>

          {/* Disponibilità */}
          <select
            name="availability"
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={searchFilters.availability}
            onChange={handleChange}
          >
            <option value="any">Qualsiasi disponibilità</option>
            <option value="today">Disponibile oggi</option>
            <option value="tomorrow">Disponibile domani</option>
            <option value="week">Disponibile questa settimana</option>
          </select>
          
          {/* Rimosso il selettore delle convenzioni */}
        </div>
        
        {/* Rimossi i badge delle convenzioni selezionate */}
      </form>
    </div>
  );
};

export default SearchBar;