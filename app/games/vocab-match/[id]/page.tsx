import { getVocabGame } from '@/lib/game-actions';
import VocabMatchGame from '@/components/VocabMatchGame';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function VocabMatchPlayPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const game = await getVocabGame(id);

    if (!game) return <div className="container mx-auto px-4 py-8">Game not found</div>;

    const pairs = JSON.parse(game.pairs);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/games/vocab-match" className="text-green-600 hover:text-green-800">← Back to Vocab Match</Link>
            </div>
            <h1 className="text-3xl font-bold mb-8 text-center text-green-900">{game.title}</h1>
            <VocabMatchGame pairs={pairs} title={game.title} />
        </div>
    );
}
