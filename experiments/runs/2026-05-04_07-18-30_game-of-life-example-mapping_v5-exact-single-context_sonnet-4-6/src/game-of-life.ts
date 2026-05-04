export type Cell = [x: number, y: number];

const isNeighbor = ([x, y]: Cell, [nx, ny]: Cell): boolean =>
  Math.abs(nx - x) <= 1 && Math.abs(ny - y) <= 1 && (nx !== x || ny !== y);

const countLiveNeighbors = (cell: Cell, liveCells: Cell[]): number =>
  liveCells.filter((n) => isNeighbor(cell, n)).length;

const deadNeighborCandidates = (liveCells: Cell[]): Cell[] => {
  const liveKeys = new Set(liveCells.map(([x, y]) => `${x},${y}`));
  const candidateKeys = new Set<string>();
  for (const [x, y] of liveCells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const key = `${x + dx},${y + dy}`;
        if (!liveKeys.has(key)) candidateKeys.add(key);
      }
    }
  }
  return [...candidateKeys].map((key) => key.split(",").map(Number) as Cell);
};

export const nextGeneration = (liveCells: Cell[]): Cell[] => {
  const survivors = liveCells.filter((cell) => {
    const neighborCount = countLiveNeighbors(cell, liveCells);
    return neighborCount >= 2 && neighborCount <= 3;
  });

  const born = deadNeighborCandidates(liveCells)
    .filter((candidate) => countLiveNeighbors(candidate, liveCells) === 3);

  return [...survivors, ...born];
};
