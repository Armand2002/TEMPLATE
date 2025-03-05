// src/services/authService.js
import api from './api';
import { toast } from 'react-toastify';

// Costanti
const AUTH_TOKEN_KEY = 'authToken';
const AUTH_USER_KEY = 'authUser';
const VERIFICATION_TIMEOUT = 10 * 60 * 1000; // 10 minuti

/**
 * Servizio per la gestione dell'autenticazione con verifica email
 * e meccanismi di sicurezza avanzati
 */

// Funzione per il login
export const login = async (email, password, userType) => {
  try {
    // In produzione, sostituire con una vera chiamata API
    const response = await api.post('/auth/login', {
      email,
      password,
      userType
    });
    
    if (response.data && response.data.token) {
      const userData = {
        id: response.data.user.id,
        name: response.data.user.name,
        email: response.data.user.email,
        userType: response.data.user.userType,
        token: response.data.token,
        isVerified: response.data.user.isVerified
      };
      
      // Verifica se l'utente ha confermato l'email
      if (!userData.isVerified) {
        return {
          needsVerification: true,
          email: userData.email
        };
      }
      
      // Salva i dati dell'utente e il token
      localStorage.setItem(AUTH_TOKEN_KEY, userData.token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));
      
      // Imposta un timeout per la sessione (opzionale)
      setupSessionTimeout();
      
      return userData;
    } else {
      throw new Error('Token non trovato nella risposta');
    }
  } catch (error) {
    handleAuthError(error);
    throw error;
  }
};

// Funzione per la registrazione
export const register = async (userData) => {
  try {
    // In produzione, sostituire con una vera chiamata API
    const response = await api.post('/auth/register', userData);
    
    if (response.data && response.data.success) {
      toast.success("Registrazione completata! Controlla la tua email per verificare l'account."); // Corretta la stringa
      return {
        success: true,
        email: userData.email,
        needsVerification: true
      };
    } else {
      throw new Error('Errore durante la registrazione');
    }
  } catch (error) {
    handleAuthError(error);
    throw error;
  }
};

// Funzione per verificare l'email
export const verifyEmail = async (token) => {
  try {
    const response = await api.post('/auth/verify-email', { token });
    
    if (response.data && response.data.success) {
      toast.success('Email verificata con successo! Ora puoi accedere.');
      return { success: true };
    } else {
      throw new Error('Errore durante la verifica dell\'email');
    }
  } catch (error) {
    handleAuthError(error);
    throw error;
  }
};

// Funzione per richiedere il reset della password
export const requestPasswordReset = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    
    if (response.data && response.data.success) {
      toast.success('Email per il reset della password inviata! Controlla la tua casella di posta.');
      return { success: true };
    } else {
      throw new Error('Errore durante la richiesta di reset della password');
    }
  } catch (error) {
    handleAuthError(error);
    throw error;
  }
};

// Funzione per completare il reset della password
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await api.post('/auth/reset-password', {
      token,
      newPassword
    });
    
    if (response.data && response.data.success) {
      toast.success('Password reimpostata con successo! Ora puoi accedere con la nuova password.');
      return { success: true };
    } else {
      throw new Error('Errore durante il reset della password');
    }
  } catch (error) {
    handleAuthError(error);
    throw error;
  }
};

// Funzione per il logout
export const logout = () => {
  // Rimuovi dati di autenticazione
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  
  // Cancella eventuali timer di sessione
  clearSessionTimeout();
  
  // In un'app reale, potrebbe essere necessario invalidare il token sul server
  try {
    api.post('/auth/logout');
  } catch (error) {
    console.error('Errore durante il logout sul server:', error);
  }
};

// Funzione per verificare l'autenticazione
export const isAuthenticated = () => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const user = JSON.parse(localStorage.getItem(AUTH_USER_KEY) || '{}');
  
  // Verifica la presenza del token e che l'utente sia verificato
  return !!token && user.isVerified !== false;
};

// Funzione per verificare se l'utente è un professionista
export const isProfessional = () => {
  const user = JSON.parse(localStorage.getItem(AUTH_USER_KEY) || '{}');
  return user.userType === 'professionista';
};

// Ottieni dati dell'utente corrente
export const getCurrentUser = () => {
  const userString = localStorage.getItem(AUTH_USER_KEY);
  if (!userString) return null;
  try {
    return JSON.parse(userString);
  } catch (e) {
    console.error('Errore parsing dati utente', e);
    return null;
  }
};

// Funzione per aggiornare il profilo utente
export const updateUserProfile = async (userData) => {
  try {
    const response = await api.put('/users/me', userData);
    
    if (response.data) {
      // Aggiorna i dati utente nel localStorage
      const currentUser = getCurrentUser();
      const updatedUser = { ...currentUser, ...response.data };
      
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updatedUser));
      
      toast.success('Profilo aggiornato con successo!');
      return updatedUser;
    } else {
      throw new Error('Errore durante l\'aggiornamento del profilo');
    }
  } catch (error) {
    handleAuthError(error);
    throw error;
  }
};

// Funzione per cambiare la password
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.post('/auth/change-password', {
      currentPassword,
      newPassword
    });
    
    if (response.data && response.data.success) {
      toast.success('Password cambiata con successo!');
      return { success: true };
    } else {
      throw new Error('Errore durante il cambio della password');
    }
  } catch (error) {
    handleAuthError(error);
    throw error;
  }
};

// Funzioni di utilità

// Gestisce in modo centralizzato gli errori di autenticazione
function handleAuthError(error) {
  const message = error.response?.data?.message || error.message || 'Errore di autenticazione';
  
  // Log dell'errore (in produzione potrebbe essere inviato a un servizio di monitoraggio)
  console.error('Auth error:', message);
  
  // Mostra toast con errore
  toast.error(message);
  
  // Gestione degli errori specifici
  if (error.response?.status === 401) {
    // Token scaduto o non valido, logout automatico
    logout();
    toast.error('Sessione scaduta. Effettua nuovamente l\'accesso.');
  }
}

// Imposta un timeout per la sessione (utile per sicurezza)
let sessionTimer;
function setupSessionTimeout() {
  // Pulisce qualsiasi timer esistente
  clearSessionTimeout();
  
  // Imposta un nuovo timer (es. 1 ora)
  sessionTimer = setTimeout(() => {
    toast.warn('La tua sessione sta per scadere. Vuoi rimanere connesso?', {
      autoClose: 10000,
      closeButton: true,
      closeOnClick: false,
      draggable: false,
      onClick: () => {
        // Refresha il token in background
        refreshToken();
      }
    });
    
    // Se l'utente non risponde entro 10 secondi, logout
    setTimeout(() => {
      if (isAuthenticated()) {
        logout();
        toast.error('Sessione scaduta per inattività.');
      }
    }, 10000);
  }, 60 * 60 * 1000); // 1 ora
}

// Pulisce il timer di sessione
function clearSessionTimeout() {
  if (sessionTimer) {
    clearTimeout(sessionTimer);
  }
}

// Refresha il token JWT
async function refreshToken() {
  try {
    const response = await api.post('/auth/refresh-token');
    
    if (response.data && response.data.token) {
      // Aggiorna il token
      localStorage.setItem(AUTH_TOKEN_KEY, response.data.token);
      
      // Aggiorna il timeout della sessione
      setupSessionTimeout();
      
      toast.success('Sessione estesa con successo!');
    } else {
      throw new Error('Errore durante il refresh del token');
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
    logout();
    toast.error('Errore durante l\'estensione della sessione. Effettua nuovamente l\'accesso.');
  }
}

// Funzione per ritrasmettere la verifica email
export const resendVerificationEmail = async (email) => {
  try {
    const response = await api.post('/auth/resend-verification', { email });
    
    if (response.data && response.data.success) {
      toast.success('Email di verifica inviata nuovamente! Controlla la tua casella di posta.');
      return { success: true };
    } else {
      throw new Error('Errore durante l\'invio dell\'email di verifica');
    }
  } catch (error) {
    handleAuthError(error);
    throw error;
  }
};

export default {
  login,
  register,
  logout,
  isAuthenticated,
  isProfessional,
  getCurrentUser,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
  updateUserProfile,
  changePassword,
  resendVerificationEmail
};