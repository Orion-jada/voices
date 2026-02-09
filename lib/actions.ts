'use server';

import db from './db';
import { v4 as uuidv4 } from 'uuid';
import { Article, Crossword, Issue } from './types';
import { revalidatePath } from 'next/cache';

export async function getAllArticles(): Promise<Article[]> {
  const stmt = db.prepare('SELECT * FROM articles ORDER BY created_at DESC');
  return stmt.all() as Article[];
}

export async function getIssues(): Promise<Issue[]> {
  const stmt = db.prepare('SELECT * FROM issues ORDER BY year DESC, created_at DESC');
  return stmt.all() as Issue[];
}

export async function getIssue(id: string): Promise<Issue | undefined> {
  const stmt = db.prepare('SELECT * FROM issues WHERE id = ?');
  return stmt.get(id) as Issue | undefined;
}

export async function createIssue(month: string, year: number) {
  const id = uuidv4();
  const stmt = db.prepare('INSERT INTO issues (id, month, year) VALUES (?, ?, ?)');
  stmt.run(id, month, year);
  revalidatePath('/issues');
  return id;
}

export async function getArticles(issueId: string): Promise<Article[]> {
  const stmt = db.prepare('SELECT * FROM articles WHERE issue_id = ? ORDER BY created_at DESC');
  return stmt.all(issueId) as Article[];
}

export async function getArticle(id: string): Promise<Article | undefined> {
  const stmt = db.prepare('SELECT * FROM articles WHERE id = ?');
  return stmt.get(id) as Article | undefined;
}

export async function createArticle(data: Omit<Article, 'id' | 'created_at'>) {
  const id = uuidv4();
  const stmt = db.prepare('INSERT INTO articles (id, title, subline, banner_image, content, author, issue_id) VALUES (?, ?, ?, ?, ?, ?, ?)');
  stmt.run(id, data.title, data.subline || null, data.banner_image || null, data.content, data.author || null, data.issue_id || null);
  revalidatePath(`/issues/${data.issue_id}`);
  return id;
}

export async function updateCrossword(id: string, data: Partial<Omit<Crossword, 'id' | 'created_at'>>) {
  const keys = Object.keys(data);
  if (keys.length === 0) return;

  const fields = keys.map((key) => `${key} = ?`).join(', ');
  const values = Object.values(data);
  const stmt = db.prepare(`UPDATE crosswords SET ${fields} WHERE id = ?`);
  stmt.run(...values, id);
}

export async function updateArticle(id: string, data: Partial<Omit<Article, 'id' | 'created_at'>>) {
  const keys = Object.keys(data);
  if (keys.length === 0) return;

  const fields = keys.map((key) => `${key} = ?`).join(', ');
  const values = Object.values(data);
  const stmt = db.prepare(`UPDATE articles SET ${fields} WHERE id = ?`);
  stmt.run(...values, id);
}

export async function getAllCrosswords(): Promise<Crossword[]> {
  const stmt = db.prepare('SELECT * FROM crosswords ORDER BY created_at DESC');
  return stmt.all() as Crossword[];
}

export async function getCrosswords(issueId: string): Promise<Crossword[]> {
  const stmt = db.prepare('SELECT * FROM crosswords WHERE issue_id = ? ORDER BY created_at DESC');
  return stmt.all(issueId) as Crossword[];
}

export async function getCrossword(id: string): Promise<Crossword | undefined> {
  const stmt = db.prepare('SELECT * FROM crosswords WHERE id = ?');
  return stmt.get(id) as Crossword | undefined;
}

export async function createCrossword(data: Omit<Crossword, 'id' | 'created_at'>) {
  const id = uuidv4();
  const stmt = db.prepare('INSERT INTO crosswords (id, title, grid, clues, solution, issue_id) VALUES (?, ?, ?, ?, ?, ?)');
  stmt.run(id, data.title, data.grid, data.clues, data.solution, data.issue_id || null);
  revalidatePath(`/issues/${data.issue_id}`);
  return id;
}
