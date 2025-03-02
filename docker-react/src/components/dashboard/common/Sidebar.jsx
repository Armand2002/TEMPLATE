import React from 'react';
import { Clipboard, Calendar, Users, Settings } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'overview', name: 'Panoramica', icon: <Clipboard size={18} /> },
    { id: 'appointments', name: 'Appuntamenti', icon: <Calendar size={18} /> },
    { id: 'patients', name: 'Pazienti', icon: <Users size={18} /> },
    { id: 'settings', name: 'Impostazioni', icon: <Settings size={18} /> },
  ];
  
  return (
    <div className="bg-white shadow-sm rounded-lg">
      <ul className="py-2">
        {tabs.map((tab) => (
          <li key={tab.id}>
            <button
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center px-4 py-3 text-left ${
                activeTab === tab.id 
                ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' 
                : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="mr-3">{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;