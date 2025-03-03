import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import ProfessionalItem from './ProfessionalItem';

const ProfessionalsTab = ({ favoriteProviders }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredProviders = favoriteProviders?.filter(provider => {
    if (!searchTerm) return true;
    return (
      provider.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      provider.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }) || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium">I miei professionisti</h2>
        <div className="flex items-center">
          <div className="relative mr-2">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cerca professionisti" 
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <Plus size={18} className="mr-1" />
            <span>Trova nuovo</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProviders.map(provider => (
          <ProfessionalItem 
            key={provider.id} 
            professional={provider} 
          />
        ))}
      </div>
      
      {filteredProviders.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500 mb-4">Nessun professionista preferito trovato.</p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Cerca nuovi professionisti
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfessionalsTab;