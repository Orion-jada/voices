export interface Issue {
  id: string;
  month: string;
  year: number;
  is_published: boolean;
  created_at: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  author: string | null;
  issue_id: string | null;
  created_at: string;
}

export interface Crossword {
  id: string;
  title: string;
  grid: string; // JSON string
  clues: string; // JSON string
  solution: string; // JSON string
  issue_id: string | null;
  created_at: string;
}
