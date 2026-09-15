export type Cell = [number, number];

type Candidate = { cell: Cell; liveNeighbors: number };

const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0],            [1, 0],
  [-1, 1],  [0, 1],   [1, 1],
];
// Named domain thresholds make the Game of Life policy explicit.
const REPRODUCTION_NEIGHBORS = 3;
// eslint-disable-next-line no-magic-numbers
const SURVIVAL_NEIGHBORS = new Set([2, 3]);

const cellKey = ([x, y]: Cell): string => `${x},${y}`;

function livesInNextGeneration(wasAlive: boolean, liveNeighbors: number): boolean {
  return liveNeighbors === REPRODUCTION_NEIGHBORS
    || (wasAlive && SURVIVAL_NEIGHBORS.has(liveNeighbors));
}

export function nextGeneration(cells: Cell[]): Cell[] {
  const livingCells = new Set(cells.map(cellKey));
  const candidates = new Map<string, Candidate>();

  for (const [x, y] of cells) {
    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const cell: Cell = [x + dx, y + dy];
      const key = cellKey(cell);
      const candidate = candidates.get(key) ?? { cell, liveNeighbors: 0 };
      candidate.liveNeighbors += 1;
      candidates.set(key, candidate);
    }
  }

  return [...candidates.entries()]
    .filter(([key, candidate]) => livesInNextGeneration(livingCells.has(key), candidate.liveNeighbors))
    .map(([, candidate]) => candidate.cell);
}
