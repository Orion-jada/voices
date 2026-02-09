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
  subline: string | null;
  banner_image: string | null;
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

export interface TriviaQuiz {
  id: string;
  title: string;
  category: string | null;
  created_at: string;
}

export interface TriviaQuestion {
  id: string;
  quiz_id: string;
  question: string;
  options: string; // JSON array
  correct_answer: number;
}

export interface VocabGame {
  id: string;
  title: string;
  pairs: string; // JSON: [{word, definition}]
  created_at: string;
}

export interface WordLadder {
  id: string;
  title: string;
  start_word: string;
  end_word: string;
  solution: string; // JSON array of steps
  created_at: string;
}
