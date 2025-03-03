/**
 * Servizio per la gestione dei professionisti
 */

// Funzione per ottenere i professionisti preferiti del paziente
export const getFavoriteProfessionals = async (userId) => {
    // In produzione, qui chiameresti l'API
    // Dati di esempio
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
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockFavoriteProviders);
      }, 500);
    });
  };
  
  // Funzione per cercare professionisti
  export const searchProfessionals = async (searchParams) => {
    // In produzione, qui chiameresti l'API
    const mockProfessionals = [
      {
        id: 1,
        name: 'Dr. Marco Rossi',
        specialty: 'Cardiologo',
        location: 'Milano',
        rating: 4.9,
        reviews: 42
      },
      {
        id: 2,
        name: 'Dr.ssa Giulia Bianchi',
        specialty: 'Psicologa',
        location: 'Roma',
        rating: 4.8,
        reviews: 38
      },
      {
        id: 3,
        name: 'Dr. Paolo Verdi',
        specialty: 'Dermatologo',
        location: 'Napoli',
        rating: 4.7,
        reviews: 31
      }
    ];
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockProfessionals);
      }, 500);
    });
  };
  
  // Funzione per aggiungere un professionista ai preferiti
  export const addToFavorites = async (professionalId, userId) => {
    // In produzione, qui chiameresti l'API
    console.log(`Adding professional ${professionalId} to favorites for user ${userId}`);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Professionista aggiunto ai preferiti'
        });
      }, 500);
    });
  };