export type CardType = 'note' | 'todo' | 'image' | 'quote' | 'link';

export type BackgroundPattern = 'none' | 'dots' | 'grid' | 'lines' | 'cork';

export type TemplateId =
  | 'blank'
  | 'vision-board'
  | 'mind-map'
  | 'brainstorming'
  | 'project-planning'
  | 'content-mapping'
  | 'moodboard'
  | 'creative-art'
  | 'illustration'
  | 'writing'
  | 'web-dev';

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Card {
  id: string;
  type: CardType;
  title: string;
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  pinned: boolean;
  pinColor: string;
  rotation: number;
  zIndex: number;
  createdAt: number;
  todos?: TodoItem[];
  imageUrl?: string;
  linkUrl?: string;
}

export interface Board {
  id: string;
  name: string;
  backgroundColor: string;
  backgroundPattern: BackgroundPattern;
  cards: Card[];
  createdAt: number;
  updatedAt: number;
}

export interface CanvasState {
  x: number;
  y: number;
  scale: number;
}

export interface BoardTemplate {
  id: TemplateId;
  name: string;
  description: string;
  icon: string;
  category: 'creative' | 'planning' | 'technical';
  backgroundColor: string;
  backgroundPattern: BackgroundPattern;
  cards: Omit<Card, 'id' | 'createdAt'>[];
}
