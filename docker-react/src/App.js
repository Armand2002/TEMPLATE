import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/Home';
import Login from './pages/Login';
import { isAuthenticated } from './services/auth';
import './index.css';

// Componente per rotte protette
const ProtectedRoute = ({ element, allowedUserType }) => {
  const user = JSON.parse(localStorage.getItem('authUser') || '{}');
  const authenticated = isAuthenticated();
  const hasCorrectRole = !allowedUserType || user.userType === allowedUserType;
  
  return authenticated && hasCorrectRole ? element : <Navigate to="/login" />;
};

// Pagine placeholder per demo
const PatientDashboard = () => <div className="p-8">Dashboard Paziente</div>;
const DoctorDashboard = () => <div className="p-8">Dashboard Professionista</div>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/dashboard/paziente" 
          element={<ProtectedRoute element={<PatientDashboard />} allowedUserType="paziente" />} 
        />
        <Route 
          path="/dashboard/professionista" 
          element={<ProtectedRoute element={<DoctorDashboard />} allowedUserType="professionista" />} 
        />
        <Route path="*" element={<div className="p-8">Pagina non trovata</div>} />
      </Routes>
    </Router>
  );
}

export default App;