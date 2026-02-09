import { getAllVocabGames } from '@/lib/game-actions';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function VocabMatchListPage() {
    const games = await getAllVocabGames();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/games" className="text-green-600 hover:text-green-800">← Back to Games</Link>
            </div>

            <h1 className="text-4xl font-bold mb-8 text-center text-green-900">Vocab Match</h1>

            {games.length === 0 ? (
                <p className="text-center text-black">No vocab games available yet. Check back soon!</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {games.map(game => {
                        const pairCount = JSON.parse(game.pairs).length;
                        return (
                            <Link href={`/games/vocab-match/${game.id}`} key={game.id} className="block p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition border border-green-100 text-center group">
                                <div className="text-4xl mb-4">🔤</div>
                                <h2 className="text-2xl font-bold text-black mb-2 group-hover:text-green-600 transition">{game.title}</h2>
                                <p className="text-green-500 text-sm">{pairCount} pairs to match</p>
                                <span className="inline-block mt-4 text-green-600 font-semibold group-hover:translate-x-1 transition-transform">Play Now →</span>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
