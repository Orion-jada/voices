import { getAllTriviaQuizzes } from '@/lib/game-actions';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function TriviaListPage() {
    const quizzes = await getAllTriviaQuizzes();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/games" className="text-blue-600 hover:text-blue-800">← Back to Games</Link>
            </div>

            <h1 className="text-4xl font-bold mb-8 text-center text-purple-900">Trivia Quizzes</h1>

            {quizzes.length === 0 ? (
                <p className="text-center text-black">No trivia quizzes available yet. Check back soon!</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quizzes.map(quiz => (
                        <Link href={`/games/trivia/${quiz.id}`} key={quiz.id} className="block p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition border border-purple-100 text-center group">
                            <div className="text-4xl mb-4">🎯</div>
                            <h2 className="text-2xl font-bold text-black mb-2 group-hover:text-purple-600 transition">{quiz.title}</h2>
                            {quiz.category && <p className="text-purple-500 text-sm mb-2">{quiz.category}</p>}
                            <span className="inline-block mt-4 text-purple-600 font-semibold group-hover:translate-x-1 transition-transform">Play Now →</span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
