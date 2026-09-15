export type Cell = [number, number];

type Candidate = { cell: Cell; neighbors: number };

const MINIMUM_SURVIVAL_NEIGHBORS = 2;
const REPRODUCTION_NEIGHBORS = 3;
const NEIGHBOR_OFFSETS: Cell[] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

export function nextGeneration(cells: Cell[]): Cell[] {
  const livingCells = new Set(cells.map(cellKey));
  return countCandidates(cells)
    .filter((candidate) => willLive(candidate, livingCells))
    .map(({ cell }) => cell);
}

function willLive({ cell, neighbors }: Candidate, livingCells: Set<string>): boolean {
  return neighbors === REPRODUCTION_NEIGHBORS
    || (livingCells.has(cellKey(cell)) && neighbors === MINIMUM_SURVIVAL_NEIGHBORS);
}

function countCandidates(cells: Cell[]): Candidate[] {
  const candidates = new Map<string, Candidate>();
  for (const [x, y] of cells) {
    for (const [xOffset, yOffset] of NEIGHBOR_OFFSETS) {
      const cell: Cell = [x + xOffset, y + yOffset];
      const key = cellKey(cell);
      const candidate = candidates.get(key) ?? { cell, neighbors: 0 };
      candidate.neighbors += 1;
      candidates.set(key, candidate);
    }
  }
  return [...candidates.values()];
}

function cellKey([x, y]: Cell): string {
  return `${x},${y}`;
}
