'use client';
import { useState, useEffect } from 'react';
import { Crossword, Issue } from '@/lib/types';
import { createCrossword, updateCrossword } from '@/lib/actions';
import { useRouter } from 'next/navigation';

type Cell = {
  value: string;
  isBlack: boolean;
  number: number | null;
};

type Clues = {
  across: { [key: number]: string };
  down: { [key: number]: string };
};

export default function CrosswordEditor({ issues, initialData }: { issues: Issue[], initialData?: Crossword }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [issueId, setIssueId] = useState(initialData?.issue_id || '');
  const [rows, setRows] = useState(15);
  const [cols, setCols] = useState(15);
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [clues, setClues] = useState<Clues>({ across: {}, down: {} });
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'grid' | 'letters'>('grid');
  const router = useRouter();

  useEffect(() => {
     if (initialData) {
        try {
            const parsedGridStructure = JSON.parse(initialData.grid);
            const parsedSolution = JSON.parse(initialData.solution);
            const merged = parsedGridStructure.map((row: any[], r: number) => row.map((cell: any, c: number) => ({
                ...cell,
                value: parsedSolution[r][c]
            })));
            setGrid(merged);
            setClues(JSON.parse(initialData.clues));
            setRows(merged.length);
            setCols(merged[0].length);
        } catch (e) {
            console.error("Failed to parse initial data", e);
            createGrid(15, 15);
        }
     } else {
        createGrid(15, 15);
     }
  }, [initialData]);

  const createGrid = (r: number, c: number) => {
    const newGrid = Array(r).fill(null).map(() => Array(c).fill({ value: '', isBlack: false, number: null }));
    renumberGrid(newGrid);
  };
  
  const resizeGrid = () => {
      if (confirm('Resizing will clear the grid. Continue?')) {
        createGrid(rows, cols);
      }
  };
  
  const toggleBlack = (r: number, c: number) => {
      const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
      newGrid[r][c] = { ...newGrid[r][c], isBlack: !newGrid[r][c].isBlack, value: '' };
      renumberGrid(newGrid);
  };
  
  const handleCellChange = (r: number, c: number, val: string) => {
      if (grid[r][c].isBlack) return;
      const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
      newGrid[r][c].value = val.toUpperCase().slice(-1);
      setGrid(newGrid);
  };

  const renumberGrid = (currentGrid: Cell[][]) => {
     let num = 1;
     const newGrid: Cell[][] = currentGrid.map(row => row.map(cell => ({ ...cell, number: null })));
     const rLen = newGrid.length;
     const cLen = newGrid[0].length;
     
     for (let r = 0; r < rLen; r++) {
         for (let c = 0; c < cLen; c++) {
             if (newGrid[r][c].isBlack) continue;
             let getsNumber = false;
             if ((c === 0 || newGrid[r][c-1].isBlack) && (c + 1 < cLen && !newGrid[r][c+1].isBlack)) getsNumber = true;
             if ((r === 0 || newGrid[r-1][c].isBlack) && (r + 1 < rLen && !newGrid[r+1][c].isBlack)) getsNumber = true;
             if (getsNumber) newGrid[r][c].number = num++;
         }
     }
     setGrid(newGrid);
  };

  const updateClue = (direction: 'across' | 'down', num: number, val: string) => {
      setClues(prev => ({
          ...prev,
          [direction]: { ...prev[direction], [num]: val }
      }));
  };
  
  const getClueNumbers = () => {
      const nums = { across: [] as number[], down: [] as number[] };
      const rLen = grid.length;
      if (rLen === 0) return nums;
      const cLen = grid[0].length;

      for (let r = 0; r < rLen; r++) {
          for (let c = 0; c < cLen; c++) {
              const cell = grid[r][c];
              if (cell.number) {
                   if ((c === 0 || grid[r][c-1].isBlack) && (c + 1 < cLen && !grid[r][c+1].isBlack)) nums.across.push(cell.number);
                   if ((r === 0 || grid[r-1][c].isBlack) && (r + 1 < rLen && !grid[r+1][c].isBlack)) nums.down.push(cell.number);
              }
          }
      }
      return nums;
  };

  const handleSubmit = async () => {
      setLoading(true);
      const gridStructure = grid.map(row => row.map(({ value, ...rest }) => rest));
      const solution = grid.map(row => row.map(cell => cell.value));
      
      const data = {
          title,
          issue_id: issueId,
          grid: JSON.stringify(gridStructure),
          solution: JSON.stringify(solution),
          clues: JSON.stringify(clues),
      };
      
      try {
        if (initialData) {
            await updateCrossword(initialData.id, data);
        } else {
            await createCrossword(data);
        }
        router.push('/secret-admin-voices/crosswords');
        router.refresh();
      } catch(e) {
          console.error(e);
          alert('Error saving');
      } finally {
          setLoading(false);
      }
  };

  const clueNums = getClueNumbers();

  return (
    <div className="space-y-8 pb-20">
        <div className="bg-white p-4 rounded shadow space-y-4">
            <div>
                <label className="block text-sm font-bold">Title</label>
                <input value={title} onChange={e => setTitle(e.target.value)} className="w-full border p-2 rounded" />
            </div>
             <div>
                <label className="block text-sm font-bold">Issue</label>
                <select value={issueId} onChange={e => setIssueId(e.target.value)} className="w-full border p-2 rounded">
                    <option value="">Select Issue</option>
                    {issues.map(i => <option key={i.id} value={i.id}>{i.month} {i.year}</option>)}
                </select>
            </div>
             <div className="flex gap-4 items-end">
                <div>
                    <label className="block text-sm font-bold">Rows</label>
                    <input type="number" value={rows} onChange={e => setRows(Number(e.target.value))} className="border p-2 rounded w-20" />
                </div>
                <div>
                    <label className="block text-sm font-bold">Cols</label>
                    <input type="number" value={cols} onChange={e => setCols(Number(e.target.value))} className="border p-2 rounded w-20" />
                </div>
                <button onClick={resizeGrid} className="bg-red-100 text-red-700 px-4 py-2 rounded">Reset Grid Size</button>
            </div>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
            <h2 className="font-bold mb-4">Grid Editor</h2>
            <div className="flex gap-4 mb-4">
                <button onClick={() => setMode('grid')} className={`px-4 py-2 rounded ${mode === 'grid' ? 'bg-black text-white' : 'bg-gray-200'}`}>Edit Grid Layout (Black Squares)</button>
                <button onClick={() => setMode('letters')} className={`px-4 py-2 rounded ${mode === 'letters' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Edit Solution (Letters)</button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                <div className="overflow-auto">
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${grid[0]?.length || 1}, 2rem)` }} className="gap-px bg-gray-400 border border-black w-fit">
                        {grid.map((row, r) => row.map((cell, c) => (
                            <div 
                                key={`${r}-${c}`} 
                                className={`w-8 h-8 relative flex items-center justify-center text-sm font-bold uppercase select-none cursor-pointer ${cell.isBlack ? 'bg-black' : 'bg-white'}`}
                                onClick={() => {
                                    if (mode === 'grid') toggleBlack(r, c);
                                }}
                            >
                                {cell.number && <span className="absolute top-0 left-0 text-[8px] leading-none p-0.5">{cell.number}</span>}
                                {!cell.isBlack && mode === 'letters' && (
                                    <input 
                                        className="w-full h-full text-center bg-transparent outline-none p-0" 
                                        value={cell.value} 
                                        onChange={(e) => handleCellChange(r, c, e.target.value)}
                                        maxLength={1}
                                    />
                                )}
                                {!cell.isBlack && mode === 'grid' && cell.value && (
                                    <span className="text-gray-400">{cell.value}</span>
                                )}
                            </div>
                        )))}
                    </div>
                </div>

                <div className="flex-1 grid grid-cols-2 gap-4">
                    <div>
                        <h3 className="font-bold mb-2">Across Clues</h3>
                        <div className="space-y-2 h-96 overflow-auto border p-2 rounded">
                            {clueNums.across.map(num => (
                                <div key={`a-${num}`} className="flex gap-2">
                                    <span className="font-bold w-6">{num}</span>
                                    <input 
                                        className="border p-1 rounded flex-1" 
                                        value={clues.across[num] || ''} 
                                        onChange={e => updateClue('across', num, e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                     <div>
                        <h3 className="font-bold mb-2">Down Clues</h3>
                         <div className="space-y-2 h-96 overflow-auto border p-2 rounded">
                            {clueNums.down.map(num => (
                                <div key={`d-${num}`} className="flex gap-2">
                                    <span className="font-bold w-6">{num}</span>
                                    <input 
                                        className="border p-1 rounded flex-1" 
                                        value={clues.down[num] || ''} 
                                        onChange={e => updateClue('down', num, e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div className="fixed bottom-0 right-0 p-4 bg-white border-t w-full flex justify-end gap-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
             <button onClick={handleSubmit} disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                 {loading ? 'Saving...' : 'Save Crossword'}
             </button>
        </div>
    </div>
  );
}
