import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:voices.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export async function initDB() {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS issues (
      id TEXT PRIMARY KEY,
      month TEXT NOT NULL,
      year INTEGER NOT NULL,
      is_published INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS articles (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      subline TEXT,
      banner_image TEXT,
      content TEXT NOT NULL,
      author TEXT,
      issue_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(issue_id) REFERENCES issues(id)
    )
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS crosswords (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      grid TEXT NOT NULL,
      clues TEXT NOT NULL,
      solution TEXT NOT NULL,
      issue_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(issue_id) REFERENCES issues(id)
    )
  `);
}

export default client;
