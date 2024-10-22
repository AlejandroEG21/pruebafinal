import React, { useState } from 'react';
import { Component, WebProperties, BackgroundShape, Template } from '../types';
import { Plus, Trash2, Type, Image, Hash, Layout, Settings, FileText, Save } from 'lucide-react';
import TemplatePreview from './TemplatePreview';

interface EditorProps {
  selectedComponent: Component | null;
  updateComponent: (component: Component) => void;
  webProperties: WebProperties;
  updateWebProperties: (newProperties: Partial<WebProperties>) => void;
  selectedShape: BackgroundShape | null;
  setSelectedShape: (shape: BackgroundShape | null) => void;
  activeTab: 'component' | 'general' | 'templates';
  setActiveTab: (tab: 'component' | 'general' | 'templates') => void;
  addComponent: (type: string) => void;
  applyTemplate: (template: Template) => void;
  saveAsTemplate: (name: string) => void;
  templates: Template[];
  deleteTemplate: (id: string) => void;
}

const Editor: React.FC<EditorProps> = ({
  selectedComponent,
  updateComponent,
  webProperties,
  updateWebProperties,
  selectedShape,
  setSelectedShape,
  activeTab,
  setActiveTab,
  addComponent,
  applyTemplate,
  saveAsTemplate,
  templates,
  deleteTemplate,
}) => {
  const [templateName, setTemplateName] = useState('');

  const handleSaveTemplate = () => {
    if (templateName.trim()) {
      saveAsTemplate(templateName);
      setTemplateName('');
    }
  };

  const renderComponentEditor = () => {
    return (
      <div className="space-y-4">
        <div className="flex space-x-2">
          <button className="btn btn-primary flex items-center" onClick={() => addComponent('text')}>
            <Type size={16} className="mr-1" /> Texto
          </button>
          <button className="btn btn-primary flex items-center" onClick={() => addComponent('image')}>
            <Image size={16} className="mr-1" /> Imagen
          </button>
          <button className="btn btn-primary flex items-center" onClick={() => addComponent('number')}>
            <Hash size={16} className="mr-1" /> Número
          </button>
        </div>
        {selectedComponent && (
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Tipo:</label>
              <input
                type="text"
                value={selectedComponent.type}
                readOnly
                className="input bg-gray-100"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Contenido:</label>
              {selectedComponent.type === 'text' ? (
                <textarea
                  value={selectedComponent.content}
                  onChange={(e) => updateComponent({ ...selectedComponent, content: e.target.value })}
                  className="input"
                  rows={3}
                />
              ) : (
                <input
                  type={selectedComponent.type === 'number' ? 'number' : 'text'}
                  value={selectedComponent.content}
                  onChange={(e) => updateComponent({ ...selectedComponent, content: e.target.value })}
                  className="input"
                />
              )}
            </div>
            <div>
              <label className="block mb-1 font-medium">Ancho (%):</label>
              <input
                type="number"
                value={selectedComponent.size.width}
                onChange={(e) => updateComponent({ ...selectedComponent, size: { ...selectedComponent.size, width: Number(e.target.value) } })}
                className="input"
                min="1"
                max="100"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Alto (%):</label>
              <input
                type="number"
                value={selectedComponent.size.height}
                onChange={(e) => updateComponent({ ...selectedComponent, size: { ...selectedComponent.size, height: Number(e.target.value) } })}
                className="input"
                min="1"
                max="100"
              />
            </div>
            {selectedComponent.type === 'text' && (
              <>
                <div>
                  <label className="block mb-1 font-medium">Tamaño de fuente:</label>
                  <input
                    type="number"
                    value={selectedComponent.fontSize || 16}
                    onChange={(e) => updateComponent({ ...selectedComponent, fontSize: Number(e.target.value) })}
                    className="input"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Tipo de fuente:</label>
                  <select
                    value={selectedComponent.fontFamily || 'Arial, sans-serif'}
                    onChange={(e) => updateComponent({ ...selectedComponent, fontFamily: e.target.value })}
                    className="input"
                  >
                    <option value="Arial, sans-serif">Arial</option>
                    <option value="Helvetica, sans-serif">Helvetica</option>
                    <option value="Times New Roman, serif">Times New Roman</option>
                    <option value="Courier New, monospace">Courier New</option>
                    <option value="Georgia, serif">Georgia</option>
                  </select>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderGeneralEditor = () => {
    return (
      <div className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Color de fondo:</label>
          <input
            type="color"
            value={webProperties.backgroundColor}
            onChange={(e) => updateWebProperties({ backgroundColor: e.target.value })}
            className="w-full h-10 rounded-md"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Color de texto:</label>
          <input
            type="color"
            value={webProperties.textColor}
            onChange={(e) => updateWebProperties({ textColor: e.target.value })}
            className="w-full h-10 rounded-md"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Figuras de fondo:</label>
          <div className="flex space-x-2 mb-2">
            <button
              className="btn btn-secondary flex items-center"
              onClick={() => {
                const newShape: BackgroundShape = {
                  id: Date.now(),
                  type: 'circle',
                  color: '#000000',
                  position: { x: 50, y: 50 },
                  size: 10,
                  opacity: 0.5,
                };
                updateWebProperties({
                  backgroundShapes: [...webProperties.backgroundShapes, newShape],
                });
              }}
            >
              <Plus size={16} className="mr-1" /> Círculo
            </button>
            <button
              className="btn btn-secondary flex items-center"
              onClick={() => {
                const newShape: BackgroundShape = {
                  id: Date.now(),
                  type: 'square',
                  color: '#000000',
                  position: { x: 50, y: 50 },
                  size: 10,
                  opacity: 0.5,
                };
                updateWebProperties({
                  backgroundShapes: [...webProperties.backgroundShapes, newShape],
                });
              }}
            >
              <Plus size={16} className="mr-1" /> Cuadrado
            </button>
            <button
              className="btn btn-secondary flex items-center"
              onClick={() => {
                const newShape: BackgroundShape = {
                  id: Date.now(),
                  type: 'triangle',
                  color: '#000000',
                  position: { x: 50, y: 50 },
                  size: 10,
                  opacity: 0.5,
                };
                updateWebProperties({
                  backgroundShapes: [...webProperties.backgroundShapes, newShape],
                });
              }}
            >
              <Plus size={16} className="mr-1" /> Triángulo
            </button>
          </div>
        </div>
        {selectedShape && (
          <div className="space-y-2">
            <div>
              <label className="block mb-1 font-medium">Color de la figura:</label>
              <input
                type="color"
                value={selectedShape.color}
                onChange={(e) => {
                  const updatedShapes = webProperties.backgroundShapes.map(shape =>
                    shape.id === selectedShape.id ? { ...shape, color: e.target.value } : shape
                  );
                  updateWebProperties({ backgroundShapes: updatedShapes });
                  setSelectedShape({ ...selectedShape, color: e.target.value });
                }}
                className="w-full h-10 rounded-md"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Tamaño (%):</label>
              <input
                type="number"
                value={selectedShape.size}
                onChange={(e) => {
                  const newSize = Math.max(1, Math.min(100, Number(e.target.value)));
                  const updatedShapes = webProperties.backgroundShapes.map(shape =>
                    shape.id === selectedShape.id ? { ...shape, size: newSize } : shape
                  );
                  updateWebProperties({ backgroundShapes: updatedShapes });
                  setSelectedShape({ ...selectedShape, size: newSize });
                }}
                className="input"
                min="1"
                max="100"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Opacidad:</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={selectedShape.opacity}
                onChange={(e) => {
                  const newOpacity = Number(e.target.value);
                  const updatedShapes = webProperties.backgroundShapes.map(shape =>
                    shape.id === selectedShape.id ? { ...shape, opacity: newOpacity } : shape
                  );
                  updateWebProperties({ backgroundShapes: updatedShapes });
                  setSelectedShape({ ...selectedShape, opacity: newOpacity });
                }}
                className="w-full"
              />
            </div>
            <button
              className="btn btn-accent flex items-center"
              onClick={() => {
                const updatedShapes = webProperties.backgroundShapes.filter(shape => shape.id !== selectedShape.id);
                updateWebProperties({ backgroundShapes: updatedShapes });
                setSelectedShape(null);
              }}
            >
              <Trash2 size={16} className="mr-1" /> Eliminar figura
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderTemplatesEditor = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="Nombre de la plantilla"
            className="input flex-grow"
          />
          <button
            className="btn btn-primary flex items-center"
            onClick={handleSaveTemplate}
            disabled={!templateName.trim()}
          >
            <Save size={16} className="mr-1" /> Guardar
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {templates.map((template) => (
            <div key={template.id} className="border rounded-lg p-4 relative overflow-hidden">
              <h3 className="font-bold mb-2">{template.name}</h3>
              <div className="relative" style={{ paddingBottom: '75%' }}>
                <div className="absolute inset-0">
                  <TemplatePreview template={template} />
                </div>
                <img
                  src={`https://picsum.photos/seed/${template.id}/300/200`}
                  alt="Template background"
                  className="absolute inset-0 w-full h-full object-cover opacity-20"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                  <button
                    className="btn btn-secondary mr-2"
                    onClick={() => applyTemplate(template)}
                  >
                    Aplicar
                  </button>
                  <button
                    className="btn bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
                    onClick={() => deleteTemplate(template.id)}
                    title="Eliminar plantilla"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex bg-white">
      <div className="w-16 bg-green-100 flex flex-col items-center py-4 space-y-4">
        <button
          className={`p-2 rounded-lg ${activeTab === 'component' ? 'bg-teal-600 text-white' : 'text-teal-800 hover:bg-green-200'}`}
          onClick={() => setActiveTab('component')}
          title="Componente"
        >
          <Layout size={24} />
        </button>
        <button
          className={`p-2 rounded-lg ${activeTab === 'general' ? 'bg-teal-600 text-white' : 'text-teal-800 hover:bg-green-200'}`}
          onClick={() => setActiveTab('general')}
          title="General"
        >
          <Settings size={24} />
        </button>
        <button
          className={`p-2 rounded-lg ${activeTab === 'templates' ? 'bg-teal-600 text-white' : 'text-teal-800 hover:bg-green-200'}`}
          onClick={() => setActiveTab('templates')}
          title="Plantillas"
        >
          <FileText size={24} />
        </button>
      </div>

      <div className="flex-grow p-4 overflow-hidden">
        <div className="h-full overflow-y-auto pr-4">
          {activeTab === 'component' && renderComponentEditor()}
          {activeTab === 'general' && renderGeneralEditor()}
          {activeTab === 'templates' && renderTemplatesEditor()}
        </div>
      </div>
    </div>
  );
};

export default Editor;