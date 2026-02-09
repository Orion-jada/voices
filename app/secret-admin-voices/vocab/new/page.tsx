'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createVocabGame } from '@/lib/game-actions';

interface Pair {
    word: string;
    definition: string;
}

export default function NewVocabPage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [pairs, setPairs] = useState<Pair[]>([
        { word: '', definition: '' },
        { word: '', definition: '' },
        { word: '', definition: '' }
    ]);
    const [saving, setSaving] = useState(false);

    const addPair = () => {
        setPairs([...pairs, { word: '', definition: '' }]);
    };

    const removePair = (index: number) => {
        if (pairs.length > 2) {
            setPairs(pairs.filter((_, i) => i !== index));
        }
    };

    const updatePair = (index: number, field: keyof Pair, value: string) => {
        const updated = [...pairs];
        updated[index] = { ...updated[index], [field]: value };
        setPairs(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const validPairs = pairs.filter(p => p.word && p.definition);
            if (validPairs.length < 2) {
                alert('Please add at least 2 word-definition pairs');
                setSaving(false);
                return;
            }

            await createVocabGame(title, validPairs);
            router.push('/secret-admin-voices/vocab');
        } catch (error) {
            console.error('Failed to create game:', error);
            setSaving(false);
        }
    };

    return (
        <div className="max-w-2xl">
            <h1 className="text-2xl font-bold mb-8">Create Vocab Match Game</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block font-medium mb-2">Game Title *</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                        placeholder="e.g., SAT Vocab - Week 5"
                    />
                </div>

                <div className="border-t pt-6">
                    <h2 className="text-lg font-bold mb-4">Word-Definition Pairs</h2>

                    {pairs.map((pair, index) => (
                        <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-center mb-3">
                                <span className="font-medium text-green-600">Pair {index + 1}</span>
                                {pairs.length > 2 && (
                                    <button type="button" onClick={() => removePair(index)} className="text-red-500 text-sm">Remove</button>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    value={pair.word}
                                    onChange={(e) => updatePair(index, 'word', e.target.value)}
                                    placeholder="Word"
                                    className="px-3 py-2 border rounded-lg"
                                />
                                <input
                                    type="text"
                                    value={pair.definition}
                                    onChange={(e) => updatePair(index, 'definition', e.target.value)}
                                    placeholder="Definition"
                                    className="px-3 py-2 border rounded-lg"
                                />
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addPair}
                        className="text-green-600 font-medium hover:underline"
                    >
                        + Add Another Pair
                    </button>
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={saving || !title || pairs.filter(p => p.word && p.definition).length < 2}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
                    >
                        {saving ? 'Creating...' : 'Create Game'}
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
