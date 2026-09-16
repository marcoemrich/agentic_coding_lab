export type Cell = [number, number];

type Candidate = {
  cell: Cell;
  liveNeighbors: number;
};

const NEIGHBOR_DIRECTIONS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],           [1, 0],
  [-1, 1],  [0, 1],  [1, 1],
];
const SURVIVAL_NEIGHBORS = 2;
const REPRODUCTION_NEIGHBORS = 3;

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}

function willBeAlive(isAlive: boolean, liveNeighbors: number): boolean {
  return liveNeighbors === REPRODUCTION_NEIGHBORS
    || (isAlive && liveNeighbors === SURVIVAL_NEIGHBORS);
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const liveCellKeys = new Set(cells.map(cellKey));
  const candidates = new Map<string, Candidate>();

  for (const [x, y] of cells) {
    for (const [offsetX, offsetY] of NEIGHBOR_DIRECTIONS) {
      const cell: Cell = [x + offsetX, y + offsetY];
      const key = cellKey(cell);
      const candidate = candidates.get(key) ?? { cell, liveNeighbors: 0 };
      candidate.liveNeighbors += 1;
      candidates.set(key, candidate);
    }
  }

  return [...candidates.entries()]
    .filter(([key, { liveNeighbors }]) => willBeAlive(liveCellKeys.has(key), liveNeighbors))
    .map(([, { cell }]) => cell);
}
