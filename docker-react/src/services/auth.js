/**
 * Servizio per la gestione dell'autenticazione
 */

// Simula una chiamata API di login
export const login = async (email, password, userType) => {
  // Simulazione di chiamata API
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
  
  // Verifica se l'utente è autenticato
  export const isAuthenticated = () => {
    return localStorage.getItem('authToken') !== null;
  };
  

  // Verifica se l'utente è un professionista
  export const isProfessional = () => {
    const user = JSON.parse(localStorage.getItem('authUser') || '{}');
    return user && user.userType === 'professionista';
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
  
  // Registrazione utente
  export const register = async (userData) => {
    try {
      console.log('Registering user:', userData);
    
      // In produzione, questa sarebbe una vera chiamata API
      // Simula una risposta dal server dopo 1 secondo
      await new Promise(resolve => setTimeout(resolve, 1000));
    
      // Simulazione di registrazione avvenuta con successo
      const response = {
        success: true,
        message: "Registrazione completata con successo!",
        user: {
          id: Math.floor(Math.random() * 10000),
          name: `${userData.name} ${userData.surname}`,
          email: userData.email,
          userType: userData.userType
        }
      };
    
    // In un'applicazione reale, qui connetteresti con il backend
    // e invieresti i dati, incluso il file del certificato se presente
    
    return response;
  } catch (error) {
    console.error('Registration error:', error);
    throw new Error('Si è verificato un errore durante la registrazione. Riprova.');
  }
};

  // Logout
  export const logout = () => {
    localStorage.removeItem('authUser');
    localStorage.removeItem('authToken');
    // In produzione, si potrebbe anche invalidare il token sul server
  };