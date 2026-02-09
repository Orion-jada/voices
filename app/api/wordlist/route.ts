import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

let cachedWords: string[] | null = null;

export async function GET() {
    try {
        // Cache the word list in memory
        if (!cachedWords) {
            const filePath = join(process.cwd(), 'data', 'wordlist.txt');
            const content = readFileSync(filePath, 'utf-8');
            cachedWords = content
                .split('\n')
                .map(word => word.trim().toUpperCase())
                .filter(word => word.length > 0 && /^[A-Z]+$/.test(word));
        }

        return NextResponse.json(cachedWords);
    } catch (error) {
        console.error('Failed to load word list:', error);
        return NextResponse.json([]);
    }
}
