'use server';

import db from './db';
import { v4 as uuidv4 } from 'uuid';
import { TriviaQuiz, TriviaQuestion, VocabGame, WordLadder } from './types';
import { revalidatePath } from 'next/cache';

// ============ TRIVIA ============

export async function getAllTriviaQuizzes(): Promise<TriviaQuiz[]> {
    try {
        const result = await db.execute('SELECT * FROM trivia_quizzes ORDER BY created_at DESC');
        return result.rows as unknown as TriviaQuiz[];
    } catch (error) {
        console.error('getAllTriviaQuizzes error:', error);
        return [];
    }
}

export async function getTriviaQuiz(id: string): Promise<TriviaQuiz | undefined> {
    try {
        const result = await db.execute({
            sql: 'SELECT * FROM trivia_quizzes WHERE id = ?',
            args: [id]
        });
        return result.rows[0] as unknown as TriviaQuiz | undefined;
    } catch (error) {
        console.error('getTriviaQuiz error:', error);
        return undefined;
    }
}

export async function getTriviaQuestions(quizId: string): Promise<TriviaQuestion[]> {
    try {
        const result = await db.execute({
            sql: 'SELECT * FROM trivia_questions WHERE quiz_id = ?',
            args: [quizId]
        });
        return result.rows as unknown as TriviaQuestion[];
    } catch (error) {
        console.error('getTriviaQuestions error:', error);
        return [];
    }
}

export async function createTriviaQuiz(title: string, category: string | null) {
    const id = uuidv4();
    await db.execute({
        sql: 'INSERT INTO trivia_quizzes (id, title, category) VALUES (?, ?, ?)',
        args: [id, title, category]
    });
    revalidatePath('/games/trivia');
    return id;
}

export async function addTriviaQuestion(quizId: string, question: string, options: string[], correctAnswer: number) {
    const id = uuidv4();
    await db.execute({
        sql: 'INSERT INTO trivia_questions (id, quiz_id, question, options, correct_answer) VALUES (?, ?, ?, ?, ?)',
        args: [id, quizId, question, JSON.stringify(options), correctAnswer]
    });
    return id;
}

export async function deleteTriviaQuiz(id: string) {
    await db.execute({ sql: 'DELETE FROM trivia_questions WHERE quiz_id = ?', args: [id] });
    await db.execute({ sql: 'DELETE FROM trivia_quizzes WHERE id = ?', args: [id] });
    revalidatePath('/games/trivia');
}

// ============ VOCAB MATCH ============

export async function getAllVocabGames(): Promise<VocabGame[]> {
    try {
        const result = await db.execute('SELECT * FROM vocab_games ORDER BY created_at DESC');
        return result.rows as unknown as VocabGame[];
    } catch (error) {
        console.error('getAllVocabGames error:', error);
        return [];
    }
}

export async function getVocabGame(id: string): Promise<VocabGame | undefined> {
    try {
        const result = await db.execute({
            sql: 'SELECT * FROM vocab_games WHERE id = ?',
            args: [id]
        });
        return result.rows[0] as unknown as VocabGame | undefined;
    } catch (error) {
        console.error('getVocabGame error:', error);
        return undefined;
    }
}

export async function createVocabGame(title: string, pairs: { word: string; definition: string }[]) {
    const id = uuidv4();
    await db.execute({
        sql: 'INSERT INTO vocab_games (id, title, pairs) VALUES (?, ?, ?)',
        args: [id, title, JSON.stringify(pairs)]
    });
    revalidatePath('/games/vocab-match');
    return id;
}

export async function updateVocabGame(id: string, title: string, pairs: { word: string; definition: string }[]) {
    await db.execute({
        sql: 'UPDATE vocab_games SET title = ?, pairs = ? WHERE id = ?',
        args: [title, JSON.stringify(pairs), id]
    });
    revalidatePath('/games/vocab-match');
}

export async function deleteVocabGame(id: string) {
    await db.execute({ sql: 'DELETE FROM vocab_games WHERE id = ?', args: [id] });
    revalidatePath('/games/vocab-match');
}

// ============ WORD LADDER ============

export async function getAllWordLadders(): Promise<WordLadder[]> {
    try {
        const result = await db.execute('SELECT * FROM word_ladders ORDER BY created_at DESC');
        return result.rows as unknown as WordLadder[];
    } catch (error) {
        console.error('getAllWordLadders error:', error);
        return [];
    }
}

export async function getWordLadder(id: string): Promise<WordLadder | undefined> {
    try {
        const result = await db.execute({
            sql: 'SELECT * FROM word_ladders WHERE id = ?',
            args: [id]
        });
        return result.rows[0] as unknown as WordLadder | undefined;
    } catch (error) {
        console.error('getWordLadder error:', error);
        return undefined;
    }
}

export async function createWordLadder(title: string, startWord: string, endWord: string, solution: string[]) {
    const id = uuidv4();
    await db.execute({
        sql: 'INSERT INTO word_ladders (id, title, start_word, end_word, solution) VALUES (?, ?, ?, ?, ?)',
        args: [id, title, startWord, endWord, JSON.stringify(solution)]
    });
    revalidatePath('/games/word-ladder');
    return id;
}

export async function updateWordLadder(id: string, title: string, startWord: string, endWord: string, solution: string[]) {
    await db.execute({
        sql: 'UPDATE word_ladders SET title = ?, start_word = ?, end_word = ?, solution = ? WHERE id = ?',
        args: [title, startWord, endWord, JSON.stringify(solution), id]
    });
    revalidatePath('/games/word-ladder');
}

export async function deleteWordLadder(id: string) {
    await db.execute({ sql: 'DELETE FROM word_ladders WHERE id = ?', args: [id] });
    revalidatePath('/games/word-ladder');
}
