import React from 'react';

const Header = () => {
  const navigateTo = (path) => {
    console.log(`Navigazione verso: ${path}`);
    alert(`Navigazione verso: ${path}`);
  };

  return (
    
      
        
          
            HealthMatch
          
          
            Come funziona
            Per i professionisti
            Assistenza
          
          
            <button onClick={() => navigateTo('/login')} className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              Accedi
            
            <button onClick={() => navigateTo('/register')} className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
              Registrati
            
          
        
      
    
  );
};

export default Header;