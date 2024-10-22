import React, { useState, useEffect, useRef } from 'react';
import { Template } from '../types';
import TemplatePreview from './TemplatePreview';
import FullscreenDisplay from './FullscreenDisplay';
import { ChevronLeft, ChevronRight, Maximize2, Trash2 } from 'lucide-react';

interface AdvertisingDisplayProps {
  templates: Template[];
  articles: { id: number; name: string; price: number }[];
}

const AdvertisingDisplay: React.FC<AdvertisingDisplayProps> = ({ templates, articles }) => {
  const [selectedTemplates, setSelectedTemplates] = useState<Template[]>([]);
  const [currentTemplateIndex, setCurrentTemplateIndex] = useState(0);
  const [displayInterval, setDisplayInterval] = useState(5);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedTemplates.length > 0) {
        setCurrentTemplateIndex((prevIndex) => (prevIndex + 1) % selectedTemplates.length);
      }
    }, displayInterval * 1000);

    return () => clearInterval(interval);
  }, [selectedTemplates, displayInterval]);

  const toggleTemplateSelection = (template: Template) => {
    setSelectedTemplates((prevSelected) => {
      if (prevSelected.some((t) => t.id === template.id)) {
        return prevSelected.filter((t) => t.id !== template.id);
      } else {
        return [...prevSelected, template];
      }
    });
  };

  const scrollTemplates = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setDisplayInterval(value);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const clearArticles = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/articles', {
        method: 'DELETE',
      });
      if (response.ok) {
        console.log('All articles have been cleared');
        // The socket will handle updating the articles state
      } else {
        console.error('Failed to clear articles:', await response.text());
      }
    } catch (error) {
      console.error('Error clearing articles:', error);
    }
  };

  if (isFullscreen) {
    return (
      <FullscreenDisplay
        selectedTemplates={selectedTemplates}
        displayInterval={displayInterval}
        onClose={() => setIsFullscreen(false)}
        articles={articles}
      />
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="h-2/3 flex overflow-hidden">
        <div className="w-1/2 p-4 bg-gray-100 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold">Vista previa de publicidad</h2>
            <button
              className="btn btn-primary flex items-center"
              onClick={toggleFullscreen}
              disabled={selectedTemplates.length === 0}
            >
              <Maximize2 size={16} className="mr-1" /> Pantalla completa
            </button>
          </div>
          <div className="flex-1 relative">
            {selectedTemplates.length > 0 ? (
              <TemplatePreview template={selectedTemplates[currentTemplateIndex]} articles={articles} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Selecciona plantillas para mostrar
              </div>
            )}
          </div>
        </div>
        <div className="w-1/2 p-4 flex flex-col overflow-hidden">
          <h2 className="text-xl font-bold mb-2">Información de la publicidad</h2>
          <p className="mb-2 text-sm">
            Las plantillas seleccionadas se mostrarán en la vista previa, cambiando cada {displayInterval} segundos.
          </p>
          <div className="mb-4">
            <label htmlFor="intervalInput" className="block text-sm font-medium text-gray-700 mb-1">
              Intervalo de visualización (segundos):
            </label>
            <input
              id="intervalInput"
              type="number"
              min="1"
              value={displayInterval}
              onChange={handleIntervalChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div className="bg-white p-2 rounded-lg shadow flex-1 overflow-y-auto">
            <h3 className="font-bold mb-1 text-sm">Plantillas seleccionadas:</h3>
            {selectedTemplates.length > 0 ? (
              <ul className="list-disc pl-5 text-sm">
                {selectedTemplates.map((template) => (
                  <li key={template.id}>{template.name}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No hay plantillas seleccionadas</p>
            )}
          </div>
          {articles.length > 0 && (
            <div className="mt-4 bg-yellow-100 p-4 rounded-lg max-h-40 overflow-y-auto">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-sm">Artículos recibidos:</h3>
                <button
                  onClick={clearArticles}
                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md flex items-center text-sm"
                >
                  <Trash2 size={16} className="mr-1" /> Limpiar
                </button>
              </div>
              <ul className="list-none p-0 m-0">
                {articles.map((article) => (
                  <li key={article.id} className="text-sm mb-1">
                    {article.name} - ${article.price.toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="h-1/3 bg-gray-200 p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-2">Plantillas guardadas</h2>
        {templates.length > 0 ? (
          <div className="relative flex-1">
            <button
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10"
              onClick={() => scrollTemplates('left')}
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10"
              onClick={() => scrollTemplates('right')}
            >
              <ChevronRight size={24} />
            </button>
            <div
              ref={scrollContainerRef}
              className="grid grid-flow-col auto-cols-[14%] gap-3 overflow-x-auto scrollbar-hide h-full"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`border rounded-lg p-2 cursor-pointer transition-colors duration-200 flex flex-col scroll-snap-align-start ${
                    selectedTemplates.some((t) => t.id === template.id)
                      ? 'bg-green-100 border-green-500'
                      : 'bg-white hover:bg-gray-100'
                  }`}
                  onClick={() => toggleTemplateSelection(template)}
                >
                  <h3 className="font-bold mb-1 text-xs truncate">{template.name}</h3>
                  <div className="flex-grow relative">
                    <TemplatePreview template={template} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            No hay plantillas guardadas
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvertisingDisplay;