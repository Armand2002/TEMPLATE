import React from 'react';
import { Clipboard, Calendar, FileText, Users, Settings, Layout } from 'lucide-react';

// Modifica la firma per accettare links e onLinkClick invece di tabs e setActiveTab
const Sidebar = ({ activeLink, onLinkClick, links }) => {
  // Mapping delle icone per i diversi tipi di tab
  const iconMapping = {
    'overview': <Layout size={18} />,
    'appointments': <Calendar size={18} />,
    'health-records': <FileText size={18} />,
    'patients': <Users size={18} />,
    'professionals': <Users size={18} />,
    'settings': <Settings size={18} />,
  };
  
  return (
    <div className="bg-white shadow-sm rounded-lg">
      <ul className="py-2">
        {/* Usa i links passati come prop invece di tabsToRender */}
        {links && links.map((link) => (
          <li key={link.id}>
            <button
              onClick={() => onLinkClick(link.id)}
              className={`w-full flex items-center px-4 py-3 text-left ${
                activeLink === link.id 
                ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' 
                : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="mr-3">{iconMapping[link.id] || <Clipboard size={18} />}</span>
              <span>{link.label}</span> {/* Cambiato da link.name a link.label */}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;