export type Cell = [number, number];

const cellKey = (cell: Cell): string => `${cell[0]},${cell[1]}`;

const countLiveNeighbors = (cell: Cell, liveCells: Cell[]): number => {
  const [x, y] = cell;
  let count = 0;
  for (const [lx, ly] of liveCells) {
    if (lx === x && ly === y) continue;
    if (Math.abs(lx - x) <= 1 && Math.abs(ly - y) <= 1) count++;
  }
  return count;
};

const candidateCells = (liveCells: Cell[]): Map<string, Cell> => {
  const candidates = new Map<string, Cell>();
  for (const [x, y] of liveCells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const c: Cell = [x + dx, y + dy];
        candidates.set(cellKey(c), c);
      }
    }
  }
  return candidates;
};

const isAliveNextGen = (isCurrentlyAlive: boolean, liveNeighborCount: number): boolean => {
  if (isCurrentlyAlive) return liveNeighborCount === 2 || liveNeighborCount === 3;
  return liveNeighborCount === 3;
};

export const nextGeneration = (liveCells: Cell[]): Cell[] => {
  const liveSet = new Set(liveCells.map(cellKey));
  const result: Cell[] = [];
  for (const [key, cell] of candidateCells(liveCells)) {
    const isAlive = liveSet.has(key);
    const n = countLiveNeighbors(cell, liveCells);
    if (isAliveNextGen(isAlive, n)) result.push(cell);
  }
  return result;
};
