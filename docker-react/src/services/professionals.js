// Sostituire i dati mockati con API reali
// filepath: /c:/Users/arman/Desktop/Struttura/docker-react/src/services/professionals.js
export const searchProfessionals = async (filters) => {
  try {
    const response = await fetch('/api/professionals/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filters)
    });
    
    if (!response.ok) {
      throw new Error('Errore nella ricerca dei professionisti');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error searching professionals:', error);
    throw error;
  }
};