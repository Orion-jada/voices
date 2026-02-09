import { getAllWordLadders } from '@/lib/game-actions';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function WordLadderListPage() {
    const ladders = await getAllWordLadders();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/games" className="text-orange-600 hover:text-orange-800">← Back to Games</Link>
            </div>

            <h1 className="text-4xl font-bold mb-8 text-center text-orange-900">Word Ladder</h1>

            {ladders.length === 0 ? (
                <p className="text-center text-black">No word ladder puzzles available yet. Check back soon!</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ladders.map(ladder => (
                        <Link href={`/games/word-ladder/${ladder.id}`} key={ladder.id} className="block p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition border border-orange-100 text-center group">
                            <div className="text-4xl mb-4">🪜</div>
                            <h2 className="text-2xl font-bold text-black mb-2 group-hover:text-orange-600 transition">{ladder.title}</h2>
                            <p className="text-orange-500 font-mono">
                                {ladder.start_word.toUpperCase()} → {ladder.end_word.toUpperCase()}
                            </p>
                            <span className="inline-block mt-4 text-orange-600 font-semibold group-hover:translate-x-1 transition-transform">Play Now →</span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
