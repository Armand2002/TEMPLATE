import React from 'react';
import { Calendar, Users } from 'lucide-react';
import StatCard from '../common/StatCard';
import AppointmentCard from './AppointmentCard';
import RecentPatientCard from './RecentPatientCard';

const OverviewTab = ({ appointments, patients, onUpdateAppointmentStatus }) => {
  const todayAppointments = appointments?.filter(app => 
    app.status !== 'cancelled' && 
    app.status !== 'completed'
  ) || [];
  
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard 
          title="Appuntamenti oggi" 
          value={todayAppointments.length} 
          icon={<Calendar size={20} />} 
        />
        <StatCard 
          title="Appuntamenti questa settimana" 
          value={appointments?.length || 0} 
          icon={<Calendar size={20} />} 
        />
        <StatCard 
          title="Totale pazienti" 
          value={patients?.length || 0}
          icon={<Users size={20} />} 
        />
      </div>
      
      <h2 className="text-lg font-medium mb-4">Prossimi appuntamenti</h2>
      <div className="mb-8">
        {appointments && appointments
          .filter(app => app.status === 'confirmed' || app.status === 'pending')
          .slice(0, 3)
          .map(appointment => (
            <AppointmentCard 
              key={appointment.id} 
              appointment={appointment} 
              onUpdateStatus={onUpdateAppointmentStatus}
            />
          ))}
        {(!appointments || appointments.length === 0) && (
          <p className="text-gray-500">Nessun appuntamento programmato.</p>
        )}
      </div>
      
      <h2 className="text-lg font-medium mb-4">Pazienti recenti</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {patients && patients.slice(0, 4).map(patient => (
          <RecentPatientCard key={patient.id} patient={patient} />
        ))}
        {(!patients || patients.length === 0) && (
          <p className="text-gray-500">Nessun paziente trovato.</p>
        )}
      </div>
    </div>
  );
};

export default OverviewTab;