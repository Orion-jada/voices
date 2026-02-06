import Database from 'better-sqlite3';

const db = new Database('voices.db');

export function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS issues (
      id TEXT PRIMARY KEY,
      month TEXT NOT NULL,
      year INTEGER NOT NULL,
      is_published INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS articles (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      author TEXT,
      issue_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(issue_id) REFERENCES issues(id)
    );

    CREATE TABLE IF NOT EXISTS crosswords (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      grid TEXT NOT NULL, -- JSON string
      clues TEXT NOT NULL, -- JSON string
      solution TEXT NOT NULL, -- JSON string
      issue_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(issue_id) REFERENCES issues(id)
    );
  `);
}

export default db;
