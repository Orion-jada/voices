import { getAllVocabGames, deleteVocabGame } from '@/lib/game-actions';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminVocabPage() {
    const games = await getAllVocabGames();

    return (
        <div className="max-w-4xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Vocab Match Games</h1>
                <Link href="/secret-admin-voices/vocab/new" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                    + New Game
                </Link>
            </div>

            {games.length === 0 ? (
                <p className="text-gray-500">No vocab games yet. Create your first one!</p>
            ) : (
                <div className="bg-white rounded-lg shadow">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left p-4">Title</th>
                                <th className="text-left p-4">Pairs</th>
                                <th className="text-left p-4">Created</th>
                                <th className="text-right p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {games.map(game => {
                                const pairCount = JSON.parse(game.pairs).length;
                                return (
                                    <tr key={game.id} className="border-t">
                                        <td className="p-4 font-medium">{game.title}</td>
                                        <td className="p-4 text-gray-600">{pairCount} pairs</td>
                                        <td className="p-4 text-gray-600">{new Date(game.created_at).toLocaleDateString()}</td>
                                        <td className="p-4 text-right">
                                            <Link href={`/secret-admin-voices/vocab/${game.id}`} className="text-green-600 hover:underline mr-4">Edit</Link>
                                            <form action={async () => { 'use server'; await deleteVocabGame(game.id); }} className="inline">
                                                <button type="submit" className="text-red-600 hover:underline">Delete</button>
                                            </form>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
