import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, logout } from '../../services/auth';
import DashboardHeader from '../../components/dashboard/common/DashboardHeader';
import Sidebar from '../../components/dashboard/common/Sidebar';
import OverviewTab from '../../components/dashboard/patient/OverviewTab';
import AppointmentsTab from '../../components/dashboard/patient/AppointmentsTab';
import HealthRecordsTab from '../../components/dashboard/patient/HealthRecordsTab';
import ProfessionalsTab from '../../components/dashboard/patient/ProfessionalsTab';
import SettingsTab from '../../components/dashboard/patient/SettingsTab';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [healthRecords, setHealthRecords] = useState([]);
  const [favoriteProviders, setFavoriteProviders] = useState([]);
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
        // Simula caricamento appuntamenti
        const mockAppointments = [
          { 
            id: 1, 
            professionalName: 'Dr. Marco Rossi', 
            specialty: 'Cardiologo',
            serviceName: 'Visita cardiologica', 
            date: '15/03/2025', 
            time: '10:00', 
            status: 'confirmed', 
            location: 'Via Roma 123, Milano'
          },
          { 
            id: 2, 
            professionalName: 'Dr.ssa Giulia Bianchi', 
            specialty: 'Psicologa',
            serviceName: 'Seduta di psicoterapia', 
            date: '20/03/2025', 
            time: '15:30', 
            status: 'pending',
            location: 'Via Garibaldi 45, Milano'
          }
        ];
        setAppointments(mockAppointments);
        
        // Simula caricamento documenti sanitari
        const mockHealthRecords = [
          {
            id: 1,
            title: 'Analisi del sangue',
            date: '10/02/2025',
            doctor: 'Dr. Paolo Verdi',
            type: 'Laboratorio',
            status: 'Completato'
          },
          {
            id: 2,
            title: 'Radiografia torace',
            date: '20/01/2025',
            doctor: 'Dr.ssa Sara Neri',
            type: 'Diagnostica',
            status: 'Completato'
          },
          {
            id: 3,
            title: 'Visita cardiologica',
            date: '05/12/2024',
            doctor: 'Dr. Marco Rossi',
            type: 'Visita',
            status: 'Completato'
          }
        ];
        setHealthRecords(mockHealthRecords);
        
        // Simula caricamento professionisti preferiti
        const mockFavoriteProviders = [
          {
            id: 1,
            name: 'Dr. Marco Rossi',
            specialty: 'Cardiologo',
            rating: 4.9,
            lastVisit: '05/12/2024'
          },
          {
            id: 2,
            name: 'Dr.ssa Giulia Bianchi',
            specialty: 'Psicologa',
            rating: 4.8,
            lastVisit: '15/11/2024'
          }
        ];
        setFavoriteProviders(mockFavoriteProviders);
        
        // Simula notifiche
        setNotifications([
          { id: 1, message: 'Promemoria: visita domani', date: '2025-03-14' },
          { id: 2, message: 'Nuovi risultati disponibili', date: '2025-03-10' }
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
  
  const handleCancelAppointment = async (appointmentId) => {
    try {
      // In una implementazione reale, qui ci sarebbe una chiamata API
      console.log(`Cancellazione appuntamento: ${appointmentId}`);
      
      // Aggiorna localmente lo stato degli appuntamenti
      setAppointments(appointments.filter(app => app.id !== appointmentId));
    } catch (error) {
      console.error('Error cancelling appointment:', error);
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
            healthRecords={healthRecords}
            favoriteProviders={favoriteProviders}
            onCancelAppointment={handleCancelAppointment}
          />
        );
      case 'appointments':
        return (
          <AppointmentsTab 
            appointments={appointments}
            onCancelAppointment={handleCancelAppointment}
          />
        );
      case 'health-records':
        return (
          <HealthRecordsTab 
            healthRecords={healthRecords} 
          />
        );
      case 'professionals':
        return (
          <ProfessionalsTab 
            favoriteProviders={favoriteProviders} 
          />
        );
      case 'settings':
        return (
          <SettingsTab 
            user={user}
          />
        );
      default:
        return <div>Seleziona una sezione</div>;
    }
  };

  // Personalizza le opzioni della sidebar per il paziente
  const patientTabs = [
    { id: 'overview', name: 'Panoramica' },
    { id: 'appointments', name: 'I miei appuntamenti' },
    { id: 'health-records', name: 'Documenti sanitari' },
    { id: 'professionals', name: 'I miei professionisti' },
    { id: 'settings', name: 'Impostazioni' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        user={user}
        notifications={notifications}
        onLogout={handleLogout}
        title="Dashboard Paziente" 
        subtitle={`Benvenuto, ${user?.name || ''}`}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/4">
            <Sidebar 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              tabs={patientTabs}
            />
          </div>
          <div className="md:w-3/4">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;