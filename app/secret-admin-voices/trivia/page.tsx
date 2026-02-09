import { getAllTriviaQuizzes, deleteTriviaQuiz } from '@/lib/game-actions';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminTriviaPage() {
    const quizzes = await getAllTriviaQuizzes();

    return (
        <div className="max-w-4xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Trivia Quizzes</h1>
                <Link href="/secret-admin-voices/trivia/new" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">
                    + New Quiz
                </Link>
            </div>

            {quizzes.length === 0 ? (
                <p className="text-gray-500">No trivia quizzes yet. Create your first one!</p>
            ) : (
                <div className="bg-white rounded-lg shadow">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left p-4">Title</th>
                                <th className="text-left p-4">Category</th>
                                <th className="text-left p-4">Created</th>
                                <th className="text-right p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quizzes.map(quiz => (
                                <tr key={quiz.id} className="border-t">
                                    <td className="p-4 font-medium">{quiz.title}</td>
                                    <td className="p-4 text-gray-600">{quiz.category || '-'}</td>
                                    <td className="p-4 text-gray-600">{new Date(quiz.created_at).toLocaleDateString()}</td>
                                    <td className="p-4 text-right">
                                        <Link href={`/secret-admin-voices/trivia/${quiz.id}`} className="text-purple-600 hover:underline mr-4">Edit</Link>
                                        <form action={async () => { 'use server'; await deleteTriviaQuiz(quiz.id); }} className="inline">
                                            <button type="submit" className="text-red-600 hover:underline">Delete</button>
                                        </form>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
