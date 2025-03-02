import React, { useState } from 'react';
import { Search } from 'lucide-react';
import AppointmentCard from './AppointmentCard';

const AppointmentsTab = ({ appointments, onUpdateStatus }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filtraggio degli appuntamenti
  const filteredAppointments = appointments.filter(app => {
    // Filtraggio per stato
    if (filter !== 'all' && app.status !== filter) return false;
    
    // Filtraggio per ricerca
    if (searchTerm && !app.patientName.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !app.serviceName.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium">Gestione Appuntamenti</h2>
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Cerca appuntamenti" 
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex mb-6">
        <button 
          className={`mr-2 px-4 py-2 rounded-md ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
          onClick={() => setFilter('all')}
        >
          Tutti
        </button>
        <button 
          className={`mr-2 px-4 py-2 rounded-md ${filter === 'pending' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
          onClick={() => setFilter('pending')}
        >
          In attesa
        </button>
        <button 
          className={`mr-2 px-4 py-2 rounded-md ${filter === 'confirmed' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
          onClick={() => setFilter('confirmed')}
        >
          Confermati
        </button>
        <button 
          className={`px-4 py-2 rounded-md ${filter === 'completed' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
          onClick={() => setFilter('completed')}
        >
          Completati
        </button>
      </div>
      
      {filteredAppointments.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Nessun appuntamento trovato</p>
        </div>
      ) : (
        filteredAppointments.map(appointment => (
          <AppointmentCard 
            key={appointment.id} 
            appointment={appointment} 
            onUpdateStatus={onUpdateStatus}
          />
        ))
      )}
    </div>
  );
};

export default AppointmentsTab;