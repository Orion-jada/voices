'use client';
import { useState, useEffect } from 'react';
import { Crossword } from '@/lib/types';
import clsx from 'clsx';

export default function CrosswordPlayer({ data }: { data: Crossword }) {
    const [gridStructure, setGridStructure] = useState<any[][]>([]);
    const [solution, setSolution] = useState<string[][]>([]);
    const [clues, setClues] = useState<{ across: any, down: any }>({ across: {}, down: {} });
    const [userGrid, setUserGrid] = useState<string[][]>([]);
    const [cursor, setCursor] = useState({ r: 0, c: 0 });
    const [direction, setDirection] = useState<'across' | 'down'>('across');
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    useEffect(() => {
        if (data) {
            try {
                const parsedGrid = JSON.parse(data.grid);
                setGridStructure(parsedGrid);
                setSolution(JSON.parse(data.solution));
                setClues(JSON.parse(data.clues));
                setUserGrid(parsedGrid.map((row: any[]) => row.map(() => '')));

                // Find first white square
                for (let r = 0; r < parsedGrid.length; r++) {
                    for (let c = 0; c < parsedGrid[0].length; c++) {
                        if (!parsedGrid[r][c].isBlack) {
                            setCursor({ r, c });
                            return;
                        }
                    }
                }
            } catch (e) {
                console.error("Failed to load crossword data", e);
            }
        }
    }, [data]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (gridStructure.length === 0) return;

            // Prevent scrolling with arrows/space if focused on grid
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
                e.preventDefault();
            }

            const { r, c } = cursor;
            const rLen = gridStructure.length;
            const cLen = gridStructure[0].length;

            if (e.key === 'ArrowRight') {
                if (c + 1 < cLen && !gridStructure[r][c + 1].isBlack) setCursor({ r, c: c + 1 });
                else if (direction !== 'across') setDirection('across');
            } else if (e.key === 'ArrowLeft') {
                if (c - 1 >= 0 && !gridStructure[r][c - 1].isBlack) setCursor({ r, c: c - 1 });
                else if (direction !== 'across') setDirection('across');
            } else if (e.key === 'ArrowDown') {
                if (r + 1 < rLen && !gridStructure[r + 1][c].isBlack) setCursor({ r: r + 1, c });
                else if (direction !== 'down') setDirection('down');
            } else if (e.key === 'ArrowUp') {
                if (r - 1 >= 0 && !gridStructure[r - 1][c].isBlack) setCursor({ r: r - 1, c });
                else if (direction !== 'down') setDirection('down');
            } else if (e.key === 'Backspace') {
                const newGrid = [...userGrid.map(row => [...row])];
                if (newGrid[r][c] !== '') {
                    newGrid[r][c] = '';
                    setUserGrid(newGrid);
                } else {
                    // Move back and clear
                    let nextR = r, nextC = c;
                    if (direction === 'across') {
                        if (c > 0 && !gridStructure[r][c - 1].isBlack) nextC--;
                    } else {
                        if (r > 0 && !gridStructure[r - 1][c].isBlack) nextR--;
                    }
                    setCursor({ r: nextR, c: nextC });
                    // Optional: clear previous cell on backspace move? Standard is yes.
                    if (newGrid[nextR][nextC] !== '') {
                        newGrid[nextR][nextC] = '';
                        setUserGrid(newGrid);
                    }
                }
            } else if (e.key.length === 1 && e.key.match(/[a-zA-Z]/)) {
                const newGrid = [...userGrid.map(row => [...row])];
                newGrid[r][c] = e.key.toUpperCase();
                setUserGrid(newGrid);

                // Move forward
                let nextR = r, nextC = c;
                if (direction === 'across') {
                    if (c + 1 < cLen && !gridStructure[r][c + 1].isBlack) nextC++;
                } else {
                    if (r + 1 < rLen && !gridStructure[r + 1][c].isBlack) nextR++;
                }
                setCursor({ r: nextR, c: nextC });
            } else if (e.key === 'Tab') { // Cycle clues? Maybe later.
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [cursor, direction, gridStructure, userGrid]);

    const handleCellClick = (r: number, c: number) => {
        if (gridStructure[r][c].isBlack) return;
        if (r === cursor.r && c === cursor.c) {
            setDirection(prev => prev === 'across' ? 'down' : 'across');
        } else {
            setCursor({ r, c });
        }
    };

    const checkAnswers = () => {
        let correct = true;
        for (let r = 0; r < userGrid.length; r++) {
            for (let c = 0; c < userGrid[0].length; c++) {
                if (gridStructure[r][c].isBlack) continue;
                if (userGrid[r][c] !== solution[r][c]) {
                    correct = false;
                    break;
                }
            }
        }
        setIsCorrect(correct);
        if (correct) alert('Congratulations! You solved it!');
        else alert('Not quite right yet. Keep trying!');
    };

    if (gridStructure.length === 0) return <div>Loading...</div>;

    return (
        <div className="flex flex-col lg:flex-row gap-8 justify-center">
            <div className="space-y-4">
                <div
                    style={{ display: 'grid', gridTemplateColumns: `repeat(${gridStructure[0].length}, 2.5rem)` }}
                    className="gap-px bg-black border-2 border-black w-fit shadow-lg"
                >
                    {gridStructure.map((row, r) => row.map((cell, c) => {
                        const isSelected = r === cursor.r && c === cursor.c;
                        // Check if part of current word
                        // Logic: same row if direction across, same col if direction down
                        // AND not blocked by black squares? 
                        // Simple highlight:
                        const isHighlighted = !cell.isBlack && (
                            (direction === 'across' && r === cursor.r) ||
                            (direction === 'down' && c === cursor.c)
                        );
                        // This simple highlight highlights the whole row/col. Ideally only the word.
                        // For now, highlighting just the cell or the row is fine.

                        return (
                            <div
                                key={`${r}-${c}`}
                                className={clsx(
                                    "w-10 h-10 relative flex items-center justify-center text-xl font-bold uppercase select-none cursor-pointer transition-all",
                                    cell.isBlack ? 'bg-black' : 'bg-white',
                                    !cell.isBlack && isSelected && 'bg-blue-400 ring-2 ring-blue-600 ring-inset z-10',
                                    !cell.isBlack && !isSelected && isHighlighted && 'bg-blue-100'
                                )}
                                onClick={() => handleCellClick(r, c)}
                            >
                                {cell.number && <span className="absolute top-0 left-0.5 text-[9px] leading-none pointer-events-none font-semibold">{cell.number}</span>}
                                {!cell.isBlack && <span className={isSelected ? 'text-white' : 'text-black'}>{userGrid[r][c]}</span>}
                            </div>
                        );
                    }))}
                </div>
                <button onClick={checkAnswers} className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 shadow transition">Check Puzzle</button>
            </div>

            <div className="flex-1 max-w-md space-y-4">
                <div className="bg-white p-4 rounded shadow h-96 overflow-auto">
                    <h3 className="font-bold border-b pb-2 mb-2 sticky top-0 bg-white">Across</h3>
                    <ul className="space-y-1">
                        {Object.keys(clues.across).map(num => (
                            <li key={`a-${num}`} className={clsx("text-sm", direction === 'across' && cursor.r !== -1 /* Logic to highlight active clue */)}>
                                <span className="font-bold mr-2">{num}</span>{clues.across[num]}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bg-white p-4 rounded shadow h-96 overflow-auto">
                    <h3 className="font-bold border-b pb-2 mb-2 sticky top-0 bg-white">Down</h3>
                    <ul className="space-y-1">
                        {Object.keys(clues.down).map(num => (
                            <li key={`d-${num}`} className="text-sm">
                                <span className="font-bold mr-2">{num}</span>{clues.down[num]}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
