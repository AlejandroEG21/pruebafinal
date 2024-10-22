import React from 'react';
import { Template, Component, BackgroundShape } from '../types';

interface TemplatePreviewProps {
  template: Template | null;
  articles?: { id: number; name: string; price: number }[];
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({ template, articles }) => {
  if (!template) {
    return <div className="w-full h-full flex items-center justify-center text-gray-500">No template available</div>;
  }

  const { components, webProperties } = template;

  const renderBackgroundShape = (shape: BackgroundShape) => {
    const shapeStyle: React.CSSProperties = {
      position: 'absolute',
      left: `${shape.position.x}%`,
      top:`${shape.position.y}%`,
      width: `${shape.size}%`,
      height: `${shape.size}%`,
      backgroundColor: shape.color,
      opacity: shape.opacity,
    };

    switch (shape.type) {
      case 'circle':
        return <div key={shape.id} style={{ ...shapeStyle, borderRadius: '50%' }} />;
      case 'square':
        return <div key={shape.id} style={shapeStyle} />;
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
          />
        );
      default:
        return null;
    }
  };

  const renderComponent = (component: Component) => {
    const componentStyle: React.CSSProperties = {
      position: 'absolute',
      left: `${component.position.x}%`,
      top: `${component.position.y}%`,
      width: `${component.size.width}%`,
      height: `${component.size.height}%`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      fontSize: component.fontSize ? `${component.fontSize}px` : 'inherit',
      fontFamily: component.fontFamily || 'inherit',
    };

    switch (component.type) {
      case 'text':
        return (
          <div key={component.id} style={componentStyle}>
            {component.content}
          </div>
        );
      case 'image':
        return (
          <div key={component.id} style={componentStyle}>
            <img
              src={component.content}
              alt="Component"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/150?text=Error+loading+image';
              }}
            />
          </div>
        );
      case 'number':
        return (
          <div key={component.id} style={componentStyle}>
            {component.content}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full rounded-lg overflow-hidden relative" style={{ aspectRatio: '4/3' }}>
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: webProperties.backgroundColor,
          color: webProperties.textColor,
        }}
      >
        {webProperties.backgroundShapes.map(renderBackgroundShape)}
        {components.map(renderComponent)}
      </div>
      {articles && articles.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 bg-yellow-100 p-2 text-center max-h-40 overflow-y-auto">
          <h3 className="font-bold mb-1 text-sm">Artículos Recibidos:</h3>
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
  );
};

export default TemplatePreview;