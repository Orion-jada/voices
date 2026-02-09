'use client';
import { useState, useEffect } from 'react';

interface Props {
    startWord: string;
    endWord: string;
    solution: string[];
    title: string;
}

// Word list will be loaded from the text file
let wordListSet: Set<string> | null = null;
let wordListLoading = false;
let wordListPromise: Promise<Set<string>> | null = null;

async function loadWordList(): Promise<Set<string>> {
    if (wordListSet) return wordListSet;

    if (wordListPromise) return wordListPromise;

    wordListLoading = true;
    wordListPromise = fetch('/api/wordlist')
        .then(res => res.json())
        .then((words: string[]) => {
            wordListSet = new Set(words.map(w => w.toUpperCase()));
            wordListLoading = false;
            return wordListSet;
        })
        .catch(() => {
            wordListSet = new Set();
            wordListLoading = false;
            return wordListSet;
        });

    return wordListPromise;
}

async function checkWordWithAPI(word: string): Promise<boolean> {
    // First check against the loaded word list
    const wordList = await loadWordList();
    if (wordList.has(word)) {
        return true;
    }

    // Fall back to free dictionary API for words not in the list
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);
        return response.ok;
    } catch {
        // If API fails, accept the word to not block gameplay
        return true;
    }
}

export default function WordLadderGame({ startWord, endWord, solution, title }: Props) {
    const [currentSteps, setCurrentSteps] = useState<string[]>([startWord.toUpperCase()]);
    const [inputValue, setInputValue] = useState('');
    const [error, setError] = useState('');
    const [gameComplete, setGameComplete] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [isChecking, setIsChecking] = useState(false);
    const [wordListReady, setWordListReady] = useState(false);

    // Pre-load word list on mount
    useEffect(() => {
        loadWordList().then(() => setWordListReady(true));
    }, []);

    const validateWord = (prevWord: string, newWord: string): string | null => {
        // Check letters only
        if (!/^[A-Z]+$/.test(newWord)) {
            return 'Only letters allowed';
        }

        if (newWord.length !== prevWord.length) {
            return `Word must be ${prevWord.length} letters`;
        }

        let diffCount = 0;
        for (let i = 0; i < prevWord.length; i++) {
            if (prevWord[i] !== newWord[i]) diffCount++;
        }

        if (diffCount !== 1) {
            return 'Change exactly one letter';
        }

        return null;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Only allow letters
        const value = e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase();
        setInputValue(value);
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const word = inputValue.toUpperCase().trim();

        if (!word) return;

        const lastWord = currentSteps[currentSteps.length - 1];
        const validationError = validateWord(lastWord, word);

        if (validationError) {
            setError(validationError);
            return;
        }

        // Check if it's a real word
        setIsChecking(true);
        const isValidWord = await checkWordWithAPI(word);
        setIsChecking(false);

        if (!isValidWord) {
            setError(`"${word}" is not a valid English word`);
            return;
        }

        const newSteps = [...currentSteps, word];
        setCurrentSteps(newSteps);
        setInputValue('');
        setError('');
        setShowHint(false);

        if (word === endWord.toUpperCase()) {
            setGameComplete(true);
        }
    };

    const undoStep = () => {
        if (currentSteps.length > 1) {
            setCurrentSteps(currentSteps.slice(0, -1));
            setError('');
        }
    };

    const restartGame = () => {
        setCurrentSteps([startWord.toUpperCase()]);
        setInputValue('');
        setError('');
        setGameComplete(false);
        setShowHint(false);
    };

    const getHint = () => {
        const currentStep = currentSteps.length - 1;
        if (currentStep < solution.length - 1) {
            setShowHint(true);
        }
    };

    if (gameComplete) {
        const optimal = solution.length - 1;
        const playerSteps = currentSteps.length - 1;
        const isOptimal = playerSteps <= optimal;

        return (
            <div className="max-w-xl mx-auto text-center py-12">
                <div className="text-6xl mb-4">{isOptimal ? '🏆' : '🎉'}</div>
                <h2 className="text-3xl font-bold mb-4 text-orange-700">Ladder Complete!</h2>
                <p className="text-lg text-black mb-2">
                    You solved it in <span className="font-bold text-orange-600">{playerSteps}</span> steps
                </p>
                <p className="text-sm text-gray-600 mb-6">
                    {isOptimal ? 'You found the optimal solution!' : `Optimal solution: ${optimal} steps`}
                </p>
                <div className="flex justify-center gap-3 flex-wrap mb-8">
                    {currentSteps.map((word, i) => (
                        <span key={i} className={`px-3 py-1 rounded-lg font-mono text-sm ${i === 0 || i === currentSteps.length - 1 ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-800'
                            }`}>
                            {word}
                        </span>
                    ))}
                </div>
                <button
                    onClick={restartGame}
                    className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition"
                >
                    Play Again
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto">
            <div className="text-center mb-8">
                <p className="text-lg text-black mb-4">
                    Transform <span className="font-bold text-orange-600">{startWord.toUpperCase()}</span> into <span className="font-bold text-orange-600">{endWord.toUpperCase()}</span>
                </p>
                <p className="text-sm text-gray-600">Change one letter at a time. Each step must be a valid English word.</p>
            </div>

            {/* Current ladder */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <div className="flex flex-wrap gap-2 justify-center mb-6">
                    {currentSteps.map((word, i) => (
                        <div key={i} className="flex items-center">
                            <span className={`px-4 py-2 rounded-lg font-mono font-bold ${i === 0 ? 'bg-orange-500 text-white' :
                                    word === endWord.toUpperCase() ? 'bg-green-500 text-white' :
                                        'bg-orange-100 text-orange-800'
                                }`}>
                                {word}
                            </span>
                            {i < currentSteps.length - 1 && <span className="mx-2 text-orange-400">→</span>}
                        </div>
                    ))}
                    {!gameComplete && <span className="px-4 py-2 text-orange-300">→ ?</span>}
                </div>

                <form onSubmit={handleSubmit} className="flex gap-3">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder={`Enter ${startWord.length}-letter word`}
                        maxLength={startWord.length}
                        pattern="[A-Za-z]*"
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg font-mono text-center text-lg uppercase focus:border-orange-400 focus:outline-none"
                        disabled={isChecking}
                    />
                    <button
                        type="submit"
                        disabled={isChecking}
                        className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition disabled:opacity-50"
                    >
                        {isChecking ? '...' : 'Add'}
                    </button>
                </form>

                {error && <p className="text-red-600 text-center mt-3">{error}</p>}
            </div>

            <div className="flex justify-center gap-4">
                <button
                    onClick={undoStep}
                    disabled={currentSteps.length <= 1}
                    className="text-orange-600 px-4 py-2 rounded-lg hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    ← Undo
                </button>
                <button
                    onClick={getHint}
                    className="text-orange-600 px-4 py-2 rounded-lg hover:bg-orange-50 transition"
                >
                    💡 Hint
                </button>
                <button
                    onClick={restartGame}
                    className="text-orange-600 px-4 py-2 rounded-lg hover:bg-orange-50 transition"
                >
                    🔄 Restart
                </button>
            </div>

            {showHint && solution[currentSteps.length] && (
                <p className="text-center text-orange-600 mt-4">
                    Hint: Try changing the letter at position {
                        (() => {
                            const current = currentSteps[currentSteps.length - 1];
                            const next = solution[currentSteps.length].toUpperCase();
                            for (let i = 0; i < current.length; i++) {
                                if (current[i] !== next[i]) return i + 1;
                            }
                            return '?';
                        })()
                    }
                </p>
            )}
        </div>
    );
}
