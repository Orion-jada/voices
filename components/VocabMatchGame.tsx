'use client';
import { useState, useEffect } from 'react';

interface Pair {
    word: string;
    definition: string;
}

interface Props {
    pairs: Pair[];
    title: string;
}

export default function VocabMatchGame({ pairs, title }: Props) {
    const [selectedWord, setSelectedWord] = useState<string | null>(null);
    const [selectedDefinition, setSelectedDefinition] = useState<string | null>(null);
    const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
    const [shuffledWords, setShuffledWords] = useState<string[]>([]);
    const [shuffledDefinitions, setShuffledDefinitions] = useState<string[]>([]);
    const [wrongMatch, setWrongMatch] = useState(false);
    const [gameComplete, setGameComplete] = useState(false);

    useEffect(() => {
        setShuffledWords([...pairs].sort(() => Math.random() - 0.5).map(p => p.word));
        setShuffledDefinitions([...pairs].sort(() => Math.random() - 0.5).map(p => p.definition));
    }, [pairs]);

    useEffect(() => {
        if (selectedWord && selectedDefinition) {
            const pair = pairs.find(p => p.word === selectedWord);
            if (pair && pair.definition === selectedDefinition) {
                setMatchedPairs(prev => new Set([...prev, selectedWord]));
                setSelectedWord(null);
                setSelectedDefinition(null);

                if (matchedPairs.size + 1 === pairs.length) {
                    setGameComplete(true);
                }
            } else {
                setWrongMatch(true);
                setTimeout(() => {
                    setWrongMatch(false);
                    setSelectedWord(null);
                    setSelectedDefinition(null);
                }, 800);
            }
        }
    }, [selectedWord, selectedDefinition, pairs, matchedPairs.size]);

    const restartGame = () => {
        setMatchedPairs(new Set());
        setSelectedWord(null);
        setSelectedDefinition(null);
        setGameComplete(false);
        setShuffledWords([...pairs].sort(() => Math.random() - 0.5).map(p => p.word));
        setShuffledDefinitions([...pairs].sort(() => Math.random() - 0.5).map(p => p.definition));
    };

    if (pairs.length === 0) {
        return <div className="text-center py-12">No pairs available for this game.</div>;
    }

    if (gameComplete) {
        return (
            <div className="max-w-xl mx-auto text-center py-12">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-3xl font-bold mb-4 text-green-700">Perfect Match!</h2>
                <p className="text-lg text-black mb-8">You matched all {pairs.length} pairs correctly!</p>
                <button
                    onClick={restartGame}
                    className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                    Play Again
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6">
                <span className="text-sm font-medium bg-green-100 text-green-800 px-3 py-1 rounded-full">
                    {matchedPairs.size} of {pairs.length} matched
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Words Column */}
                <div>
                    <h3 className="text-lg font-bold text-green-900 mb-4 text-center">Words</h3>
                    <div className="space-y-3">
                        {shuffledWords.map((word) => {
                            const isMatched = matchedPairs.has(word);
                            const isSelected = selectedWord === word;

                            return (
                                <button
                                    key={word}
                                    onClick={() => !isMatched && setSelectedWord(isSelected ? null : word)}
                                    disabled={isMatched}
                                    className={`w-full p-4 rounded-lg border-2 text-left font-medium transition-all ${isMatched ? 'bg-green-100 border-green-300 text-green-600 opacity-60' :
                                            isSelected ? 'bg-green-500 border-green-600 text-white' :
                                                wrongMatch && isSelected ? 'bg-red-100 border-red-400' :
                                                    'bg-white border-gray-200 hover:border-green-400 hover:bg-green-50 cursor-pointer'
                                        }`}
                                >
                                    {word}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Definitions Column */}
                <div>
                    <h3 className="text-lg font-bold text-green-900 mb-4 text-center">Definitions</h3>
                    <div className="space-y-3">
                        {shuffledDefinitions.map((definition) => {
                            const matchedWord = pairs.find(p => p.definition === definition)?.word;
                            const isMatched = matchedWord ? matchedPairs.has(matchedWord) : false;
                            const isSelected = selectedDefinition === definition;

                            return (
                                <button
                                    key={definition}
                                    onClick={() => !isMatched && setSelectedDefinition(isSelected ? null : definition)}
                                    disabled={isMatched}
                                    className={`w-full p-4 rounded-lg border-2 text-left text-sm transition-all ${isMatched ? 'bg-green-100 border-green-300 text-green-600 opacity-60' :
                                            isSelected ? 'bg-green-500 border-green-600 text-white' :
                                                wrongMatch && isSelected ? 'bg-red-100 border-red-400' :
                                                    'bg-white border-gray-200 hover:border-green-400 hover:bg-green-50 cursor-pointer'
                                        }`}
                                >
                                    {definition}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {wrongMatch && (
                <p className="text-center text-red-600 font-medium mt-6 animate-pulse">Not a match! Try again.</p>
            )}
        </div>
    );
}
