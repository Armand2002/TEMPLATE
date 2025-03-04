// In App.js, assicurati che le rotte siano configurate correttamente
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/Home';  // Cambia da './pages/Home/HomePage'
import Login from './pages/Login';    // Cambia da './pages/Auth/Login'
import Register from './pages/Register';  // Cambia da './pages/Auth/Register'
import PatientDashboard from './pages/Dashboard/PatientDashboard'; // Corretto da PatientDashboard.jsx a PatientDashBoard.jsx
import ProfessionalDashboard from './pages/Dashboard/ProfessionalDashboard';
import { isAuthenticated, isProfessional } from './services/auth';
import SearchPage from './pages/Search/index'; // Se usi index.jsx nella cartella
import './index.css';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51your_publishable_key');

// Componente per rotte protette
const ProtectedRoute = ({ element, allowedUserType }) => {
  const user = JSON.parse(localStorage.getItem('authUser') || '{}');
  const authenticated = isAuthenticated();
  const hasCorrectRole = !allowedUserType || user.userType === allowedUserType;
  
  return authenticated && hasCorrectRole ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Elements stripe={stripePromise}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<SearchPage />} />
          <Route 
            path="/Dashboard/paziente" 
            element={<ProtectedRoute element={<PatientDashboard />} allowedUserType="paziente" />} 
          />
          <Route 
            path="/Dashboard/professionista" 
            element={<ProtectedRoute element={<ProfessionalDashboard />} allowedUserType="professionista" />} 
          />
          <Route path="*" element={<div className="p-8">Pagina non trovata</div>} />
        </Routes>
      </Elements>
    </Router>
  );
}

export default App;