'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createWordLadder } from '@/lib/game-actions';

export default function NewWordLadderPage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [startWord, setStartWord] = useState('');
    const [endWord, setEndWord] = useState('');
    const [solutionText, setSolutionText] = useState('');
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            // Parse solution - one word per line
            const solution = solutionText
                .split('\n')
                .map(s => s.trim().toUpperCase())
                .filter(s => s);

            if (solution.length < 2) {
                alert('Solution must have at least 2 steps (start and end words)');
                setSaving(false);
                return;
            }

            // Validate solution includes start and end
            if (solution[0] !== startWord.toUpperCase()) {
                alert('Solution must start with the start word');
                setSaving(false);
                return;
            }
            if (solution[solution.length - 1] !== endWord.toUpperCase()) {
                alert('Solution must end with the end word');
                setSaving(false);
                return;
            }

            await createWordLadder(title, startWord.toUpperCase(), endWord.toUpperCase(), solution);
            router.push('/secret-admin-voices/word-ladder');
        } catch (error) {
            console.error('Failed to create puzzle:', error);
            setSaving(false);
        }
    };

    return (
        <div className="max-w-2xl">
            <h1 className="text-2xl font-bold mb-8">Create Word Ladder Puzzle</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block font-medium mb-2">Puzzle Title *</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        placeholder="e.g., Easy Ladder #1"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-medium mb-2">Start Word *</label>
                        <input
                            type="text"
                            value={startWord}
                            onChange={(e) => setStartWord(e.target.value.toUpperCase())}
                            required
                            className="w-full px-4 py-2 border rounded-lg font-mono uppercase focus:ring-2 focus:ring-orange-500 focus:outline-none"
                            placeholder="e.g., CAT"
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-2">End Word *</label>
                        <input
                            type="text"
                            value={endWord}
                            onChange={(e) => setEndWord(e.target.value.toUpperCase())}
                            required
                            className="w-full px-4 py-2 border rounded-lg font-mono uppercase focus:ring-2 focus:ring-orange-500 focus:outline-none"
                            placeholder="e.g., DOG"
                        />
                    </div>
                </div>

                <div>
                    <label className="block font-medium mb-2">Solution (one word per line) *</label>
                    <textarea
                        value={solutionText}
                        onChange={(e) => setSolutionText(e.target.value.toUpperCase())}
                        required
                        rows={6}
                        className="w-full px-4 py-2 border rounded-lg font-mono uppercase focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        placeholder={`CAT\nCOT\nCOG\nDOG`}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        Enter the complete solution path including start and end words
                    </p>
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={saving || !title || !startWord || !endWord || !solutionText}
                        className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 transition"
                    >
                        {saving ? 'Creating...' : 'Create Puzzle'}
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
