import React, { useState } from 'react';
import { Search, Upload } from 'lucide-react';
import HealthRecordCard from './HealthRecordCard';

const HealthRecordsTab = ({ healthRecords }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const recordTypes = ['Laboratorio', 'Diagnostica', 'Visita', 'Prescrizione', 'Altro'];
  
  const filteredRecords = healthRecords
    ?.filter(record => {
      if (filter === 'all') return true;
      return record.type === filter;
    })
    .filter(record => {
      if (!searchTerm) return true;
      return (
        record.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        record.doctor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }) || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium">Documenti sanitari</h2>
        <div className="flex items-center">
          <div className="relative mr-2">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cerca documenti" 
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <Upload size={18} className="mr-1" />
            <span>Carica</span>
          </button>
        </div>
      </div>
      
      <div className="flex mb-6 overflow-x-auto whitespace-nowrap">
        <button 
          className={`mr-2 px-4 py-2 rounded-md ${
            filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300'
          }`}
          onClick={() => setFilter('all')}
        >
          Tutti
        </button>
        {recordTypes.map(type => (
          <button 
            key={type}
            className={`mr-2 px-4 py-2 rounded-md ${
              filter === type ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300'
            }`}
            onClick={() => setFilter(type)}
          >
            {type}
          </button>
        ))}
      </div>
      
      {filteredRecords.map(record => (
        <HealthRecordCard 
          key={record.id} 
          record={record} 
        />
      ))}
      
      {filteredRecords.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500 mb-4">Nessun documento trovato.</p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Carica un documento
          </button>
        </div>
      )}
    </div>
  );
};

export default HealthRecordsTab;