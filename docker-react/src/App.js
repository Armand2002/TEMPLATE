import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Importa gli stili CSS
import HomePage from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/Dashboard/PatientDashboard';
import ProfessionalDashboard from './pages/Dashboard/ProfessionalDashboard';
import SearchPage from './pages/Search/index';
import { isAuthenticated, isProfessional } from './services/auth';
import './index.css';

function App() {
  // Funzione per reindirizzare alla dashboard corretta
  const DashboardRouter = () => {
    if (!isAuthenticated()) {
      return <Navigate to="/login" />;
    }
    
    // Controlla il tipo di utente e reindirizza di conseguenza
    return isProfessional() ? 
      <Navigate to="/dashboard/professionista" replace /> : 
      <Navigate to="/dashboard/paziente" replace />;
  };

  return (
    <Router>
      {/* ToastContainer per mostrare le notifiche in tutta l'app */}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <Routes>
        {/* ... rotte esistenti */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<DashboardRouter />} />
        {/* Rimuovi i reindirizzamenti circolari */}
        <Route path="/dashboard/paziente" element={<PatientDashboard />} />
        <Route path="/dashboard/professionista" element={<ProfessionalDashboard />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;