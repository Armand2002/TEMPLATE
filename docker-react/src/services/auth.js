/**
 * Servizio per la gestione dell'autenticazione
 */

// Simula una chiamata API di login
export const login = async (email, password, userType) => {
    try {
      // In produzione, questa sarebbe una vera chiamata API
      console.log(`Login attempt: ${email}, ${userType}`);
      
      // Simula una risposta dal server dopo 1 secondo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulazione credenziali per testing
      if (email === 'test@example.com' && password === 'password123') {
        const userData = {
          id: '123456',
          name: userType === 'paziente' ? 'Mario Rossi' : 'Dott. Mario Rossi',
          email,
          userType,
          token: 'fake-jwt-token-12345'
        };
        
        // Salva le informazioni di autenticazione
        localStorage.setItem('authUser', JSON.stringify(userData));
        localStorage.setItem('authToken', userData.token);
        
        return userData;
      } else {
        throw new Error('Credenziali non valide');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };
  
  // Verifica se l'utente è autenticato
  export const isAuthenticated = () => {
    return localStorage.getItem('authToken') !== null;
  };
  
  // Ottieni dati dell'utente corrente
  export const getCurrentUser = () => {
    const userString = localStorage.getItem('authUser');
    if (!userString) return null;
    try {
      return JSON.parse(userString);
    } catch (e) {
      console.error('Error parsing user data', e);
      return null;
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