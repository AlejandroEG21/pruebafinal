import React, { useState, useRef, useEffect } from 'react';
import { Component, WebProperties, BackgroundShape } from '../types';

interface PreviewProps {
  components: Component[];
  selectedComponent: Component | null;
  setSelectedComponent: (component: Component | null) => void;
  updateComponent: (component: Component) => void;
  webProperties: WebProperties;
  updateWebProperties: (newProperties: Partial<WebProperties>) => void;
  selectedShape: BackgroundShape | null;
  setSelectedShape: (shape: BackgroundShape | null) => void;
  activeTab: 'component' | 'general' | 'templates';
  articles: { id: number; name: string; price: number }[];
}

const Preview: React.FC<PreviewProps> = ({
  components,
  selectedComponent,
  setSelectedComponent,
  updateComponent,
  webProperties,
  updateWebProperties,
  selectedShape,
  setSelectedShape,
  activeTab,
  articles,
}) => {
  const [draggedItem, setDraggedItem] = useState<Component | BackgroundShape | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const previewRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, item: Component | BackgroundShape) => {
    if (activeTab !== 'component' && activeTab !== 'general') return;
    
    e.preventDefault();
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    const itemLeft = (item.position.x / 100) * containerRect.width;
    const itemTop = (item.position.y / 100) * containerRect.height;

    setDragOffset({
      x: e.clientX - containerRect.left - itemLeft,
      y: e.clientY - containerRect.top - itemTop,
    });
    setDraggedItem(item);
    if ('type' in item && (item.type === 'text' || item.type === 'image' || item.type === 'number')) {
      setSelectedComponent(item);
      setSelectedShape(null);
    } else {
      setSelectedShape(item as BackgroundShape);
      setSelectedComponent(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (draggedItem && containerRef.current) {
      e.preventDefault();
      const containerRect = containerRef.current.getBoundingClientRect();
      
      const x = ((e.clientX - containerRect.left - dragOffset.x) / containerRect.width) * 100;
      const y = ((e.clientY - containerRect.top - dragOffset.y) / containerRect.height) * 100;
      
      const clampedX = Math.max(0, Math.min(100, x));
      const clampedY = Math.max(0, Math.min(100, y));

      if ('type' in draggedItem && (draggedItem.type === 'text' || draggedItem.type === 'image' || draggedItem.type === 'number')) {
        updateComponent({
          ...draggedItem,
          position: { x: clampedX, y: clampedY },
        });
      } else {
        const updatedShapes = webProperties.backgroundShapes.map(shape => 
          shape.id === (draggedItem as BackgroundShape).id ? { ...shape, position: { x: clampedX, y: clampedY } } : shape
        );
        updateWebProperties({ backgroundShapes: updatedShapes });
      }
    }
  };

  const handleMouseUp = () => {
    setDraggedItem(null);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setDraggedItem(null);
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => document.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  const renderBackgroundShape = (shape: BackgroundShape) => {
    const shapeStyle: React.CSSProperties = {
      position: 'absolute',
      left: `${shape.position.x}%`,
      top: `${shape.position.y}%`,
      backgroundColor: shape.color,
      opacity: shape.opacity,
      width: `${shape.size}%`,
      height: `${shape.size}%`,
      cursor: activeTab === 'general' ? 'move' : 'default',
    };

    const handleShapeClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedShape(shape);
      setSelectedComponent(null);
    };

    switch (shape.type) {
      case 'circle':
        return (
          <div
            key={shape.id}
            style={{ ...shapeStyle, borderRadius: '50%' }}
            onClick={handleShapeClick}
            onMouseDown={(e) => activeTab === 'general' && handleMouseDown(e, shape)}
          />
        );
      case 'square':
        return (
          <div
            key={shape.id}
            style={shapeStyle}
            onClick={handleShapeClick}
            onMouseDown={(e) => activeTab === 'general' && handleMouseDown(e, shape)}
          />
        );
      case 'triangle':
        return (
          <div
            key={shape.id}
            style={{
              ...shapeStyle,
              width: 0,
              height: 0,
              backgroundColor: 'transparent',
              borderLeft: `${shape.size / 2}% solid transparent`,
              borderRight: `${shape.size / 2}% solid transparent`,
              borderBottom: `${shape.size}% solid ${shape.color}`,
            }}
            onClick={handleShapeClick}
            onMouseDown={(e) => activeTab === 'general' && handleMouseDown(e, shape)}
          />
        );
    }
  };

  return (
    <div
      ref={previewRef}
      className="w-full h-full rounded-lg shadow-inner relative overflow-hidden"
      style={{ backgroundColor: webProperties.backgroundColor }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div 
        ref={containerRef}
        className="absolute inset-0" 
      >
        {webProperties.backgroundShapes.map(renderBackgroundShape)}
        {components.map((component) => (
          <div
            key={component.id}
            style={{
              position: 'absolute',
              left: `${component.position.x}%`,
              top: `${component.position.y}%`,
              width: `${component.size.width}%`,
              height: `${component.size.height}%`,
              outline: component === selectedComponent ? '2px solid blue' : 'none',
              color: webProperties.textColor,
              fontSize: component.type === 'text' ? `${component.fontSize || 16}px` : 'inherit',
              fontFamily: component.type === 'text' ? component.fontFamily || 'Arial, sans-serif' : 'inherit',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              cursor: activeTab === 'component' ? 'move' : 'default',
              userSelect: 'none',
            }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedComponent(component);
              setSelectedShape(null);
            }}
            onMouseDown={(e) => activeTab === 'component' && handleMouseDown(e, component)}
          >
            {component.type === 'text' && (
              <p style={{ fontSize: `${component.fontSize || 16}px`, margin: 0 }}>{component.content}</p>
            )}
            {component.type === 'image' && (
              <img 
                src={component.content} 
                alt="Component" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                }} 
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/150?text=Error+loading+image';
                }}
              />
            )}
            {component.type === 'number' && <span>{component.content}</span>}
          </div>
        ))}
      </div>
      {articles.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 bg-yellow-100 p-2 text-center max-h-40 overflow-y-auto">
          <h3 className="font-bold mb-1">Artículos Recibidos:</h3>
          <ul className="list-none p-0 m-0">
            {articles.map((article) => (
              <li key={article.id} className="mb-1">
                {article.name} - ${article.price.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Preview;