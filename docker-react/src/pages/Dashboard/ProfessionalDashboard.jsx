// File: TEMPLATE/docker-react/src/pages/Dashboard/ProfessionalDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../../components/dashboard/common/DashboardHeader';
import Sidebar from '../../components/dashboard/common/Sidebar';
import OverviewTab from '../../components/dashboard/professional/OverviewTab';
import AppointmentsTab from '../../components/dashboard/professional/AppointmentsTab';
import PatientsTab from '../../components/dashboard/professional/PatientsTab';
import SettingsTab from '../../components/dashboard/professional/SettingsTab';
import { isAuthenticated, logout } from '../../services/auth';
import { getAppointments, updateAppointmentStatus } from '../../services/appointments';

const ProfessionalDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Verifico autenticazione
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    const currentUser = JSON.parse(localStorage.getItem('authUser') || '{}');
    setUser(currentUser);
    
    // Carico i dati
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Carica appuntamenti
        const appointmentsData = await getAppointments();
        setAppointments(appointmentsData);
        
        // Estrai pazienti dagli appuntamenti
        const uniquePatients = [];
        const patientIds = new Set();
        appointmentsData.forEach(app => {
          if (!patientIds.has(app.patientId)) {
            patientIds.add(app.patientId);
            uniquePatients.push({
              id: app.patientId,
              name: app.patientName,
              lastVisit: app.date
            });
          }
        });
        setPatients(uniquePatients);
        
        // Simula notifiche
        setNotifications([
          { id: 1, message: 'Nuovo appuntamento', date: '2025-03-03' },
          { id: 2, message: 'Messaggio da paziente', date: '2025-03-02' }
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [navigate]);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const handleUpdateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      await updateAppointmentStatus(appointmentId, newStatus);
      setAppointments(appointments.map(app => 
        app.id === appointmentId ? { ...app, status: newStatus } : app
      ));
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  // Renderer condizionale in base allo stato di caricamento
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Caricamento dashboard...</p>
      </div>
    );
  }

  // Determina quale tab mostrare
  const renderContent = () => {
    switch(activeTab) {
      case 'overview':
        return (
          <OverviewTab 
            appointments={appointments}
            patients={patients}
            onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
          />
        );
      case 'appointments':
        return (
          <AppointmentsTab 
            appointments={appointments}
            onUpdateStatus={handleUpdateAppointmentStatus}
          />
        );
      case 'patients':
        return (
          <PatientsTab patients={patients} />
        );
      case 'settings':
        return (
          <SettingsTab />
        );
      default:
        return <div>Seleziona una sezione</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        user={user}
        notifications={notifications}
        onLogout={handleLogout}
        title="Dashboard Professionista" 
        subtitle={`Benvenuto, Dr. ${user?.name || ''}`}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/4">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
          <div className="md:w-3/4">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;