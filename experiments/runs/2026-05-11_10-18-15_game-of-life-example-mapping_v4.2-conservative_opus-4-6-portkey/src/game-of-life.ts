export type Cell = [number, number];

function cellKey(x: number, y: number): string {
  return `${x},${y}`;
}

function countLiveNeighbors(cell: Cell, liveSet: Set<string>): number {
  const [x, y] = cell;
  let count = 0;
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      if (liveSet.has(cellKey(x + dx, y + dy))) count++;
    }
  }
  return count;
}

export function nextGeneration(liveCells: Cell[]): Cell[] {
  const liveSet = new Set(liveCells.map(([x, y]) => cellKey(x, y)));

  const survivors = liveCells.filter(
    (cell) => {
      const neighborCount = countLiveNeighbors(cell, liveSet);
      return neighborCount === 2 || neighborCount === 3;
    }
  );

  const deadCandidates = new Map<string, Cell>();
  for (const [x, y] of liveCells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const key = cellKey(x + dx, y + dy);
        if (!liveSet.has(key)) {
          deadCandidates.set(key, [x + dx, y + dy]);
        }
      }
    }
  }

  const births = [...deadCandidates.values()].filter(
    (cell) => countLiveNeighbors(cell, liveSet) === 3
  );

  return [...survivors, ...births];
}
