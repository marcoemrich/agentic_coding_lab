export type Cell = [number, number];

type Candidate = { cell: Cell; liveNeighbors: number };

const SURVIVAL_NEIGHBORS = 2;
const REPRODUCTION_NEIGHBORS = 3;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],            [1, 0],
  [-1, 1],  [0, 1],   [1, 1],
];

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function countLiveNeighborsByCandidate(cells: Cell[]): Map<string, Candidate> {
  const candidates = new Map<string, Candidate>();
  for (const [x, y] of cells) {
    for (const [offsetX, offsetY] of NEIGHBOR_OFFSETS) {
      const cell: Cell = [x + offsetX, y + offsetY];
      const key = cellKey(cell);
      const liveNeighbors = (candidates.get(key)?.liveNeighbors ?? 0) + 1;
      candidates.set(key, { cell, liveNeighbors });
    }
  }
  return candidates;
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const livingCells = new Set(cells.map(cellKey));
  return [...countLiveNeighborsByCandidate(cells).values()]
    .filter(({ cell, liveNeighbors }) =>
      liveNeighbors === REPRODUCTION_NEIGHBORS
      || (liveNeighbors === SURVIVAL_NEIGHBORS && livingCells.has(cellKey(cell))))
    .map(({ cell }) => cell);
}
