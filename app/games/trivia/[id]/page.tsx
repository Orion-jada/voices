import { getTriviaQuiz, getTriviaQuestions } from '@/lib/game-actions';
import TriviaPlayer from '@/components/TriviaPlayer';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function TriviaQuizPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const [quiz, questions] = await Promise.all([
        getTriviaQuiz(id),
        getTriviaQuestions(id)
    ]);

    if (!quiz) return <div className="container mx-auto px-4 py-8">Quiz not found</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/games/trivia" className="text-purple-600 hover:text-purple-800">← Back to Trivia</Link>
            </div>
            <h1 className="text-3xl font-bold mb-2 text-center text-purple-900">{quiz.title}</h1>
            {quiz.category && <p className="text-center text-purple-600 mb-8">{quiz.category}</p>}
            <TriviaPlayer questions={questions} quizTitle={quiz.title} />
        </div>
    );
}
