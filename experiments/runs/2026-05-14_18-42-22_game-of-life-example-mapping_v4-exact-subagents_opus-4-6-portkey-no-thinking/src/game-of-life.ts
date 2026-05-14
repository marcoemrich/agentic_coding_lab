type Cell = [number, number];

const cellKey = ([row, col]: Cell): string => `${row},${col}`;

const parseKey = (key: string): Cell =>
  key.split(",").map(Number) as Cell;

const neighborsOf = ([row, col]: Cell): Cell[] => {
  const result: Cell[] = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      result.push([row + dr, col + dc]);
    }
  }
  return result;
};

const countLiveNeighbors = (cell: Cell, liveSet: Set<string>): number =>
  neighborsOf(cell).filter((neighbor) => liveSet.has(cellKey(neighbor))).length;

const reproductionCandidates = (liveCells: Cell[], liveSet: Set<string>): Cell[] => {
  const candidates = new Set<string>();
  for (const cell of liveCells) {
    for (const neighbor of neighborsOf(cell)) {
      const key = cellKey(neighbor);
      if (!liveSet.has(key)) candidates.add(key);
    }
  }
  return [...candidates].map(parseKey);
};

export const nextGeneration = (liveCells: Cell[]): Cell[] => {
  const liveSet = new Set(liveCells.map(cellKey));
  const survivors = liveCells.filter((cell) => {
    const neighbors = countLiveNeighbors(cell, liveSet);
    return neighbors === 2 || neighbors === 3;
  });
  const births = reproductionCandidates(liveCells, liveSet).filter(
    (cell) => countLiveNeighbors(cell, liveSet) === 3
  );
  return [...survivors, ...births];
};
