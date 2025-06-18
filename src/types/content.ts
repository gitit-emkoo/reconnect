export enum ContentType {
  ARTICLE = 'ARTICLE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  PREMIUM = 'PREMIUM',
}

export interface Content {
  id: string;
  title: string;
  body: string;
  type: ContentType;
  isPremium: boolean;
  createdAt: Date;
  updatedAt: Date;
  likesCount?: number;
  bookmarksCount?: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
} 