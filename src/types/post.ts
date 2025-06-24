export interface PollVote {
  userId: string;
  choice: number;
}

export interface Poll {
  question: string;
  options: string[];
  votes?: PollVote[];
}

export interface Category {
  id: string;
  name: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  categoryId?: string;
  category?: Category;
  poll?: {
    id: string;
    question: string;
    options: { id: string; text: string }[];
    votes: PollVote[];
  };
  tags?: string[];
  viewCount?: number;
  _count?: {
    comments: number;
  };
  author: {
    id: string;
    nickname: string;
  };
} 