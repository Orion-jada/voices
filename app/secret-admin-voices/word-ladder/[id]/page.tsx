import { getWordLadder } from '@/lib/game-actions';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ViewWordLadderPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const ladder = await getWordLadder(id);

    if (!ladder) return <div>Puzzle not found</div>;

    const solution = JSON.parse(ladder.solution);

    return (
        <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/secret-admin-voices/word-ladder" className="text-orange-600 hover:underline">← Back</Link>
                <h1 className="text-2xl font-bold">View: {ladder.title}</h1>
            </div>

            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                        <span className="text-sm text-gray-500">Start Word</span>
                        <p className="text-2xl font-mono font-bold text-orange-600">{ladder.start_word.toUpperCase()}</p>
                    </div>
                    <div>
                        <span className="text-sm text-gray-500">End Word</span>
                        <p className="text-2xl font-mono font-bold text-orange-600">{ladder.end_word.toUpperCase()}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="font-bold text-lg mb-4">Solution ({solution.length} steps)</h2>
                <div className="flex flex-wrap gap-2 items-center">
                    {solution.map((word: string, i: number) => (
                        <div key={i} className="flex items-center">
                            <span className={`px-3 py-1 rounded font-mono ${i === 0 || i === solution.length - 1
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-orange-100 text-orange-800'
                                }`}>
                                {word}
                            </span>
                            {i < solution.length - 1 && <span className="mx-2 text-orange-400">→</span>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
