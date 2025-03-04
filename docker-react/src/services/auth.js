/**
 * Servizio per la gestione dell'autenticazione
 */

// Funzione per il login
export const login = async (email, password, userType) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Credenziali per paziente
      if (email === 'paziente@example.com' && password === 'password123' && userType === 'paziente') {
        const userData = {
          id: '123456',
          name: 'Mario Rossi',
          email,
          userType: 'paziente',
          token: 'fake-jwt-token-paziente-12345'
        };
        localStorage.setItem('authUser', JSON.stringify(userData));
        localStorage.setItem('authToken', userData.token);
        resolve(userData);
      }
      // Credenziali per professionista
      else if (email === 'dottore@example.com' && password === 'password123' && userType === 'professionista') {
        const userData = {
          id: '789012',
          name: 'Dott. Antonio Bianchi',
          email,
          userType: 'professionista',
          specialty: 'Cardiologia',
          token: 'fake-jwt-token-professionista-12345'
        };
        localStorage.setItem('authUser', JSON.stringify(userData));
        localStorage.setItem('authToken', userData.token);
        resolve(userData);
      }
      // Credenziali non valide
      else {
        reject(new Error('Credenziali non valide'));
      }
    }, 800); // Simula ritardo di rete
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
  if (!userString) return { userType: 'guest' };
  try {
    return JSON.parse(userString);
  } catch (e) {
    console.error('Error parsing user data', e);
    return { userType: 'guest' };
  }
};

// Funzione per la registrazione
export const register = async (userData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newUser = {
        id: Math.floor(Math.random() * 1000),
        ...userData,
        userType: userData.isProfessional ? 'professionista' : 'paziente',
        token: `mock-token-${userData.isProfessional ? 'professionista' : 'paziente'}-${Date.now()}`
      };
      
      localStorage.setItem('authToken', newUser.token);
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
  getCurrentUser,
  login,
  register,
  logout
};