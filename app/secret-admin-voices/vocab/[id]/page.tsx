import { getVocabGame } from '@/lib/game-actions';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function EditVocabPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const game = await getVocabGame(id);

    if (!game) return <div>Game not found</div>;

    const pairs = JSON.parse(game.pairs);

    return (
        <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/secret-admin-voices/vocab" className="text-green-600 hover:underline">← Back</Link>
                <h1 className="text-2xl font-bold">Edit: {game.title}</h1>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="font-bold text-lg mb-4">Word-Definition Pairs ({pairs.length})</h2>
                <div className="space-y-3">
                    {pairs.map((pair: { word: string; definition: string }, i: number) => (
                        <div key={i} className="p-3 bg-gray-50 rounded-lg grid grid-cols-2 gap-4">
                            <div><strong className="text-green-600">Word:</strong> {pair.word}</div>
                            <div><strong className="text-gray-600">Definition:</strong> {pair.definition}</div>
                        </div>
                    ))}
                </div>
            </div>

            <p className="text-sm text-gray-500 mt-6">
                Note: To edit pairs, delete this game and create a new one.
            </p>
        </div>
    );
}
