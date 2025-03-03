import React from 'react';
import { Calendar, Clock, FileText, Star } from 'lucide-react';
import StatCard from '../common/StatCard';
import AppointmentCard from './AppointmentCard';
import HealthRecordCard from './HealthRecordCard';
import ProfessionalItem from './ProfessionalItem';

const OverviewTab = ({ appointments, healthRecords, favoriteProviders, onCancelAppointment }) => {
  const pendingAppointments = appointments?.filter(app => 
    app.status === 'pending' || app.status === 'confirmed'
  ) || [];
  
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard 
          title="Appuntamenti programmati" 
          value={pendingAppointments.length} 
          icon={<Calendar size={20} />} 
        />
        <StatCard 
          title="Documenti sanitari" 
          value={healthRecords?.length || 0} 
          icon={<FileText size={20} />} 
        />
        <StatCard 
          title="Specialisti preferiti" 
          value={favoriteProviders?.length || 0}
          icon={<Star size={20} />} 
        />
      </div>
      
      <h2 className="text-lg font-medium mb-4">Prossimi appuntamenti</h2>
      <div className="mb-8">
        {pendingAppointments && pendingAppointments
          .slice(0, 2)
          .map(appointment => (
            <AppointmentCard 
              key={appointment.id} 
              appointment={appointment} 
              onCancel={onCancelAppointment}
            />
          ))}
        {pendingAppointments.length === 0 && (
          <p className="text-gray-500">Nessun appuntamento programmato.</p>
        )}
        {pendingAppointments.length > 0 && (
          <div className="mt-4">
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Vedi tutti gli appuntamenti
            </button>
          </div>
        )}
      </div>
      
      <h2 className="text-lg font-medium mb-4">Documenti recenti</h2>
      <div className="mb-8">
        {healthRecords && healthRecords
          .slice(0, 3)
          .map(record => (
            <HealthRecordCard 
              key={record.id} 
              record={record} 
            />
          ))}
        {(!healthRecords || healthRecords.length === 0) && (
          <p className="text-gray-500">Nessun documento sanitario trovato.</p>
        )}
        {healthRecords && healthRecords.length > 0 && (
          <div className="mt-4">
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Vedi tutti i documenti
            </button>
          </div>
        )}
      </div>
      
      <h2 className="text-lg font-medium mb-4">I tuoi professionisti</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {favoriteProviders && favoriteProviders.map(provider => (
          <ProfessionalItem key={provider.id} professional={provider} />
        ))}
        {(!favoriteProviders || favoriteProviders.length === 0) && (
          <p className="text-gray-500">Nessun professionista preferito trovato.</p>
        )}
      </div>
    </div>
  );
};

export default OverviewTab;