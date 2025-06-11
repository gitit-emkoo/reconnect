export interface Content {
  id: string;
  title: string;
  chip: string;
  thumbnail: string;
  content: string;
  createdAt: string;
  index?: number;
  onClick?: () => void;
} 