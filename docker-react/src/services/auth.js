/**
 * Servizio per la gestione dell'autenticazione
 */

// Funzione per il login
export const login = async (email, password) => {
  // Per ora è una simulazione
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Mock user data
      if (email === 'paziente@example.com' && password === 'password') {
        const userData = {
          id: 1,
          name: 'Mario Rossi',
          email: 'paziente@example.com',
          userType: 'paziente'
        };
        
        localStorage.setItem('authToken', 'mock-token-patient');
        localStorage.setItem('authUser', JSON.stringify(userData));
        
        resolve(userData);
      } 
      else if (email === 'dottore@example.com' && password === 'password') {
        const userData = {
          id: 2,
          name: 'Dr. Marco Bianchi',
          email: 'dottore@example.com',
          userType: 'professionista',
          specialty: 'Cardiologia'
        };
        
        localStorage.setItem('authToken', 'mock-token-professional');
        localStorage.setItem('authUser', JSON.stringify(userData));
        
        resolve(userData);
      } 
      else {
        reject(new Error('Credenziali non valide'));
      }
    }, 800);
  });
};

// Funzione per verificare l'autenticazione
export const isAuthenticated = () => {
  const token = localStorage.getItem('authToken');
  return !!token;
};

// Funzione per verificare se l'utente è un professionista
export const isProfessional = () => {
  const user = JSON.parse(localStorage.getItem('authUser') || '{}');
  return user.userType === 'professionista';
};

// Ottieni dati dell'utente corrente
export const getCurrentUser = () => {
  const userString = localStorage.getItem('authUser');
  if (!userString) return { userType: 'guest' }; // valore predefinito
  try {
    return JSON.parse(userString);
  } catch (e) {
    console.error('Error parsing user data', e);
    return { userType: 'guest' }; // valore predefinito in caso di errore
  }
};

// Funzione per la registrazione
export const register = async (userData) => {
  // Per ora è una simulazione
  return new Promise((resolve) => {
    setTimeout(() => {
      const newUser = {
        id: Math.floor(Math.random() * 1000),
        ...userData,
        userType: userData.isProfessional ? 'professionista' : 'paziente'
      };
      
      localStorage.setItem('authToken', 'mock-token-' + newUser.userType);
      localStorage.setItem('authUser', JSON.stringify(newUser));
      
      resolve(newUser);
    }, 800);
  });
};

// Funzione per il logout
export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('authUser');
};

export default {
  isAuthenticated,
  isProfessional,
  login,
  register,
  logout
};