export type Cell = [number, number];

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

function cellKey(x: number, y: number): string {
  return `${x},${y}`;
}

function countLiveNeighbors([x, y]: Cell, liveCells: Set<string>): number {
  return NEIGHBOR_OFFSETS.filter(([dx, dy]) =>
    liveCells.has(cellKey(x + dx, y + dy)),
  ).length;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveCells = new Set(cells.map(([x, y]) => cellKey(x, y)));

  const survivors = cells.filter((cell) => {
    const liveNeighborCount = countLiveNeighbors(cell, liveCells);
    return liveNeighborCount === 2 || liveNeighborCount === 3;
  });

  const deadCandidates = new Map<string, Cell>();
  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const candidate: Cell = [x + dx, y + dy];
      const key = cellKey(...candidate);
      if (!liveCells.has(key)) deadCandidates.set(key, candidate);
    }
  }

  const births: Cell[] = [];
  for (const candidate of deadCandidates.values()) {
    if (countLiveNeighbors(candidate, liveCells) === 3) births.push(candidate);
  }

  return [...survivors, ...births];
}
