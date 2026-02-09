import { getAllCrosswords } from '@/lib/actions';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function CrosswordListPage() {
    const crosswords = await getAllCrosswords();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/games" className="text-blue-600 hover:text-blue-800">← Back to Games</Link>
            </div>

            <h1 className="text-4xl font-bold mb-8 text-center text-blue-900">Crossword Puzzles</h1>

            {crosswords.length === 0 ? (
                <p className="text-center text-black">No crossword puzzles available yet. Check back soon!</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {crosswords.map(cw => (
                        <Link href={`/games/crossword/${cw.id}`} key={cw.id} className="block p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition border border-blue-100 text-center group">
                            <div className="text-4xl mb-4">📝</div>
                            <h2 className="text-2xl font-bold text-black mb-2 group-hover:text-blue-600 transition">{cw.title}</h2>
                            <p className="text-blue-500">{new Date(cw.created_at).toLocaleDateString()}</p>
                            <span className="inline-block mt-4 text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">Play Now →</span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
