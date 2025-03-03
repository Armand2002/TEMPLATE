import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Grid, List, Filter, ChevronDown } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import SearchBar from '../../components/search/SearchBar';
import FilterOptions from '../../components/search/FilterOptions';
import ProfessionalCard from '../../components/search/ProfessionalCard';

// Dati simulati di professionisti per test
const mockProfessionals = [
  {
    id: 1,
    name: 'Dr. Mario Rossi',
    specialty: 'Cardiologo',
    location: 'Milano',
    rating: 4.8,
    reviewCount: 124,
    price: { min: 120, max: 150 },
    nextAvailability: 'Oggi',
    experience: 15,
    gender: 'M',
    languages: ['Italiano', 'Inglese'],
    insurances: ['Allianz', 'UniSalute'],
    bio: 'Specializzato in cardiologia interventistica con oltre 15 anni di esperienza.',
    services: ['Visita cardiologica', 'Elettrocardiogramma', 'Ecocardiogramma'],
    education: ['Laurea in Medicina - Università di Milano', 'Specializzazione in Cardiologia - Università di Bologna']
  },
  {
    id: 2,
    name: 'Dr.ssa Anna Bianchi',
    specialty: 'Dermatologa',
    location: 'Roma',
    rating: 4.9,
    reviewCount: 89,
    price: { min: 100, max: 100 },
    nextAvailability: 'Domani',
    experience: 10,
    gender: 'F',
    languages: ['Italiano', 'Francese'],
    insurances: ['Generali', 'Mediolanum'],
    bio: 'Dermatologa con esperienza in dermatologia estetica e patologie della pelle.',
    services: ['Visita dermatologica', 'Mappatura nei', 'Trattamenti estetici'],
    education: ['Laurea in Medicina - Università La Sapienza', 'Specializzazione in Dermatologia - Università di Firenze']
  },
  {
    id: 3,
    name: 'Dr. Giuseppe Verdi',
    specialty: 'Neurologo',
    location: 'Firenze',
    rating: 4.6,
    reviewCount: 56,
    price: { min: 130, max: 180 },
    nextAvailability: 'Questa settimana',
    experience: 20,
    gender: 'M',
    languages: ['Italiano', 'Inglese', 'Tedesco'],
    insurances: ['UniSalute', 'Allianz'],
    bio: 'Neurologo specializzato in disturbi del sonno e cefalee.',
    services: ['Visita neurologica', 'Elettroencefalogramma', 'Consulenza disturbi del sonno'],
    education: ['Laurea in Medicina - Università di Pisa', 'Specializzazione in Neurologia - Università di Milano']
  },
  {
    id: 4,
    name: 'Dr.ssa Laura Neri',
    specialty: 'Ginecologa',
    location: 'Napoli',
    rating: 4.7,
    reviewCount: 112,
    price: { min: 110, max: 140 },
    nextAvailability: 'Prossima settimana',
    experience: 12,
    gender: 'F',
    languages: ['Italiano', 'Spagnolo'],
    insurances: ['Mediolanum', 'Generali'],
    bio: 'Specializzata in ginecologia e ostetricia con particolare attenzione alla salute femminile.',
    services: ['Visita ginecologica', 'Pap test', 'Ecografia'],
    education: ['Laurea in Medicina - Università Federico II', 'Specializzazione in Ginecologia - Università La Sapienza']
  },
  {
    id: 5,
    name: 'Dr. Marco Bruni',
    specialty: 'Ortopedico',
    location: 'Torino',
    rating: 4.5,
    reviewCount: 78,
    price: { min: 140, max: 160 },
    nextAvailability: 'Oggi',
    experience: 18,
    gender: 'M',
    languages: ['Italiano', 'Inglese'],
    insurances: ['Allianz', 'Generali'],
    bio: 'Ortopedico specializzato in traumatologia dello sport e chirurgia del ginocchio.',
    services: ['Visita ortopedica', 'Infiltrazioni', 'Valutazione posturale'],
    education: ['Laurea in Medicina - Università di Torino', 'Specializzazione in Ortopedia - Università di Milano']
  }
];

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Stati per i risultati e filtri
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState('relevance');
  const [favorites, setFavorites] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // 'list' o 'grid'
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Stato per i filtri di ricerca
  const [filters, setFilters] = useState({
    specialty: '',
    location: '',
    availability: 'any',
    date: '',
    insurances: [],
    minRating: 0,
    gender: null,
    minPrice: null,
    maxPrice: null,
    minExperience: 0,
    languages: []
  });
  
  // Conteggio filtri attivi
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.minRating > 0) count++;
    if (filters.gender) count++;
    if (filters.minPrice) count++;
    if (filters.maxPrice) count++;
    if (filters.minExperience > 0) count++;
    if (filters.languages.length > 0) count++;
    return count;
  };
  
  // Carica i preferiti dalla localStorage
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favoriteProfessionals');
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (e) {
        console.error('Error parsing favorites:', e);
      }
    }
  }, []);
  
  // Inizializza i filtri dai parametri URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    // Aggiorna i filtri in base ai parametri URL
    setFilters(prev => ({
      ...prev,
      specialty: params.get('specialty') || '',
      location: params.get('location') || '',
      date: params.get('date') || '',
      availability: params.get('availability') || 'any',
      insurances: params.get('insurances') ? params.get('insurances').split(',') : []
    }));
    
    // Esegui la ricerca
    performSearch();
  }, [location.search]);
  
  // Esegui la ricerca quando cambiano i filtri o l'ordinamento
  useEffect(() => {
    performSearch();
  }, [filters, sortOrder]);
  
  // Funzione di ricerca
  const performSearch = () => {
    setLoading(true);
    
    // Simulazione di chiamata API
    setTimeout(() => {
      // Filtraggio base: specialità, località
      let results = [...mockProfessionals];
      
      if (filters.specialty) {
        results = results.filter(pro => 
          pro.specialty.toLowerCase().includes(filters.specialty.toLowerCase())
        );
      }
      
      if (filters.location) {
        results = results.filter(pro => 
          pro.location.toLowerCase().includes(filters.location.toLowerCase())
        );
      }
      
      // Filtri avanzati
      if (filters.minRating > 0) {
        results = results.filter(pro => pro.rating >= filters.minRating);
      }
      
      if (filters.gender) {
        results = results.filter(pro => pro.gender === filters.gender);
      }
      
      if (filters.minPrice !== null) {
        results = results.filter(pro => pro.price.min >= filters.minPrice);
      }
      
      if (filters.maxPrice !== null) {
        results = results.filter(pro => pro.price.max <= filters.maxPrice);
      }
      
      if (filters.minExperience > 0) {
        results = results.filter(pro => pro.experience >= filters.minExperience);
      }
      
      if (filters.languages.length > 0) {
        results = results.filter(pro => 
          filters.languages.every(lang => pro.languages.includes(lang))
        );
      }
      
      // Ordinamento
      switch (sortOrder) {
        case 'rating':
          results.sort((a, b) => b.rating - a.rating);
          break;
        case 'price_low':
          results.sort((a, b) => a.price.min - b.price.min);
          break;
        case 'price_high':
          results.sort((a, b) => b.price.min - a.price.min);
          break;
        default: // relevance
          // Ordinamento di default già presente nei dati
          break;
      }
      
      setSearchResults(results);
      setLoading(false);
    }, 500);
  };
  
  // Gestisce la ricerca dalla SearchBar
  const handleSearch = (searchFilters) => {
    const params = new URLSearchParams();
    
    // Aggiorna i parametri URL in base ai nuovi filtri
    if (searchFilters.specialty) params.append('specialty', searchFilters.specialty);
    if (searchFilters.location) params.append('location', searchFilters.location);
    if (searchFilters.date) params.append('date', searchFilters.date);
    if (searchFilters.availability !== 'any') params.append('availability', searchFilters.availability);
    if (searchFilters.insurances.length) params.append('insurances', searchFilters.insurances.join(','));
    
    // Naviga con i nuovi parametri
    navigate(`/search?${params.toString()}`);
  };
  
  // Gestisce il cambio di un filtro
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  // Resetta tutti i filtri
  const handleResetFilters = () => {
    setFilters({
      specialty: '',
      location: '',
      availability: 'any',
      date: '',
      insurances: [],
      minRating: 0,
      gender: null,
      minPrice: null,
      maxPrice: null,
      minExperience: 0,
      languages: []
    });
  };
  
  // Gestisce i preferiti
  const handleToggleFavorite = (professionalId) => {
    const newFavorites = favorites.includes(professionalId)
      ? favorites.filter(id => id !== professionalId)
      : [...favorites, professionalId];
    
    setFavorites(newFavorites);
    localStorage.setItem('favoriteProfessionals', JSON.stringify(newFavorites));
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Barra di ricerca */}
          <div className="mb-8">
            <SearchBar onSearch={handleSearch} initialFilters={filters} />
          </div>
          
          {/* Risultati e filtri */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filtri laterali - desktop */}
            <div className="hidden lg:block lg:w-1/4">
              <FilterOptions 
                filters={filters} 
                onFilterChange={handleFilterChange} 
                onResetFilters={handleResetFilters} 
                activeFiltersCount={getActiveFiltersCount()} 
              />
            </div>
            
            {/* Risultati */}
            <div className="flex-1">
              {/* Intestazione risultati */}
              <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div>
                    <h1 className="text-lg font-medium text-gray-900">
                      {loading ? 'Ricerca in corso...' : `${searchResults.length} risultati`}
                    </h1>
                    <p className="text-sm text-gray-600">
                      {filters.specialty && filters.location 
                        ? `${filters.specialty} a ${filters.location}`
                        : filters.specialty 
                          ? filters.specialty
                          : filters.location 
                            ? `Ricerca a ${filters.location}`
                            : 'Tutti i professionisti'
                      }
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {/* Pulsante filtri mobile */}
                    <button
                      onClick={() => setShowMobileFilters(true)}
                      className="lg:hidden flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 bg-white text-sm"
                    >
                      <Filter size={16} className="mr-1" />
                      Filtri
                      {getActiveFiltersCount() > 0 && (
                        <span className="ml-1 w-5 h-5 flex items-center justify-center bg-blue-600 text-white text-xs rounded-full">
                          {getActiveFiltersCount()}
                        </span>
                      )}
                    </button>
                    
                    {/* Selezione ordinamento */}
                    <div className="relative">
                      <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="appearance-none pl-3 pr-8 py-1.5 border border-gray-300 rounded-md text-gray-700 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="relevance">Rilevanza</option>
                        <option value="rating">Valutazione</option>
                        <option value="price_low">Prezzo crescente</option>
                        <option value="price_high">Prezzo decrescente</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    
                    {/* Controlli vista */}
                    <div className="hidden sm:flex border border-gray-300 rounded-md overflow-hidden">
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-500'}`}
                        aria-label="Vista lista"
                      >
                        <List size={20} />
                      </button>
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-500'}`}
                        aria-label="Vista griglia"
                      >
                        <Grid size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Risultati della ricerca */}
              {loading ? (
                <div className="flex justify-center items-center my-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <>
                  {searchResults.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                      <p className="text-lg text-gray-600 mb-2">Nessun professionista trovato</p>
                      <p className="text-gray-500">Prova a modificare i filtri di ricerca</p>
                    </div>
                  ) : (
                    <div className={`
                      ${viewMode === 'grid' 
                        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6' 
                        : 'space-y-6'
                      }
                    `}>
                      {searchResults.map(professional => (
                        <ProfessionalCard
                          key={professional.id}
                          id={professional.id}
                          name={professional.name}
                          specialty={professional.specialty}
                          location={professional.location}
                          rating={professional.rating}
                          reviewCount={professional.reviewCount}
                          price={professional.price}
                          nextAvailability={professional.nextAvailability}
                          experience={professional.experience}
                          gender={professional.gender}
                          languages={professional.languages}
                          insurances={professional.insurances}
                          bio={professional.bio}
                          services={professional.services}
                          education={professional.education}
                          isFavorite={favorites.includes(professional.id)}
                          onToggleFavorite={() => handleToggleFavorite(professional.id)}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      
      {/* Filtri mobile (overlay) */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowMobileFilters(false)}></div>
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="relative w-full max-w-xs bg-white h-full flex flex-col">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="font-medium">Filtri</h2>
                  <button 
                    className="text-gray-400" 
                    onClick={() => setShowMobileFilters(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                <FilterOptions 
                  filters={filters} 
                  onFilterChange={handleFilterChange} 
                  onResetFilters={handleResetFilters} 
                  activeFiltersCount={getActiveFiltersCount()}
                />
              </div>
              
              <div className="p-4 border-t">
                <button
                  className="w-full py-2 bg-blue-600 text-white rounded-md"
                  onClick={() => setShowMobileFilters(false)}
                >
                  Mostra {searchResults.length} risultati
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default SearchPage;