import api from './api';

// Funzione per ottenere i documenti sanitari
export const getHealthRecords = async (userId) => {
  // In produzione, qui chiameresti l'API
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

export const downloadHealthRecord = async (recordId) => {
  console.log('Downloading record:', recordId);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 500);
  });
};

export default {
  getHealthRecords,
  downloadHealthRecord
};