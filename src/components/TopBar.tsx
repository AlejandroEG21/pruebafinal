import React from 'react';

interface TopBarProps {
  setCurrentView: (view: 'editor' | 'advertising') => void;
}

const TopBar: React.FC<TopBarProps> = ({ setCurrentView }) => {
  return (
    <div className="bg-teal-600 text-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Editor de Componentes Profesional</h1>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <button
              onClick={() => setCurrentView('editor')}
              className="hover:text-teal-200 transition-colors duration-200"
            >
              Editor
            </button>
          </li>
          <li>
            <button
              onClick={() => setCurrentView('advertising')}
              className="hover:text-teal-200 transition-colors duration-200"
            >
              Publicidad Mostrador
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default TopBar;