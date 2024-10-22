export interface Component {
  id: number;
  type: string;
  content: string;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  fontSize?: number;
  fontFamily?: string;
}

export interface BackgroundShape {
  id: number;
  type: 'circle' | 'square' | 'triangle';
  color: string;
  position: {
    x: number;
    y: number;
  };
  size: number;
  opacity: number;
}

export interface WebProperties {
  backgroundColor: string;
  textColor: string;
  backgroundShapes: BackgroundShape[];
}

export interface Template {
  id: string;
  name: string;
  components: Component[];
  webProperties: WebProperties;
}