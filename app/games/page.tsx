import { getAllCrosswords } from '@/lib/actions';
import { getAllTriviaQuizzes, getAllVocabGames, getAllWordLadders } from '@/lib/game-actions';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function GamesPage() {
    const [crosswords, triviaQuizzes, vocabGames, wordLadders] = await Promise.all([
        getAllCrosswords(),
        getAllTriviaQuizzes(),
        getAllVocabGames(),
        getAllWordLadders()
    ]);

    const games = [
        {
            title: 'Crossword',
            description: 'Test your vocabulary with our classic crossword puzzles',
            icon: '📝',
            href: '/games/crossword',
            count: crosswords.length,
            color: 'from-blue-500 to-blue-700'
        },
        {
            title: 'Trivia',
            description: 'Challenge yourself with fun trivia questions',
            icon: '🎯',
            href: '/games/trivia',
            count: triviaQuizzes.length,
            color: 'from-purple-500 to-purple-700'
        },
        {
            title: 'Vocab Match',
            description: 'Match words with their definitions',
            icon: '🔤',
            href: '/games/vocab-match',
            count: vocabGames.length,
            color: 'from-green-500 to-green-700'
        },
        {
            title: 'Word Ladder',
            description: 'Transform one word into another, one letter at a time',
            icon: '🪜',
            href: '/games/word-ladder',
            count: wordLadders.length,
            color: 'from-orange-500 to-orange-700'
        }
    ];

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-bold text-blue-900 mb-4">Games</h1>
                <p className="text-xl text-black max-w-2xl mx-auto">
                    Take a break and challenge yourself with our collection of word games and puzzles!
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {games.map((game) => (
                    <Link
                        key={game.title}
                        href={game.href}
                        className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-90`} />
                        <div className="relative p-8 text-white">
                            <div className="text-5xl mb-4">{game.icon}</div>
                            <h2 className="text-2xl font-bold mb-2">{game.title}</h2>
                            <p className="text-white/90 mb-4">{game.description}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                                    {game.count} {game.count === 1 ? 'puzzle' : 'puzzles'} available
                                </span>
                                <span className="text-white font-semibold group-hover:translate-x-2 transition-transform">
                                    Play →
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
