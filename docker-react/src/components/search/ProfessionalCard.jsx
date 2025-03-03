import React, { useState } from 'react';
import { Star, Heart, MapPin, Calendar, Clock, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfessionalCard = ({
  id,
  name,
  specialty,
  location,
  rating,
  reviewCount,
  price,
  nextAvailability,
  experience,
  isFavorite = false,
  onToggleFavorite,
  services = []
}) => {
  const [showDetails, setShowDetails] = useState(false);
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="p-5">
        {/* Header con nome e pulsante preferiti */}
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{name}</h3>
            <p className="text-blue-600">{specialty}</p>
          </div>
          <button 
            onClick={() => onToggleFavorite(id)} 
            className="text-gray-400 hover:text-red-500 focus:outline-none"
            aria-label={isFavorite ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
          >
            <Heart size={20} className={isFavorite ? "fill-red-500 text-red-500" : ""} />
          </button>
        </div>
        
        {/* Info principali */}
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <MapPin size={16} className="mr-1" />
          <span>{location}</span>
        </div>
        
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            <Star size={16} className="text-yellow-400 fill-current" />
            <span className="ml-1 text-sm font-medium">{rating}</span>
            <span className="ml-1 text-xs text-gray-500">({reviewCount} recensioni)</span>
          </div>
          <span className="mx-2 text-gray-300">•</span>
          <div className="flex items-center">
            <Award size={16} className="mr-1 text-gray-500" />
            <span className="text-sm">{experience} anni esp.</span>
          </div>
        </div>
        
        {/* Disponibilità e prezzo */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center text-sm">
            <Calendar size={16} className="mr-1 text-green-500" />
            <span className="text-green-600 font-medium">Disponibile {nextAvailability}</span>
          </div>
          <div className="text-right">
            <span className="text-sm text-gray-500">Tariffa</span>
            <p className="font-medium">
              {price.min === price.max 
                ? `€${price.min}` 
                : `€${price.min} - €${price.max}`}
            </p>
          </div>
        </div>
        
        {/* Bottoni azione */}
        <div className="flex space-x-2">
          <Link 
            to={`/professionisti/${id}`}
            className="flex-1 bg-white border border-blue-600 text-blue-600 py-2 rounded-md font-medium text-sm text-center hover:bg-blue-50"
          >
            Visualizza profilo
          </Link>
          <Link 
            to={`/prenota/${id}`}
            className="flex-1 bg-blue-600 text-white py-2 rounded-md font-medium text-sm text-center hover:bg-blue-700"
          >
            Prenota
          </Link>
        </div>
        
        {/* Dettagli aggiuntivi espandibili */}
        {services.length > 0 && (
          <div className="mt-4">
            <button 
              className="flex items-center text-sm text-blue-600"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? 'Meno dettagli' : 'Più dettagli'}
              <ArrowRight size={14} className={`ml-1 transition-transform ${showDetails ? 'rotate-90' : ''}`} />
            </button>
            
            {showDetails && (
              <div className="mt-2 border-t pt-2">
                <h4 className="text-sm font-medium mb-1">Servizi offerti</h4>
                <ul className="text-sm text-gray-600">
                  {services.slice(0, 3).map((service, index) => (
                    <li key={index} className="flex items-center mt-1">
                      <Clock size={14} className="mr-2 text-gray-400" />
                      {service}
                    </li>
                  ))}
                  {services.length > 3 && (
                    <li className="mt-1 text-blue-600">+ altri {services.length - 3}</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalCard;