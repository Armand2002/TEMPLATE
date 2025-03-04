import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../../components/dashboard/common/DashboardHeader'; // Corretto "DashBoardHeader" in "DashboardHeader"
import Sidebar from '../../components/dashboard/common/Sidebar';
import OverviewTab from '../../components/dashboard/patient/OverviewTab';
import AppointmentsTab from '../../components/dashboard/patient/AppointmentsTab';
import HealthRecordsTab from '../../components/dashboard/patient/HealthRecordsTab';
import ProfessionalsTab from '../../components/dashboard/patient/ProfessionalsTab';
import SettingsTab from '../../components/dashboard/patient/SettingsTab';
import { isAuthenticated, logout } from '../../services/auth';
import { getAppointments } from '../../services/appointments';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
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
        
        // Simula notifiche
        setNotifications([
          { id: 1, message: 'Nuovo appuntamento confermato', date: '2025-03-05' },
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
  
  // Sidebar links
  const sidebarLinks = [
    { id: 'overview', label: 'Panoramica', icon: 'layout' },
    { id: 'appointments', label: 'Appuntamenti', icon: 'calendar' },
    { id: 'health-records', label: 'Documenti Sanitari', icon: 'file-text' },
    { id: 'professionals', label: 'Professionisti', icon: 'users' },
    { id: 'settings', label: 'Impostazioni', icon: 'settings' }
  ];
  
  // Rimuovi questa riga che causa l'errore
  // const tabsToRender = tabs || [
  //   { id: 'overview', name: 'Panoramica' },
  //   { id: 'appointments', name: 'Appuntamenti' },
  //   { id: 'patients', name: 'Pazienti' },    
  //   { id: 'settings', name: 'Impostazioni' },
  // ];

  // Renderer condizionale in base allo stato di caricamento
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Renderizza il componente corretto in base alla tab attiva
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab onCancelAppointment={handleCancelAppointment} />;
      case 'appointments':
        return <AppointmentsTab appointments={appointments} onCancelAppointment={handleCancelAppointment} />;
      case 'health-records':
        return <HealthRecordsTab />;
      case 'professionals':
        return <ProfessionalsTab />;
      case 'settings':
        return <SettingsTab user={user} />;
      default:
        return <OverviewTab onCancelAppointment={handleCancelAppointment} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        tabs={sidebarLinks.map(link => ({ id: link.id, name: link.label }))} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          user={user} 
          notifications={notifications} 
          onLogout={handleLogout}
          title="Dashboard Paziente"
        />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {renderActiveTab()}
        </main>
      </div>
    </div>
  );
};

export default PatientDashboard;