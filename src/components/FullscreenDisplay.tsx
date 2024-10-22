import React, { useState, useEffect } from 'react';
import { Template } from '../types';
import TemplatePreview from './TemplatePreview';
import { X, Minimize2, Maximize2, Monitor } from 'lucide-react';

interface FullscreenDisplayProps {
  selectedTemplates: Template[];
  displayInterval: number;
  onClose: () => void;
  articles: { id: number; name: string; price: number }[];
}

const FullscreenDisplay: React.FC<FullscreenDisplayProps> = ({ selectedTemplates, displayInterval, onClose, articles }) => {
  const [currentTemplateIndex, setCurrentTemplateIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [presentationConnection, setPresentationConnection] = useState<PresentationConnection | null>(null);
  const [presentationError, setPresentationError] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedTemplates.length > 0) {
        setCurrentTemplateIndex((prevIndex) => (prevIndex + 1) % selectedTemplates.length);
      }
    }, displayInterval * 1000);

    return () => clearInterval(interval);
  }, [selectedTemplates, displayInterval]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const startPresentation = async () => {
    if ('PresentationRequest' in window) {
      try {
        const presentationRequest = new PresentationRequest(['presentation.html']);
        const connection = await presentationRequest.start();
        setPresentationConnection(connection);
        setPresentationError(null);

        connection.onclose = () => setPresentationConnection(null);
        connection.onterminate = () => setPresentationConnection(null);

        sendDataToPresentation(connection);
      } catch (error) {
        console.error('Error al iniciar la presentación:', error);
        if (error instanceof Error && error.name === 'NotFoundError') {
          setPresentationError('No se encontraron pantallas secundarias. La presentación se mostrará en esta ventana.');
        } else {
          setPresentationError('Ocurrió un error al iniciar la presentación. Por favor, inténtalo de nuevo.');
        }
      }
    } else {
      setPresentationError('Tu navegador no soporta la API de Presentación. La presentación se mostrará en esta ventana.');
    }
  };

  const sendDataToPresentation = (connection: PresentationConnection) => {
    const currentTemplate = selectedTemplates[currentTemplateIndex];
    connection.send(JSON.stringify({
      type: 'update',
      template: currentTemplate,
      articles,
    }));
  };

  useEffect(() => {
    if (presentationConnection) {
      sendDataToPresentation(presentationConnection);
    }
  }, [currentTemplateIndex, selectedTemplates, presentationConnection, articles]);

  if (selectedTemplates.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white text-2xl">
        No hay plantillas seleccionadas para mostrar
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-gray-800 flex items-center justify-center p-4">
      <div className="w-full h-full max-w-6xl bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
        <div className="bg-gray-200 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="flex-1 text-center">
            <span className="text-sm font-medium text-gray-600">Vista previa de plantilla</span>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={startPresentation} 
              className="text-gray-600 hover:text-gray-800" 
              title="Mostrar en pantalla secundaria"
              disabled={!!presentationConnection}
            >
              <Monitor size={18} />
            </button>
            <button onClick={toggleFullscreen} className="text-gray-600 hover:text-gray-800">
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
            <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
              <X size={18} />
            </button>
          </div>
        </div>
        {presentationError && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
            <p>{presentationError}</p>
          </div>
        )}
        <div className="flex-1 overflow-hidden">
          <TemplatePreview template={selectedTemplates[currentTemplateIndex]} articles={articles} />
        </div>
        {articles.length > 0 && (
          <div className="bg-yellow-100 p-4 text-center max-h-40 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-2">Artículos Recibidos</h2>
            <ul className="list-none p-0 m-0">
              {articles.map((article) => (
                <li key={article.id} className="text-xl mb-1">
                  {article.name} - ${article.price.toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default FullscreenDisplay;