/**
 * Servizio per la gestione dei documenti sanitari
 */

// Funzione per ottenere i documenti sanitari di un paziente
export const getHealthRecords = async (userId) => {
    // In produzione, qui chiameresti l'API
    // Dati di esempio
    const mockHealthRecords = [
      {
        id: 1,
        title: 'Analisi del sangue',
        date: '10/02/2025',
        doctor: 'Dr. Paolo Verdi',
        type: 'Laboratorio',
        status: 'Completato'
      },
      {
        id: 2,
        title: 'Radiografia torace',
        date: '20/01/2025',
        doctor: 'Dr.ssa Sara Neri',
        type: 'Diagnostica',
        status: 'Completato'
      },
      {
        id: 3,
        title: 'Visita cardiologica',
        date: '05/12/2024',
        doctor: 'Dr. Marco Rossi',
        type: 'Visita',
        status: 'Completato'
      }
    ];
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockHealthRecords);
      }, 500);
    });
  };
  
  // Funzione per caricare un nuovo documento sanitario
  export const uploadHealthRecord = async (recordData) => {
    // In produzione, qui chiameresti l'API
    console.log('Uploading health record:', recordData);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: Math.floor(Math.random() * 1000),
          ...recordData,
          status: 'Completato',
          date: new Date().toLocaleDateString('it-IT')
        });
      }, 500);
    });
  };
  
  // Funzione per scaricare un documento sanitario
  export const downloadHealthRecord = async (recordId) => {
    console.log('Downloading health record:', recordId);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Documento pronto per il download'
        });
      }, 500);
    });
  };