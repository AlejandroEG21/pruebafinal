import React, { useState, useEffect } from 'react';
import TopBar from './components/TopBar';
import Editor from './components/Editor';
import Preview from './components/Preview';
import AdvertisingDisplay from './components/AdvertisingDisplay';
import { Component, WebProperties, BackgroundShape, Template } from './types';
import { io } from "socket.io-client";

interface Article {
  id: number;
  name: string;
  price: number;
}

function App() {
  const [currentView, setCurrentView] = useState<'editor' | 'advertising'>('editor');
  const [components, setComponents] = useState<Component[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [webProperties, setWebProperties] = useState<WebProperties>({
    backgroundColor: '#f0fff4',
    textColor: '#2d3748',
    backgroundShapes: [],
  });
  const [selectedShape, setSelectedShape] = useState<BackgroundShape | null>(null);
  const [activeTab, setActiveTab] = useState<'component' | 'general' | 'templates'>('component');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const socket = io('http://localhost:3001');
    socket.on('initialArticles', (initialArticles: Article[]) => {
      setArticles(initialArticles);
    });
    socket.on('newArticle', (article: Article) => {
      setArticles(prevArticles => [...prevArticles, article]);
    });
    socket.on('clearArticles', () => {
      setArticles([]);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const addComponent = (type: string) => {
    const newComponent: Component = {
      id: Date.now(),
      type,
      content: type === 'text' ? 'Nuevo texto' : type === 'image' ? 'https://via.placeholder.com/150' : '0',
      position: { x: 10, y: 10 },
      size: { width: 20, height: type === 'text' ? 10 : 20 },
      fontSize: 16,
    };
    setComponents([...components, newComponent]);
    setSelectedComponent(newComponent);
  };

  const updateComponent = (updatedComponent: Component) => {
    setComponents(components.map(c => c.id === updatedComponent.id ? updatedComponent : c));
    setSelectedComponent(updatedComponent);
  };

  const updateWebProperties = (newProperties: Partial<WebProperties>) => {
    setWebProperties({ ...webProperties, ...newProperties });
  };

  const applyTemplate = (template: Template) => {
    setComponents(template.components);
    setWebProperties(template.webProperties);
    setSelectedComponent(null);
    setSelectedShape(null);
  };

  const saveAsTemplate = (name: string) => {
    const newTemplate: Template = {
      id: Date.now().toString(),
      name,
      components,
      webProperties,
    };
    setTemplates([...templates, newTemplate]);
  };

  const deleteTemplate = (id: string) => {
    setTemplates(templates.filter(template => template.id !== id));
  };

  return (
    <div className="flex flex-col h-screen bg-green-50">
      <TopBar setCurrentView={setCurrentView} />
      {currentView === 'editor' ? (
        <div className="flex flex-1 overflow-hidden">
          <div className="w-1/4 bg-white shadow-lg z-10 overflow-hidden flex flex-col">
            <Editor
              selectedComponent={selectedComponent}
              updateComponent={updateComponent}
              webProperties={webProperties}
              updateWebProperties={updateWebProperties}
              selectedShape={selectedShape}
              setSelectedShape={setSelectedShape}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              addComponent={addComponent}
              applyTemplate={applyTemplate}
              saveAsTemplate={saveAsTemplate}
              templates={templates}
              deleteTemplate={deleteTemplate}
            />
          </div>
          <div className="flex-1 p-4">
            <Preview
              components={components}
              selectedComponent={selectedComponent}
              setSelectedComponent={setSelectedComponent}
              updateComponent={updateComponent}
              webProperties={webProperties}
              updateWebProperties={updateWebProperties}
              selectedShape={selectedShape}
              setSelectedShape={setSelectedShape}
              activeTab={activeTab}
              articles={articles}
            />
          </div>
        </div>
      ) : (
        <AdvertisingDisplay templates={templates} articles={articles} />
      )}
    </div>
  );
}

export default App;