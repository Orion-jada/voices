'use client';
import { useState, useEffect } from 'react';
import { TriviaQuestion } from '@/lib/types';

interface Props {
    questions: TriviaQuestion[];
    quizTitle: string;
}

export default function TriviaPlayer({ questions, quizTitle }: Props) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [gameComplete, setGameComplete] = useState(false);

    const currentQuestion = questions[currentIndex];
    const options = currentQuestion ? JSON.parse(currentQuestion.options) : [];

    const handleAnswer = (index: number) => {
        if (selectedAnswer !== null) return;

        setSelectedAnswer(index);
        setShowResult(true);

        if (index === currentQuestion.correct_answer) {
            setScore(score + 1);
        }
    };

    const nextQuestion = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setSelectedAnswer(null);
            setShowResult(false);
        } else {
            setGameComplete(true);
        }
    };

    const restartGame = () => {
        setCurrentIndex(0);
        setScore(0);
        setSelectedAnswer(null);
        setShowResult(false);
        setGameComplete(false);
    };

    if (questions.length === 0) {
        return <div className="text-center py-12">No questions available for this quiz.</div>;
    }

    if (gameComplete) {
        const percentage = Math.round((score / questions.length) * 100);
        return (
            <div className="max-w-xl mx-auto text-center py-12">
                <div className="text-6xl mb-4">{percentage >= 70 ? '🎉' : percentage >= 50 ? '👍' : '📚'}</div>
                <h2 className="text-3xl font-bold mb-4 text-purple-900">Quiz Complete!</h2>
                <p className="text-2xl mb-2">Your Score: <span className="font-bold text-purple-600">{score}/{questions.length}</span></p>
                <p className="text-lg text-black mb-8">{percentage}% correct</p>
                <button
                    onClick={restartGame}
                    className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
                >
                    Play Again
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <span className="text-sm text-purple-600 font-medium">Question {currentIndex + 1} of {questions.length}</span>
                <span className="text-sm font-medium bg-purple-100 text-purple-800 px-3 py-1 rounded-full">Score: {score}</span>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
                <h2 className="text-xl font-semibold text-black mb-6">{currentQuestion.question}</h2>

                <div className="space-y-3">
                    {options.map((option: string, index: number) => {
                        let buttonClass = 'w-full text-left p-4 rounded-lg border-2 transition-all ';

                        if (showResult) {
                            if (index === currentQuestion.correct_answer) {
                                buttonClass += 'border-green-500 bg-green-50 text-green-800';
                            } else if (index === selectedAnswer) {
                                buttonClass += 'border-red-500 bg-red-50 text-red-800';
                            } else {
                                buttonClass += 'border-gray-200 text-gray-400';
                            }
                        } else {
                            buttonClass += 'border-gray-200 hover:border-purple-400 hover:bg-purple-50 cursor-pointer';
                        }

                        return (
                            <button
                                key={index}
                                onClick={() => handleAnswer(index)}
                                disabled={showResult}
                                className={buttonClass}
                            >
                                <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                                {option}
                            </button>
                        );
                    })}
                </div>
            </div>

            {showResult && (
                <div className="text-center">
                    <p className={`text-lg font-medium mb-4 ${selectedAnswer === currentQuestion.correct_answer ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedAnswer === currentQuestion.correct_answer ? '✓ Correct!' : `✗ Incorrect. The answer was: ${options[currentQuestion.correct_answer]}`}
                    </p>
                    <button
                        onClick={nextQuestion}
                        className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
                    >
                        {currentIndex < questions.length - 1 ? 'Next Question →' : 'See Results'}
                    </button>
                </div>
            )}
        </div>
    );
}
