import React from 'react';

const HowItWorksSection = () => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-12 text-center">Come funziona</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-full text-xl font-bold mb-4">
              1
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Cerca</h3>
            <p className="text-gray-600">Trova lo specialista più adatto per la tua esigenza.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-full text-xl font-bold mb-4">
              2
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Prenota</h3>
            <p className="text-gray-600">Scegli data e ora che preferisci e conferma la prenotazione.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-full text-xl font-bold mb-4">
              3
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Visita</h3>
            <p className="text-gray-600">Ricevi assistenza dal professionista che hai scelto.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;