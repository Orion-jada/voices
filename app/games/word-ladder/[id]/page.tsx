import { getWordLadder } from '@/lib/game-actions';
import WordLadderGame from '@/components/WordLadderGame';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function WordLadderPlayPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const ladder = await getWordLadder(id);

    if (!ladder) return <div className="container mx-auto px-4 py-8">Puzzle not found</div>;

    const solution = JSON.parse(ladder.solution);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/games/word-ladder" className="text-orange-600 hover:text-orange-800">← Back to Word Ladder</Link>
            </div>
            <h1 className="text-3xl font-bold mb-8 text-center text-orange-900">{ladder.title}</h1>
            <WordLadderGame
                startWord={ladder.start_word}
                endWord={ladder.end_word}
                solution={solution}
                title={ladder.title}
            />
        </div>
    );
}
