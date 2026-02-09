'use server';

import db from './db';
import { v4 as uuidv4 } from 'uuid';
import { Article, Crossword, Issue } from './types';
import { revalidatePath } from 'next/cache';

export async function getAllArticles(): Promise<Article[]> {
  try {
    const result = await db.execute('SELECT * FROM articles ORDER BY created_at DESC');
    return result.rows as unknown as Article[];
  } catch (error) {
    console.error('getAllArticles error:', error);
    return [];
  }
}

export async function getIssues(): Promise<Issue[]> {
  try {
    const result = await db.execute('SELECT * FROM issues ORDER BY year DESC, created_at DESC');
    return result.rows as unknown as Issue[];
  } catch (error) {
    console.error('getIssues error:', error);
    return [];
  }
}

export async function getIssue(id: string): Promise<Issue | undefined> {
  try {
    const result = await db.execute({
      sql: 'SELECT * FROM issues WHERE id = ?',
      args: [id]
    });
    return result.rows[0] as unknown as Issue | undefined;
  } catch (error) {
    console.error('getIssue error:', error);
    return undefined;
  }
}

export async function createIssue(month: string, year: number) {
  const id = uuidv4();
  await db.execute({
    sql: 'INSERT INTO issues (id, month, year) VALUES (?, ?, ?)',
    args: [id, month, year]
  });
  revalidatePath('/issues');
  return id;
}

export async function getArticles(issueId: string): Promise<Article[]> {
  try {
    const result = await db.execute({
      sql: 'SELECT * FROM articles WHERE issue_id = ? ORDER BY created_at DESC',
      args: [issueId]
    });
    return result.rows as unknown as Article[];
  } catch (error) {
    console.error('getArticles error:', error);
    return [];
  }
}

export async function getArticle(id: string): Promise<Article | undefined> {
  try {
    const result = await db.execute({
      sql: 'SELECT * FROM articles WHERE id = ?',
      args: [id]
    });
    return result.rows[0] as unknown as Article | undefined;
  } catch (error) {
    console.error('getArticle error:', error);
    return undefined;
  }
}

export async function createArticle(data: Omit<Article, 'id' | 'created_at'>) {
  const id = uuidv4();
  await db.execute({
    sql: 'INSERT INTO articles (id, title, subline, banner_image, content, author, issue_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
    args: [id, data.title, data.subline || null, data.banner_image || null, data.content, data.author || null, data.issue_id || null]
  });
  revalidatePath(`/issues/${data.issue_id}`);
  revalidatePath('/');
  return id;
}

export async function updateCrossword(id: string, data: Partial<Omit<Crossword, 'id' | 'created_at'>>) {
  const keys = Object.keys(data);
  if (keys.length === 0) return;

  const fields = keys.map((key) => `${key} = ?`).join(', ');
  const values = Object.values(data);
  await db.execute({
    sql: `UPDATE crosswords SET ${fields} WHERE id = ?`,
    args: [...values, id]
  });
}

export async function updateArticle(id: string, data: Partial<Omit<Article, 'id' | 'created_at'>>) {
  const keys = Object.keys(data);
  if (keys.length === 0) return;

  const fields = keys.map((key) => `${key} = ?`).join(', ');
  const values = Object.values(data);
  await db.execute({
    sql: `UPDATE articles SET ${fields} WHERE id = ?`,
    args: [...values, id]
  });
  revalidatePath('/');
}

export async function getAllCrosswords(): Promise<Crossword[]> {
  try {
    const result = await db.execute('SELECT * FROM crosswords ORDER BY created_at DESC');
    return result.rows as unknown as Crossword[];
  } catch (error) {
    console.error('getAllCrosswords error:', error);
    return [];
  }
}

export async function getCrosswords(issueId: string): Promise<Crossword[]> {
  try {
    const result = await db.execute({
      sql: 'SELECT * FROM crosswords WHERE issue_id = ? ORDER BY created_at DESC',
      args: [issueId]
    });
    return result.rows as unknown as Crossword[];
  } catch (error) {
    console.error('getCrosswords error:', error);
    return [];
  }
}

export async function getCrossword(id: string): Promise<Crossword | undefined> {
  try {
    const result = await db.execute({
      sql: 'SELECT * FROM crosswords WHERE id = ?',
      args: [id]
    });
    return result.rows[0] as unknown as Crossword | undefined;
  } catch (error) {
    console.error('getCrossword error:', error);
    return undefined;
  }
}

export async function createCrossword(data: Omit<Crossword, 'id' | 'created_at'>) {
  const id = uuidv4();
  await db.execute({
    sql: 'INSERT INTO crosswords (id, title, grid, clues, solution, issue_id) VALUES (?, ?, ?, ?, ?, ?)',
    args: [id, data.title, data.grid, data.clues, data.solution, data.issue_id || null]
  });
  revalidatePath(`/issues/${data.issue_id}`);
  return id;
}
