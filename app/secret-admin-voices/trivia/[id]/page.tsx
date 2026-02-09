import { getTriviaQuiz, getTriviaQuestions } from '@/lib/game-actions';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function EditTriviaPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const [quiz, questions] = await Promise.all([
        getTriviaQuiz(id),
        getTriviaQuestions(id)
    ]);

    if (!quiz) return <div>Quiz not found</div>;

    return (
        <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/secret-admin-voices/trivia" className="text-purple-600 hover:underline">← Back</Link>
                <h1 className="text-2xl font-bold">Edit Quiz: {quiz.title}</h1>
            </div>

            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="font-bold text-lg mb-4">Quiz Info</h2>
                <p><strong>Title:</strong> {quiz.title}</p>
                <p><strong>Category:</strong> {quiz.category || 'None'}</p>
                <p><strong>Questions:</strong> {questions.length}</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="font-bold text-lg mb-4">Questions</h2>
                {questions.length === 0 ? (
                    <p className="text-gray-500">No questions yet.</p>
                ) : (
                    <div className="space-y-4">
                        {questions.map((q, i) => {
                            const options = JSON.parse(q.options);
                            return (
                                <div key={q.id} className="p-4 bg-gray-50 rounded-lg">
                                    <p className="font-medium mb-2">{i + 1}. {q.question}</p>
                                    <ul className="ml-4 text-sm text-gray-600">
                                        {options.map((opt: string, j: number) => (
                                            <li key={j} className={j === q.correct_answer ? 'text-green-600 font-medium' : ''}>
                                                {String.fromCharCode(65 + j)}. {opt} {j === q.correct_answer && '✓'}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <p className="text-sm text-gray-500 mt-6">
                Note: To edit questions, delete this quiz and create a new one with updated questions.
            </p>
        </div>
    );
}
