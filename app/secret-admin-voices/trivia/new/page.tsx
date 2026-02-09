'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createTriviaQuiz, addTriviaQuestion } from '@/lib/game-actions';

interface Question {
    question: string;
    options: string[];
    correctAnswer: number;
}

export default function NewTriviaPage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [questions, setQuestions] = useState<Question[]>([
        { question: '', options: ['', '', '', ''], correctAnswer: 0 }
    ]);
    const [saving, setSaving] = useState(false);

    const addQuestion = () => {
        setQuestions([...questions, { question: '', options: ['', '', '', ''], correctAnswer: 0 }]);
    };

    const removeQuestion = (index: number) => {
        if (questions.length > 1) {
            setQuestions(questions.filter((_, i) => i !== index));
        }
    };

    const updateQuestion = (index: number, field: keyof Question, value: any) => {
        const updated = [...questions];
        updated[index] = { ...updated[index], [field]: value };
        setQuestions(updated);
    };

    const updateOption = (qIndex: number, oIndex: number, value: string) => {
        const updated = [...questions];
        updated[qIndex].options[oIndex] = value;
        setQuestions(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const quizId = await createTriviaQuiz(title, category || null);

            for (const q of questions) {
                if (q.question && q.options.some(o => o)) {
                    await addTriviaQuestion(quizId, q.question, q.options.filter(o => o), q.correctAnswer);
                }
            }

            router.push('/secret-admin-voices/trivia');
        } catch (error) {
            console.error('Failed to create quiz:', error);
            setSaving(false);
        }
    };

    return (
        <div className="max-w-2xl">
            <h1 className="text-2xl font-bold mb-8">Create Trivia Quiz</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block font-medium mb-2">Quiz Title *</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        placeholder="e.g., Science Quiz - February 2024"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-2">Category</label>
                    <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        placeholder="e.g., Science, History, Current Events"
                    />
                </div>

                <div className="border-t pt-6">
                    <h2 className="text-lg font-bold mb-4">Questions</h2>

                    {questions.map((q, qIndex) => (
                        <div key={qIndex} className="mb-6 p-4 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-center mb-3">
                                <span className="font-medium text-purple-600">Question {qIndex + 1}</span>
                                {questions.length > 1 && (
                                    <button type="button" onClick={() => removeQuestion(qIndex)} className="text-red-500 text-sm">Remove</button>
                                )}
                            </div>

                            <input
                                type="text"
                                value={q.question}
                                onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                                placeholder="Enter question"
                                className="w-full px-4 py-2 border rounded-lg mb-3"
                            />

                            <div className="space-y-2">
                                {q.options.map((option, oIndex) => (
                                    <div key={oIndex} className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name={`correct-${qIndex}`}
                                            checked={q.correctAnswer === oIndex}
                                            onChange={() => updateQuestion(qIndex, 'correctAnswer', oIndex)}
                                            className="accent-purple-600"
                                        />
                                        <input
                                            type="text"
                                            value={option}
                                            onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                            placeholder={`Option ${oIndex + 1}`}
                                            className="flex-1 px-3 py-1 border rounded"
                                        />
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Select the radio button for the correct answer</p>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addQuestion}
                        className="text-purple-600 font-medium hover:underline"
                    >
                        + Add Another Question
                    </button>
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={saving || !title}
                        className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition"
                    >
                        {saving ? 'Creating...' : 'Create Quiz'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="text-gray-600 px-6 py-2 hover:underline"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
