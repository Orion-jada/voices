import { getAllWordLadders, deleteWordLadder } from '@/lib/game-actions';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminWordLadderPage() {
    const ladders = await getAllWordLadders();

    return (
        <div className="max-w-4xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Word Ladder Puzzles</h1>
                <Link href="/secret-admin-voices/word-ladder/new" className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition">
                    + New Puzzle
                </Link>
            </div>

            {ladders.length === 0 ? (
                <p className="text-gray-500">No word ladder puzzles yet. Create your first one!</p>
            ) : (
                <div className="bg-white rounded-lg shadow">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left p-4">Title</th>
                                <th className="text-left p-4">Words</th>
                                <th className="text-left p-4">Steps</th>
                                <th className="text-left p-4">Created</th>
                                <th className="text-right p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ladders.map(ladder => {
                                const steps = JSON.parse(ladder.solution).length;
                                return (
                                    <tr key={ladder.id} className="border-t">
                                        <td className="p-4 font-medium">{ladder.title}</td>
                                        <td className="p-4 text-gray-600 font-mono">{ladder.start_word.toUpperCase()} → {ladder.end_word.toUpperCase()}</td>
                                        <td className="p-4 text-gray-600">{steps} steps</td>
                                        <td className="p-4 text-gray-600">{new Date(ladder.created_at).toLocaleDateString()}</td>
                                        <td className="p-4 text-right">
                                            <Link href={`/secret-admin-voices/word-ladder/${ladder.id}`} className="text-orange-600 hover:underline mr-4">View</Link>
                                            <form action={async () => { 'use server'; await deleteWordLadder(ladder.id); }} className="inline">
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
