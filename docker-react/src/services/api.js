const apiClient = axios.create({
    baseURL: 'http://localhost:8000', // Modifica questo URL se necessario
    headers: {
      'Content-Type': 'application/json',
    },
  });